const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message from other', msg);
    socket.emit('chat message from self', msg);
  });    
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});