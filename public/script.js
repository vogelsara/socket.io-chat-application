var socket = io();
var messages = document.getElementById('messages');

var messageInputForm = document.getElementById("messageInputForm");
messageInputForm.addEventListener("submit", sendMessage);

function sendMessage(e){
    e.preventDefault();
    var messageInput = document.getElementById("messageInput");
    console.log(messageInput.value);
    socket.emit('chat message', messageInput.value);
    messageInput.value = '';
    return false;
}

socket.on('chat message from other', function(msg) {
    var messageListElement = document.createElement('li');
    messageListElement.innerText = msg;
    messages.append(messageListElement);
});

socket.on('chat message from self', function(msg) {
    var messageListElement = document.createElement('li');
    messageListElement.className = "message-from-self";
    messageListElement.innerText = msg;
    messages.append(messageListElement);
});
