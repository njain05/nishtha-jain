"use client";

import { useLenis } from "lenis/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CONTACT } from "@/data/contact";
import { HIDDEN_TRACK } from "@/data/tracks";
import { flipRecord, useDeck } from "@/lib/vinyl/deck";
import { unlockAudio } from "@/lib/vinyl/sound";
import { WaveRider } from "./WaveRider";

/**
 * After the last track: a stretch of run-out groove, then the hidden track —
 * the first thing ever built — then the record still in its shrink-wrap,
 * the next release.
 */

export function HiddenTrack() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The screen straightens and rises as it comes up, like a photo picked up
  // off a table — and once the game is on, it sits dead level to be played.
  const [live, setLive] = useState(false);
  const rotate = useTransform(scrollYProgress, [0, 0.5], reduced ? [0, 0] : [-7, 0]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [90, -60]);
  const t = HIDDEN_TRACK;

  return (
    <section
      ref={ref}
      aria-labelledby="hidden-title"
      className="relative overflow-hidden px-5 pt-40 pb-36 sm:px-8 lg:px-14"
      style={{
        background: `radial-gradient(50% 60% at 70% 55%, color-mix(in oklab, ${t.color} 40%, #0c0a09), #0c0a09 75%)`,
      }}
    >
      <p className="led text-center text-[12px] opacity-70">· · · RUN-OUT GROOVE · · ·</p>

      <div className="mx-auto mt-28 grid max-w-[1280px] items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <p
            className="led text-[13px] font-[700]"
            style={{ "--led": "#f2d27a" } as React.CSSProperties}
          >
            HIDDEN TRACK · {t.year}
          </p>
          <h2
            id="hidden-title"
            className="mt-5 text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.98]"
          >
            Where it started
          </h2>
          <p className="face-display mt-3 text-[clamp(1.1rem,1.7vw,1.4rem)] text-[#e9cf86] italic">
            {t.title} — {t.kind.split(" · ")[0].toLowerCase()}
          </p>
          <p className="mt-6 max-w-[34rem] text-[16px] text-sandal leading-relaxed">
            {t.blurb}
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            {t.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        <motion.figure style={{ rotate: live ? 0 : rotate, y }} className="relative">
          <WaveRider live={live} onPlay={() => setLive(true)} />
        </motion.figure>
      </div>
    </section>
  );
}

export function NextRelease() {
  return (
    <section aria-labelledby="next-title" className="relative px-5 py-36 sm:px-8 lg:px-14">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Still sealed: a sleeve in shrink-wrap, with the sticker on the front. */}
        <div className="relative mx-auto aspect-square w-[min(78vw,26rem)]">
          <div className="sleeve" style={{ "--c": "#1c1815" } as React.CSSProperties}>
            <div className="flex items-baseline justify-between text-[3.1cqw] uppercase tracking-[0.16em] opacity-70">
              <span>Nishtha Jain</span>
              <span>Sealed</span>
            </div>
            <div className="mt-auto">
              <p className="face-display text-[11cqw] leading-[0.92]">Next release</p>
              <p className="face-display mt-[3%] text-[4.4cqw] italic opacity-70">
                Recorded at EPAM India
              </p>
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2px]"
            style={{
              background:
                "linear-gradient(118deg, transparent 30%, rgb(255 255 255 / 0.10) 38%, transparent 44%, transparent 62%, rgb(255 255 255 / 0.06) 68%, transparent 74%)",
            }}
          />
          <div className="absolute top-[14%] right-[-5%] grid size-[30%] rotate-[12deg] place-content-center rounded-full bg-amber text-center text-void shadow-[0_8px_20px_rgb(0_0_0/0.45)]">
            <span className="text-[clamp(0.55rem,1.6vw,0.72rem)] uppercase tracking-[0.14em]">
              Coming
            </span>
            <span className="face-display text-[clamp(1rem,3vw,1.35rem)] italic leading-none">
              soon
            </span>
          </div>
        </div>

        <div>
          <p className="led text-[13px] font-[700]">NEXT RELEASE</p>
          <h2 id="next-title" className="mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[0.98]">
            AI Native Software Engineer Intern
          </h2>
          <p className="face-display mt-3 text-[clamp(1.15rem,1.8vw,1.45rem)] text-amber/90 italic">
            EPAM India
          </p>
          <p className="mt-6 max-w-[32rem] text-[16px] text-sandal leading-relaxed">
            Placement offer, 2026. Release date to be announced.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Side B's close: the goals, still to be written in their words. */
