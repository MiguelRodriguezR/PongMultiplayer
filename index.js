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
var ballReseted = false;
var playerNames ={};
var viewerNames ={};
var game = {
  directionball:{x:1,y:1},
  ball:{x:0.5,y:0.5},
  player1:0.5,
  player2:0.5,
  scores:{p1:0,p2:0},
  velocity: 0.01
}
var gameInterval;
var timegame = 0;
var emitingGame = false;

function intersects(rectA, rectB) {
  return !(rectA.x + rectA.width < rectB.x ||
           rectB.x + rectB.width < rectA.x ||
           rectA.y + rectA.height < rectB.y ||
           rectB.y + rectB.height < rectA.y);
};

function resetBall() {
  game.velocity = 0.01;
  game.ball={x:0.5,y:0.5};
  game.directionball.x = 0;
  game.directionball.y = 0;
  while(game.directionball.x==0 || game.directionball.y==0){
    game.directionball.x=Math.floor((Math.random()*3)-1);
    game.directionball.y=Math.floor((Math.random()*3)-1);
  }
}

function updateGame(socket){
  timegame+=1;
  if(timegame<100){
    var getready = (0 + timegame)+"%";
    socket.emit('getReady', {
      getready
    });
    socket.broadcast.emit('getReady', {
      getready
    });
    return;
  }
  else{
    if(ballReseted==false){
      resetBall();
      ballReseted = true;
    }
    game.ball.x+=game.directionball.x*game.velocity;
    game.ball.y+=game.directionball.y*game.velocity;
    if(game.ball.x<=0 || game.ball.x>=1 ){
      if(game.ball.x<=0){
        game.scores.p2+=1;
      }else{
        game.scores.p1+=1;
      }
      resetBall();
    }
    if(game.ball.y<=0 || game.ball.y>=1 ){
      game.directionball.y=-game.directionball.y
    }
    if(
      intersects(
      {
        x:0.1,
        y:game.player1,
        width:0.025,
        height:0.2
      },
      {
        x:game.ball.x,
        y:game.ball.y,
        width:0.01,
        height:0.01
      })
     ||
     intersects(
     {
      x:0.87,
      y:game.player2,
      width:0.025,
      height:0.2
    },
    {
      x:game.ball.x,
      y:game.ball.y,
      width:0.01,
      height:0.01
    }
    )
    ){
      game.velocity+=0.001
      game.directionball.x=-game.directionball.x
    }

    socket.emit('updateGame', {
      game
    });
    socket.broadcast.emit('updateGame', {
      game
    });
  }
}

io.on('connection', (socket) => {

  socket.on('playerUp', (username) => {
    if(socket.username==playerNames[Object.keys(playerNames)[1]]){
      if(game.player1<=0)return;
      game.player1-=0.02
    }else if (socket.username==playerNames[Object.keys(playerNames)[0]]) {
      if(game.player2<=0)return;
      game.player2-=0.02
    }
  });

  socket.on('playerDown', (username) => {
    if(socket.username==playerNames[Object.keys(playerNames)[1]]){
      if(game.player1>=0.8)return;
      game.player1+=0.02
    }else if (socket.username==playerNames[Object.keys(playerNames)[0]]) {
      if(game.player2>=0.8)return;
      game.player2+=0.02
    }
  });

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
    if(readyStatus==1 && emitingGame==false){
      gameInterval = setInterval(function(){
        updateGame(socket);
      }, 50);
      emitingGame = true;
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
      emitingGame = false;
      ballReseted = false;
      timegame = 0;
      game = {
        directionball:{x:1,y:1},
        ball:{x:0.5,y:0.5},
        player1:0.5,
        player2:0.5,
        scores:{p1:0,p2:0},
        velocity: 0.01
      }
      clearInterval(gameInterval);
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
