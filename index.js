var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

var numPlayers = 0;
var numViewer = 0;
var readyStatus = 0;
var playerNames ={};
var viewerNames ={};

io.on('connection', (socket) => {

  socket.on('add user', (username) => {
    if(playerNames.hasOwnProperty(username) |
    viewerNames.hasOwnProperty(username)){
      socket.emit('exist', "e");
      return;
    }
    socket.username = username;
    if(numPlayers>=2){
      viewerNames[username] = username;
      numViewer++;
    }
    else{
      playerNames[username] = username;
      numPlayers++;
    }
    console.log("players : "+JSON.stringify(playerNames));
    console.log("viwers : "+JSON.stringify(viewerNames));
    socket.broadcast.emit('login new', {
      numPlayers,
      numViewer,
      playerNames,
      viewerNames,

    });
    socket.emit('login', {
      numPlayers,
      numViewer,
      playerNames,
      viewerNames,
      readyStatus
    });
    if(numPlayers==2){
      if(readyStatus==0){
        console.log("entro");
        socket.broadcast.emit('ready', {
          playerNames
        });
        socket.emit('ready', {
          playerNames
        });
        readyStatus = 1;
      }
    }
  });

  socket.on('disconnect', () => {
    if (playerNames.hasOwnProperty(socket.username)) {
      --numPlayers;
      console.log(socket.username+" has left...");
      delete playerNames[socket.username];
      socket.broadcast.emit('player left', {
        left:socket.username,
        playerNames,
        viewerNames
      });
      readyStatus = 0;
    }
    else if(viewerNames.hasOwnProperty(socket.username)){
      --numViewer;
      console.log(socket.username+" has left...");
      delete viewerNames[socket.username];
      socket.broadcast.emit('viewer left', {
        left:socket.username,
        playerNames,
        viewerNames
      });
    }
  });
});
