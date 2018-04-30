var canvas;
function displayPlayerview(){
  document.querySelector('#principal').style.display="none";
  document.querySelector('#game').style.height="100vh";
  document.querySelector('#game').innerHTML=
  '<div id="viewers"></div>'+
  '<canvas id="canvas"></canvas>'+
  '<div id="players"></div>';
  canvas = document.querySelector('#canvas');
  // canvas.style.width ='100%';
  // canvas.style.height='100%';
  // canvas.width  = canvas.offsetWidth;
  // canvas.height = canvas.offsetHeight;
}
