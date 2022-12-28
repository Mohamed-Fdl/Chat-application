const express = require('express')

const app = express()

const http = require('http')

const server = http.createServer(app)

const { Server } = require("socket.io")

const io = new Server(server)

const { v4: uuidv4 } = require('uuid')

const config = require('./config')

const moment = require('moment')

const { getAndDeleteUserDisconnected, getRoomByName, getRoomByToken, getUser, getRoomUsers } = require('./helpers')


app.use(express.static('public'))

let Users = []

let Rooms = []

io.on('connection', (socket) => {

    socket.on('userConnected', (info) => {

        socket.join(info.room)

        Rooms.push({ id: uuidv4(), roomName: info.room })

        Users.push({ id: socket.id, username: info.username, room: info.room })

        console.log('User : ' + info.username + ' is connected')

        socket.broadcast.to(info.room).emit('userConnected', {
            username: 'FdlBot',
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            text: info.username + ' is connected to the room.',
        })

        io.to(info.room).emit('roomUsers', {
            room: info.room,
            users: getRoomUsers(Users, info.room)
        })
    })


    socket.on('ChatMessage', (msg) => {

        let user = getUser(Users, socket.id)

        msg.time = moment().format('MMMM Do YYYY, h:mm:ss a')

        io.to(user.room).emit('ChatMessage', msg)
    })


    socket.on('disconnect', () => {

        try {
            let user = getAndDeleteUserDisconnected(Users, socket.id)

            console.log(user.username + ' is disconnected')

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(Users, user.room)
            })

            io.to(user.room).emit('userDisconnected', { username: 'FdlBot', time: moment().format('MMMM Do YYYY, h:mm:ss a'), text: user.username + ' is disconnected' })

        } catch (error) {
            console.log(error)
        }
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


const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log('listening on *: ' + PORT)
})