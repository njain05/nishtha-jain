"use client";

import { useSyncExternalStore } from "react";
import type { Side } from "./vinyl/deck";
import { setTranspose } from "./vinyl/sound";

/**
 * Which track is on screen — null outside a tracklist. The page header reads
 * it for its now-playing line, and the music follows it into a new key, so
 * scrolling to the next track sounds like the next song.
 */
export interface NowShowing {
  index: number;
  title: string;
  side: Side;
}

/** Semitones from the home key for each track: neighbouring keys, so every change resolves. */
const KEYS = [0, 5, -2, 3, -4, 1, 6, -1, 4, -3, 2, -5, 0];

let current: NowShowing | null = null;
const listeners = new Set<() => void>();

export function setCurrentTrack(next: NowShowing | null) {
  if (
    next?.index === current?.index &&
    next?.side === current?.side &&
    (next === null) === (current === null)
  )
    return;
  current = next;
  setTranspose(next === null ? 0 : KEYS[next.index % KEYS.length]);
  for (const l of listeners) l();
}

export function useCurrentTrack() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => null,
  );
}
