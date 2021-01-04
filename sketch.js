let b1, b2, b3, b4;
let p;
let btn_text = 'AVANTI';

//impostazioni riconoscimento vocale //////////////////////////
let lang = 'en-US'; //|| 'it-IT'
let speechRec = new p5.SpeechRec(lang, gotSpeech);

let shapes = [];
let newShape;

let articolazioni = 3;
let lineLength = 100; //lunghezza poi da inpostare in base a quanto è lunga la stringa della parola
var resolution = 0.05; //risoluzone 0.04; / scrive da solo
var gravity = 0.094;
var smorzamento = 0.998;//smorzamento 0.998 / dimensione lettere

var font = 'Georgia';
var letters = 'Hi, how are you?';
var fontSizeMin = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100); //colorMode(mode, max1, max2, max3, [maxA])
  strokeWeight(1);
  textFont(font, fontSizeMin);

  b1 = createButton('inserisci il tuo pensiero');
  b1.position(width / 2 * 1.7, height / 2 * 0.1);
  b1.mousePressed(popUp);
  b1.id('startBtn');
}

function draw() {
  background(0, 0, 100);

  //per ogni elemento dell'array chiama le seguenti funzioni
  shapes.forEach(function(shape){ shape.draw();shape.update();}); //non sei obbligato a dare un nome ad una funzione

  if (newShape) { //se newShape == true viene attivato il comando
  newShape.addPos(mouseX, mouseY);
  newShape.draw();
  newShape.update();
}
}//fine draw

function Shape(pendulumPathColor) { //class this.value
  this.shapePath = [];
  this.pendulumPath = [];
  this.pendulumPathColor = pendulumPathColor;
  this.iterator = 0;
  this.lineLength = lineLength;
  this.resolution = resolution;
  this.pendulum = new Pendulum(this.lineLength, articolazioni); //constructor function
  this.letterIndex = 0;

  Shape.prototype.addPos = function(x, y) { //per chiamare piu classi diverse
  //nomeClasse.protoype.nomeFunzione = function(){
  //codice da svolgere per ogni classe }
  var newPos = createVector(x, y);
  this.shapePath.push(newPos);
  };

  Shape.prototype.draw = function() {
    if (this.pendulumPath.length) {
      noStroke();
      fill(this.pendulumPathColor);
      this.letterIndex = 0;
      this.pendulumPath.forEach(function(pos, posIndex) {
        var newLetter = letters.charAt(this.letterIndex);//?
// tenere le tettere distanziate
  var nextPosIndex = this.pendulumPath.findIndex(function(nextPos, nextPosIndex) {
  if (nextPosIndex > posIndex) {
    var d = p5.Vector.dist(nextPos, pos);//distanza
    textSize(max(fontSizeMin, d));//dimensione delle lettere dipende dalla distanza tra loro
    return d > textWidth(newLetter);
  } });

var nextPos = this.pendulumPath[nextPosIndex];

if (nextPos) {//scrivi la lettera vera e propria
      var angle = atan2(nextPos.y - pos.y, nextPos.x - pos.x); //tangente
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      text(newLetter, 0, 0);
      pop();
      this.letterIndex++;
      if (this.letterIndex >= letters.length) {
        this.letterIndex = 0;
      }
    }

  }.bind(this));//metodo che crea una funzione
    noFill();
}//si chiude if this.pendulumPathColor
if (this.iterator < this.shapePath.length) {
      var currentIndex = floor(this.iterator);

      var currentPos = this.shapePath[currentIndex];
      var previousPos = this.shapePath[currentIndex - 1];
      if (previousPos) {
        var offsetPos = p5.Vector.lerp(previousPos, currentPos, this.iterator - currentIndex);
        var heading = atan2(currentPos.y - previousPos.y, currentPos.x - previousPos.x) - HALF_PI;

        push();
        translate(offsetPos.x, offsetPos.y);
        this.pendulum.update(heading);
        pop();
        this.pendulumPath.push(this.pendulum.getTrail(offsetPos));
      }
    }
}//si chiude shape.prototype

Shape.prototype.update = function() {
  this.iterator += this.resolution;
  this.iterator = constrain(this.iterator, 0, this.shapePath.length);
  };
}

function mousePressed() {
  newShape = new Shape(color(random(360), 80, 60)); //constructor function
  newShape.addPos(mouseX, mouseY); //posizione
}

function mouseReleased() { //quando lascio il mouse
  shapes.push(newShape); //crea forma
  newShape = undefined;
}


function popUp() {
  push(); //pop up
  rectMode(CENTER);
  fill(0, 0, 0);
  rect(width / 2, height / 2, width / 2.5, height / 2, 20);
  pop();
  //bottone avanti
  b2 = createButton(btn_text);
  b2.position(width / 2 - 80, height / 3 * 2);
  b2.mousePressed(go);
  b2.id('goBtn');

  //bottone indietro
  b3 = createButton('<');
  b3.position(width / 2 * 0.65, height / 2 * 0.6);
  b3.mousePressed(back);
  b3.id('fBtn');
}

function go() {
  //document.getElementById('goBtn').style.display = 'none';
  btn_text = 'PREVIEW';
  b2 = createButton(btn_text);
  b2.position(width / 2 - 80, height / 3 * 2);
  //bottone indietro
  b4 = createButton('microfono');
  b4.position(width / 2 - 60, height / 3 * 1.2);
  b4.mousePressed(microfono);
  b4.id('fBtn');
}

function back() {
  document.getElementById('goBtn').style.display = 'none';
  document.getElementById('fBtn').style.display = 'none';
  background(255);
}

function microfono() {
  rectMode(CENTER);
  fill(32, 178, 170);
  rect(width / 2, height / 2, width / 2.5, height / 2, 20);
  //impostazioni riconoscimento vocale
  let continuous = false; //continua a registrare
  let interim = true;
  speechRec.start(continuous, interim);
}

function gotSpeech() {
  if (speechRec.resultValue) {
     createP(speechRec.resultString);
    //  p.position(width/2*0.8, height/2);
    console.log(speechRec.resultString)
  }
}
  // keyReleased = function() {
  // if (keyCode == DELETE || keyCode == BACKSPACE){
  //   background(255);
  //   }
  // }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
