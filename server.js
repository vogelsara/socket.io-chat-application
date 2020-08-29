const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let key = '0cb8bb7793c77ef0d11298c542690f95a723aca6';

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