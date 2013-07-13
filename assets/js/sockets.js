var socket = io.connect(window.location.hostname);
socket.on('connect', function(){
  console.log("connected")
});
