"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { WISHES } from "@/data/loves";

/**
 * What I want from life, as a wishlist of tickets: a concert stub, a
 * boarding pass, an "admit three" for my parents. They lie scattered like a
 * scrapbook and each one swings in and settles as you scroll to it.
 */

/** How each ticket finally rests — a little crooked, as if stuck in by hand. */
const REST = [-2.4, 1.8, -1.2, 2.2, -0.8];

/** *Asterisks* mark a phrase for the italic. */
function Phrase({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed split of a fixed string
          <em key={i} className="text-[#a4004f]">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Ticket({
  wish,
  i,
  last,
}: {
  wish: (typeof WISHES)[number];
  i: number;
  last: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const from = i % 2 === 0 ? -1 : 1;
  const rest = REST[i % REST.length];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.62"] });
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [rest, rest] : [rest + from * 12, rest],
  );
  const x = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [from * 110, 0]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [70, 0]);

  return (
    <motion.li
      ref={ref}
      style={{ rotate, x, y }}
      // The last wish is the one everything else leads to: bigger, and centred.
      className={`ticket-wrap w-full ${last ? "mx-auto mt-6 max-w-[58rem]" : `max-w-[46rem] ${i % 2 ? "lg:ml-auto" : ""}`}`}
    >
      <div className="ticket" style={{ "--t": wish.color } as React.CSSProperties}>
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
            {wish.admit} · Bonus track
          </p>
          <p
            className={`face-display mt-3 leading-[1.22] ${last ? "text-[clamp(1.5rem,3.2vw,2.6rem)]" : "text-[clamp(1.3rem,2.5vw,2rem)]"}`}
          >
            <Phrase text={wish.text} />
          </p>
        </div>
        <div className="ticket-stub">
          <span className="face-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[10.5px] uppercase leading-snug tracking-[0.14em] opacity-75">
            {wish.stub}
          </span>
          <span aria-hidden className="ticket-barcode mt-auto" />
        </div>
      </div>
    </motion.li>
  );
}

export function Wishlist() {
  return (
    <section
      aria-labelledby="goals-title"
      className="relative overflow-hidden px-5 py-36 sm:px-8 lg:px-14"
    >
      <div className="mx-auto max-w-[1280px]">
        <p className="led text-[13px] font-[700]">BONUS TRACK</p>
        <h2 id="goals-title" className="mt-5 text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98]">
          What I want from life
        </h2>
        <p className="face-display mt-4 text-[clamp(1.1rem,1.8vw,1.4rem)] text-sandal italic">
          A wishlist, one ticket for each.
        </p>
        <ol className="mt-16 flex flex-col gap-10 sm:gap-14">
          {WISHES.map((w, i) => (
            <Ticket key={w.text} wish={w} i={i} last={i === WISHES.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}
