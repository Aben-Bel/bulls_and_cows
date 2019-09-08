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

const chooseType = document.querySelector('.choose-type');
const createGameForm = document.querySelector('.create-game-form');
const tokenForm = document.querySelector('.token-form');

const playToken = document.querySelector('#playToken');
const cancel1 = document.querySelector('#cancel1');
const cancel2 = document.querySelector('#cancel2');


let gameStarted = false;

const adjustDisplay = () => {
  const mq = window.matchMedia('(max-width: 1030px)');
  if (mq.matches) {
    // window width is at less than 1030px
    hideClass(side);
    if (gameStarted) {
      showClass(nave);
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
  hideClass(nav, sideNav, chat, chooseType, tokenForm, createGameForm);
};

const startToken = () => {
  hideEverything();
  gameStarted = true;
  adjustDisplay();

  showClass(gameBoard);
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

playToken.addEventListener('click', startToken);
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

const startGame = () => {
  hideEverything();
  adjustDisplay();

  showClass(showToken);
  // show loading icon

  // step 1: initiate peer
  peerInit = new SimplePeer({
    initiator: true, trickle: false, objectMode: true,
  });

  // step 2: generate id
  peerInit.on('signal', (webRTCid) => {
    const name = play1Name.value || 'Player 1';
    const data = JSON.stringify({ webRTCid, name });

    // step 3: send id to server
    socket.emit('join', data);
  });

  // step 4: get short token from server
  socket.on('join', (token) => {
    // TODO:: remove loading icon

    // step 5: append short token to screen
    tokenBox.value = token;
    // step 6: show waiting for opponent to join message
    tokenStatus.textContent = 'Waiting for opponent to join';
  });
};

playCreate.addEventListener('click', startGame);
