const ctx = new AudioContext();
const loader = require('webaudio-buffer-loader');
const Amaker = require('./amaker');
const Graphics = require('./graphics');

const buffers = ['assets/audio/eleven.mp3'];

let visuals;
let sequences = [];
let sequenceIndex = 0;
let tick = 0;

loader(buffers, ctx, (err, samples) => {
  if(err){
    return console.log(err);
  }

  visuals = new Graphics.VisualController();

  document.getElementById('add').addEventListener('click', () => {
    sequences.push(new Amaker.Sequence(samples[0], ctx, visuals,
      {
        numSlices: 128,
        rates: [0.4, 0.8, 1.6],
        minLength: 4,
        maxLength: 12,
        maxDuration: 4,
        index: sequenceIndex
      }
    ));

    sequenceIndex += 1;
  });

  setInterval( () => {
    if(tick % 12 == 0) {
      let positions = [];
      for(let i = 0; i < sequences.length; i++) {
        sequences[i].play();
        positions.push(sequences[i].position);
      }
      visuals.update(positions);
    }
    tick += 1;
  }, 10);
});
