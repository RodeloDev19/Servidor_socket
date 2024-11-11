const getLocalUser = () => {
    let userName = localStorage.getItem('username');
    if (userName) {
        const sameUser = confirm(`Hola, ${userName}. Eres tu?`);
        if (!sameUser) userName = '';
    }
    if (!userName) {
        userName = prompt("Como os llamais?");
        if (!userName) window.location = '';
        localStorage.setItem('username', userName);
    }
    document.getElementById('user').innerText = userName;
}

const getChatRooms = () => {
    axios.get('/api/rooms').then(response => {
        const rooms = response.data;
        let roomFormat = '';
        rooms.map(room => {
            roomFormat += `<div class="room">
                <h3>${room.name}</h3>
                <a href="/chat/${room.id}" id="button">Ingresar</a>
            </div>`;
        });

        document.getElementById('rooms').innerHTML = roomFormat;
    }).catch(err => {
        console.log('Failed to get rooms', err);
    })
}

// Llamadas a las funciones
getLocalUser();
getChatRooms();