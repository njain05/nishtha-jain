"use client";

import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Wheel scrolling eased into a glide, so the tracklist turns like a heavy
 * platter rather than in notches. Touch keeps the phone's own momentum, and
 * reduced motion keeps the browser's own scrolling.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return <ReactLenis root options={{ lerp: 0.09 }} />;
}
