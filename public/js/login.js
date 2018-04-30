var socket = io();
username = 'miguel'

socket.emit('add user', username);

socket.on('login', function (data) {
  console.log("players : "+data.numPlayers);
  console.log("viwers : "+data.numViewer);
});
