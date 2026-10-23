import type { Track } from "./tracks";

/**
 * Side B: what Nishtha loves, as an album of its own. The subjects are their
 * own list; the songs are the ones they named. Everything marked `draft` is
 * a prompt waiting for their words — nothing here is written for them.
 */
export const LOVES: Track[] = [
  {
    id: "kpop",
    title: "K-pop",
    kind: "The lightstick ocean",
    color: "#ff5fa2",
    art: { pattern: "ocean" },
    blurb: "Your words: who you listen to, your bias, the comeback you stayed up for.",
    details: [],
    stack: [],
    links: [],
    draft: true,
  },
  {
    id: "kdramas",
    title: "K-dramas",
    kind: "Sixteen episodes at a time",
    color: "#b48cff",
    art: { pattern: "episodes" },
    blurb:
      "Your words: the drama you would start again from episode one, and the one that made you cry.",
    details: [],
    stack: [],
    links: [],
    draft: true,
  },
  {
    id: "cosmos",
    title: "The cosmos",
    kind: "Science, and the very big",
    color: "#7b86ff",
    art: { pattern: "stars" },
    blurb: "Your words: what you look up at, and why something so far away feels close.",
    details: [],
    stack: [],
    links: [],
    draft: true,
  },
  {
    id: "singing",
    title: "Singing",
    kind: "My own voice",
    color: "#ff8a6b",
    art: { pattern: "voice" },
    blurb:
      "Your words: what you sing and where — and a recording, if you like, to play right here on the deck.",
    details: [],
    stack: [],
    links: [],
    draft: true,
  },
  {
    id: "music",
    title: "On repeat",
    kind: "R&B, pop, classical and slow EDM",
    color: "#ffc95a",
    art: { pattern: "staff" },
    blurb:
      "Golden Brown by The Stranglers, Space Song by Beach House, Video Games by Lana Del Rey, Lovers Rock by TV Girl.",
    details: [],
    stack: [],
    links: [],
  },
  {
    id: "photography",
    title: "Photography",
    kind: "Through my lens",
    color: "#4fd1c0",
    art: { pattern: "aperture" },
    blurb: "Your words — and your photographs, which will fill these sleeves.",
    details: [],
    stack: [],
    links: [],
    draft: true,
  },
];
