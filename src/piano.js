import {
  select as d3_select
} from 'd3';

import Tone from 'tone';

const WIDTH  = 800;
const HEIGHT = 300;

const notes       = 'CDEFGAB'.split('');
const sharps      = 'CDFGA';
const octaveStart = 4;
const octaveEnd   = 5;
const numKeys     = notes.length * (octaveEnd - octaveStart + 1) + 1;
const keyWidth    = WIDTH / numKeys;
const sharpWidth  = 0.5 * keyWidth;

let data  = [];
let index = 0;

for (let octave = octaveStart; octave <= octaveEnd; octave++) {
  for (let i = 0; i < notes.length; i++) {
    data.push({
      note  : notes[i] + octave,
      sharp : false,
      index : index
    });
    if (sharps.indexOf(notes[i]) > -1) {
      data.push({
        note  : notes[i] + '#' + octave,
        sharp : true,
        index : index
      });
    }
    index++;
  }
}
data.push({
  note  : 'C' + (octaveEnd + 1),
  sharp : false,
  index : index
});
data.push({
  note  : 'C#' + (octaveEnd + 1),
  sharp : true,
  index : index
});


console.log(data);
console.log(numKeys);

const parent = d3_select('#piano').append('div')
  .style('width', WIDTH + 'px')
  .style('height', HEIGHT + 'px');

const key = parent.selectAll('.key').data(data)
  .enter().append('div')
    .attr('class', d => 'key' + (d.sharp ? ' sharp' : ''))
    .style('left', d => (d.sharp ? (d.index + 1)*keyWidth - sharpWidth/2 : d.index*keyWidth) + 'px')
    .style('width', d => (d.sharp ? sharpWidth : keyWidth) + 'px')
    .style('height', d => ((d.sharp ? 0.8 : 1) * HEIGHT) + 'px');

/*const dist = new Tone.Distortion().toMaster();
const synth = new Tone.Synth().connect(dist);
synth.triggerAttackRelease('C4', '8n');*/

/*const osc = new Tone.OmniOscillator();
osc.frequency.value = 'C4';
const env = new Tone.AmplitudeEnvelope();
osc.connect(env);
env.toMaster();

osc.start();
env.triggerAttack();*/

/*const synth = new Tone.Synth();//.toMaster();
const dist = new Tone.Distortion(0.8).toMaster();
synth.connect(dist);

synth.triggerAttackRelease('C4', '8n');*/

/*const loop = new Tone.Loop( t => {
  synth.triggerAttackRelease('C2', '8n', t);
}, '4n');

loop.start('1m').stop('4m');
Tone.Transport.start();*/
/*
const synth = new Tone.Synth({
  oscillator: {
    type : 'pwm',
    mutationFrequency: 0.2
  },
  envelope: {
    attack: 0.02,
    decay : 0.1,
    sustain: 0.2,
    release: 0.9
  }
}).toMaster();

synth.triggerAttack('D3', '+1');*/

/*const poly = new Tone.PolySynth(4, Tone.Synth).toMaster();
poly.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '2n');*/

/*
const WIDTH       = 800;
const HEIGHT      = 100;
const NUM_KEYS    = 88;
const NUM_WHITE   = 52;
const KEY_WIDTH   = WIDTH / NUM_WHITE;
const SHARP_WIDTH = 0.5 * KEY_WIDTH;

function nextKey (key) {
  const keys  = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const index = keys.indexOf(key);
  return (index === -1 || index === keys.length - 1) ? 'A' : keys[index + 1];
}

let keys = (() => {

  let keys       = [];
  let thisKey    = 'A';
  let countWhite = 0;

  for (let i = 0; i < NUM_KEYS; i++) {
    keys.push({
      sharp : false,
      freq  : 440 * Math.pow(2, (i - 48)/12),
      x     : countWhite * KEY_WIDTH
    });
    if (/[CDFGA]/.test(thisKey) && i < NUM_KEYS - 1) {
      i++;
      keys.push({
        sharp : true,
        freq  : 440 * Math.pow(2, (i - 48)/12),
        x     : (countWhite + 1) * KEY_WIDTH - SHARP_WIDTH / 2
      });
    }

    countWhite++;
    thisKey = nextKey(thisKey);

  }

  return keys;

})();

keys.sort( (a, b) => a.sharp - b.sharp);

const parent = d3_select('#piano').append('div')
  .style('width', WIDTH + 'px')
  .style('height', HEIGHT + 'px');

const key = parent.selectAll('.key').data(keys)
  .enter()
  .append('div')
    .attr('class', d => 'key' + (d.sharp ? ' sharp' : ''))
    .style('left', d => d.x + 'px')
    .style('width', d => (d.sharp ? SHARP_WIDTH : KEY_WIDTH) + 'px')
    .style('height', d => (d.sharp ? 0.8*HEIGHT : HEIGHT) + 'px');


if (!OscillatorNode.prototype.start) OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
if (!OscillatorNode.prototype.stop) OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;

const over    = 'ontouchstart' in window ? 'touchstart' : 'mouseover';
const context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext) ();

key.on(over, d => {
  const now  = context.currentTime;
  const osc  = context.createOscillator();
  const gain = context.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(d.freq, now);
  gain.gain.linearRampToValueAtTime(0.0, now + 0.0);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.8);
  gain.gain.linearRampToValueAtTime(0.0, now + 1.5);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(0);
  setTimeout(() => { osc.stop(); }, 2000);
});
*/
