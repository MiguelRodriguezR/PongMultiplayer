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
var playerNames ={};
var viewerNames ={};

io.on('connection', (socket) => {

  socket.on('add user', (username) => {
    socket.username = username;
    if(numPlayers>=2){
      viewerNames[username] = username;
      numViewer++;
    }
    else{
      playerNames[username] = username;
      numPlayers++;
    }
    console.log("players : "+numPlayers);
    console.log("viwers : "+numViewer);
    socket.emit('login', {
      numPlayers: numPlayers,
      numViewer: numViewer
    });
  });

});
