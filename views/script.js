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
const playCreate = document.querySelector('#playCreate');
const playToken = document.querySelector('#playToken');
const cancel1 = document.querySelector('#cancel1');
const cancel2 = document.querySelector('#cancel2');
const showToken = document.querySelector('.show-token');

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

const startGame = () => {
  hideEverything();
  adjustDisplay();

  showClass(showToken);
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

playCreate.addEventListener('click', startGame);
playToken.addEventListener('click', startToken);
window.addEventListener('resize', adjustDisplay);

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
