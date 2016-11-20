const ctx = new AudioContext();
const loader = require('webaudio-buffer-loader');
const Amaker = require('./amaker');
const P5 = require('p5');

const buffers = ['assets/audio/eleven.mp3'];

let seq;
let tick = 0;


loader(buffers, ctx, (err, samples) => {
  if(err){
    return console.log(err);
  }

  seq = new Amaker.Sequence(samples[0], ctx,
    {
      numSlices: 128,
      rates: [0.8, 1.6],
      minLength: 4,
      maxLength: 12,
      maxDuration: 4
    }
  );

  document.getElementById('reset').addEventListener('click', () => {
    seq.reset();
  })

  setInterval( () => {
    if(tick % 12 == 0) {
      seq.play();
    }
    tick += 1;
  }, 10);
});


//-------------VIS---------------------

class Step {
  constructor(renderer, x, y) {
    this.renderer = renderer;
    this.x = x;
    this.y = y;
    this.size = 10;
  }
  
  update() {
    this.size += Math.sin(this.renderer.frameCount/10)/5;
  }

  draw() {
    this.renderer.rect(this.x, this.y, this.size, this.size);
  }
}

let vis = function(p) {
  let steps = [];

  p.setup = function() {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.background(0);
    p.rectMode('center');
    for(let i = 0; i < pattern.sequence.length; i++){
      let xpos = i * (p.width/pattern.sequence.length) + p.width/(pattern.sequence.length * 2);
      steps.push( new Step(p, xpos, p.height/2));
    }
  }

  p.draw = function() {
    p.background(0, 50);
    p.noStroke();
    for(let i = 0; i < pattern.sequence.length; i++){
      steps[i].update();
      if( i != position ){
        steps[i].draw();
      }
    }
  }

  p.reset = function() {
    steps = [];
    for(let i = 0; i < pattern.sequence.length; i++){
      let xpos = i * (p.width/pattern.sequence.length) + p.width/(pattern.sequence.length * 2);
      steps.push( new Step(p, xpos, p.height/2));
    }
  }
};

