"use client";

import gsap from "gsap";
import { useSyncExternalStore } from "react";
import { LEAD_IN_R, OMEGA, RUN_OUT_R, yawForRadius } from "./geometry";
import { drop, setSideSound, startCrackle, startMusic, stopAll, unlockAudio } from "./sound";

/**
 * The deck: its state, its choreography and its sound, with no dependency on
 * WebGL. The 3D turntable only *draws* what lives here. That separation is
 * what lets the deck play — readout, timing, music — on a phone with no
 * WebGL, on a connection still downloading the scene, or after the scene has
 * crashed; and lets a scene that mounts mid-song pick up exactly where the
 * music already is.
 */

export type DeckState = "idle" | "cueing" | "playing" | "lifting" | "flipping";
export type Side = "A" | "B";
export type SceneState = "loading" | "ready" | "unavailable";

interface Deck {
  state: DeckState;
  /** performance.now() when the needle touched down, for the elapsed clock */
  since: number;
  muted: boolean;
  scene: SceneState;
  /** Which side of the record is up — and so which half of the site you are in. */
  side: Side;
}

let deck: Deck = { state: "idle", since: 0, muted: false, scene: "loading", side: "A" };
const listeners = new Set<() => void>();

export const getDeck = () => deck;

export function setDeck(patch: Partial<Deck>) {
  deck = { ...deck, ...patch };
  for (const l of listeners) l();
}

export function useDeck(): Deck {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => deck,
    () => deck,
  );
}

/**
 * The animated values the 3D deck reads every frame. `flip` is the record's
 * turn about its own axis (odd multiples of π are Side B), `lift` raises it
 * off the platter to make room for the turn, and `tint` carries the room
 * from Side A's lamplight (0) to Side B's pink (1).
 */
export const anim = { yaw: 0, pitch: 0, omega: 0, led: 0, lift: 0, flip: 0, tint: 0 };

/** A side of an LP runs about twenty minutes; the arm tracks inward over that. */
const SIDE_SECONDS = 20 * 60;
const LIFT = -0.075;

// The needle-drop sound is scheduled on the timeline, so the timeline runs on
// wall-clock time. With GSAP's default lag smoothing a slow device would play
// the arm in slow motion and the thump would land out of sync with it.
gsap.ticker.lagSmoothing(0);

let tl: gsap.core.Timeline | null = null;

function cue() {
  tl?.kill();
  setDeck({ state: "cueing" });
  tl = gsap
    .timeline()
    .to(anim, { omega: OMEGA, duration: 1.1, ease: "power2.out" }, 0)
    .to(anim, { led: 1, duration: 0.25 }, 0)
    .to(anim, { pitch: LIFT, duration: 0.35, ease: "power2.out" }, 0)
    .to(anim, { yaw: yawForRadius(LEAD_IN_R), duration: 1.25, ease: "power2.inOut" }, 0.3)
    .to(anim, { pitch: 0, duration: 0.55, ease: "power1.in" }, 1.6)
    .add(() => {
      drop();
      startCrackle();
      setDeck({ state: "playing", since: performance.now() });
      // Only if the needle is still down: a stop or a flip inside this half
      // second must not leave music starting after it.
      window.setTimeout(() => {
        if (deck.state === "playing") startMusic();
      }, 450);
    }, 2.15);
}

function lift() {
  tl?.kill();
  stopAll();
  setDeck({ state: "lifting" });
  tl = gsap
    .timeline({ onComplete: () => setDeck({ state: "idle" }) })
    .to(anim, { pitch: LIFT, duration: 0.3, ease: "power2.out" }, 0)
    .to(anim, { omega: 0, duration: 2.4, ease: "power2.out" }, 0)
    .to(anim, { led: 0, duration: 0.4 }, 0.2)
    .to(anim, { yaw: 0, duration: 1.1, ease: "power2.inOut" }, 0.3)
    .to(anim, { pitch: 0, duration: 0.35, ease: "power1.in" }, 1.4);
}

