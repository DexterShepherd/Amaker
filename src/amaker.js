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

class Sequence {
  contsructor(sound, context, params) {
    this.sound = new SndBuf(sound, context);
    this.rates = params.rates;
    this.position = 0;
    this.clock = 0;
    this.pattern = pattern(this.sound, params);
  }

  play() {
    if (this.clock == 0) {
      this.sound.rate(this.pattern.rates[this.position]);
      this.sound.pos(this.pattern.notes[this.position]);
    }
    advanceTimer();
  }

  reset() {
    this.position = 0;
    this.clock = 0;
    this.pattern = pattern(this.sound, params);
  }

  advanceTimer() {
    this.clock += 1;
    if (this.clock == this.pattern.time[this.position]) {
      this.clock = 0;
      this.position = (this.position + 1) % this.pattern.length;
    }
  }
}

function pattern(sound, numSlices, rates, minLength, maxLength, maxDuration) {
  let slices = slice(sound, params.numSlices);
  let length = Math.floor(Math.random() * (params.maxLength - params.minLength)) + params.minLength;
  let chops = [];
  let durations = [];
  let rate_seq = [];

  for (let i = 0; i < length; i++) {
    chops.push(slices[Math.floor(Math.random() * slices.length)]);
    durations.push(Math.floor(Math.random() * maxDuration) + 1);
    rate_seq.push(rates[Math.floor(Math.random() * rates.length)])
  }

  return { notes: chops, time: durations, rates: rate_seq, length: length };
}

function slice(buffer, numSlices) {
  let slices = [];
  for(let i = 0; i < numSlices; i++) {
    slices.push(((buffer.duration * 1000) / numSlices) * i); 
  }
  return slices;
}


module.exports = {
  SndBuf: SndBuf,
  Sample: Sample,
  reset: reset,
  sequence: sequence
}
