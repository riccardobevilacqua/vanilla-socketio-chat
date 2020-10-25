const express = require('express');
const socket = require('socket.io');

const port = 3030;
const app = express();

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.use(express.static('public'));

const io = socket(server);
const activeUsers = new Set();

io.on('connection', function (socket) {
  socket.on('new user', function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit('new user', [...activeUsers]);
    console.log('A user joined the server.');
  });

  socket.on('disconnect', function () {
    activeUsers.delete(socket.userId);
    io.emit('user disconnected', socket.userId);
    console.log('A user disconnected.');
  });

  socket.on('chat message', function (data) {
    io.emit('chat message', data);
  });

  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data);
  });
});