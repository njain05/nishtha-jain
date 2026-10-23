"use client";

import { ABOUT, FACTS } from "@/data/about";
import { Lyrics } from "./Lyrics";

/** About the artist: a paragraph that lights up as you read it, then four facts. */
export function About() {
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

        <Lyrics
          text={ABOUT}
          className="face-display mt-8 text-[clamp(1.5rem,3.95vw,3.125rem)] leading-[1.18] lg:mt-10"
        />

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
