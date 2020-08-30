var socket = io();
var messages = document.getElementById('messages');

var messageInputForm = document.getElementById("messageInputForm");
messageInputForm.addEventListener("submit", sendMessage);
let key = '0cb8bb7793c77ef0d11298c542690f95a723aca6';

var supportedSlashCommands = {
    "emoji": getEmojis,
    "shortcut": showNotImplementedMessage,
    "shrug": showNotImplementedMessage,
    "search": showNotImplementedMessage,
}

function sendMessage(e){
    e.preventDefault();
    var messageInput = document.getElementById("messageInput");
    socket.emit('chat message', messageInput.value);
    messageInput.value = '';
    var commandSearchBox = document.getElementById("slash-command-search");
    commandSearchBox.style.display = "none";
    hideEmojiSelection();
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

function getEmojis() {
    var commandSearchBox = document.getElementById("slash-command-search");
    commandSearchBox.style.display = "none";
    makeRequest("GET", `https://emoji-api.com/emojis?access_key=${key}`, {}, onEmojiResponse);
}

function onEmojiResponse(emojiResponseText) {
    var emojiList = JSON.parse(emojiResponseText);
    showEmojis(emojiList);
}

function showEmojis(emojis) {
    var emojisContainer = document.createElement("div");
    var inputArea = document.getElementById("inputArea");
    inputArea.appendChild(emojisContainer);
    emojisContainer.className = "emojisContainer";
    emojisContainer.id = "emojiContainer";
    for (var i = 0; i < emojis.length; i++) {
        var emoji = emojis[i]["character"];
        var emojiDiv = document.createElement("div");
        emojiDiv.onclick = function(arg) {
            return function() {
                insertEmoji(arg);
            }
        }(emoji);
        emojiDiv.innerText = emoji;
        emojisContainer.appendChild(emojiDiv);
    }
}

function hideEmojiSelection() {
    emojisContainer = document.getElementById("emojiContainer");
    emojisContainer.remove();
}

function insertEmoji(chosenEmoji) {
    var textArea = document.getElementById("messageInput");
    textArea.value = textArea.value + chosenEmoji;
}

function showNotImplementedMessage() {
    var commandSearchBox = document.getElementById("slash-command-search");
    commandSearchBox.style.display = "none";
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