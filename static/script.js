const socket = io();

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const userList = document.getElementById('users');

let nickname = prompt('Enter your nickname:');
while (!nickname) {
    nickname = prompt('Nickname cannot be empty. Please enter your nickname:');
}

socket.emit('join', { nickname: nickname });

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('message', { message: messageInput.value });
        messageInput.value = '';
    }
});

socket.on('message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(data.nickname === nickname ? 'user' : 'other');
    messageElement.textContent = `${data.nickname}: ${data.message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('user_joined', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.textContent = `${data.nickname} has joined the chat`;
    chatMessages.appendChild(messageElement);
});

socket.on('user_left', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.textContent = `${data.nickname} has left the chat`;
    chatMessages.appendChild(messageElement);
});

socket.on('update_users', (data) => {
    userList.innerHTML = '';
    data.users.forEach((user) => {
        const userElement = document.createElement('li');
        userElement.textContent = user;
        userList.appendChild(userElement);
    });
});