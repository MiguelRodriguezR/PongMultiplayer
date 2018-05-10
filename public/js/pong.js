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
  }

  drawGame(){
    this.ctx.beginPath();
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(canvas.width,canvas.height);
    this.ctx.stroke();
  }
}
