var socket = io();

var connected = false;
function registrarNuevo(){
  username = document.querySelector('input').value;
  socket.emit('add user', username);
}
socket.on('login', function (data) {
  console.log("players : "+data.numPlayers);
  console.log("viwers : "+data.numViewer);
  console.log("Players : "+JSON.stringify(data.playerNames));
  console.log("viwers : "+JSON.stringify(data.viewerNames));
  displayPlayerview();
});
