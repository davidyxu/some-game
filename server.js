var express = require('express')
	, app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);


io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/client.html');
});

var port = process.env.PORT || 5000;

server.listen(port);
// parties (groups of players in same room)

// battles[party_id]
// once battle is over, battle[party_id] = null

io.sockets.on('connection', function(socket) {
	socket.emit('start', function() {

	});
	socket.on('ping', function(time) {
		socket.emit('ping', time);
	});
	socket.on('battle', function(data) {
		io.sockets.room.broadcast('spawn', room);
			// send all data to everyone in current room
	});
	socket.on('update', function(data) {
		//if valid(data) {
			// socket.emit validated
			// sockets.broadcast data
		//} else {
		//	socket.emit('sync', entity[data.id]);

		//}
		//io.sockets.emit('echo', data);
	});

	socket.on('', function(data) {

	});
})
