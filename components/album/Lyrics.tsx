"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useMemo, useRef } from "react";

/**
 * A paragraph read like lyrics on a screen: all of it there from the start,
 * dim, each word lighting as the scroll reaches it. *Asterisks* set a phrase
 * in the display italic, in the accent colour.
 */

type Word = { text: string; italic: boolean; key: string };

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

function Lit({
  word,
  i,
  count,
  progress,
}: {
  word: Word;
  i: number;
  count: number;
  progress: MotionValue<number>;
}) {
  // Each word has its own short stretch of the scroll; a few overlap, so a
  // phrase lights as a phrase rather than one word at a time.
  const start = i / count;
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

export function Lyrics({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const list = useMemo(() => words(text), [text]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <p ref={ref} className={className}>
      {reduced
        ? list.map((w) => (
            <span key={w.key} className={w.italic ? "text-amber italic" : undefined}>
              {w.text}{" "}
            </span>
          ))
        : list.map((w, i) => (
            <Lit key={w.key} word={w} i={i} count={list.length} progress={scrollYProgress} />
          ))}
    </p>
  );
}
