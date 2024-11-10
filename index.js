const express = require('express');
const socketIo = require('socket.io');

const app = express(); // Define `app` antes de usarlo

const rooms = [
    { id: '1', name: 'Chat 1' },
    { id: '2', name: 'Chat 2' },
    { id: '3', name: 'Chat 3' },
    { id: '4', name: 'Chat 4' }
];

app.use(express.static(__dirname + '/public'));

app.get('/api/rooms', (req, res) => {
    res.send(rooms);
});

app.get('/chat/:id', (req, res) => {
    const chatId = req.params.id;
    const room = rooms.filter(item => item.id === chatId);
    if (!room.length) res.redirect('/');
    res.sendFile(__dirname + '/views/chat.html');
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    const host = 'localhost';
    console.log(`Servidor en ejecución en http://${host}:${PORT}/`);
});

const io = socketIo(server); // Configura `socketIo` después de iniciar el servidor

io.on('connection', (socket) => {
    console.log('Un nuevo usuario se ha conectado');

    socket.on('newUser', (data) => {
        socket.data.user = data.user;
        socket.data.chat = data.chat;
        socket.join('chat-' + data.chat);
        socket.to('chat-' + data.chat).emit('newUser', data);
    });

    socket.on('newMessage', (data) => {
        socket.to('chat-' + socket.data.chat).emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        socket.to('chat-' + socket.data.chat).emit('userLeft', { ...socket.data });
    });
});
