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
const showToken = document.querySelector('.show-token');

const cancel1 = document.querySelector('#cancel1');
const cancel2 = document.querySelector('#cancel2');
const secretNum1 = document.querySelector('#play1sec');
const secretNum2 = document.querySelector('#play2sec');

const gameEnd = document.querySelector('.gameEnd');
const gameEndMessage = document.querySelector('#gameEndMessage');
const submitInput = document.querySelector('.submit-input');

const socket = io.connect();

let gameStarted = false;

const adjustDisplay = () => {
  const mq = window.matchMedia('(max-width: 1030px)');
  if (mq.matches) {
    // window width is at less than 1030px
    hideClass(side);
    showClass(nav);
    if (gameStarted) {
      hideClass(sideNav);
    }
  } else {
    // window width is greater than 1030p
    showClass(side);
    hideClass(nav);
    if (gameStarted) {
      showClass(gameBoard, sideNav, chat);
    }
  }
};

const hideEverything = () => {
  hideClass(nav, sideNav, chat, chooseType, showToken, tokenForm, createGameForm, loading);
};

liChat.addEventListener('click', () => {
  addClass(liChat, 'active');
  removeClass(liPlay, 'active');

  hideClass(game);
  adjustDisplay();
  showClass(chat, side);
});
liPlay.addEventListener('click', () => {
  addClass(liPlay, 'active');
  removeClass(liChat, 'active');

  showClass(gameBoard, game);
  adjustDisplay();
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


const tbody = document.querySelector('#tbody');

const appendIandP = (userType, guess, i, p) => {
  const lastRow = tbody.rows[tbody.children.length - 1];
  const entry = [guess, i, p, '', '', ''];
  const entry2 = ['', '', '', guess, i, p];

  if (userType === 'self' && lastRow.cells[0].textContent === '') {
    lastRow.cells[0].textContent = guess;
    lastRow.cells[1].textContent = i;
    lastRow.cells[2].textContent = p;
  } else if (userType === 'opponent' && lastRow.cells[3].textContent === '') {
    lastRow.cells[3].textContent = guess;
    lastRow.cells[4].textContent = i;
    lastRow.cells[5].textContent = p;
  } else if (userType === 'self' && lastRow.cells[3].textContent !== '' && lastRow.cells[0].textContent !== '') {
    const tr = document.createElement('TR');
    for (let j = 0; j < 6; j += 1) {
      const td = document.createElement('TD');
      td.textContent = entry[j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  } else if (userType === 'opponent' && lastRow.cells[3].textContent !== '' && lastRow.cells[0].textContent !== '') {
    const tr = document.createElement('TR');
    for (let j = 0; j < 6; j += 1) {
      const td = document.createElement('TD');
      td.textContent = entry2[j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  } else {
    console.log('Illegal append request by ', userType);
  }
};

const appendMessage = (userType, message) => {
  const messageBox = document.querySelector('.message-box');
  const color = userType === 'self' ? 'orange' : 'green';
  const html = `                    
    <div class="message">
        <div>
            <span class="user-initial" style="background:${color};"></span>
          <span class="user-message">${message}</span>
        </di>
    </div>`;

  messageBox.innerHTML += html;
};

const communicate = (peer, secretNum, data) => {
  const { type, message } = JSON.parse(data);

  if (secretNum !== '') {
    if (type === 'guess') {
      const iAndP = correct(secretNum, message);
      iAndP.guess = message;
      const messageJson = {
        type: 'answer',
        message: JSON.stringify(iAndP),
      };
      peer.send(`${JSON.stringify(messageJson)}`);
      appendIandP('opponent', iAndP.guess, iAndP.i, iAndP.p);
    } else if (type === 'chat') {
      appendMessage('opponent', message);
    } else {
      const value = JSON.parse(message);
      appendIandP('self', value.guess, value.i, value.p);

      if (value.i + value.p === 8) {
        gameStarted = false;
        hideEverything();
        showClass(gameEnd, chat, nav);
        adjustDisplay();
        hideClass(submitInput);
        gameEndMessage.textContent = 'YOU WON';
      }
    }
  }
};

const listenTop2pMessage = () => {
  // listening for message from other peer
  peer.on('data', (data) => {
    const secretNum = secretNum1.value || secretNum2.value;
    communicate(peer, secretNum, data);
  });
};
const validSecretNum = () => {
  const secretNum = secretNum1.value || secretNum2.value || '';
  const condition1 = secretNum.split('').every((val, index) => !(secretNum.slice(0, index) + secretNum.slice(index + 1)).includes(val));
  const condition2 = (/^([0-9]{4})$/g).test(secretNum);

  return condition1 && condition2;
};
const onSubmitCommunication = (initiator) => {
  if (validSecretNum()) {
    // track player's initiate status
  // selfIdInit = initiator;
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

    if (!initiator) {
      socket.on('token', (player1string) => {
        const player1 = JSON.parse(player1string);
        peer.signal(player1.webRTCid);
        generateWebRTCid(false, player1.token);
        hideEverything();
        showClass(gameBoard, nav, chat);
        gameStarted = true;
        adjustDisplay();
      });
    } else {
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
          hideEverything();
          showClass(gameBoard, game, nav, chat);
          gameStarted = true;
          adjustDisplay();
        });
      });
    }
  }
};

playCreate.addEventListener('click', () => onSubmitCommunication(true));
playToken.addEventListener('click', () => onSubmitCommunication(false));


// sending message appending them to the dom

const sendMessage = document.querySelector('#sendMessage');
const sendGuess = document.querySelector('#submit-guess');

let selfIdInit;

const isTurn = () => {
  const lastRow = tbody.rows[tbody.children.length - 1];
  return (lastRow.cells[3].textContent === '' && lastRow.cells[0].textContent === '') || lastRow.cells[3].textContent !== '';
};

const message = (peer) => {
  const textMessage = document.querySelector('#message').value;
  const messageJson = {
    type: 'chat',
    message: textMessage,
  };
  // const sender = selfIdInit ? 'self' : 'oppo';
  peer.send(`${JSON.stringify(messageJson)}`);
  appendMessage('self', textMessage);
};

sendMessage.addEventListener('click', () => message(peer));

const guess = (peer) => {
  const textGuess = document.querySelector('#submit-input-text').value;
  const messageJson = {
    type: 'guess',
    message: textGuess,
  };

  if (isTurn()) {
    peer.send(`${JSON.stringify(messageJson)}`);
  } else {
    console.log('invalid request, cannot send guess');
  }
};

sendGuess.addEventListener('click', () => guess(peer));
