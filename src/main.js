const ctx = new AudioContext();
const loader = require('webaudio-buffer-loader');
const Amaker = require('./amaker');
const P5 = require('p5');

const buffers = ['assets/audio/eleven.mp3'];

let pattern;
let rates;
let slices;

let tick = 0;
let beat = 0;
let clock = 0;
let position = 0;


loader(buffers, ctx, (err, samples) => {
  let sound = new Amaker.SndBuf(samples[0], ctx);
  rates = [0.4, 0.6, 1.2, 2.4];

  slices = Amaker.slice(samples[0], 128);
  pattern = Amaker.sequence(slices, rates, 4, 12, 4);

  position = 0

  let p5 = new P5(vis);

  document.getElementById('reset').addEventListener('click', () => {
    pattern = Amaker.reset(slices, rates, 4, 12, 4);
    p5.reset();
    position = 0;
    clock = 0;
  })


  setInterval( () => {
    if(tick % 12 == 0) {
      if(clock == 0){
        sound.rate(pattern.rates[position]);
        sound.pos(pattern.sequence[position]);
      }

      clock++;
      if (clock == pattern.time[position]) {
        clock = 0; 
        position = (position + 1) % pattern.sequence.length;
      }
    }
     
    tick++;
    if (tick % 24 == 0) {
      beat = (beat + 1) % 16;
    }
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

