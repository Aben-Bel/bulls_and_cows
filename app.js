const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 3000;
const io = require('socket.io').listen(server);

const connections = [];

const db = mongoose.connect('mongodb://localhost/bullAndCow');

app.use(morgan('tiny'));

server.listen(port, () => {
  debug(`Listening at port ${chalk.green(port)}`);
});

app.use('/simple-peer', express.static(path.join(__dirname, '/node_modules')));
app.use('/style', express.static(path.join(__dirname, '/views')));
app.use('/script', express.static(path.join(__dirname, '/views')));
app.use('/connect', express.static(path.join(__dirname, '/connect')));

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
});
