"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { CREDITS } from "@/data/about";

/**
 * The credits, cut into a record: each group of skills is one groove, its
 * names running round the disc. The record turns as you scroll past it;
 * point at a group in the list and its groove lights up. The list beside
 * it is the readable version — the record is for looking at.
 */

const SIZE = 600;
const C = SIZE / 2;
const OUTER = 268;
const STEP = 23;
const FONT = 11;
/** Average advance of a character in the body face, as a share of its size. */
const CHAR = 0.56;

/** A circle drawn from the top, clockwise — the path a groove's text follows. */
const circle = (r: number) =>
  `M ${C} ${C - r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 ${-2 * r}`;

function grooveText(group: string, items: string[], r: number) {
  const once = `${group.toUpperCase()} —  ${items.join("  ·  ")}  ·  `;
  const circumference = 2 * Math.PI * r;
  const repeats = Math.max(1, Math.round(circumference / (once.length * CHAR * FONT)));
  return { text: once.repeat(repeats), length: circumference - 2 };
}

export function Credits() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-40, 160]);

  return (
    <section
      ref={ref}
      id="credits"
      aria-labelledby="credits-title"
      className="relative overflow-hidden px-5 py-32 sm:px-8 lg:px-14 lg:py-40"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-[34rem]" aria-hidden>
          <motion.svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="block w-full"
            style={{ rotate }}
          >
            <defs>
              <radialGradient id="credits-vinyl">
                <stop offset="0.3" stopColor="#141312" />
                <stop offset="1" stopColor="#0b0b0c" />
              </radialGradient>
              {CREDITS.map((c, i) => (
                <path key={c.group} id={`groove-${i}`} d={circle(OUTER - i * STEP)} />
              ))}
            </defs>

            <circle cx={C} cy={C} r={C - 4} fill="url(#credits-vinyl)" />
            {/* the fine grooves between the lines of type */}
            {CREDITS.map((c, i) => (
              <circle
                key={c.group}
                cx={C}
                cy={C}
                r={OUTER - i * STEP + 9}
                fill="none"
                stroke="rgb(255 255 255 / 0.05)"
                strokeWidth={1}
              />
            ))}

            {CREDITS.map((c, i) => {
              const r = OUTER - i * STEP;
              const { text, length } = grooveText(c.group, c.items, r);
              const lit = active === null || active === i;
              return (
                <text
                  key={c.group}
                  fontSize={FONT}
                  letterSpacing="0.04em"
                  className="transition-[fill,opacity] duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fill: active === i ? "var(--color-amber)" : "#d8cfc2",
                    opacity: lit ? (active === i ? 1 : 0.62) : 0.16,
                  }}
                >
                  <textPath href={`#groove-${i}`} textLength={length} lengthAdjust="spacing">
                    {text}
                  </textPath>
                </text>
              );
            })}

            {/* the label */}
            <circle cx={C} cy={C} r={OUTER - CREDITS.length * STEP - 6} fill="#c8412b" />
            <circle
              cx={C}
              cy={C}
              r={OUTER - CREDITS.length * STEP - 14}
              fill="none"
              stroke="#efe5cf"
              strokeOpacity={0.5}
            />
            <text
              x={C}
              y={C - 16}
              textAnchor="middle"
              fontSize={13}
              fill="#efe5cf"
              letterSpacing="0.2em"
              style={{ fontFamily: "var(--font-body)" }}
            >
              CREDITS
            </text>
            <text
              x={C}
              y={C + 26}
              textAnchor="middle"
              fontSize={11}
              fill="#efe5cf"
              opacity={0.8}
              letterSpacing="0.16em"
              style={{ fontFamily: "var(--font-body)" }}
            >
              SIDE A
            </text>
            <circle cx={C} cy={C} r={5} fill="#0c0a09" />
          </motion.svg>
          {/* the light stays put while the record turns under it */}
          <div className="disc-sheen" />
        </div>

        <div>
          <p className="led text-[13px] font-[700]">CREDITS</p>
          <h2
            id="credits-title"
            className="mt-5 text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.98]"
          >
            What I work with
          </h2>
          <ul className="mt-10 border-ivory/10 border-t">
            {CREDITS.map((c, i) => (
              <li
                key={c.group}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                className={`grid gap-1 border-ivory/10 border-b py-3.5 transition-colors duration-300 sm:grid-cols-[11rem_1fr] sm:gap-6 ${active === i ? "text-ivory" : ""}`}
              >
                <span
                  className={`face-display text-[17px] italic transition-colors duration-300 ${active === i ? "text-amber" : "text-sandal"}`}
                >
                  {c.group}
                </span>
                <span className="text-[14.5px] text-ash leading-relaxed">
                  {c.items.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
