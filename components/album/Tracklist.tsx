"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useInView,
  useIsPresent,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Track } from "@/data/tracks";
import { setCurrentTrack } from "@/lib/album";
import type { Side } from "@/lib/vinyl/deck";
import { LinerNotes } from "./LinerNotes";
import { Disc, pad, Sleeve } from "./Sleeve";

/** Screen heights of scrolling per track. */
const PER_TRACK = 95;
/**
 * The share of each track's scroll spent holding still. The record sits and
 * plays, then the next one comes — a song, then the gap, then a song —
 * rather than sliding past continuously.
 */
const HOLD = 0.42;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (t: number) => t * t * (3 - 2 * t);

function hold(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const a = HOLD / 2;
  return i + smooth(clamp01((f - a) / (1 - HOLD)));
}

/**
 * Where a sleeve sits, by its distance d from the one playing. Upcoming
 * records wait in the crate behind, each a little higher and further back;
 * a finished one tips forward toward you and drops out of the crate.
 */
function sleeveTransform(d: number, reduced: boolean) {
  if (reduced) return "none";
  if (d >= 0) {
    const k = Math.min(d, 3.4);
    return `translate3d(${k * 6.5}%, ${-k * 6}%, ${-k * 120}px) rotateY(${-Math.min(d, 1) * 7}deg)`;
  }
  const a = Math.min(-d, 1.5);
  return `translate3d(${-a * 6}%, ${a * 85}%, ${a * 220}px) rotateX(${-a * 58}deg) rotateZ(${-a * 4}deg)`;
}

function sleeveOpacity(d: number, reduced: boolean) {
  if (reduced) return 1 - clamp01(Math.abs(d) * 2.2);
  if (d >= 0) return clamp01(3.6 - d);
  return 1 - clamp01((-d - 0.5) / 0.45);
}

/** The record slides out of its sleeve, rolling as it goes, once its track has arrived. */
function discTransform(d: number) {
  const out = smooth(1 - clamp01(Math.abs(d) / 0.34));
  return `translateX(${out * 54}%) rotate(${out * 150}deg)`;
}

