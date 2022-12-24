const socket = io()

const charForm = document.getElementById('chat-form')

const chatMessage = document.querySelector('.chat-messages')

const inviteButton = document.getElementById('invite-button')

const modal = document.getElementById('modal')

const invitationLinkContent = document.getElementById('invitation-link-content')

let searchParams = new URLSearchParams(window.location.search)

let username, room

// Get the close button
const closeButton = document.querySelector('.close-button');

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


if (searchParams.has('roomName') && searchParams.has('username')) {

    username = searchParams.get('username')

    room = searchParams.get('roomName')

    socket.emit('userConnected', { username, time: Date.now(), room })

} else {
    window.location = '/'
}

socket.emit('userDisconnected', username)

socket.on('userConnected', function(msg) {
    outputMessage(msg)
})

socket.on('userDisconnected', function(msg) {
    outputMessage(msg)
})


charForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    outputMessage({ username, time: Date.now(), text: msg })

    socket.emit('ChatMessage', { username, time: Date.now(), text: msg })

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

})

inviteButton.addEventListener('click', async(e) => {

    let link = await getInvitationLink(room)

})

socket.on('ChatMessage', function(msg) {
    outputMessage(msg)
    chatMessage.scrollTop = chatMessage.scrollHeight
})


function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

function getInvitationLink(room) {

    return axios.get(`http://localhost:3000/getInviteLink/${room}`)
        .then(function(response) {
            if (response.data.success) {
                let link = response.data.link
                modal.style.display = 'block'
                invitationLinkContent.innerHTML = link
            }
            return
        })
        .catch(function(error) {
            console.log(error)
        })
}

// Get the modal button and modal element



/*
const roomName = document.getElementById('room-name')
const usersList = document.getElementById('users')

//Get username and room from URL 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room)




//Join chatRoom
socket.emit('joinRoom', { username, room })

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

//Message from server
socket.on('message', message => {
    outputMessage(message)
    chatMessage.scrollTop = chatMessage.scrollHeight
})

//Message submit
charForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //Get message text
    const msg = e.target.elements.msg.value

    //Emit message to the server
    socket.emit('ChatMessage', msg)

    //Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

})

//outputMessage from dom


//add room name to dom
function outputRoomName(room) {
    roomName.innerHTML = room
}

//add users to dom
function outputUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}*/