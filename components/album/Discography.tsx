"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RELEASES } from "@/data/about";

/**
 * The journey as a discography: a release a year, laid out along one long
 * groove. Scrolling down carries the row sideways — the page stays put and
 * the years pass under you, the way the record passes under the needle.
 */

const MOST = Math.max(...RELEASES.map((r) => r.commits ?? 0));
const DOTS = 32;

/** Commits that year as a row of LEDs: the busier the year, the more are lit. */
function Meter({ commits, note }: { commits: number; note?: string }) {
  const lit = Math.max(1, Math.round((commits / MOST) * DOTS));
  return (
    <div className="mt-auto pt-8">
      <div aria-hidden className="flex gap-[3px]">
        {Array.from({ length: DOTS }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed row of identical dots
            key={i}
            className={`h-2.5 flex-1 rounded-[1px] ${i < lit ? "bg-amber shadow-[0_0_6px_var(--color-amber)]" : "bg-ivory/[0.07]"}`}
          />
        ))}
      </div>
      <p className="mt-2.5 text-[12.5px] text-ash">
        <span className="led text-[13px] font-[700]">{commits}</span> commits on GitHub
        {note ? ` · ${note}` : ""}
      </p>
    </div>
  );
}

function Release({ r, i }: { r: (typeof RELEASES)[number]; i: number }) {
  const upcoming = r.upcoming === true;
  return (
    <li className="relative flex w-[min(80vw,25rem)] shrink-0 flex-col pt-14">
      {/* where this year sits on the groove */}
      <span
        aria-hidden
        className={`absolute top-0 left-0 size-3 -translate-y-1/2 rounded-full ${upcoming ? "border border-amber bg-void" : "bg-amber"}`}
      />
      <span aria-hidden className="led absolute top-5 left-0 text-[12px] opacity-60">
        {String(i + 1).padStart(2, "0")}
      </span>
      <div
        className={`flex h-full flex-col rounded-[6px] border p-7 ${upcoming ? "border-amber/40 border-dashed" : "border-ivory/10 bg-ivory/[0.025]"}`}
      >
        {r.stage ? (
          <p className="mb-3 text-[12px] text-ash uppercase tracking-[0.16em]">{r.stage}</p>
        ) : null}
        <p className="face-display text-[clamp(3rem,6vw,4.5rem)] leading-none">{r.year}</p>
        <h3 className="face-display mt-3 text-[clamp(1.25rem,2vw,1.55rem)] text-amber italic">
          {r.title}
        </h3>
        <ul className="mt-5 space-y-2.5 text-[15px] text-sandal leading-relaxed">
          {r.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        {r.commits !== undefined ? <Meter commits={r.commits} note={r.note} /> : null}
      </div>
    </li>
  );
}

export function Discography() {
  const section = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const distance = useMotionValue(0);
  const [height, setHeight] = useState<string>("auto");
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  // How far the row has to travel is however much of it is off screen; the
  // section is made exactly that much taller, so a pixel down is a pixel across.
  useEffect(() => {
    const el = row.current;
    if (!el || reduced) return;
    const measure = () => {
      const d = Math.max(0, el.scrollWidth - window.innerWidth);
      distance.set(d);
      setHeight(`calc(100svh + ${d}px)`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance, reduced]);

  const content = (
    <motion.div
      ref={row}
      style={reduced ? undefined : { x }}
      className="flex w-max shrink-0 items-stretch gap-10 px-5 sm:px-8 lg:gap-14 lg:px-14"
    >
      <div className="flex w-[min(80vw,24rem)] shrink-0 flex-col justify-center pr-4">
        <p className="led text-[13px] font-[700]">DISCOGRAPHY</p>
        <h2
          id="journey-title"
          className="mt-5 text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.98]"
        >
          How I got here
        </h2>
        <p className="mt-5 max-w-[22rem] text-[15px] text-ash leading-relaxed">
          From 9th class to EPAM, with the next one on the way. Keep scrolling — the years go by
          sideways.
        </p>
      </div>
      <div className="relative">
        {/* the groove all the years sit on */}
        <span aria-hidden className="absolute top-0 right-0 left-0 h-px bg-ivory/15" />
        <ol className="flex h-full items-stretch gap-8 lg:gap-12">
          {RELEASES.map((r, i) => (
            <Release key={r.year} r={r} i={i} />
          ))}
        </ol>
      </div>
    </motion.div>
  );

  if (reduced)
    return (
      <section aria-labelledby="journey-title" className="overflow-x-auto py-32">
        {content}
      </section>
    );

  return (
    <section
      ref={section}
      id="journey"
      aria-labelledby="journey-title"
      className="relative"
      style={{ height }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-14">
        {content}
      </div>
    </section>
  );
}
