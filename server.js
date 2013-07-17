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

io.sockets.on('connection', function(socket) {
	socket.emit('start', function(data) {

	});
	socket.on('update', function(data) {
		io.sockets.emit('echo', data);
	});

	socket.on('', function(data) {

	});
})