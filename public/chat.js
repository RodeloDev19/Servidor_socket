const socket = io('/');

let userName = '';

const retrieveUserName = () => {
    userName = localStorage.getItem('username');
    if (userName) {
        document.getElementById('user').innerText = userName;
    } else {
        console.warn('Usuario no identificado:', userName);
        window.location.href = '/login';
    }
};

const startSockets = () => {
    socket.emit('newUser', {
        user: userName,
        chat: window.location.pathname.split('/').pop()
    });
    
    socket.on('newUser', (data) => {
        displayUserJoinedMessage(data.user);
    });
    
    socket.on('newMessage', (data) => {
        displayNewMessage(data);
    });
    
    socket.on('userLeft', (data) => {
        displayUserLeftMessage(data.user);
    });
};

const displayUserJoinedMessage = (name) => {
    const messageElement = document.createElement('p');
    messageElement.className = 'new-user';
    messageElement.innerText = name === 'Propio' ? 'Te has unido' : `${name} se unió`;
    document.getElementById('messages').appendChild(messageElement);
};

const displayUserLeftMessage = (name) => {
    const messageElement = document.createElement('p');
    messageElement.className = 'user-left';
    messageElement.innerText = name === 'Propio' ? 'Te has salido' : `${name} se salió`;
    document.getElementById('messages').appendChild(messageElement);
};

const displayNewMessage = (data, isOwnMessage = false) => {
    const messageElement = document.createElement('p');
    const senderName = isOwnMessage ? 'Propio' : data.user;
    messageElement.className = isOwnMessage ? 'message mine' : 'message';
    messageElement.innerText = `${senderName}: ${data.message}`;
    document.getElementById('messages').appendChild(messageElement);
};

const initializeMessageForm = () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = form.querySelector('input');
        const message = input.value.trim();
        if (!message) return;

        displayNewMessage({ message }, true);

        socket.emit('newMessage', {
            user: userName,
            message
        });
    
        input.value = '';
    });
};

// Inicialización del chat
retrieveUserName();
startSockets();
initializeMessageForm();
displayUserJoinedMessage('Propio');
