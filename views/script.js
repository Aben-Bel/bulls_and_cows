/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const gameBoard = document.querySelector('.game-board');
const side = document.querySelector('.side');
const game = document.querySelector('.game');
const nav = document.querySelector('.nav');
const liPlay = document.querySelector('.nav ul li:nth-child(1)');
const liChat = document.querySelector('.nav ul li:nth-child(2)');
const sideNav = document.querySelector('.side-nav');
const chat = document.querySelector('.chat');
const loading = document.querySelector('.loading');

const chooseType = document.querySelector('.choose-type');
const createGameForm = document.querySelector('.create-game-form');
const tokenForm = document.querySelector('.token-form');

const cancel1 = document.querySelector('#cancel1');
const cancel2 = document.querySelector('#cancel2');

const socket = io.connect();

let gameStarted = false;

const adjustDisplay = () => {
  const mq = window.matchMedia('(max-width: 1030px)');
  if (mq.matches) {
    // window width is at less than 1030px
    hideClass(side);
    if (gameStarted) {
      showClass(nav);
      hideClass(sideNav);
    }
  } else {
    // window width is greater than 1030p
    showClass(side);
    if (gameStarted) {
      hideClass(nav);
      showClass(gameBoard, game, sideNav, chat);
    }
  }
};

const hideEverything = () => {
  hideClass(nav, sideNav, chat, chooseType, tokenForm, createGameForm, loading);
};

liChat.addEventListener('click', () => {
  addClass(liChat, 'active');
  removeClass(liPlay, 'active');

  showClass(chat, side);
  hideClass(gameBoard, game);
});
liPlay.addEventListener('click', () => {
  addClass(liChat, 'active');
  removeClass(liPlay, 'active');

  showClass(gameBoard, game);
  hideClass(chat);
});
cancel1.addEventListener('click', () => {
  location.reload();
});
cancel2.addEventListener('click', () => {
  location.reload();
});

window.addEventListener('resize', adjustDisplay);
// ============================================== //

// first screen: create game or submit Token

const create = document.querySelector('#createGame');
const token = document.querySelector('#submitToken');

const createGame = () => {
  hideEverything();
  showClass(createGameForm);
};

const submitToken = () => {
  hideEverything();
  showClass(tokenForm);
};

create.addEventListener('click', createGame);
token.addEventListener('click', submitToken);

// second screen: regsiter player 1

const playCreate = document.querySelector('#playCreate');
const showToken = document.querySelector('.show-token');
const play1Name = document.querySelector('#nickname1');
const tokenBox = document.querySelector('#tokenBox');
const tokenStatus = document.querySelector('#tokenStatus');

// second screen: register player 2

const play2Name = document.querySelector('#nickname2');
const playToken = document.querySelector('#playToken');
const tokenValue = document.querySelector('#tokenValue');

let peer;

const generateWebRTCid = (initiator, tokenId) => {
  peer.on('signal', (webRTCid) => {
    const name = initiator ? play1Name.value || 'Player 1' : play2Name.value || 'Player 2';
    const data = JSON.stringify({ webRTCid, name, tokenId });

    const sendTo = initiator ? 'join' : 'joinGame';
    // send id to server
    socket.emit(sendTo, data);
  });
};

const listenTop2pMessage = () => {
  // listening for message from other peer
  peer.on('data', (data) => {
    communicate(peerJoin, secretNum, data);
  });
};

const onSubmitCommunication = (initiator) => {
  // track player's initiate status
  selfIdInit = initiator;

  // show loading icon
  loadingIcon(true);

  // step 1: create peer
  peer = new SimplePeer({
    initiator, trickle: false, objectMode: true,
  });

  if (initiator) {
    generateWebRTCid(initiator);
    hideEverything();
    adjustDisplay();
    showClass(showToken);
  } else {
    const tokenId = tokenValue.value;
    socket.emit('token', tokenId);
  }

  // start listening to WebRTC p2p messages
  listenTop2pMessage();
};

playCreate.addEventListener('click', () => onSubmitCommunication(true));
playToken.addEventListener('click', () => onSubmitCommunication(false));

// listen to messages from socket.io

socket.on('join', (tokenId) => {
  // remove loading icon
  loadingIcon(false);
  // append short token to screen
  tokenBox.value = tokenId;

  tokenStatus.textContent = 'Waiting for opponent to join';

  // listen with your token short id for WebRTC id answer
  socket.on(tokenId, (player2) => {
    // respond to establish peer connection
    peer.signal(player2);
    gameStarted = true;
    adjustDisplay();
  });
});

socket.on('token', (player1string) => {
  console.log(player1string);
  const player1 = JSON.parse(player1string);
  peer.signal(player1.webRTCid);
  generateWebRTCid(false);
  hideEverything();
  adjustDisplay();
  showClass(gameBoard, sideNav, chat);
});
