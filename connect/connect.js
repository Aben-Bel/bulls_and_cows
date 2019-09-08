/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// undefined variables are either defined in script.js
// or variables provided by the browser
const socket = io.connect();
const playInit = document.querySelector('#playCreate');
const tokenBox = document.querySelector('#tokenBox');
const tokenValue = document.querySelector('#tokenValue');
const sendMessage = document.querySelector('#sendMessage');
const tbody = document.querySelector('#tbody');
const sendGuess = document.querySelector('#submit-guess');

let selfIdInit;
let joinId;
let peerInit; // simple-peer initiator
let peerJoin; // simple-peer join

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
            <span class="user-initial" style="background:${color};"></span>
            <span class="user-message">${message}</span>
        </div>
    </div>`;

  messageBox.innerHTML += html;
};

// for peer initaition
playInit.addEventListener('click', () => {
  peerInit = new SimplePeer({
    initiator: true, trickle: false, objectMode: true,
  });
  // generating id for initiation
  peerInit.on('signal', (data) => {
    selfIdInit = JSON.stringify(data);
    tokenBox.value = selfIdInit;
  });
  // listening for message from other peer
  peerInit.on('data', (data) => {
    console.log('message in init: ', data);
    if (/(^;[0-9]{4};)$/.test(data)) {
      appendIandP('opponent', data.split(';')[1], 0, 0);
    } else {
      appendMessage('opponent', data);
    }
  });
});

// for peer joining
playToken.addEventListener('click', () => {
  peerJoin = new SimplePeer({
    initiator: false, trickle: false, objectMode: true,
  });
  joinId = tokenValue.value;
  // using the id submitted to signal self
  // to generate joining id
  peerJoin.signal(joinId);

  // getting the join id generated from
  // initiator's id
  peerJoin.on('signal', (data) => {
    const obj = {
      mine: JSON.stringify(data),
      their: joinId,
    };

    // sending to server joining id and
    // initiator's id
    socket.emit('send message', obj);
  });
  // listening for message from other peer
  peerJoin.on('data', (data) => {
    console.log('message in join: ', data);
    if (/(^;[0-9]{4};)$/.test(data)) {
      appendIandP('opponent', data.split(';')[1], 0, 0);
    } else {
      appendMessage('opponent', data);
    }
  });
});

sendMessage.addEventListener('click', () => {
  const message = document.querySelector('#message').value;
  // if we are on the initiator side or otherwise
  if (selfIdInit) {
    message.user = 'self';
    peerInit.send(message);
    appendMessage('self', message);
  } else {
    message.user = 'oppo';
    peerJoin.send(message);
    appendMessage('oppo', message);
  }
});

sendGuess.addEventListener('click', () => {
  const guess = document.querySelector('#submit-input-text').value;
  if (isTurn()) {
    appendIandP('self', guess, 0, 0);
    if (selfIdInit) {
      peerInit.send(`;${guess};`);
    } else {
      peerJoin.send(`;${guess};`);
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
