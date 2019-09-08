const socket = io.connect();

const playInit = document.querySelector('#playCreate');
const tokenBox = document.querySelector('#tokenBox');
const tokenValue = document.querySelector('#tokenValue');
const sendMessage = document.querySelector('#sendMessage');

let selfIdInit;
let joinId;
let peerInit; // simple-peer initiator
let peerJoin; // simple-peer join

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
    appendMessage('oppo', data);
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
    // other id
    socket.emit('send message', obj);
  });
  // listening for message from other peer
  peerJoin.on('data', (data) => {
    appendMessage('self', data);
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

// when join id sends its id to server,
// the server sends the message to everyone.
// we recieve on client side and check, if
// it has our initiator id, then connect.
socket.on('new message', (data) => {
  if (data.msg.their === selfIdInit) {
    peerInit.signal(JSON.parse(data.msg.mine));
  }
});
