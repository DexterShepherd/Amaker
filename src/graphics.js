const p5 = require('p5');

class Step {
  constructor(renderer, x, y, z) {
    this.renderer = renderer;
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = this.renderer.random(2, 20);
  }
  
  update() {
  }

  draw() {
    this.renderer.push();
    this.renderer.translate(this.x, this.y, this.z);
    this.renderer.sphere(this.size);
    this.renderer.pop();
  }
}

class Sequencer {
  constructor(renderer, index, xpos, ypos, width, height, numSteps) {
    this.renderer = renderer;
    this.steps = [];
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.numSteps = numSteps;
    this.position = 0;
    this.index = index;

    for(let i = 0; i < numSteps; i++){
      this.steps.push( new Step(this.renderer, this.xpos + this.renderer.random(-this.width, this.width),
                                               this.ypos + this.renderer.random(-this.height, this.height),
                                               this.renderer.random(-100, -10)));
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
    let canvas = p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    position = 0;
    p.background(0);
    p.rectMode('center');
  }

  p.draw = function() {
    p.background(0);
    p.noStroke();
    for(let i = 0; i < sequencers.length; i++){
      sequencers[i].display();
    }
    p.ambientLight(100);
    p.pointLight(255, 255, 255, p.mouseX, p.mouseY, 0);
  }

  p.update = function(positions) {
    for(let i = 0; i < positions.length; i++) {
      sequencers[i].update(positions[i]);
    }
  }

  p.add = function(index, numSteps) {
    sequencers.push(new Sequencer(p, index, p.random(-500, 500), p.random(-500, 500), 50, 50, numSteps));
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
