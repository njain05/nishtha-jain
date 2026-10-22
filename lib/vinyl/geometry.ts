/** Every dimension of the deck in one place, in scene units (≈ 10 cm). */

export const FOOT_H = 0.16;
export const BODY_H = 0.42;
export const TOP = FOOT_H + BODY_H;
export const PLINTH = { w: 4.5, d: 3.5 } as const;

export const PLATTER = { x: -0.5, z: 0.05, r: 1.62, h: 0.13 } as const;
export const MAT_H = 0.004;
export const RECORD = { r: 1.5, h: 0.022 } as const;
export const LABEL_R = RECORD.r * 0.34;

/** Groove radii, as distance from the spindle. */
export const LEAD_IN_R = 1.45;
export const RUN_OUT_R = 0.6;

/** 33⅓ rpm, in radians per second. */
export const OMEGA = (33.333 * Math.PI * 2) / 60;

/** Tonearm: where it pivots, how high it rides, and how far the stylus sits from the pivot. */
export const PIVOT = { x: 1.62, z: -1.08 } as const;
export const BEARING_Y = 0.27;
export const HEADSHELL_OFFSET = -0.38; // the offset angle that keeps the stylus tangent to the groove
export const HEADSHELL_AT = { y: -0.035, z: 2.04 } as const;
export const STYLUS_IN_SHELL = { y: -0.083, z: 0.255 } as const;

/** Stylus position in the arm's frame (before yaw), derived rather than guessed. */
export const STYLUS_LOCAL = {
  x: Math.sin(HEADSHELL_OFFSET) * STYLUS_IN_SHELL.z,
  z: HEADSHELL_AT.z + Math.cos(HEADSHELL_OFFSET) * STYLUS_IN_SHELL.z,
};

/** Where the stylus is, from above, for a given arm yaw. */
export function stylusAt(yaw: number) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return {
    x: PIVOT.x + STYLUS_LOCAL.x * c + STYLUS_LOCAL.z * s,
    z: PIVOT.z - STYLUS_LOCAL.x * s + STYLUS_LOCAL.z * c,
  };
}

/**
 * The yaw that puts the stylus on a groove of radius `r`. Distance from the
 * spindle falls monotonically as the arm swings in, so bisection is exact
 * enough in twenty steps.
 */
export function yawForRadius(r: number) {
  let lo = -0.95;
  let hi = 0;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    const p = stylusAt(mid);
    const d = Math.hypot(p.x - PLATTER.x, p.z - PLATTER.z);
    if (d > r) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
