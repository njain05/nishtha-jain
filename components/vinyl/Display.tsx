"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState, useSyncExternalStore } from "react";
import { type DeckState, flipRecord, type Side, toggleDeck, useDeck } from "@/lib/vinyl/deck";
import { getSong, subscribeSong } from "@/lib/vinyl/sound";

/**
 * How long Play waits for the 3D scene before working without it. The deck
 * plays fine without WebGL; this only stops a slow connection from leaving
 * the visitor staring at a disabled button.
 */
const SCENE_GRACE_MS = 9000;

// No colons: at this size Doto's colon reads as a dagger.
const NOW_PLAYING: Record<Side, string> = {
  A: "NOW PLAYING  ·  NISHTHA JAIN  ·  SOFTWARE & APPLIED AI ENGINEER  ·  INCOMING AT EPAM  ·  SIDE A  WHAT I BUILD  ·  ",
  B: "NOW PLAYING  ·  NISHTHA JAIN  ·  SIDE B  WHAT I LOVE  ·  K-POP  ·  K-DRAMAS  ·  THE COSMOS  ·  SINGING  ·  PHOTOGRAPHY  ·  ",
};

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** What a screen reader hears when the deck changes state. */
const spoken = (state: DeckState, side: Side) =>
  ({
    idle: `Stopped on side ${side}. Press play to drop the needle.`,
    cueing: "Cueing the record.",
    playing: `Now playing, side ${side}.`,
    lifting: "Stopping.",
    flipping: "Turning the record over.",
  })[state];

/**
 * The deck's readout: amber dot-matrix on a dark glass panel, like the
 * display on a hi-fi. It is also the accessible control for the whole
 * turntable — the canvas can be clicked, but this can be tabbed to.
 */
export function Display() {
  const { state, since, scene, side } = useDeck();
  const { progress } = useProgress();
  const [graceOver, setGraceOver] = useState(false);
  const loading = scene === "loading" && !graceOver;
  const [now, setNow] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setGraceOver(true), SCENE_GRACE_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    setNow(performance.now());
    const id = window.setInterval(() => setNow(performance.now()), 250);
    return () => window.clearInterval(id);
  }, [state]);

  // Space plays and stops while the turntable is on screen, unless focus is on
  // something that uses Space itself. Further down, Space scrolls the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (window.scrollY > window.innerHeight * 0.5) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("button, a, input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      if (!loading) toggleDeck();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading]);

  // While a recording is actually playing, the readout names it first.
  const song = useSyncExternalStore(subscribeSong, getSong, () => null);
  const ticker = song
    ? `${song.title.toUpperCase()}  ·  ${song.artist.toUpperCase()}  ·  ${NOW_PLAYING[side]}`
    : NOW_PLAYING[side];
  const busy = loading || state === "cueing" || state === "lifting" || state === "flipping";
  const playing = state === "playing";

  let line: React.ReactNode;
  if (loading) line = <span>LOADING {Math.round(progress)}%</span>;
  else if (state === "idle") line = <span className="led-pulse">DROP THE NEEDLE</span>;
  else if (state === "cueing") line = <span>CUEING</span>;
  else if (state === "lifting") line = <span>STOP</span>;
  else if (state === "flipping") line = <span>TURNING OVER</span>;
  else
    line = (
      <span className="ticker" aria-hidden>
        <span>{ticker}</span>
        <span>{ticker}</span>
      </span>
    );

  return (
    <section
      aria-label="Turntable"
      className="led-panel pointer-events-auto w-[min(92vw,27rem)] rounded-[14px] border border-white/[0.06] px-5 pt-4 pb-3.5"
    >
      <div className="led flex items-baseline justify-between text-[12px] font-[600] opacity-75">
        <span>SIDE {side}</span>
        <span className="tabular-nums">{playing ? clock(now - since) : "33 RPM"}</span>
      </div>

      <div className="led mt-2 h-8 overflow-hidden text-[23px] leading-8 font-[800]">
        {line}
      </div>

      <p className="sr-only" aria-live="polite">
        {loading ? "Loading the turntable." : spoken(state, side)}
      </p>

      <div className="mt-3 flex items-center justify-between border-white/[0.06] border-t pt-3">
        <button
          type="button"
          onClick={toggleDeck}
          disabled={busy}
          aria-pressed={playing}
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pr-4 pl-3 text-[13px] text-ivory transition-colors duration-200 hover:border-amber/50 hover:bg-amber/[0.08] disabled:cursor-default disabled:opacity-45 disabled:hover:border-white/10 disabled:hover:bg-white/[0.03]"
        >
          <span
            aria-hidden
            className={`grid size-4 place-items-center rounded-full ${playing ? "bg-amber/90" : "bg-ivory/90"} transition-colors`}
          >
            {playing ? (
              <span className="size-[6px] rounded-[1px] bg-void" />
            ) : (
              <span className="ml-[2px] h-0 w-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-void" />
            )}
          </span>
          {playing ? "Stop" : "Play"}
        </button>
        <button
          type="button"
          onClick={flipRecord}
          disabled={
            loading || state === "cueing" || state === "lifting" || state === "flipping"
          }
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-sandal transition-colors duration-200 hover:bg-white/[0.05] hover:text-ivory disabled:opacity-45"
        >
          <span aria-hidden className="text-[15px] leading-none">
            ↻
          </span>
          Flip to Side {side === "A" ? "B" : "A"}
        </button>
      </div>
      {/* How to do both from the record itself: mouse gets clicks and Space, touch gets taps. */}
      <p className="mt-2.5 text-center text-[11.5px] text-ash">
        {scene === "ready" ? (
          <>
            <span className="pointer-coarse:hidden">
              Click the record to play, double-click to flip it. Or press{" "}
              <kbd className="font-sans">Space</kbd>.
            </span>
            <span className="hidden pointer-coarse:inline">
              Tap the record to play, double-tap to flip it.
            </span>
          </>
        ) : (
          <span className="pointer-coarse:hidden">
            Or press <kbd className="font-sans">Space</kbd> to play.
          </span>
        )}
      </p>
    </section>
  );
}
