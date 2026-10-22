/**
 * Chandra — manas. Mind, feeling, water.
 *
 * `spotifyId` is empty until the real ids are filled in; the section renders
 * as a typographic list with search links until then, and switches to real
 * embedded players the moment an id appears. Nothing else needs to change.
 */

export interface Song {
  title: string;
  artist: string;
  /** 22-character Spotify track id. Leave empty rather than guessing. */
  spotifyId?: string;
  /** Why it is on the list. */
  note: string;
}

/** Paste a Spotify playlist id here to embed the whole set at once. */
export const PLAYLIST_ID = "";

export const SONGS: Song[] = [
  {
    title: "golden brown",
    artist: "the stranglers",
    note: "a harpsichord waltz about something it never names. the whole site is trying to be this colour.",
  },
  {
    title: "space song",
    artist: "beach house",
    note: "the reverb is the point. everything sounds like it is arriving from further away than it is.",
  },
  {
    title: "video games",
    artist: "lana del rey",
    note: "strings pitched somewhere between a film score and a memory of one.",
  },
  {
    title: "lovers rock",
    artist: "tv girl",
    note: "warm, woozy, slightly out of tune on purpose. sun-faded.",
  },
  {
    title: "self aware",
    artist: "temper city",
    note: "",
  },
  {
    title: "earrings",
    artist: "malcolm todd",
    note: "",
  },
];

export const searchUrl = (s: Song) =>
  `https://open.spotify.com/search/${encodeURIComponent(`${s.title} ${s.artist}`)}`;
