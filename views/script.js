const gameBoard = document.querySelector('.game-board');
const side = document.querySelector('.side');
const game = document.querySelector('.game');
const nav = document.querySelector('.nav');
const liPlay = document.querySelector('.nav ul li:nth-child(1)');
const liChat = document.querySelector('.nav ul li:nth-child(2)');
const sideNav = document.querySelector('.side-nav');
const chat = document.querySelector('.chat');
const create = document.querySelector('#createGame');
const token = document.querySelector('#submitToken');
const chooseType = document.querySelector('.choose-type');
const createGameForm = document.querySelector('.create-game-form');
const tokenForm = document.querySelector('.token-form');
const playCreate = document.querySelector('#playCreate');
const playToken = document.querySelector('#playToken');
const cancel1 = document.querySelector('#cancel1');
const cancel2 = document.querySelector('#cancel2');
const tbody = document.querySelector('#tbody');
const showToken = document.querySelector('.show-token');

let gameStarted = false;

const appendMessage = (userType, message) => {
  const messageBox = document.querySelector('.message-box');
  const color = userType === 'self' ? 'orange' : 'green';
  const html = `                    
    <div class="message">
        <div>
            <span class="user-initial" style="background:${color};"></span>
            <span class="user-message">${message}</span>
        </div>
    </div>`;

  messageBox.innerHTML += html;
};


const appendIandP = (userType, guess, i, p) => {
  const lastRow = tbody.rows[tbody.children.length - 1];

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
    const td1 = document.createElement('TD');
    td1.textContent = guess;
    tr.appendChild(td1);

    const td2 = document.createElement('TD');
    td2.textContent = i;
    tr.appendChild(td2);

    const td3 = document.createElement('TD');
    td3.textContent = p;
    tr.appendChild(td3);

    const td4 = document.createElement('TD');
    td4.textContent = '';
    tr.appendChild(td4);

    const td5 = document.createElement('TD');
    td5.textContent = '';
    tr.appendChild(td5);

    const td6 = document.createElement('TD');
    td6.textContent = '';
    tr.appendChild(td6);

    tbody.appendChild(tr);
  } else if (userType === 'opponent' && lastRow.cells[3].textContent !== '' && lastRow.cells[0].textContent !== '') {
    const tr = document.createElement('TR');

    const td1 = document.createElement('TD');
    td1.textContent = '';
    tr.appendChild(td1);

    const td2 = document.createElement('TD');
    td2.textContent = '';
    tr.appendChild(td2);

    const td3 = document.createElement('TD');
    td3.textContent = '';
    tr.appendChild(td3);

    const td4 = document.createElement('TD');
    td4.textContent = guess;
    tr.appendChild(td4);

    const td5 = document.createElement('TD');
    td5.textContent = i;
    tr.appendChild(td5);

    const td6 = document.createElement('TD');
    td6.textContent = p;
    tr.appendChild(td6);

    tbody.appendChild(tr);
  } else {
    console.log('Illegal append request by ', userType);
  }
};
appendIandP('self', '1234', '1', '1');
appendIandP('self', '1234', '1', '1');
appendIandP('opponent', '1234', '1', '1');
appendIandP('opponent', '1234', '1', '1');


const hideEverything = () => {
  nav.classList.add('hide');
  sideNav.classList.add('hide');
  chat.classList.add('hide');
  chooseType.classList.add('hide');
  tokenForm.classList.add('hide');
  createGameForm.classList.add('hide');
};

const startGame = () => {
  hideEverything();
  // gameStarted = true;
  adjustDisplay();

  // gameBoard.classList.remove("hide");
  showToken.classList.remove('hide');
};

const startToken = () => {
  hideEverything();
  gameStarted = true;
  adjustDisplay();

  gameBoard.classList.remove('hide');
};

const createGame = () => {
  hideEverything();
  createGameForm.classList.remove('hide');
};

const submitToken = () => {
  hideEverything();
  tokenForm.classList.remove('hide');
};

const adjustDisplay = () => {
  const mq = window.matchMedia('(max-width: 1030px)');
  if (mq.matches) {
    // window width is at less than 1030px
    side.classList.add('hide');
    if (gameStarted) {
      sideNav.classList.add('hide');

      nav.classList.remove('hide');
    }
  } else {
    // window width is greater than 1030px
    side.classList.remove('hide');
    if (gameStarted) {
      nav.classList.add('hide');

      gameBoard.classList.remove('hide');
      game.classList.remove('hide');
      sideNav.classList.remove('hide');
      chat.classList.remove('hide');
    }
  }
};


liChat.addEventListener('click', () => {
  liChat.classList.add('active');
  liPlay.classList.remove('active');

  gameBoard.classList.add('hide');
  chat.classList.remove('hide');
  side.classList.remove('hide');
  game.classList.add('hide');
});
liPlay.addEventListener('click', () => {
  liChat.classList.remove('active');
  liPlay.classList.add('active');

  gameBoard.classList.remove('hide');
  chat.classList.add('hide');
  game.classList.remove('hide');
});
cancel1.addEventListener('click', () => {
  location.reload();
});
cancel2.addEventListener('click', () => {
  location.reload();
});
document.querySelector('#continue').addEventListener('click', () => {
  hideEverything();
  gameStarted = true;
  adjustDisplay();

  gameBoard.classList.remove('hide');
  showToken.classList.add('hide');
});

playCreate.addEventListener('click', startGame);
playToken.addEventListener('click', startToken);
create.addEventListener('click', createGame);
token.addEventListener('click', submitToken);
window.addEventListener('resize', adjustDisplay);
