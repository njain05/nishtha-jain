"use client";

import { AnimatePresence, motion } from "motion/react";
import { type Side, setDeck, useDeck } from "@/lib/vinyl/deck";
import { setMuted } from "@/lib/vinyl/sound";
import { Display } from "./Display";

/**
 * What the name says about itself, per side: the work on Side A, the person
 * on Side B. Side B's lines are their own interests, waiting for their words.
 */
const LINES: Record<Side, { title: string; lines: [string, string] }> = {
  A: {
    title: "Software & Applied AI Engineer",
    lines: [
      "Incoming AI Native Software Engineer Intern, EPAM India",
      "Final-year Computer Science, GNDEC Ludhiana",
    ],
  },
  B: {
    title: "K-pop, K-dramas & the cosmos",
    lines: ["Singing; R&B, pop, classical and slow EDM", "Photography, and so much more"],
  },
};

export function Overlay() {
  const { muted, side } = useDeck();
  const say = LINES[side];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
      {/* The nav sits beside the (short) name only, so the lines beneath get
          the full width instead of being squeezed into a column on phones. */}
      <header className="relative px-5 pt-5 sm:px-8 sm:pt-7">
        <div>
          <p className="face-display text-[28px] leading-none sm:text-[32px]">Nishtha Jain</p>
          {/* The lines turn over with the record: out one way, the other side's in. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={side}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{
                rotateX: 0,
                opacity: 1,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              }}
              exit={{
                rotateX: 90,
                opacity: 0,
                transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
              }}
              style={{ transformOrigin: "50% 0%", transformPerspective: 600 }}
            >
              <p className="face-display mt-1.5 text-[17px] text-sandal italic leading-snug sm:text-[19px]">
                {say.title}
              </p>
              <p className="mt-2.5 text-[12.5px] text-ash leading-relaxed">
                <span className="text-ivory/85">{say.lines[0]}</span>
                <br />
                {say.lines[1]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <nav
          aria-label="Elsewhere"
          className="pointer-events-auto absolute top-4 right-2 flex items-center gap-0.5 whitespace-nowrap text-[13px] sm:top-6 sm:right-5"
        >
          <button
            type="button"
            onClick={() => {
              setMuted(!muted);
              setDeck({ muted: !muted });
            }}
            aria-pressed={!muted}
            className="rounded-full px-3 py-1.5 text-sandal transition-colors duration-200 hover:bg-ivory/[0.05] hover:text-ivory"
          >
            Sound {muted ? "off" : "on"}
          </button>
          <a
            href="/cv"
            className="rounded-full px-3 py-1.5 text-sandal no-underline transition-colors duration-200 hover:bg-ivory/[0.05] hover:text-ivory"
          >
            CV
          </a>
        </nav>
      </header>

      <footer className="relative flex justify-center px-4 pb-5 sm:pb-8">
        <Display />
        {/* Mouse and keyboard need telling that the page goes on; a phone already knows. */}
        <a
          href={`#side-${side.toLowerCase()}`}
          className="pointer-events-auto absolute right-8 bottom-8 hidden items-center gap-3 text-[13px] text-sandal no-underline transition-colors hover:text-ivory lg:flex"
        >
          Scroll for Side {side}
          <span aria-hidden className="relative h-9 w-px overflow-hidden bg-ivory/15">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-amber" />
          </span>
        </a>
      </footer>
    </div>
  );
}
