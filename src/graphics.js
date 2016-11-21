const p5 = require('p5');

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

class Sequencer {
  constructor(renderer, index, width, height, numSteps) {
    this.renderer = renderer;
    this.steps = [];
    this.width = width;
    this.height = height;
    this.numSteps = numSteps;
    this.position = 0;
    this.index = index;

    for(let i = 0; i < numSteps; i++){
      let xpos = i * (this.width/this.numSteps) + this.width/(this.numSteps * 2);
      this.steps.push( new Step(this.renderer, xpos, this.height/2 + (this.index * this.height)));
    }
  }

  update(_position) {
    this.position = _position;
  }

  display() {
    for(let i = 0; i < this.numSteps; i++){
      this.steps[i].update();
      if( i != this.position ){
        this.steps[i].draw();
      }
    }
  }
}


class VisualController {
  constructor() {
    this.container = document.getElementById('sequences');
    this.sketch = new p5(Sketch, this.container);
  }

  update(position) {
    this.sketch.update(position);
  }

  add(index, numSteps) {
    this.sketch.add(index, numSteps) 
  }
}

const Sketch = function(p) {
  let sequencers = [];
  let position;

  p.setup = function() {
    let canvas = p.createCanvas(window.innerWidth, window.innerHeight);
    position = 0;
    p.background(0);
    p.rectMode('center');
  }

  p.draw = function() {
    p.background(0, 50);
    p.noStroke();
    for(let i = 0; i < sequencers.length; i++){
      sequencers[i].display();
    }
  }

  p.update = function(positions) {
    for(let i = 0; i < positions.length; i++) {
      sequencers[i].update(positions[i]);
    }
  }

  p.add = function(index, numSteps) {
    sequencers.push(new Sequencer(p, index, p.width, 50, numSteps));
  }

  p.reset = function() {
    steps = [];
    for(let i = 0; i < numSteps; i++){
      let xpos = i * (p.width/numSteps) + p.width/(numSteps * 2);
      steps.push( new Step(p, xpos, p.height/2));
    }
  }
}


module.exports = {
  VisualController: VisualController
};
