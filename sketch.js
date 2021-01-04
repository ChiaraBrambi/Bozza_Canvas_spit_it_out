let b1, b2, b3, b4;
let btn_text= 'AVANTI';
let  agents = [];
let agentCount = 4000;
//  var noiseScale = 300;
//  var noiseStrength = 10;
let  overlayAlpha = 10;
//  var agentAlpha = 90;
//  var strokeWidth = 0.3;
//  //var drawMode = 1;
//

//////////////////onda parole /////////////////
let xspacing = 30; // Distance between each horizontal location
let w_onda; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 20.0; // Height of wave
let period = 510.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave

function preload(){}

 function setup() {
 createCanvas(windowWidth,windowHeight);
    //background
    fill(0, overlayAlpha*5);//poi da mettere nel draw per reciclare
    noStroke();
    rect(0, 0, width,height);

    b1 = createButton('inserisci il tuo pensiero');
    b1.position(width/2*1.7, height/2*0.1);
    b1.mousePressed(popUp);
    b1.id('startBtn');

  /////////onda setup
  w_onda = width/2*1.3;//dove finisce l'onda
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w_onda / xspacing));

//   for (var i = 0; i < agentCount; i++) {
//         agents[i] = new Agent();
//       }
}

 function draw() {
// // Draw agents
//   stroke(0, agentAlpha);
//     for (var i = 0; i < agentCount; i++) {
//       //if (drawMode == 1)
//       agents[i].update1(noiseScale, noiseStrength, strokeWidth);
//       //else agents[i].update2(noiseScale, noiseStrength, strokeWidth);
//     }

//calcWave();
//renderWave();
}


function popUp() {
push();//pop up
rectMode(CENTER);
fill(0, 0, 0);
rect(width/2,height/2, width/2.5,height/2, 20);
pop();
//bottone avanti
b2 = createButton( btn_text);
b2.position(width/2-80, height/3*2);
b2.mousePressed(go);
b2.id('goBtn');

//bottone indietro
b3 = createButton('<');
b3.position(width/2*0.65, height/2*0.6);
b3.mousePressed(back);
b3.id('fBtn');

}

function go(){
//document.getElementById('goBtn').style.display = 'none';
btn_text = 'PREVIEW';
b2 = createButton( btn_text);
b2.position(width/2-80, height/3*2);
//bottone indietro
b4 = createButton('microfono');
b4.position(width/2-60, height/3*1.2);
b4.mousePressed(microfono);
b4.id('fBtn');
}

function back(){
document.getElementById('goBtn').style.display = 'none';
document.getElementById('fBtn').style.display = 'none';
background(255);
}

function microfono(){

  rectMode(CENTER);
  fill(32, 178, 170);
  rect(width/2,height/2, width/2.5,height/2, 20);

}

/////////////////////////////////onda
function calcWave() {
// Increment theta (try different values for 'angular velocity' here)
  theta += 0.02;
// For every x value, calculate a y value with sine function
  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;
    x += dx;
  }
}

function renderWave() {
  push();//pop up
  rectMode(CENTER);
  fill(0, 0, 0);
  rect(width/2,height/2, width/2.5,height/4, 20);
  pop();
  push()
  noStroke();
  fill(255);
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 15; x < yvalues.length; x++) {
    ellipse(x * xspacing, height / 2 + yvalues[x], 5, 5);
  }
    pop();
}



// keyReleased = function() {
// if (keyCode == DELETE || keyCode == BACKSPACE){
//   background(255);
//   }
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
