"use client";

/**
 * The deck's sound. The record itself is synthesised:
 *
 *  - crackle: hiss plus sparse pops, the sound of dust in a groove
 *  - drop:    the soft thump of a stylus landing
 *  - skip:    the click of the needle crossing to the next track
 *
 * The music is a real recording where a side has one (Side A: "The World We
 * Knew", Caravelli Orchestra), played through a gentle record-player tone.
 * Without one — Side B for now, or if the file can't load — it is synthesised
 * chords with a slow wow and flutter, which also move key track by track.
 */

export type Side = "A" | "B";

/**
 * Where each side's recording lives. Song files stay out of the public
 * repository: locally the file sits in public/audio (ignored by git); for the
 * live site, set NEXT_PUBLIC_SONG_A to wherever it is hosted. With no song,
 * the side plays its synthesised chords.
 */
const SONGS: Record<Side, string | undefined> = {
  A:
    process.env.NEXT_PUBLIC_SONG_A ??
    (process.env.NODE_ENV === "development" ? "/audio/side-a.mp3" : undefined),
  B: process.env.NEXT_PUBLIC_SONG_B,
};

/** What the readout says is playing, when a side has a recording. */
export const SONG_TITLES: Record<Side, { title: string; artist: string } | undefined> = {
  A: SONGS.A ? { title: "The World We Knew", artist: "Caravelli Orchestra" } : undefined,
  B: undefined,
};

const SONG_LEVEL = 0.8;

/**
 * Which side's recording is actually sounding right now — not merely
 * configured — so the readout never names a song the deck isn't playing.
 */
let sounding: Side | null = null;
const soundingListeners = new Set<() => void>();
function setSounding(next: Side | null) {
  if (next === sounding) return;
  sounding = next;
  for (const l of soundingListeners) l();
}
export function subscribeSong(listener: () => void) {
  soundingListeners.add(listener);
  return () => {
    soundingListeners.delete(listener);
  };
}
export const getSong = () => (sounding ? (SONG_TITLES[sounding] ?? null) : null);

type Voice = { osc: OscillatorNode; gain: GainNode };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let crackleSrc: AudioBufferSourceNode | null = null;
let crackleGain: GainNode | null = null;
let musicBus: GainNode | null = null;
let voices: Voice[] = [];
let wobble: OscillatorNode | null = null;
let chordTimer: number | null = null;
let chordIndex = 0;
/** Semitones away from D. Each track of the album sits in its own key. */
let transpose = 0;

/** Side A: two slow R&B chords, a long sway between them. */
const SIDE_A = [
  [146.83, 185.0, 220.0, 277.18, 329.63], // Dmaj9: D3 F#3 A3 C#4 E4
  [123.47, 146.83, 185.0, 220.0, 277.18], // Bm9:  B2 D3 F#3 A3 C#4
];

/**
 * Side B: IV–V–iii–vi, the "royal road" progression a great deal of K-pop
 * and J-pop is built on, in C and voiced to sit beside Side A's chords.
 */
const SIDE_B = [
  [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9: F3 A3 C4 E4 G4
  [196.0, 246.94, 293.66, 349.23, 440.0], // G9:    G3 B3 D4 F4 A4
  [164.81, 196.0, 246.94, 293.66, 392.0], // Em7:   E3 G3 B3 D4 G4
  [220.0, 261.63, 329.63, 392.0, 493.88], // Am9:   A3 C4 E4 G4 B4
];

let CHORDS = SIDE_A;
let chordMs = 6400;
let side: Side = "A";

interface Song {
  el: HTMLAudioElement;
  gain: GainNode;
  /** Swept down and back up when the needle skips to the next track. */
  tone: BiquadFilterNode;
  ok: boolean;
  blessed: boolean;
}
const songs: Partial<Record<Side, Song>> = {};
let songPlaying: Song | null = null;

/** The current side's recording, wired into the deck — or null if it has none, or it failed. */
function songForSide(): Song | null {
  const src = SONGS[side];
  const c = ctx;
  if (!src || !c || !master) return null;
  let song = songs[side];
  if (!song) {
    const el = new Audio();
    el.crossOrigin = "anonymous";
    el.preload = "auto";
    el.loop = true;
    el.src = src;
    // A record is warmer than a file: take a little off the very top.
    const warm = c.createBiquadFilter();
    warm.type = "highshelf";
    warm.frequency.value = 7500;
    warm.gain.value = -5;
    const tone = c.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 20000;
    tone.Q.value = 0.5;
    const gain = c.createGain();
    gain.gain.value = 0;
    c.createMediaElementSource(el).connect(warm).connect(tone).connect(gain).connect(master);
    const made: Song = { el, gain, tone, ok: true, blessed: false };
    // If the file can't be played, the side falls back to its chords.
    el.addEventListener("error", () => {
      made.ok = false;
      if (songPlaying === made) {
        songPlaying = null;
        setSounding(null);
        startSynth();
      }
    });
    songs[side] = made;
    song = made;
  }
  return song.ok ? song : null;
}

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
  // iOS only lets a media element play later if it first played during a
  // gesture: start it silently now and pause it again straight away.
  const song = songForSide();
  if (song && !song.blessed) {
    song.blessed = true;
    song.el
      .play()
      .then(() => {
        if (songPlaying !== song) song.el.pause();
      })
      .catch(() => undefined);
  }
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
  // Quieter under a real recording than under the chords.
  crackleGain.gain.linearRampToValueAtTime(songForSide() ? 0.3 : 0.55, c.currentTime + 0.3);
}

