var socket = io();
var messages = document.getElementById('messages');

var messageInputForm = document.getElementById("messageInputForm");
messageInputForm.addEventListener("submit", sendMessage);

var supportedSlashCommands = {
    "emoji": showEmojis,
    "shortcut": showNotImplementedMessage,
    "shrug": showNotImplementedMessage,
    "search": showNotImplementedMessage,
}

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

function onMessageInputChange(value) {
    var commandSearchBox = document.getElementById("slash-command-search");
    if (value[0] === "/") {
        var searchText = value.substring(1);
        commandSearchBox.innerHTML = '';
        for (var command in supportedSlashCommands) {
            if (command.startsWith(searchText)) {
                var commandDiv = document.createElement('div');
                commandDiv.className = "slashcommand";
                commandDiv.innerText = command;
                commandDiv.onclick = supportedSlashCommands[command];
                commandSearchBox.appendChild(commandDiv);
            }
        }
        commandSearchBox.style.display = "block";
    } else {
        commandSearchBox.style.display = "none";
    }
}

function showEmojis() {
    
}

function showNotImplementedMessage() {
    console.log("This feature is not implemented yet.");
}

function makeRequest(method, url, body, onResponse) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && parseInt(this.status/100) == 2) {
          onResponse(this.responseText);
        }
    }
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(body));
}