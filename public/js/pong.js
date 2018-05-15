var canvas;
var ctx;
var game;
function displayPlayerview(){
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
    ctx.fillText("Esperando Jugadores",canvas.width/3,canvas.height/2);
  ctx.restore();
  canvas.style.width ='100%';
  canvas.style.height='100%';
}

function updatePlayersViewers(){

  document.querySelector('#players').innerHTML="<h3>Jugadores</h3><ul>"
  for(var p in players){
    document.querySelector('#players').innerHTML+="<li>"+p+"</li>";
  }
  document.querySelector('#players').innerHTML+="</ul>";
  document.querySelector('#viewers').innerHTML="<h3>Espectadores</h3><ul>";
  for(var v in viewers){
    document.querySelector('#viewers').innerHTML+="<li>"+v+"</li>";
  }
  document.querySelector('#viewers').innerHTML+="</ul>";
}



class Game{
  constructor(user,canvas,ctx){
    this.user = user;
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawGame();
    this.posyP1 = 0.5;
    this.posyP2 = 0.5;
    this.ballX = 0.5;
    this.ballY = 0.5;
    this.scoreP1=0;
    this.scoreP2=0;
  }

  drawGetReady(time){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
      this.ctx.fillStyle="black";
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.fillStyle="white";
      this.ctx.font = "10px Arial";
      this.ctx.fillText(""+time,this.canvas.width/2,this.canvas.height/2);
    this.ctx.restore();
  }

  updateGameSocket(game){
    this.posyP1 = game.player1;
    this.posyP2 = game.player2;
    this.ballX = game.ball.x;
    this.ballY = game.ball.y;
    this.scoreP1 = game.scores.p1;
    this.scoreP2 = game.scores.p2;
    this.drawGame();
    // console.log(game.ball.x);
  }

  drawGame(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
      this.ctx.fillStyle="black";
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.fillStyle="white";
      this.ctx.fillRect(this.canvas.width*0.1,this.canvas.height*this.posyP1,this.canvas.width*0.025,this.canvas.height*0.2);
      this.ctx.fillRect(this.canvas.width*0.9,this.canvas.height*this.posyP2,-this.canvas.width*0.025,this.canvas.height*0.2);
      this.ctx.fillRect(this.canvas.width*this.ballX,this.canvas.height*this.ballY,this.canvas.width*0.01,this.canvas.height*0.01);
      this.ctx.font = "10px Arial";
      this.ctx.fillText(""+this.scoreP1,this.canvas.width*0.1,this.canvas.height*0.1);
      this.ctx.fillText(""+this.scoreP2,this.canvas.width*0.9,this.canvas.height*0.1);
      this.ctx.fillText(""+players[Object.keys(players)[1]],this.canvas.width*0.1,this.canvas.height*0.95);
      this.ctx.fillText(""+players[Object.keys(players)[0]],this.canvas.width*0.7,this.canvas.height*0.95);
      // this.ctx.arc(this.canvas.width*this.ballX, this.canvas.height*this.ballY, this.canvas.height*0.01, 0, 2 * Math.PI);
      // this.ctx.fill();
    this.ctx.restore();
  }

  move(key){
    if(username == players[Object.keys(players)[1]]){
      if(key=='ArrowUp' ){
        this.posyP1-=0.02;
        this.drawGame();
        socket.emit('playerUp', username);
      }else if (key=='ArrowDown') {
        this.posyP1+=0.02;
        this.drawGame();
        socket.emit('playerDown', username);
      }

    }else if (username == players[Object.keys(players)[0]] ) {
      if(key=='ArrowUp'){
        this.posyP2-=0.02;
        this.drawGame();
        socket.emit('playerUp', username);
      }else if (key=='ArrowDown') {
        this.posyP2+=0.02;
        this.drawGame();
        socket.emit('playerDown', username);
      }
    }
  }
}

document.addEventListener("keydown", function(e){
  // console.log(e.key);
  if(connected==true){
    if(e.key=='ArrowUp' || e.key=='ArrowDown'){
      game.move(e.key);
    }
  }
});

socket.on('getReady',function(data){
  if(connected==true){
    game.drawGetReady(data.getready);
  }
});

socket.on('updateGame',function(data){
  if(connected==true){
    game.updateGameSocket(data.game);
  }
});
