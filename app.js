const express = require('express');
const dotenv = require('dotenv').config();
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = require('http').createServer(app);


const port = process.env.PORT || 3000;
const io = require('socket.io').listen(server);

const shortid = require('shortid');

const connections = [];

const db = mongoose.connect('mongodb://localhost/bullAndCow', { useNewUrlParser: true });
const Player = require('./model/playerModel.js');

app.use(morgan('tiny'));

server.listen(port, () => {
  debug(`Listening at port ${chalk.green(port)}`);
});

app.use('/simple-peer', express.static(path.join(__dirname, '/node_modules')));
app.use('/style', express.static(path.join(__dirname, '/views')));
app.use('/script', express.static(path.join(__dirname, '/views')));
app.use('/connect', express.static(path.join(__dirname, '/connect')));
app.use('/game', express.static(path.join(__dirname, '/game_logic')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});


io.sockets.on('connection', (socket) => {
  connections.push(socket);

  // Disconnect

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
  });

  // Send Message

  socket.on('send message', (data) => {
    io.sockets.emit('new message', { msg: data });
  });

  // register new player

  socket.on('join', (msg) => {
    const { name, webRTCid } = JSON.parse(msg);
    // step 1: generate short id
    const token = shortid.generate();
    // step 2: write to database short id, name and webRTCid
    const playerInstance = new Player({ name, token, webRTCid });

    // Save the new model instance, passing a callback
    playerInstance.save((err) => {
      if (err) return debug(err);
      return '';
      // saved!
    });
    // step 3: respond to user with short id
    socket.emit('join', token);

    debug(`${name} has joined -- token ${token}`);
  });

  socket.on('token', (token) => {
    // fetch player1 webRTCid from db
    const query = { token };
    Player.findOne(query, (err, player1) => {
      if (err) {
        debug(err);
      }
      const data = player1;
      data.token = token;
      const resp = JSON.stringify(data);
      debug(resp);
      io.sockets.emit('token', resp);
    });
  });

  socket.on('joinGame', (data) => {
    const { webRTCid, tokenId } = JSON.parse(data);
    io.sockets.emit(tokenId, webRTCid);
  });
});
