var express = require('express')
var app = express()
var server = require('http').Server(app)
app.use('/', express.static(__dirname))

var io = require('socket.io')(server)
var allPlanes = {}

io.on('connection', function (socket) {
	socket.on('somebodyfresh', function (data) {
		allPlanes[data.name] = socket
		for (var user in allPlanes) {
			if (user != data.name && allPlanes[user] != undefined) {
				allPlanes[user].emit('somebodyfresh', data)
			}
		}
	})
	socket.on('disconnect', function () {
		var user;
		for (user in allPlanes) {
			if (allPlanes[user] != null && allPlanes[user] == socket) {
				allPlanes[user] = undefined;
				for (var i in allPlanes) {
					if (allPlanes[i] != undefined) {
						allPlanes[i].emit('somebodyover', {
							name: user
						})
					}
				}
				return;
			}
		}
	});
})
server.listen(3000)