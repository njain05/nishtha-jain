"use client";

import { setDeck, useDeck } from "@/lib/vinyl/deck";
import { setMuted } from "@/lib/vinyl/sound";
import { Display } from "./Display";

export function Overlay() {
  const { muted } = useDeck();

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between">
        <header className="flex items-start justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7">
          <div>
            <p className="face-display text-[28px] leading-none sm:text-[32px]">Nishtha Jain</p>
            <p className="face-display mt-1.5 text-[16px] text-sandal italic leading-snug sm:text-[17px]">
              Final-year Computer Science,
              <br className="sm:hidden" /> GNDEC Ludhiana
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
              Sound {muted ? "off" : "on"}
            </button>
            <a
              href="/cv"
              className="rounded-full px-3 py-1.5 text-sandal no-underline transition-colors duration-200 hover:bg-white/[0.04] hover:text-ivory"
            >
              CV
            </a>
          </nav>
        </header>

        <footer className="flex justify-center px-4 pb-5 sm:pb-8">
          <Display />
        </footer>
      </div>
    </>
  );
}
