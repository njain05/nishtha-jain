"use client";

import gsap from "gsap";
import { useSyncExternalStore } from "react";
import { LEAD_IN_R, OMEGA, RUN_OUT_R, yawForRadius } from "./geometry";
import { drop, startCrackle, startMusic, stopAll, unlockAudio } from "./sound";

/**
 * The deck: its state, its choreography and its sound, with no dependency on
 * WebGL. The 3D turntable only *draws* what lives here. That separation is
 * what lets the deck play — readout, timing, music — on a phone with no
 * WebGL, on a connection still downloading the scene, or after the scene has
 * crashed; and lets a scene that mounts mid-song pick up exactly where the
 * music already is.
 */

export type DeckState = "idle" | "cueing" | "playing" | "lifting";
export type SceneState = "loading" | "ready" | "unavailable";

interface Deck {
  state: DeckState;
  /** performance.now() when the needle touched down, for the elapsed clock */
  since: number;
  muted: boolean;
  scene: SceneState;
}

let deck: Deck = { state: "idle", since: 0, muted: false, scene: "loading" };
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

/** The animated values the 3D deck reads every frame. */
export const anim = { yaw: 0, pitch: 0, omega: 0, led: 0 };

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
      window.setTimeout(startMusic, 450);
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

/**
 * Play or stop. Call it straight from a click or keypress: the audio context
 * is opened inside that gesture, which Safari requires, because the needle
 * itself does not land until two seconds later. Clicks mid-move are ignored.
 */
export function toggleDeck() {
  unlockAudio();
  if (deck.state === "idle") cue();
  else if (deck.state === "playing") lift();
}

/** While playing, the arm tracks inward across the side; call once per frame. */
export function trackArm(now: number) {
  if (deck.state !== "playing") return;
  const t = Math.min(1, (now - deck.since) / 1000 / SIDE_SECONDS);
  anim.yaw = yawForRadius(LEAD_IN_R + (RUN_OUT_R - LEAD_IN_R) * t);
}
