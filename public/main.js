const getUserName = () => {
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
        let template = '';
        rooms.map(room => {
            template += `<div class="room">
                <h3>${room.name}</h3>
                <a href="/chat/${room.id}">Ingresar</a>
            </div>`;
        });

        document.getElementById('rooms').innerHTML = template;
    }).catch(err => {
        console.log('Failed to get rooms', err);
    })
}

(() => {
    getUserName();
    getChatRooms();
})();