module.exports.getAndDeleteUserDisconnected = function(users, id) {
    let user

    users.forEach(element => {
        if (element.id === id) user = element
    });

    let index = users.indexOf(user)

    users.splice(index, 1)

    return user
}

module.exports.getUser = function(users, id) {
    let user

    users.forEach(element => {
        if (element.id === id) user = element
    });

    return user
}

module.exports.getRoomByName = function(rooms, roomName) {
    let room

    rooms.forEach(element => {
        if (element.roomName === roomName) room = element
    });

    return room
}

module.exports.getRoomByToken = function(rooms, token) {
    let room

    rooms.forEach(element => {
        if (element.id === token) room = element
    });

    return room
}

module.exports.getRoomUsers = function(Users, room) {
    return Users.filter(user => user.room === room);
}