function Crate({
  tracks,
  side,
  pos,
  active,
  reduced,
}: {
  tracks: Track[];
  side: Side;
  pos: MotionValue<number>;
  active: number;
  reduced: boolean;
}) {
  return (
    <div className="absolute inset-0 [perspective:1700px]">
      {tracks.map((t, i) => (
        <SleeveUnit
          key={t.id}
          track={t}
          side={side}
          i={i}
          pos={pos}
          active={active}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

function SleeveUnit({
  track,
  side,
  i,
  pos,
  active,
  reduced,
}: {
  track: Track;
  side: Side;
  i: number;
  pos: MotionValue<number>;
  active: number;
  reduced: boolean;
}) {
  const transform = useTransform(pos, (p) => sleeveTransform(i - p, reduced));
  const opacity = useTransform(pos, (p) => sleeveOpacity(i - p, reduced));
  const zIndex = useTransform(pos, (p) =>
    i - p < -0.02 ? 200 : 100 - Math.round((i - p) * 10),
  );
  const dim = useTransform(pos, (p) => clamp01((i - p) * 0.3));
  const disc = useTransform(pos, (p) => discTransform(i - p));
  const near = Math.abs(i - active) <= 4;

  return (
    <motion.div
      className="crate-unit absolute"
      style={{ transform, opacity, zIndex, transformOrigin: "50% 100%" }}
    >
      {/* The record first in the DOM, so it sits behind its own sleeve. */}
      <motion.div className="absolute inset-[3%]" style={{ transform: disc }}>
        {near ? (
          <Disc track={track} n={i + 1} side={side} spinning={i === active && !reduced} />
        ) : null}
      </motion.div>
      <Sleeve track={track} n={i + 1} side={side} />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-void"
        style={{ opacity: dim }}
      />
    </motion.div>
  );
}

/*
 * Variants take the scroll direction as `custom`, so the outgoing track
 * leaves the way you are scrolling even if you have just turned round:
 * AnimatePresence hands the latest direction to whatever is exiting.
 */
const EASE = [0.22, 1, 0.36, 1] as const;
/** The incoming track waits this long, so the outgoing one is mostly gone before it rises. */
const AFTER = 0.18;

const word = (k: number): Variants => ({
  enter: (d: number) => ({ y: `${d * 105}%` }),
  show: { y: "0%", transition: { duration: 0.7, ease: EASE, delay: AFTER + k * 0.05 } },
  leave: (d: number) => ({
    y: `${-d * 105}%`,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  }),
});

const line = (delay: number): Variants => ({
  enter: (d: number) => ({ y: d * 22, opacity: 0 }),
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE, delay: AFTER + delay } },
  leave: (d: number) => ({ y: -d * 14, opacity: 0, transition: { duration: 0.22 } }),
});

/** Words rise into place from under a line, like type set on a press. */
function Words({ text, dir }: { text: string; dir: number }) {
  // Words can repeat in a title; the position makes each key unique.
  const words = text.split(" ").map((w, k) => ({ w, k, id: `${k}:${w}` }));
  return (
    <>
      {words.map(({ w, k, id }) => (
        <span key={id} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" custom={dir} variants={word(k)}>
            {w}
            {"\u00a0"}
          </motion.span>
        </span>
      ))}
    </>
  );
}

function TrackText({
  track,
  n,
  total,
  dir,
  onNotes,
}: {
  track: Track;
  n: number;
  total: number;
  dir: number;
  onNotes: () => void;
}) {
  // While it is leaving, the old track's text is only an image of itself:
  // clicks go through it to the track that is arriving.
  const present = useIsPresent();
  return (
    <motion.div
      initial="enter"
      animate="show"
      exit="leave"
      custom={dir}
      className={`max-w-[34rem] [grid-area:1/1] ${present ? "" : "pointer-events-none"}`}
    >
      <motion.p
        custom={dir}
        variants={line(0)}
        className="led led-track text-[13px] font-[700] tabular-nums"
      >
        TRACK {pad(n)} / {total}
        {track.year ? ` · ${track.year}` : ""}
      </motion.p>
      <h3 className="mt-3 text-[clamp(2.1rem,5.4vw,4.6rem)] leading-[0.98] lg:mt-5">
        <Words text={track.title} dir={dir} />
      </h3>
      <motion.p
        custom={dir}
        variants={line(0.12)}
        className="face-display mt-2 text-[clamp(1.05rem,1.6vw,1.35rem)] text-track italic lg:mt-3"
      >
        {track.kind}
      </motion.p>
      <motion.p
        custom={dir}
        variants={line(0.2)}
        className={`mt-4 line-clamp-4 text-[15px] leading-relaxed sm:text-[16px] lg:mt-6 lg:line-clamp-none ${track.draft ? "face-display rounded-[4px] border border-ivory/25 border-dashed px-3.5 py-2.5 text-ash italic" : "text-sandal"}`}
      >
        {track.blurb}
      </motion.p>
      {track.stack.length ? (
        <motion.p
          custom={dir}
          variants={line(0.26)}
          className="mt-4 hidden text-[13px] text-ash lg:block"
        >
          {track.stack.join("  ·  ")}
        </motion.p>
      ) : null}
      <motion.div
        custom={dir}
        variants={line(0.32)}
        className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] lg:mt-7"
      >
        {track.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-ivory">
            {l.label} ↗
          </a>
        ))}
        {track.note ? <span className="face-display text-ash italic">{track.note}</span> : null}
        {track.details.length ? (
          <button
            type="button"
            onClick={onNotes}
            className="rounded-full border border-ivory/15 px-3.5 py-1 text-[13px] text-sandal transition-colors duration-200 hover:border-ivory/35 hover:text-ivory"
          >
            Liner notes
          </button>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

/** The track numbers down the right edge: where you are on the side, and a way to skip. */
function Index({
  tracks,
  active,
  onPick,
}: {
  tracks: Track[];
  active: number;
  onPick: (i: number) => void;
}) {
  return (
    <nav
      aria-label="Tracks"
      className="absolute top-1/2 right-5 z-[300] hidden -translate-y-1/2 lg:block"
    >
      <ol className="flex flex-col items-end gap-2.5">
        {tracks.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-current={i === active ? "true" : undefined}
              aria-label={`Track ${i + 1}, ${t.title}`}
              className="group flex items-center gap-3 py-0.5"
            >
              <span className="pointer-events-none translate-x-1 text-[12px] text-sandal opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                {t.title}
              </span>
              <span
                className={`led text-[11px] tabular-nums transition-opacity ${i === active ? "led-track opacity-100" : "opacity-35"}`}
              >
                {pad(i + 1)}
              </span>
              <span
                className="h-px transition-all duration-500"
                style={{
                  width: i === active ? 30 : 12,
                  background:
                    i === active
                      ? "color-mix(in oklab, var(--track) 45%, var(--color-ivory))"
                      : "color-mix(in oklab, var(--color-ivory) 25%, transparent)",
                }}
              />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * One side of the record as an album you scroll through. Each track holds
 * the stage for a while — its record out of the sleeve and turning, the room
 * lit in its colour — then the next one comes forward from the crate.
 */
export function Tracklist({ tracks, side }: { tracks: Track[]; side: Side }) {
  const N = tracks.length;
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const pos = useTransform(scrollYProgress, (p) => hold(clamp01(p) * (N - 1)));
  const color = useTransform(
    pos,
    tracks.map((_, i) => i),
    tracks.map((t) => t.color),
  );

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [notes, setNotes] = useState<Track | null>(null);
  const activeRef = useRef(0);
  const inView = useInView(section, { margin: "-45% 0px -45% 0px" });

  useMotionValueEvent(pos, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.round(v)));
    if (i === activeRef.current) return;
    setDir(i > activeRef.current ? 1 : -1);
    activeRef.current = i;
    setActive(i);
  });

  // The whole page takes the track's light, so the header glows with it too.
  useMotionValueEvent(color, "change", (c) => {
    document.documentElement.style.setProperty("--track", c);
  });
  useEffect(() => {
    document.documentElement.style.setProperty("--track", color.get());
  }, [color]);

  useEffect(() => {
    setCurrentTrack(inView ? { index: active, title: tracks[active].title, side } : null);
  }, [inView, active, tracks, side]);
  useEffect(() => () => setCurrentTrack(null), []);

  const pick = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (i / (N - 1)) * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };

  const track = tracks[active];
  const id = `side-${side.toLowerCase()}`;

  return (
    <section
      ref={section}
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative"
      style={{ height: `${(N - 1) * PER_TRACK + 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The room, lit by the track: a pool of its colour behind the crate. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 68% 46%, color-mix(in oklab, var(--track) 55%, var(--color-void)) 0%, color-mix(in oklab, var(--track) 18%, var(--color-void)) 48%, var(--color-void) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void/80 to-transparent"
        />

        <h2 id={`${id}-title`} className="sr-only">
          Side {side} — {side === "A" ? "what I build" : "what I love"}. {N} tracks.
        </h2>

        <div className="relative mx-auto flex h-full max-w-[1480px] flex-col px-5 pt-16 pb-6 sm:px-8 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-6 lg:px-14 lg:pt-0 lg:pb-0">
          {/* The outgoing and incoming tracks share one grid cell and cross over,
              rather than the new one waiting for the old to leave: with "wait",
              a quick scroll back through two tracks could strand the old text. */}
          <div className="relative order-2 grid shrink-0 lg:order-1">
            <AnimatePresence custom={dir} initial={false}>
              <TrackText
                key={track.id}
                track={track}
                n={active + 1}
                total={N}
                dir={dir}
                onNotes={() => setNotes(track)}
              />
            </AnimatePresence>
          </div>

          <div
            aria-hidden
            className="relative order-1 min-h-[38svh] flex-1 lg:order-2 lg:h-full"
          >
            <div className="crate">
              <Crate tracks={tracks} side={side} pos={pos} active={active} reduced={reduced} />
            </div>
          </div>
        </div>

        <Index tracks={tracks} active={active} onPick={pick} />
      </div>

      <LinerNotes track={notes} onClose={() => setNotes(null)} />
    </section>
  );
}