function setChord(i: number, glide = 0.35) {
  const c = ctx;
  if (!c) return;
  chordIndex = i;
  const notes = CHORDS[i % CHORDS.length];
  const ratio = 2 ** (transpose / 12);
  const t = c.currentTime;
  voices.forEach((v, k) => {
    const f = notes[Math.floor(k / 2) % notes.length] * ratio;
    v.osc.frequency.cancelScheduledValues(t);
    v.osc.frequency.setTargetAtTime(f, t, glide); // glide, not jump
  });
}

/** A needle skipping a groove: the click between one track and the next. */
function skip() {
  const c = ctx;
  if (!c || !master) return;
  const t = c.currentTime;
  const src = c.createBufferSource();
  const len = Math.floor(c.sampleRate * 0.05);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len / 6));
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2400;
  bp.Q.value = 0.8;
  const g = c.createGain();
  g.gain.value = 0.22;
  src.connect(bp).connect(g).connect(master);
  src.start(t);
}

/**
 * Move the music to another key, as if the next track had started. The
 * voices slide there rather than jump, which on a turntable is exactly what
 * a change of speed sounds like.
 */
export function setTranspose(semitones: number) {
  if (semitones === transpose) return;
  transpose = semitones;
  if (songPlaying) {
    // A recording can't change key, so it changes track the way a record
    // does: the needle clicks across and the sound dips for a moment.
    skip();
    dip(songPlaying);
    return;
  }
  if (voices.length === 0) return;
  skip();
  setChord(chordIndex, 0.12);
}

function dip(song: Song) {
  const c = ctx;
  if (!c) return;
  const t = c.currentTime;
  const f = song.tone.frequency;
  f.cancelScheduledValues(t);
  f.setValueAtTime(f.value, t);
  f.exponentialRampToValueAtTime(700, t + 0.09);
  f.exponentialRampToValueAtTime(20000, t + 0.7);
}

/** The needle is down: the side's recording if it has one, its chords if not. */
export function startMusic() {
  const c = ensure();
  if (!c || !master) return;
  const song = songForSide();
  if (song) playSong(song);
  else startSynth();
}

function playSong(song: Song) {
  const c = ctx;
  if (!c || songPlaying === song) return;
  songPlaying = song;
  const t = c.currentTime;
  song.gain.gain.cancelScheduledValues(t);
  song.gain.gain.setValueAtTime(song.gain.gain.value, t);
  song.gain.gain.linearRampToValueAtTime(SONG_LEVEL, t + 1.6);
  const playing = side;
  song.el
    .play()
    .then(() => {
      if (songPlaying === song) setSounding(playing);
    })
    .catch(() => {
      if (songPlaying === song) {
        songPlaying = null;
        startSynth();
      }
    });
}

function startSynth() {
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
  chordIndex = 0;
  const notes = CHORDS[0];
  const ratio = 2 ** (transpose / 12);
  for (let k = 0; k < notes.length * 2; k++) {
    const osc = c.createOscillator();
    osc.type = k % 2 === 0 ? "triangle" : "sine";
    osc.frequency.value = notes[Math.floor(k / 2)] * ratio;
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

  chordTimer = window.setInterval(() => setChord(chordIndex + 1), chordMs);
}

/** Lift the needle: music and crackle fall away, a small click as it leaves. */
export function stopAll() {
  const c = ctx;
  if (!c) return;
  const t = c.currentTime;
  if (chordTimer) window.clearInterval(chordTimer);
  chordTimer = null;

  // The recording fades and pauses where it is, so the next drop picks up there.
  if (songPlaying) {
    const song = songPlaying;
    songPlaying = null;
    setSounding(null);
    song.gain.gain.cancelScheduledValues(t);
    song.gain.gain.setValueAtTime(song.gain.gain.value, t);
    song.gain.gain.linearRampToValueAtTime(0, t + 0.6);
    window.setTimeout(() => {
      if (songPlaying !== song) song.el.pause();
    }, 650);
  }

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

/** Which side is up decides the chords: slow and dark on A, quicker and brighter on B. */
export function setSideSound(next: Side) {
  side = next;
  CHORDS = next === "B" ? SIDE_B : SIDE_A;
  chordMs = next === "B" ? 3200 : 6400;
  transpose = 0;
}

export function setMuted(m: boolean) {
  const c = ctx;
  if (!c || !master) return;
  master.gain.setTargetAtTime(m ? 0 : 0.9, c.currentTime, 0.08);
}
