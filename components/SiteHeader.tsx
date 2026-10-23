"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { pad } from "@/components/album/Sleeve";
import { useCurrentTrack } from "@/lib/album";
import { toggleDeck, useDeck } from "@/lib/vinyl/deck";

/**
 * The header that slides in once the turntable is behind you: the name, and
 * a small readout of what is playing with its own play button — so the deck
 * stays in reach the whole way down the side.
 */
export function SiteHeader() {
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  const { state, side } = useDeck();
  const track = useCurrentTrack();

  useMotionValueEvent(scrollY, "change", (y) => setShown(y > window.innerHeight * 0.75));

  const playing = state === "playing";
  const busy = state === "cueing" || state === "lifting" || state === "flipping";
  const readout =
    track !== null
      ? `${track.side}${pad(track.index + 1)}  ${track.title.toUpperCase()}`
      : state === "playing"
        ? `SIDE ${side}  PLAYING`
        : `SIDE ${side}`;

  return (
    <header
      inert={!shown}
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-5 py-3 transition-[translate,opacity] duration-500 ease-out sm:px-8 ${shown ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -bottom-6 bg-gradient-to-b from-void/90 via-void/60 to-transparent"
      />
      <a href="#top" className="face-display relative text-[19px] leading-none no-underline">
        Nishtha Jain
      </a>

      <div className="relative flex items-center gap-1">
        <div className="led-panel flex items-center gap-3 rounded-full border border-white/[0.06] py-1 pr-4 pl-1">
          <button
            type="button"
            onClick={toggleDeck}
            disabled={busy}
            aria-pressed={playing}
            aria-label={playing ? "Stop the record" : "Play the record"}
            className="grid size-7 place-items-center rounded-full bg-white/[0.06] transition-colors hover:bg-white/[0.12] disabled:opacity-50"
          >
            {playing ? (
              <span className="size-[7px] rounded-[1px] bg-ivory" />
            ) : (
              <span className="ml-[2px] h-0 w-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-ivory" />
            )}
          </button>
          <span
            className={`led max-w-[9.5rem] truncate text-[12px] font-[700] sm:max-w-[17rem] ${track !== null ? "led-track" : ""}`}
          >
            {readout}
          </span>
        </div>
        <a
          href="/cv"
          className="hidden rounded-full px-3 py-1.5 text-[13px] text-sandal no-underline transition-colors hover:text-ivory sm:inline"
        >
          CV
        </a>
      </div>
    </header>
  );
}
