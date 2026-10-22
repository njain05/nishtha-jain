"use client";

import { setDeck, useDeck } from "@/lib/vinyl/deck";
import { setMuted } from "@/lib/vinyl/sound";
import { Display } from "./Display";

export function Overlay() {
  const { muted } = useDeck();

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between">
      <header className="flex items-start justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7">
        <div>
          <p className="font-display text-[19px] leading-none tracking-[-0.01em]">
            nishtha jain
          </p>
          <p className="mt-2 text-[12.5px] text-sandal leading-snug">
            final-year computer science
            <span className="hidden sm:inline"> · </span>
            <br className="sm:hidden" />
            gndec, ludhiana
          </p>
        </div>
        <nav
          aria-label="Elsewhere"
          className="pointer-events-auto -mr-2 flex shrink-0 items-center gap-0.5 whitespace-nowrap text-[13px]"
        >
          <button
            type="button"
            onClick={() => {
              setMuted(!muted);
              setDeck({ muted: !muted });
            }}
            aria-pressed={!muted}
            className="rounded-full px-3 py-1.5 text-sandal transition-colors duration-200 hover:bg-white/[0.04] hover:text-ivory"
          >
            sound {muted ? "off" : "on"}
          </button>
          <a
            href="/cv"
            className="rounded-full px-3 py-1.5 text-sandal no-underline transition-colors duration-200 hover:bg-white/[0.04] hover:text-ivory"
          >
            cv
          </a>
        </nav>
      </header>

      <footer className="flex justify-center px-4 pb-5 sm:pb-8">
        <Display />
      </footer>
    </div>
  );
}
