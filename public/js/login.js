var socket = io();
var username;
var connected = false;
var players ="";
var viewers = "";
function registrarNuevo(){
  username = document.querySelector('input').value;
  socket.emit('add user', username);
  // displayPlayerview();
}
socket.on('login', function (data) {
  // console.log("players : "+data.numPlayers);
  // console.log("viwers : "+data.numViewer);
  // console.log("Players : "+JSON.stringify(data.playerNames));
  // console.log("viwers : "+JSON.stringify(data.viewerNames));
  players = data.playerNames;
  viewers = data.viewerNames;
  connected = true;
  displayPlayerview();
  updatePlayersViewers();
  console.log(data.readyStatus);
  if(data.readyStatus == 1){
    game = new Game(username,canvas,ctx);
  }
});
socket.on('login new', function (data) {
  players = data.playerNames;
  viewers = data.viewerNames;
  if(connected==true){
    updatePlayersViewers();
  }
});

socket.on('exist',function (data){
  document.querySelector('input').value="";
  document.querySelector('input').placeholder="Nombre ya existe :(";

});

socket.on('player left',function (data) {
  document.querySelector('#principal').style.display="none";
  document.querySelector('#game').style.height="100vh";
  document.querySelector('#game').innerHTML=
  '<div id="viewers"><h3>Espectadores</h3></div>'+
  '<canvas id="canvas"></canvas>'+
  '<div id="players"><h3>Jugadores</h3></div>';
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  ctx.save();
    ctx.font = "10px Arial";
    console.log(data);
    ctx.fillText("Jugador: "+data.left+" se ha ido",canvas.width/3,canvas.height/2);
  ctx.restore();
  canvas.style.width ='100%';
  canvas.style.height='100%';
  players = data.playerNames;
  updatePlayersViewers();
});

socket.on('viewer left',function (data) {
  viewers = data.viewerNames;
  updatePlayersViewers();
});

socket.on('ready', function (data) {
  document.querySelector('#game').style.height="100vh";
  document.querySelector('#game').innerHTML=
  '<div id="viewers"></div>'+
  '<canvas id="canvas"></canvas>'+
  '<div id="players"></div>';
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  canvas.style.width ='100%';
  canvas.style.height='100%';
  game = new Game(username,canvas,ctx);
  updatePlayersViewers();
});
