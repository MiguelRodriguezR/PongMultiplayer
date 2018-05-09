var socket = io();
var username;
var connected = false;
var players ="";
var viewers = "";
function registrarNuevo(){
  username = document.querySelector('input').value;
  socket.emit('add user', username);
  connected = true;
  displayPlayerview();
}
socket.on('login', function (data) {
  // console.log("players : "+data.numPlayers);
  // console.log("viwers : "+data.numViewer);
  // console.log("Players : "+JSON.stringify(data.playerNames));
  // console.log("viwers : "+JSON.stringify(data.viewerNames));
  players = data.playerNames;
  viewers = data.viewerNames;
  if(connected==true){
    updatePlayersViewers();
  }
});
