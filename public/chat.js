const socket = io('/');

let userName = '';

const getUserName = () => {
    userName = localStorage.getItem('username');
    if (userName) {
        document.getElementById('user').innerText = userName;
        localStorage.setItem('username', userName);
    } else {
        console.log('Quien chota sos?', userName);
        window.location.href = '';
    }
}

const initSocketEventListeners = () => {
    socket.emit('newUser', {
        user: userName,
        chat: window.location.href.split('/').pop()
    });
    
    socket.on('newUser', (data) => {
        sendNewUserMessage(data.user);
    });
    
    socket.on('newMessage', (data) => {
        sendNewMessage(data);
    });
    
    socket.on('userLeft', (data) => {
        sendUserLeftMessage(data.user);
    });
}

const sendNewUserMessage = (name) => {
    const p = document.createElement('p');
    p.className = 'new-user';
    if (name === 'Propio') {
        p.innerText = 'Te haz unido';
    } else {
        p.innerText = `${name} se unió`;
    }
    document.getElementById('messages').append(p);
}

const sendUserLeftMessage = (name) => {
    const p = document.createElement('p');
    p.className = 'user-left';
    if (name === 'Propio') {
        p.innerText = 'Te haz salido';
    } else {
        p.innerText = `${name} se salió`;
    }
    document.getElementById('messages').append(p);
}

const sendNewMessage = (data, mine) => {
    const p = document.createElement('p');
    let name = data.user;
    if (mine) {
        p.className = 'message mine';
        name = 'Propio';
    } else {
        p.className = 'message';
    }
    p.innerText = `${name}: ${data.message}`;
    document.getElementById('messages').append(p);
}

const initMessageForm = () => {
    document.getElementsByTagName('form')[0].addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementsByTagName('input')[0];
        const message = input.value;
        if (!message) return;
        sendNewMessage({ message }, true);

        socket.emit('newMessage', {
            user: userName,
            message
        });
    
        input.value = '';
    });
}

(() => {
    getUserName();
    initSocketEventListeners();
    initMessageForm();
    sendNewUserMessage('Propio'); 

    window.onbeforeunload = () => {
        return 'Deseas salir de verdad?';
    };
})();