
let p,b1;
let mic, vol, vol_map; //Volume per dimensione lettere

//impostazioni riconoscimento vocale //////////////////////////
let lang = 'en-US'; //|| 'it-IT'
let speechRec = new p5.SpeechRec(lang, gotSpeech);

let shapes = [];
let newShape;

let articolazioni = 4;
let lineLength = 128; //lunghezza poi da inpostare in base a quanto è lunga la stringa della parola
var resolution = 0.04; //risoluzone 0.04; / scrive da solo
var gravity = 0.094;
var smorzamento = 0.998;//smorzamento 0.998 / dimensione lettere

var font = 'Georgia';
var letters = '';
var fontSizeMin = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL, 360, 100, 100); //colorMode(mode, max1, max2, max3, [maxA])
  strokeWeight(1);
  textFont(font, fontSizeMin);

  b1 = createButton('microfono');
  b1.position(width / 2 * 1.7, height / 2 * 0.1);
  b1.mousePressed(microfono);
  b1.id('startBtn');

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(255);
  //per ogni elemento dell'array chiama le seguenti funzioni
  shapes.forEach(function(shape){
    shape.draw();
    shape.update();
  }); //non sei obbligato a dare un nome ad una funzione

  if (newShape) { //se newShape == true viene attivato il comando
  newShape.addPos(mouseX, mouseY);
  newShape.draw();
  //newShape.update();
  }

  //volume
  vol = round(mic.getLevel(), 2);
  vol_map = map(vol, 0, 1, 1, 150);
  console.log("volume " + vol_map);
}//fine draw


function microfono() {
  let continuous = true; //continua a registrare
  let interim = false;
  speechRec.start(continuous, interim);
}

function gotSpeech() {
  if (speechRec.resultValue) {
     let text = speechRec.resultString;
     letters = text;
     console.log(speechRec.resultString)
  }
}

class Shape{
  constructor(pendulumPathColor){//function Shape(pendulumPathColor) { //class this.value
  this.shapePath = [];
  this.pendulumPath = [];
  this.pendulumPathColor = pendulumPathColor;
  this.iterator = 0;
  this.lineLength = lineLength;
  this.resolution = resolution;
  this.pendulum = new Pendulum(this.lineLength, articolazioni); //constructor function
  this.letterIndex = 0;
}

  addPos(x,y){//Shape.prototype.addPos = function(x, y) { //per chiamare piu classi diverse
  //nomeClasse.protoype.nomeFunzione = function(){
  //codice da svolgere per ogni classe }
  var newPos = createVector(x, y);
  this.shapePath.push(newPos);
  };


  draw(){
    if (this.pendulumPath.length) {
      noStroke();
      fill(this.pendulumPathColor);
      this.letterIndex = 0;
      this.pendulumPath.forEach(function(pos, posIndex) {
        var newLetter = letters.charAt(this.letterIndex);//prende la lettera all'indice letterIndex
// tenere le tettere distanziate
  var nextPosIndex = this.pendulumPath.findIndex(function(nextPos, nextPosIndex) {
  if (nextPosIndex > posIndex) {
    var d = p5.Vector.dist(nextPos, pos);//distanza tra due posizioni consecutive del vettore pendulumPath
    textSize(max(fontSizeMin*vol_map, d));//dimensione delle lettere dipende dalla distanza tra loro
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
}//si chiude draw

update(){
  this.iterator += this.resolution;
  this.iterator = constrain(this.iterator, 0, this.shapePath.length);
  };
} //fine classe Shape

////////////////////////////////////////////////
class Pendulum{
  constructor(size, hierarchy){
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
}

  update(heading){
    this.end.set(this.origin.x + this.size * sin(this.angle), this.origin.y + this.size * cos(this.angle));

    this.angularAcceleration = (-this.gravity / this.size) * sin(this.angle + heading);
    this.angle += this.angularVelocity;
    this.angularVelocity += this.angularAcceleration;
    this.angularVelocity *= this.smorzamento;

    if (this.pendulumArm) {
      this.pendulumArm.update(heading);
    }
  };


    getTrail(offset, end){  //dà il percorso di this
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

  } //fine classe Pendulum

function mousePressed() {
  newShape = new Shape(color(random(360), 80, 60)); //constructor function
  newShape.addPos(mouseX, mouseY); //posizione
}

function mouseReleased() { //quando lascio il mouse
  shapes.push(newShape); //crea forma
  newShape = undefined;
}

  keyReleased = function() {
  if (keyCode == DELETE || keyCode == BACKSPACE){ background(255);
    }
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
