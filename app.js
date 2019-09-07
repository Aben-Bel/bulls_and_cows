const express = require('express');
const Peer = require('simple-peer');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(port);
console.log('Server running...');

const path = require('path');

app.use('/peer', Peer);
app.use('/style', express.static(path.join(__dirname, '/views')));
app.use('/script', express.static(path.join(__dirname, '/views')));
app.use('/connect', express.static(path.join(__dirname, '/connect')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
  });

  
io.sockets.on('connection', (socket)=>{
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  // Disconnect
  socket.on('disconnect', (data)=>{
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  })

  // Send Message

  socket.on('send message', (data)=>{
    io.sockets.emit('new message',{msg: data});
  })


});

