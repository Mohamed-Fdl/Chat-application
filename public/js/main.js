const socket = io()

const APP_URL = 'https://47dc-41-138-91-173.ngrok.io'

const charForm = document.getElementById('chat-form')

const chatMessage = document.querySelector('.chat-messages')

const inviteButton = document.getElementById('invite-button')

const modal = document.getElementById('modal')

const roomOutput = document.getElementById('room-name')

const usersOutput = document.getElementById('users')

const invitationLinkContent = document.getElementById('invitation-link-content')

const closeButton = document.querySelector('.close-button')

let searchParams = new URLSearchParams(window.location.search)

let username, room


if (searchParams.has('roomName') && searchParams.has('username')) {

    username = searchParams.get('username')

    room = searchParams.get('roomName')

} else {
    window.location = '/'
}

socket.on('roomUsers', function({ room, users }) {

    roomOutput.innerText = room

    outputUsers(users)
})

socket.emit('userConnected', { username, time: Date.now(), room })

socket.on('userConnected', function(msg) {
    outputMessage(msg)
})

socket.on('userDisconnected', function(msg) {
    outputMessage(msg)
})

socket.on('ChatMessage', function(msg) {
    chatMessage.scrollTop = chatMessage.scrollHeight
    outputMessage(msg)
})

charForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    chatMessage.scrollTop = chatMessage.scrollHeight

    socket.emit('ChatMessage', { username, time: Date.now(), text: msg })

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

})

closeButton.addEventListener('click', () => {
    modal.style.display = 'none'
})

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none'
    }
})

inviteButton.addEventListener('click', async(e) => {
    await getInvitationLink(room)
})

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?')
    if (leaveRoom) {
        window.location = '../index.html'
    }
})

function outputUsers(users) {

    usersOutput.innerHTML = ''
    users.forEach((user) => {
        const li = document.createElement('li')
        li.innerText = user.username
        usersOutput.appendChild(li)
    })
}

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

    return axios.get(`${APP_URL}/getInviteLink/${room}`)
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