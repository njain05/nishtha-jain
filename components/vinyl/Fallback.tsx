"use client";

import { useDeck } from "@/lib/vinyl/deck";

/**
 * The record, without WebGL: grooves from a repeating gradient, a light
 * wedge that stays put while the disc turns beneath it, and the same label.
 * It spins when the deck plays, so nothing about the page breaks.
 */
export function Fallback() {
  const { state } = useDeck();
  const spinning = state === "cueing" || state === "playing";

  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center pb-44 sm:pb-36">
      <div className="fallback-record">
        <div className={`fallback-disc ${spinning ? "is-spinning" : ""}`}>
          <div className="fallback-label">
            <span className="deva text-[clamp(1.1rem,4.4vw,1.6rem)] text-label leading-none">
              निष्ठा
            </span>
            <span className="mt-1 font-display text-[clamp(0.6rem,2.1vw,0.8rem)] text-[#2a1c16]">
              nishtha jain
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