export function LifeGoals() {
  return (
    <section aria-labelledby="goals-title" className="relative px-5 py-36 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1280px]">
        <p className="led text-[13px] font-[700]">BONUS TRACK</p>
        <h2 id="goals-title" className="mt-5 text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98]">
          What I want from life
        </h2>
        <p className="face-display mt-8 max-w-[40rem] rounded-[4px] border border-ivory/25 border-dashed px-5 py-4 text-[clamp(1.1rem,1.8vw,1.35rem)] text-ash italic">
          Your words: the life goals you want here — the places, the people, the things you want
          to have done.
        </p>
      </div>
    </section>
  );
}

/**
 * Turn the record over from the bottom of the page: back up to the deck
 * first, so the flip is seen, then over it goes.
 */
function FlipButton() {
  const { side, state } = useDeck();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const busy = state === "cueing" || state === "lifting" || state === "flipping";

  const go = () => {
    unlockAudio();
    if (lenis && !reduced) lenis.scrollTo(0, { duration: 1.6, onComplete: flipRecord });
    else {
      window.scrollTo({ top: 0 });
      flipRecord();
    }
  };

  return (
    <button
      type="button"
      onClick={go}
      disabled={busy}
      className="group mt-12 inline-flex items-center gap-4 rounded-full border border-ivory/20 py-3 pr-7 pl-4 text-left transition-colors duration-300 hover:border-amber/60 hover:bg-amber/[0.06] disabled:opacity-50"
    >
      <span
        aria-hidden
        className="grid size-11 place-items-center rounded-full bg-amber text-[20px] text-void transition-transform duration-700 group-hover:rotate-180"
      >
        ↻
      </span>
      <span>
        <span className="face-display block text-[clamp(1.25rem,2.4vw,1.6rem)] italic leading-tight">
          Turn the record over
        </span>
        <span className="block text-[13px] text-ash">
          {side === "A" ? "Side B is what I love" : "Side A is what I build"}
        </span>
      </span>
    </button>
  );
}

/** Copies the address, for anyone who would rather not open a mail app. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(CONTACT.email);
          setCopied(true);
        } catch {
          window.location.href = `mailto:${CONTACT.email}`;
        }
      }}
      className="rounded-full border border-ivory/20 px-4 py-2 text-[13px] text-sandal transition-colors duration-200 hover:border-ivory/40 hover:text-ivory"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}

const ELSEWHERE = [
  { label: "GitHub", sub: CONTACT.github.label, href: CONTACT.github.href },
  ...(CONTACT.linkedin.href
    ? [{ label: "LinkedIn", sub: "Nishtha Jain", href: CONTACT.linkedin.href }]
    : []),
  ...(CONTACT.resume.href
    ? [{ label: "Résumé", sub: "One page, PDF", href: CONTACT.resume.href }]
    : []),
  { label: "Curriculum vitae", sub: "The long version", href: "/cv" },
];

export function Outro() {
  return (
    <footer
      id="contact"
      className="relative border-ivory/[0.08] border-t px-5 pt-32 pb-16 sm:px-8 lg:px-14"
    >
      <div className="mx-auto max-w-[1280px]">
        <p className="led text-[13px] font-[700]">CONTACT</p>
        <h2
          id="contact-title"
          className="mt-5 text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.98]"
        >
          Get in touch
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${CONTACT.email}`}
            className="face-display break-all text-[clamp(1.5rem,4.6vw,3.4rem)] italic leading-tight"
          >
            {CONTACT.email}
          </a>
          <CopyEmail />
        </div>

        <ul className="mt-12 flex flex-col gap-px overflow-hidden rounded-[6px] border border-ivory/10 bg-ivory/10 md:flex-row">
          {ELSEWHERE.map((l) => (
            <li key={l.label} className="flex-1 bg-void">
              <a
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex items-center justify-between gap-4 px-6 py-5 no-underline transition-colors duration-200 hover:bg-ivory/[0.04]"
              >
                <span>
                  <span className="block text-[16px] text-ivory">{l.label}</span>
                  <span className="block text-[13px] text-ash">{l.sub}</span>
                </span>
                <span
                  aria-hidden
                  className="text-ash transition-transform duration-300 group-hover:translate-x-1 group-hover:text-amber"
                >
                  {l.href.startsWith("http") ? "↗" : "→"}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[13px] text-ash">Ludhiana, Punjab, India</p>

        <div className="mt-28 border-ivory/[0.08] border-t pt-20">
          <p className="face-display text-[clamp(2.8rem,9vw,7.5rem)] italic leading-[0.95]">
            Thanks for listening.
          </p>
          <FlipButton />
        </div>
        <p className="mt-24 text-[13px] text-ash">
          Built by hand in Ludhiana, 2026. Every sound on this page is synthesised as you
          listen.
        </p>
      </div>
    </footer>
  );
}
