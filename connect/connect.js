/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// undefined variables are either defined in script.js
// or variables provided by the browser
const socket = io.connect();
const sendMessage = document.querySelector('#sendMessage');
const tbody = document.querySelector('#tbody');
const sendGuess = document.querySelector('#submit-guess');

let selfIdInit;
let peerInit; // simple-peer initiator
let peerJoin; // simple-peer join

let secretNum;

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

const isTurn = () => {
  const lastRow = tbody.rows[tbody.children.length - 1];
  return (lastRow.cells[3].textContent === '' && lastRow.cells[0].textContent === '') || lastRow.cells[3].textContent !== '';
};


const appendMessage = (userType, message) => {
  const messageBox = document.querySelector('.message-box');
  const color = userType === 'self' ? 'orange' : 'green';
  const html = `                    
    <div class="message">
        <div>
            <span class="user-initial" style="background>${color};"></span>
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
    }
  }
};


sendMessage.addEventListener('click', () => {
  const message = document.querySelector('#message').value;
  const messageJson = {
    type: 'chat',
    message,
  };
  // if we are on the initiator side or otherwise
  if (selfIdInit) {
    peerInit.send(`${JSON.stringify(messageJson)}`);
    appendMessage('self', message);
  } else {
    peerJoin.send(`${JSON.stringify(messageJson)}`);
    appendMessage('oppo', message);
  }
});

sendGuess.addEventListener('click', () => {
  const guess = document.querySelector('#submit-input-text').value;
  const messageJson = {
    type: 'guess',
    message: guess,
  };

  if (isTurn()) {
    // appendIandP('self', guess, 0, 0);
    if (selfIdInit) {
      peerInit.send(`${JSON.stringify(messageJson)}`);
    } else {
      peerJoin.send(`${JSON.stringify(messageJson)}`);
    }
  } else {
    console.log('invalid request, cannot send guess');
  }
});


// when join id sends its id to server,
// the server sends the message to everyone.
// we recieve on client side and check, if
// it has our initiator id, then connect.
socket.on('new message', (data) => {
  if (data.msg.their === selfIdInit) {
    peerInit.signal(JSON.parse(data.msg.mine));
    hideEverything();
    gameStarted = true;
    adjustDisplay();
    gameBoard.classList.remove('hide');
    showToken.classList.add('hide');
  }
});
