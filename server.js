var express = require('express')
	, app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/client.html');
});

server.listen(8080);

io.sockets.on('connection', function(socket) {
	socket.on('login', function(data) {
		socket.emit('start', function(data) {

		});
	});
	socket.on('update', function(data) {

	});

	socket.on('', function(data) {

	});
})