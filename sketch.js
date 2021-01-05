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
var letters = '?';
var fontSizeMin = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL, 360, 100, 100); //colorMode(mode, max1, max2, max3, [maxA])
  strokeWeight(1);
  textFont(font, fontSizeMin);

  b1 = createButton('inserisci il tuo pensiero');
  b1.position(width / 2 * 1.7, height / 2 * 0.1);
  b1.mousePressed(popUp);
  b1.id('startBtn');
}

function draw() {


  //per ogni elemento dell'array chiama le seguenti funzioni
  shapes.forEach(function(shape){ shape.draw();shape.update();}); //non sei obbligato a dare un nome ad una funzione

  if (newShape) { //se newShape == true viene attivato il comando
  newShape.addPos(mouseX, mouseY);
  newShape.draw();
  newShape.update();

}
}//fine draw



function popUp() {
  rectMode(CENTER);
  fill('#8a2be2');
  rect(width / 2, height / 2, width / 2.5, height / 2, 20);
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
  fill('#e2872c');
  rect(width / 2, height / 2, width / 2.5, height / 2, 20);
  //impostazioni riconoscimento vocale
  let continuous = false; //continua a registrare
  let interim = true;
  speechRec.start(continuous, interim);
}

function gotSpeech() {
  if (speechRec.resultValue) {
     let text = speechRec.resultString;
     letters = text;
    //  p.position(width/2*0.8, height/2);
    console.log(speechRec.resultString)
  }
}

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

////////////////////////////////////////////////
function Pendulum(size, hierarchy) {
  this.hierarchy = hierarchy - 1;
  this.pendulumArm;
  this.size = size;
  this.angle = random(TAU);
  this.origin = createVector(0, 0);
  this.end = createVector(0, 0);
  this.gravity = gravity;
  this.smorzamento = smorzamento;
  this.angularAcceleration = 0;
  this.angularVelocity = 0;

  if (this.hierarchy > 0) {
    this.pendulumArm = new Pendulum(this.size / 1.5, this.hierarchy);
  }

  Pendulum.prototype.update = function(heading) {
    this.end.set(this.origin.x + this.size * sin(this.angle), this.origin.y + this.size * cos(this.angle));

    this.angularAcceleration = (-this.gravity / this.size) * sin(this.angle + heading);
    this.angle += this.angularVelocity;
    this.angularVelocity += this.angularAcceleration;
    this.angularVelocity *= this.smorzamento;

    if (this.pendulumArm) {
      this.pendulumArm.update(heading);
    }
  };


    Pendulum.prototype.getTrail = function(offset, end) {
      if (this.pendulumArm) {
        if (end) {
          end.add(this.end);
        } else {
          end = this.end.copy();
        }
        return this.pendulumArm.getTrail(offset, end);
      } else {
        return this.end.copy().add(end).add(offset);
      }
    };

    Pendulum.prototype.draw = function() {//anche da cancellare
      stroke(0, 40);
      beginShape();
      vertex(this.origin.x, this.origin.y);
      vertex(this.end.x, this.end.y);
      endShape();

      fill(0, 20);
      ellipse(this.end.x, this.end.y, 2, 2);
      noFill();

      if (this.pendulumArm) {
        push();
        translate(this.end.x, this.end.y);
        this.pendulumArm.draw();
        pop();
      }
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

  // keyReleased = function() {
  // if (keyCode == DELETE || keyCode == BACKSPACE){
  //   background(255);
  //   }
  // }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