/** Hand the page its side: the palette in CSS, the music, and the address. */
function applySide(side: Side) {
  setDeck({ side });
  document.documentElement.dataset.side = side.toLowerCase();
  setSideSound(side);
  const hash = side === "B" ? "#side-b" : "";
  if (location.hash !== hash)
    history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
}

/** Open straight onto Side B when the link says so, with no animation. */
export function restoreSide() {
  if (location.hash !== "#side-b") return;
  anim.flip = Math.PI;
  anim.tint = 1;
  applySide("B");
}

/**
 * Turn the record over. The needle comes up and the platter stops first if
 * it was playing; then the record rises, turns over in the air, and the room
 * changes colour while it turns — so the change of side is something you
 * watch happen, not a page swap.
 */
export function flipRecord() {
  unlockAudio();
  if (deck.state === "cueing" || deck.state === "lifting" || deck.state === "flipping") return;
  const wasPlaying = deck.state === "playing";
  const next: Side = deck.side === "A" ? "B" : "A";
  tl?.kill();
  if (wasPlaying) stopAll();
  setDeck({ state: "flipping" });

  tl = gsap.timeline({ onComplete: () => setDeck({ state: "idle" }) });
  if (wasPlaying)
    tl.to(anim, { pitch: LIFT, duration: 0.3, ease: "power2.out" }, 0)
      .to(anim, { led: 0, duration: 0.4 }, 0.2)
      .to(anim, { yaw: 0, duration: 0.9, ease: "power2.inOut" }, 0.3)
      .to(anim, { pitch: 0, duration: 0.3, ease: "power1.in" }, 1.2);
  const t0 = wasPlaying ? 1.2 : 0;
  tl.to(anim, { omega: 0, duration: wasPlaying ? 1.3 : 0.01, ease: "power2.out" }, 0)
    .to(anim, { lift: 1, duration: 0.6, ease: "power2.out" }, t0)
    .to(anim, { flip: anim.flip + Math.PI, duration: 1.15, ease: "power2.inOut" }, t0 + 0.4)
    .to(anim, { tint: next === "B" ? 1 : 0, duration: 1.3, ease: "sine.inOut" }, t0 + 0.55)
    // The page changes side as the record passes edge-on.
    .add(() => applySide(next), t0 + 0.95)
    .to(anim, { lift: 0, duration: 0.55, ease: "power2.in" }, t0 + 1.4)
    .add(drop, t0 + 1.95);
}

/**
 * Play or stop. Call it straight from a click or keypress: the audio context
 * is opened inside that gesture, which Safari requires, because the needle
 * itself does not land until two seconds later. Clicks mid-move are ignored.
 */
export function toggleDeck() {
  unlockAudio();
  if (deck.state === "flipping") return;
  if (deck.state === "idle") cue();
  else if (deck.state === "playing") lift();
}

/** Two clicks closer together than this are a double-click: turn the record over. */
const DOUBLE_MS = 300;
let pendingClick: number | null = null;
let lastClick = 0;

/**
 * A click on the record itself, 3D or not. One click plays or stops; two in
 * quick succession turn it over. The audio context opens on the click,
 * which Safari requires, though the play waits a moment to be sure no
 * second click is coming.
 */
export function recordClick() {
  unlockAudio();
  const now = performance.now();
  if (pendingClick !== null && now - lastClick < DOUBLE_MS) {
    window.clearTimeout(pendingClick);
    pendingClick = null;
    flipRecord();
    return;
  }
  lastClick = now;
  pendingClick = window.setTimeout(() => {
    pendingClick = null;
    toggleDeck();
  }, DOUBLE_MS);
}

/** While playing, the arm tracks inward across the side; call once per frame. */
export function trackArm(now: number) {
  if (deck.state !== "playing") return;
  const t = Math.min(1, (now - deck.since) / 1000 / SIDE_SECONDS);
  anim.yaw = yawForRadius(LEAD_IN_R + (RUN_OUT_R - LEAD_IN_R) * t);
}
