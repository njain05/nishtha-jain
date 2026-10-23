"use client";

import { recordClick, useDeck } from "@/lib/vinyl/deck";

/**
 * The record, without WebGL: grooves from a repeating gradient, a light
 * wedge that stays put while the disc turns beneath it, and the same label.
 * It spins when the deck plays, so nothing about the page breaks.
 */
export function Fallback() {
  const { state, side } = useDeck();
  const spinning = state === "cueing" || state === "playing";

  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center pb-44 sm:pb-36">
      {/* Clickable like the 3D record; the keyboard route is the Play and Flip buttons. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative duplicate of the deck buttons */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative duplicate of the deck buttons */}
      <div
        className={`fallback-record cursor-pointer ${state === "flipping" ? "is-flipping" : ""}`}
        onClick={recordClick}
      >
        <div
          className={`fallback-disc ${spinning ? "is-spinning" : ""} ${side === "B" ? "fallback-b" : ""}`}
        >
          <div className="fallback-label">
            <span className="face-display text-[clamp(1rem,3.8vw,1.45rem)] text-label italic leading-none">
              Nishtha Jain
            </span>
            <span className="face-display mt-1 text-[clamp(0.55rem,1.8vw,0.75rem)] text-[#2a1c16]">
              {side === "A" ? "Built in Ludhiana" : "What I love"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
