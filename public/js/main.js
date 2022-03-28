const charForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const usersList = document.getElementById('users')

//Get username and room from URL 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room);



const socket = io()

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
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

//add room name to dom
function outputRoomName(room) {
    roomName.innerHTML = room
}

//add users to dom
function outputUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}