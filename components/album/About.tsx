"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { ABOUT, FACTS } from "@/data/about";

/**
 * About the artist, read like lyrics on a screen: the whole paragraph is
 * there from the start, dim, and each word lights as the scroll reaches it.
 */

type Word = { text: string; italic: boolean; key: string };

/** Split the paragraph into words, keeping *phrases* in italic. */
function words(source: string): Word[] {
  const out: Word[] = [];
  source.split(/(\*[^*]+\*)/).forEach((part, p) => {
    const italic = part.startsWith("*");
    const text = italic ? part.slice(1, -1) : part;
    for (const [w, word] of text.split(/\s+/).filter(Boolean).entries())
      out.push({ text: word, italic, key: `${p}.${w}` });
  });
  return out;
}

const WORDS = words(ABOUT);

function Lit({ word, i, progress }: { word: Word; i: number; progress: MotionValue<number> }) {
  // Each word has its own short stretch of the scroll; a few overlap, so a
  // phrase lights as a phrase rather than one word at a time.
  const start = i / WORDS.length;
  const opacity = useTransform(progress, [start - 0.02, start + 0.05], [0.16, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={word.italic ? "face-display text-amber italic" : undefined}
    >
      {word.text}{" "}
    </motion.span>
  );
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative px-5 pt-36 pb-32 sm:px-8 lg:px-14 lg:pt-44"
    >
      <div className="mx-auto max-w-[1680px]">
        <p className="led text-[13px] font-[700]">ABOUT THE ARTIST</p>
        <h2 id="about-title" className="sr-only">
          About Nishtha Jain
        </h2>

        <p
          ref={ref}
          className="face-display mt-8 text-[clamp(1.75rem,4.4vw,3.5rem)] leading-[1.18] lg:mt-10"
        >
          {reduced
            ? WORDS.map((w) => (
                <span key={w.key} className={w.italic ? "text-amber italic" : undefined}>
                  {w.text}{" "}
                </span>
              ))
            : WORDS.map((w, i) => (
                <Lit key={w.key} word={w} i={i} progress={scrollYProgress} />
              ))}
        </p>

        <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-ivory/10 border-t pt-10 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.big}>
              <dt className="face-display text-[clamp(1.6rem,3vw,2.3rem)] leading-none">
                {f.big}
              </dt>
              <dd className="mt-3 max-w-[16rem] text-[14px] text-ash leading-snug">
                {f.small}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
