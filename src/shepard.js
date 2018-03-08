import Tone from 'tone';

const F0       = 220;
const OCTAVES  = 5;
const DURATION = 10 * OCTAVES;
const INTERVAL = DURATION / 48;

let active = false;
let loop;
let oscGroup;

const gainOut = new Tone.Gain(1);




const btnEl = document.getElementById('start');

function onClickBtn (e) {
  if (active) {
    stopTone();
    btnEl.innerHTML = 'Start';
    active = false;
  }
  else {
    startTone();
    btnEl.innerHTML = 'Stop';
    active = true;
  }
}

function startTone () {
  oscGroup.start();
  loop.start();
  Tone.Transport.start();
}

function stopTone () {
  loop.stop();
  oscGroup.stop();
}

function doLoop (time) {
  oscGroup.step(time);
}


/*******************************************************************************
 *
 * A group of oscillators composing a Shepard tone.
 * @class OscillatorGroup
 *
 ******************************************************************************/
class OscillatorGroup {

 /**
  * Constructor.
  * @method constructor
  * @param config {Object} With properties:
  *   baseFreq {Number} Base frequency for lowest component.
  *   duration {Number} Duration of full loop in seconds.
  *   gain {Number} Gain for group.
  *   interval {Number} Interval for loop.
  *   octaves {Number} Number of octaves / components in tone.
  *   type {String} Oscillator type.
  */
  constructor (config) {

    const baseFreq = this.baseFreq = config.baseFreq;
    const duration = this.duration = config.duration;
    const octaves  = this.octaves  = config.octaves;

    this.interval  = config.interval;
    this.direction = config.direction;
    this.oscs      = [];

    this.gainNode = new Tone.Gain(config.gain);

    for (let i = 0; i < octaves; i++) {
      const phase = duration * i / octaves;
      const freq  = this.getFreq(baseFreq, phase, duration / octaves);
      const vol   = this.getVol(phase, 0.5, duration / 2, 0.2);
      this.oscs[i] = new Oscillator(phase, config.type, freq, vol);
    }

  }

 /**
  * Setter for gain.
  * @method gain
  * @param gain {Number} Between 0 and 1.
  */
  set gain (gain) {
    this.gainNode.gain.value = gain;
  }

 /**
  * Chains oscillators to provided arguments.
  * @method chain
  * @param args {Object[]} Outputs.
  */
  chain () {
    this.oscs.forEach( d => d.connect(this.gainNode) );
    this.gainNode.chain.apply(this.gainNode, arguments);
  }

 /**
  * Starts oscillators.
  * @method start
  */
  start () {
    this.oscs.forEach( d => d.start() );
  }

 /**
  * Stops oscillators.
  * @method stop
  */
  stop () {
    this.oscs.forEach( d => d.stop() );
  }

 /**
  * Gets frequency.
  * @method getFreq
  * @param n0 {Number} Base frequency.
  * @param t {Number} Phase-shifted time.
  * @param tHalf {Number} Half life.
  * @return {Number} Frequency.
  */
  getFreq (n0, t, tHalf) {
    return n0 * Math.pow(2, -this.direction * t / tHalf);
  }

 /**
  * Gets volume.
  * @method getVol
  * @param x {Number} Phase-shifted time.
  * @param a {Number} Amplitude.
  * @param b {Number}
  * @param c {Number}
  * @return {Number} Volume.
  */
  getVol (x, a, b, c) {
    return a * Math.exp(-Math.pow(x - b, 2) / 2 * Math.pow(c, 2));
  }

 /**
  * Steps oscillators to next frequency and volume.
  * @method step
  * @param time {Number}
  */
  step (time) {
    time = time + this.interval;
    this.oscs.forEach( d => {
      const t = (time + d.phase) % this.duration;
      d.rampToValues(
        time,
        this.getFreq(this.baseFreq, t, this.duration / this.octaves),
        this.getVol(t, 0.5, this.duration / 2, 0.2)
      );
    });
  }

}


/*******************************************************************************
 *
 * Wrapper for an oscillator.
 * @class Oscillator
 *
 ******************************************************************************/
class Oscillator {

 /**
  * Constructor.
  * @method constructor
  * @param phase {Number}
  * @param type {String}
  * @param freq {Number}
  * @param vol {Number}
  */
  constructor (phase, type, freq, vol) {
    this.phase = phase;
    this.gain = new Tone.Gain(vol);
    this.osc = new Tone.Oscillator({
      frequency : freq,
      type      : type
    });
  }

 /**
  * Connects oscillator to node.
  * @method connect
  * @param node {Tone.AudioNode}
  */
  connect (node) {
    this.osc.chain(this.gain, node);
  }

 /**
  * Starts oscillator.
  * @method start
  */
  start () {
    this.osc.start();
  }

 /**
  * Stops oscillator.
  * @method stop
  */
  stop () {
    this.osc.stop();
  }

 /**
  * Ramps to frequency and volume.
  * @method rampToValues
  * @param time {Number} Time to ramp to.
  * @param freq {Number} Frequency to ramp to.
  * @param vol {Number} Volume to ramp to.
  */
  rampToValues (time, freq, vol) {
    this.osc.frequency.linearRampToValueAtTime(freq, time);
    this.gain.gain.linearRampToValueAtTime(vol, time);
  }


}

// See https://codepen.io/rileyjshaw/pen/OPwROr?editors=0010
function setup () {

  const dir = -1;

  const f0 = F0 * Math.pow(2, dir * OCTAVES / 2);

  oscGroup = new OscillatorGroup({
    baseFreq  : f0,
    gain      : 0.5,
    type      : 'triangle',
    duration  : DURATION,
    octaves   : OCTAVES,
    interval  : INTERVAL,
    direction : dir
  });


  oscGroup.chain(gainOut, Tone.Master);

  loop = new Tone.Loop( time => {
    doLoop(time);
  }, INTERVAL);
}

setup();
btnEl.addEventListener('click', onClickBtn, false);

const btnTestEl = document.getElementById('test');
btnTestEl.addEventListener('click', function () {
  oscGroup.gain = 0.2;
}, false);
