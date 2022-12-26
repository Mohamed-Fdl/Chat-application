const { info } = require('console')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const { v4: uuidv4 } = require('uuid')
const config = require('./config')

app.use(express.static('public'))

let Users = []

let Rooms = []

io.on('connection', (socket) => {


    socket.on('userConnected', (info) => {

        socket.join(info.room)

        Rooms.push({ id: uuidv4(), roomName: info.room })

        Users.push({ id: socket.id, username: info.username, room: info.room })

        console.log('User : ' + info.username + ' connected')

        socket.broadcast.to(info.room).emit('userConnected', { username: 'FdlBot', time: Date.now(), text: info.username + ' is connected to the room : ' + info.room })
    })


    socket.on('ChatMessage', (msg) => {

        let user = getUser(Users, socket.id)

        console.log('message: ' + msg)

        socket.broadcast.to(user.room).emit('ChatMessage', msg)
    })















    socket.on('disconnect', () => {

        let user = getAndDeleteUserDisconnected(Users, socket.id)

        console.log(user.username + ' is disconnected')

        io.emit('userDisconnected', { username: 'FdlBot', time: Date.now(), text: user.username + ' is disconnected' })
    })


})

app.get('/getInviteLink/:roomName', (req, res) => {

    try {
        let room = getRoomByName(Rooms, req.params.roomName)

        let inviteLink = `${config.APP_URL}/inviteToChat.html?token=${room.id}`

        res.json({ link: inviteLink, success: true })

    } catch (error) {

        console.log(error)
        res.json({ error, success: false })
    }
})

app.get('/invite/:token', (req, res) => {

    try {
        let room = getRoomByToken(Rooms, req.params.token)

        res.json({ roomName: room.roomName, success: true })

    } catch (error) {

        console.log(error)
        res.json({ error, success: false })
    }
})


function getAndDeleteUserDisconnected(users, id) {
    let user

    users.forEach(element => {
        if (element.id === id) user = element
    });

    let index = users.indexOf(user)

    users.splice(index, 1)

    return user
}

function getUser(users, id) {
    let user

    users.forEach(element => {
        if (element.id === id) user = element
    });

    return user
}

function getRoomByName(rooms, roomName) {
    let room

    rooms.forEach(element => {
        if (element.roomName === roomName) room = element
    });

    return room
}

function getRoomByToken(rooms, token) {
    let room

    rooms.forEach(element => {
        if (element.id === token) room = element
    });

    return room
}

server.listen(3000, () => {
    console.log('listening on *:3000')
})