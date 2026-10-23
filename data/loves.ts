import type { Track } from "./tracks";

/**
 * Side B: what Nishtha loves, as an album of its own. Written from what they
 * told me (23 Oct 2026), in their voice, to read like liner notes — every
 * fact is theirs. `stack` holds the names that go with each love: the
 * artists, the dramas, the films.
 */
export const LOVES: Track[] = [
  {
    id: "kpop",
    title: "K-pop",
    kind: "Since 2019, through BTS",
    color: "#ff5fa2",
    art: { pattern: "ocean" },
    blurb:
      "2019 was the year I found code, and the year I found BTS. One became a career; the other became a rabbit hole I happily never climbed back out of.",
    details: [
      "From BTS it spilled into everything — TXT, SEVENTEEN, ENHYPEN, LE SSERAFIM, TWICE, KATSEYE, and more than I could ever fit on one sleeve.",
      "I was a busy person, so I only ever stayed up for two comebacks. But for Butter, and for Arirang, sleep could wait.",
    ],
    stack: ["BTS", "TXT", "SEVENTEEN", "ENHYPEN", "LE SSERAFIM", "TWICE", "KATSEYE"],
    links: [],
  },
  {
    id: "kdramas",
    title: "K-dramas",
    kind: "Romance, crime thrillers — never horror",
    color: "#b48cff",
    art: { pattern: "episodes" },
    blurb:
      "Some stories you watch, and some stay with you long after the last episode. For me that's Can This Love Be Translated? and Twenty-Five Twenty-One — and Nevertheless, for reasons I still can't explain.",
    details: [
      "Can This Love Be Translated? taught me that everyone speaks a language of their own. You can share every word with someone and still not be understood — and then meet someone who hears exactly what you feel, without needing your words at all.",
      "Twenty-Five Twenty-One taught me that letting go can be the kindest thing you do, and that everything has its right time.",
      "I'm here for the romance, and for a good crime thriller. Horror, never — I can't stand it.",
      "And the ones that made me cry? I couldn't tell you their names. I was too busy crying.",
    ],
    stack: ["Can This Love Be Translated?", "Twenty-Five Twenty-One", "Nevertheless"],
    links: [],
  },
  {
    id: "cosmos",
    title: "The cosmos",
    kind: "Why something so far away feels close",
    color: "#7b86ff",
    art: { pattern: "stars" },
    blurb:
      "Dark matter, dying stars, black holes, the way time itself stretches near them — the universe has never felt far away to me. Maybe because I'm made of it.",
    details: [
      "Almost every atom in me is older than the Earth. The hydrogen in the water I drink was born in the Big Bang. The carbon in my cells, the oxygen in my breath, the calcium in my bones and the iron in my blood were forged inside stars, and scattered across space when those stars died. Look up at night and you're looking at where we came from.",
      "I love following all of it, from Hubble's pictures to life aboard the International Space Station. I once wrote about the technology of living in space for Shakti Chariot's NASA Space Camp competition, and made it to the second round.",
      "And when I want the universe with a story wrapped around it: Interstellar, 3 Body Problem, Project Hail Mary.",
    ],
    stack: ["Interstellar", "3 Body Problem", "Project Hail Mary"],
    links: [],
  },
  {
    id: "singing",
    title: "Singing",
    kind: "From the school choir",
    color: "#ff8a6b",
    art: { pattern: "voice" },
    blurb:
      "I sang in my school choir, haven't stood on a stage since, and I still sing anyway — which makes me, proudly, a self-proclaimed singer.",
    details: [],
    stack: [],
    links: [],
  },
  {
    id: "music",
    title: "On repeat",
    kind: "R&B, pop, classical and slow EDM",
    color: "#ffc95a",
    art: { pattern: "staff" },
    blurb:
      "There's honestly too much to name — my playlists run on moods, not genres. Lately it's The Weeknd, Lana Del Rey, ABBA, Arctic Monkeys and Cigarettes After Sex, with all of track one in between.",
    details: [
      "A few songs that have stayed with me: Golden Brown by The Stranglers, Space Song by Beach House, Video Games by Lana Del Rey and Lovers Rock by TV Girl.",
    ],
    stack: ["The Weeknd", "Lana Del Rey", "ABBA", "Arctic Monkeys", "Cigarettes After Sex"],
    links: [],
  },
  {
    id: "photography",
    title: "Photography",
    kind: "Nature, mostly. People too.",
    color: "#4fd1c0",
    art: { pattern: "aperture" },
    blurb:
      "My camera mostly finds nature and the small things around me — though when it turns to people, I take a good portrait too. I shot for the Digital Marketing Club's photography team.",
    details: [],
    stack: [],
    links: [],
  },
];

/**
 * The bonus track at the end of Side B: what Nishtha wants from life, as a
 * wishlist of tickets. `admit` and `stub` are the small print on each one;
 * *asterisks* set a phrase in italic.
 */
export const WISHES: { admit: string; text: string; stub: string; color: string }[] = [
  {
    admit: "Admit one",
    text: "To be good — *the best version of myself.*",
    stub: "No. 01",
    color: "#ffb3d4",
  },
  {
    admit: "Admit one",
    text: "A home of my own: a space I own, where *the door opens for me and no one else.*",
    stub: "Just me",
    color: "#cdb8ff",
  },
  {
    admit: "Boarding",
    text: "To travel, and taste every kind of food the world has to offer — *vegetarian, of course.*",
    stub: "From Ludhiana · To everywhere",
    color: "#a9b6ff",
  },
  {
    admit: "Standing",
    text: "To be in the crowd at a concert, *lightstick in hand.*",
    stub: "General admission",
    color: "#ffc4a8",
  },
  {
    admit: "Admit three",
    text: "To take my parents around the world — *the world they never got to see while they were busy raising me.*",
    stub: "Mum · Dad · Me",
    color: "#ffe08f",
  },
];
