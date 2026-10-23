"use client";

import { useEffect, useRef } from "react";
import type { Track } from "@/data/tracks";

/**
 * The paper insert inside the sleeve: the whole story of a track, printed
 * in dark ink on cream. A native <dialog>, so focus, Escape and the
 * backdrop all behave without any help.
 */
export function LinerNotes({ track, onClose }: { track: Track | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (track && !d.open) d.showModal();
    if (!track && d.open) d.close();
  }, [track]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape already closes a dialog; this click only catches the backdrop
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      aria-labelledby="liner-title"
      data-lenis-prevent
      className="liner m-auto max-h-[86svh] w-[min(92vw,40rem)] overflow-y-auto rounded-[3px] bg-[#efe6d4] p-0 text-[#1d1612] backdrop:bg-black/70 backdrop:backdrop-blur-[3px]"
    >
      {track ? (
        <article className="px-7 py-8 sm:px-11 sm:py-11 [&_a:hover]:text-[#7a1f2b] [&_a]:decoration-[#1d1612]/40">
          <header className="flex items-start justify-between gap-6 border-[#1d1612]/15 border-b pb-6">
            <div>
              <p className="text-[11px] text-[#6b5a4c] uppercase tracking-[0.18em]">
                Liner notes · {track.year}
              </p>
              <h2
                id="liner-title"
                className="mt-3 text-[clamp(1.8rem,5vw,2.6rem)] leading-none"
              >
                {track.title}
              </h2>
              <p
                className="face-display mt-2 text-[17px] italic"
                style={{ color: track.color }}
              >
                {track.kind}
              </p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mt-1 -mr-2 rounded-full px-3 py-1.5 text-[13px] text-[#6b5a4c] hover:bg-black/5 hover:text-[#1d1612] focus-visible:outline-[#1d1612]"
            >
              Close
            </button>
          </header>

          <div className="mt-6 space-y-4 text-[16px] leading-relaxed">
            <p>{track.blurb}</p>
            {track.details.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>

          <h3 className="mt-8 text-[11px] text-[#6b5a4c] uppercase tracking-[0.18em] [font-family:var(--font-body)]">
            Credits
          </h3>
          <p className="mt-2 text-[15px]">{track.stack.join(" · ")}</p>

          {track.links.length || track.note ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-[#1d1612]/15 border-t pt-5 text-[15px]">
              {track.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
              {track.note ? (
                <span className="face-display text-[#6b5a4c] italic">{track.note}</span>
              ) : null}
            </div>
          ) : null}
        </article>
      ) : null}
    </dialog>
  );
}
