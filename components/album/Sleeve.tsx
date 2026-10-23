import Image from "next/image";
import type { Track } from "@/data/tracks";
import type { Side } from "@/lib/vinyl/deck";
import { Pattern } from "./Pattern";

export const pad = (n: number) => String(n).padStart(2, "0");

/**
 * How each side prints its sleeves: Side A in light ink on deep colour with
 * a black window; Side B in plum ink on bright colour with a pale window.
 */
const PRINT: Record<Side, (c: string) => React.CSSProperties> = {
  A: (c) =>
    ({
      "--c": c,
      "--window": "#0c0a09",
      "--art": `color-mix(in oklab, ${c} 30%, #f3ece0)`,
    }) as React.CSSProperties,
  B: (c) =>
    ({
      "--c": c,
      "--ink": "#3b0d2c",
      "--window": `color-mix(in oklab, ${c} 14%, #fff7fb)`,
      "--art": `color-mix(in oklab, ${c} 62%, #3b0d2c)`,
    }) as React.CSSProperties,
};

/**
 * One sleeve of the series: the track's colour as the card, a window with
 * the work in it, and the title printed underneath — the same layout on
 * every sleeve, the way a label designs a run of records.
 */
export function Sleeve({ track, n, side = "A" }: { track: Track; n: number; side?: Side }) {
  return (
    <div className="sleeve" style={PRINT[side](track.color)}>
      <div className="flex items-baseline justify-between text-[3.1cqw] uppercase tracking-[0.16em] opacity-80">
        <span>Nishtha Jain</span>
        <span className="tabular-nums">
          {side}
          {pad(n)}
        </span>
      </div>

      <div className="sleeve-window">
        {"image" in track.art ? (
          <Image
            src={track.art.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 60vw, 30vw"
            className="object-cover"
            style={{ objectPosition: track.art.position ?? "center top" }}
          />
        ) : (
          <div className="absolute inset-0 text-[var(--art)]">
            <Pattern kind={track.art.pattern} seed={track.id} />
          </div>
        )}
      </div>

      <p className="face-display mt-[5%] text-[7.4cqw] leading-[0.98]">{track.title}</p>
      <p className="face-display mt-[1.2%] text-[3.6cqw] italic opacity-75">{track.kind}</p>
    </div>
  );
}

/**
 * The record inside: grooves from a gradient, the light fixed while the disc
 * turns beneath it, and a label in the sleeve's colour.
 */
export function Disc({
  track,
  n,
  spinning,
  side = "A",
}: {
  track: Track;
  n: number;
  spinning: boolean;
  side?: Side;
}) {
  return (
    <div className="absolute inset-0">
      <div className={`disc ${side === "B" ? "disc-b" : ""} ${spinning ? "is-spinning" : ""}`}>
        <div className="disc-label" style={PRINT[side](track.color)}>
          <span className="text-[1.5cqw] uppercase tracking-[0.18em] opacity-80">
            Nishtha Jain
          </span>
          <span className="face-display text-[2.9cqw] italic leading-none">{track.title}</span>
          <span className="text-[1.4cqw] uppercase tracking-[0.18em] opacity-70">
            Side {side} · {pad(n)}
          </span>
        </div>
      </div>
      <div className="disc-sheen" />
    </div>
  );
}
