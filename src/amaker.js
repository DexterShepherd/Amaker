class Sample {
  constructor(buffer, context){
    this.buffer = buffer;
    this.context = context;
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.context.destination);
    this.startTime = 0;
  }

  setRate(_rate) {
    this.source.playbackRate.value = _rate;
  }

  loop(loop, start, duration) {
    if ( start ) {
      this.source.loopStart = start / 1000;
      this.startTime = start / 1000;
    }
    if ( duration ) {
      this.source.loopEnd = (start + duration) / 1000;
    }
    this.source.loop = loop;
  }

  setStartTime(_time) {
    this.startTime = _time / 1000; 
  }

  play() {
    this.source.start(0, this.startTime);
  }

  stop() {
    this.source.stop();
  }
}

class SndBuf {
  constructor(buffer, context) {
    this.buffer = buffer;
    this.context = context;
    this._rate = 1;
    this._duration = this.buffer.duration;
    this._voice = null;
  }

  rate(_rate) {
    this._rate = _rate;
  }

  get duration() {
    return this._duration * 1000; 
  }

  pos(_pos) {
    if (this._voice !== null)
      this._voice.stop();

    this._voice = new Sample(this.buffer, this.context);
    this._voice.setRate(this._rate);
    this._voice.setStartTime(_pos);
    this._voice.play();
  }
}

function pattern(sound, params) {
  let slices = slice(sound, params.numSlices);
  let length = Math.floor(Math.random() * (params.maxLength - params.minLength)) + params.minLength;
  let chops = [];
  let durations = [];
  let rate_seq = [];

  for (let i = 0; i < length; i++) {
    chops.push(slices[Math.floor(Math.random() * slices.length)] / 1000);
    durations.push(Math.floor(Math.random() * params.maxDuration) + 1);
    rate_seq.push(params.rates[Math.floor(Math.random() * params.rates.length)])
  }

  return { notes: chops, times: durations, rates: rate_seq, length: length };
}

class Sequence {
  // { numSlices, rates, minLength, maxLength, maxDuration }
  constructor(buffer, context, params) {
    this.buffer = buffer;
    this.context = context;
    this.params = params;

    this.sound = new SndBuf(this.buffer, this.context);
    this.position = 0;
    this.clock = 0;
    this.pattern = pattern(this.sound, this.params);
  }

  play() {
    if (this.clock == 0) {
      this.sound.rate(this.pattern.rates[this.position]);
      this.sound.pos(this.pattern.notes[this.position]);
    }
    this.advanceTimer();
  }

  reset() {
    this.position = 0;
    this.clock = 0;
    this.pattern = pattern(this.sound, this.params);
    console.log('pattern reset');
    console.log(this.pattern);
  }

  advanceTimer() {
    this.clock += 1;
    if (this.clock == this.pattern.times[this.position]) {
      this.clock = 0;
      this.position = (this.position + 1) % this.pattern.length;
    }
  }
}


function slice(buffer, numSlices) {
  let slices = [];
  for(let i = 0; i < numSlices; i++) {
    slices.push(((buffer.duration * 1000) / numSlices) * i); 
  }
  return slices;
}


module.exports = {
  Sequence: Sequence
};
