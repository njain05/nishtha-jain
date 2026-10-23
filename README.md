# Nishtha Jain

My portfolio, as a record you can play.

**Side A is what I build.** A turntable you can drop the needle on, then one long scroll through
my work as an album: each project a sleeve in a crate, its record sliding out and turning while
the room takes on its colour and the music moves to a new key. Then my skills cut into the
grooves of a record, my journey from 9th class to EPAM, and my first ever game — playable.

**Side B is what I love.** Double-click the record and it lifts, turns over in the air and lands
on Side B: the whole site fades to pink, and the music changes to a chord progression a lot of K-pop is
built on.

## Built with

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, three.js through React Three
Fiber and drei, Motion, GSAP and Lenis. Every sound is synthesised in the browser with the Web
Audio API — there are no audio files.

## Run it

```bash
npm install
npm run dev
```

`npm run check` runs the type checker and Biome.

## Where things are

- `app/` — the page, the CV and the security write-up
- `components/vinyl/` — the turntable: the 3D scene, its no-WebGL fallback, the deck readout
- `components/album/` — the tracklist, sleeves, skills record, discography, the game
- `lib/vinyl/` — the deck's state, its choreography and its sound, kept apart from the 3D so
  the deck works without WebGL
- `data/` — every word on the site
- `public/play/wave-rider/` — Trigonometric Wave Rider, my first game, copied unchanged from
  [its repository](https://github.com/njain05/trigonometric_wave_rider_game)

## Credits

Type: [Bluu Next](https://velvetyne.fr/fonts/bluu/) by Jean-Baptiste Morizot (Velvetyne),
[Apfel Grotezk](https://www.collletttivo.it/typefaces/apfel-grotezk) by Luigi Gorlero
(Collletttivo) and [Doto](https://fonts.google.com/specimen/Doto) by Óliver Lalan — all under
the SIL Open Font License. Studio lighting: "Studio Small 09" from
[Poly Haven](https://polyhaven.com), CC0.
