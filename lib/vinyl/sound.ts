"use client";

/**
 * Everything you hear is synthesised: no audio files, nothing to license.
 *
 *  - crackle: hiss plus sparse pops, the sound of dust in a groove
 *  - drop:    the soft thump of a stylus landing
 *  - music:   two lush R&B chords (Dmaj9 → Bm9) through a warm low-pass,
 *             with a slow pitch wobble — wow and flutter, the thing that
 *             makes a record sound like a record
 *
 * When there is a real track to play (their own singing, say), `play(src)`
 * will take a file instead of the chords.
 */

type Voice = { osc: OscillatorNode; gain: GainNode };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let crackleSrc: AudioBufferSourceNode | null = null;
let crackleGain: GainNode | null = null;
let musicBus: GainNode | null = null;
let voices: Voice[] = [];
let wobble: OscillatorNode | null = null;
let chordTimer: number | null = null;

const CHORDS = [
  [146.83, 185.0, 220.0, 277.18, 329.63], // Dmaj9: D3 F#3 A3 C#4 E4
  [123.47, 146.83, 185.0, 220.0, 277.18], // Bm9:  B2 D3 F#3 A3 C#4
];

function ensure() {
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.035; // hiss
    // pops: a few per second, each a fast-decaying spike
    const pops = Math.floor(seconds * (6 + Math.random() * 4));
    for (let p = 0; p < pops; p++) {
      const at = Math.floor(Math.random() * len);
      const amp = (Math.random() < 0.12 ? 0.9 : 0.35) * (Math.random() < 0.5 ? -1 : 1);
      const decay = 40 + Math.random() * 160;
      for (let k = 0; k < decay && at + k < len; k++)
        d[at + k] += amp * Math.exp(-k / (decay / 5));
    }
  }
  return buf;
}

function reverb(c: AudioContext) {
  const len = c.sampleRate * 2.6;
  const ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  const v = c.createConvolver();
  v.buffer = ir;
  return v;
}

/**
 * Create and resume the audio context inside the click or keypress itself.
 * Safari only lets audio start from a context opened during a user gesture,
 * and the needle does not land until two seconds after the click.
 */
export function unlockAudio() {
  const c = ensure();
  if (c && c.state === "suspended") void c.resume();
}

/** The stylus lands: a low thump and a short burst of surface noise. */
export function drop() {
  const c = ensure();
  if (!c || !master) return;
  void c.resume();
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.setValueAtTime(90, t);
  o.frequency.exponentialRampToValueAtTime(38, t + 0.16);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.25);
}

export function startCrackle() {
  const c = ensure();
  if (!c || !master || crackleSrc) return;
  crackleSrc = c.createBufferSource();
  crackleSrc.buffer = noiseBuffer(c, 5);
  crackleSrc.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 6200;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 140;
  crackleGain = c.createGain();
  crackleGain.gain.value = 0;
  crackleSrc.connect(hp).connect(lp).connect(crackleGain).connect(master);
  crackleSrc.start();
  crackleGain.gain.linearRampToValueAtTime(0.55, c.currentTime + 0.3);
}

function setChord(i: number) {
  const c = ctx;
  if (!c) return;
  const notes = CHORDS[i % CHORDS.length];
  const t = c.currentTime;
  voices.forEach((v, k) => {
    const f = notes[Math.floor(k / 2) % notes.length];
    v.osc.frequency.cancelScheduledValues(t);
    v.osc.frequency.setTargetAtTime(f, t, 0.35); // glide, not jump
  });
}

export function startMusic() {
  const c = ensure();
  if (!c || !master || musicBus) return;
  musicBus = c.createGain();
  musicBus.gain.value = 0;

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1900;
  lp.Q.value = 0.4;
  const verb = reverb(c);
  const wet = c.createGain();
  wet.gain.value = 0.45;
  const dry = c.createGain();
  dry.gain.value = 0.7;

  musicBus.connect(lp);
  lp.connect(dry).connect(master);
  lp.connect(verb).connect(wet).connect(master);

  // Wow and flutter: everything drifts a few cents, slowly, together.
  wobble = c.createOscillator();
  wobble.frequency.value = 0.55;
  const wobbleDepth = c.createGain();
  wobbleDepth.gain.value = 6; // cents

  voices = [];
  const notes = CHORDS[0];
  for (let k = 0; k < notes.length * 2; k++) {
    const osc = c.createOscillator();
    osc.type = k % 2 === 0 ? "triangle" : "sine";
    osc.frequency.value = notes[Math.floor(k / 2)];
    osc.detune.value = k % 2 === 0 ? -5 : 6;
    wobble.connect(wobbleDepth).connect(osc.detune);
    const gain = c.createGain();
    gain.gain.value = 0.055;
    osc.connect(gain).connect(musicBus);
    osc.start();
    voices.push({ osc, gain });
  }
  wobble.start();

  musicBus.gain.linearRampToValueAtTime(0.9, c.currentTime + 2.4);

  let i = 0;
  chordTimer = window.setInterval(() => setChord(++i), 6400);
}

/** Lift the needle: music and crackle fall away, a small click as it leaves. */
export function stopAll() {
  const c = ctx;
  if (!c) return;
  const t = c.currentTime;
  if (chordTimer) window.clearInterval(chordTimer);
  chordTimer = null;

  if (musicBus) {
    musicBus.gain.cancelScheduledValues(t);
    musicBus.gain.setValueAtTime(musicBus.gain.value, t);
    musicBus.gain.linearRampToValueAtTime(0, t + 0.6);
    const old = voices;
    const w = wobble;
    window.setTimeout(() => {
      for (const v of old) v.osc.stop();
      w?.stop();
    }, 700);
  }
  if (crackleGain && crackleSrc) {
    crackleGain.gain.cancelScheduledValues(t);
    crackleGain.gain.setValueAtTime(crackleGain.gain.value, t);
    crackleGain.gain.linearRampToValueAtTime(0, t + 0.15);
    const s = crackleSrc;
    window.setTimeout(() => s.stop(), 200);
  }
  musicBus = null;
  voices = [];
  wobble = null;
  crackleSrc = null;
  crackleGain = null;
}

export function setMuted(m: boolean) {
  const c = ctx;
  if (!c || !master) return;
  master.gain.setTargetAtTime(m ? 0 : 0.9, c.currentTime, 0.08);
}
