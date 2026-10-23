"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Trigonometric Wave Rider, playable in the page — the original 2024 game,
 * files copied unchanged from github.com/njain05/trigonometric_wave_rider_game
 * (698946d) into /public/play/wave-rider. Its page is laid out for a desktop
 * window, so it runs at that size and is scaled to fit, like a screen.
 *
 * Nothing in the game is edited. From outside it gets two things it never
 * had: arrow buttons for touch screens, and a game-over line on the screen
 * in place of its alert(), which would otherwise freeze this whole page.
 */
const SRC = "/play/wave-rider/index.html";
const W = 860;
const H = 740;

type Arrow = "ArrowLeft" | "ArrowRight";

export function WaveRider({ live, onPlay }: { live: boolean; onPlay: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const repeat = useRef<number | null>(null);
  const [scale, setScale] = useState(0);
  const [over, setOver] = useState<number | null>(null);
  const [startLabel, setStartLabel] = useState("Start");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (over === null) return;
    const id = window.setTimeout(() => setOver(null), 3200);
    return () => window.clearTimeout(id);
  }, [over]);

  // Never leave a held button repeating after the game has gone.
  useEffect(
    () => () => {
      if (repeat.current !== null) window.clearInterval(repeat.current);
    },
    [],
  );

  const onLoad = () => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    win.alert = (message?: unknown) => {
      const score = String(message ?? "").match(/\d+/);
      setOver(score ? Number(score[0]) : 0);
      setStartLabel("Restart");
    };
    win.focus();
  };

  // On a phone the game's own Start button is scaled down to a speck, so a
  // full-size one presses it — closing the welcome card first if it is up —
  // and then shows whatever the game's button now says.
  const startStop = () => {
    const d = frame.current?.contentDocument;
    if (!d) return;
    const welcome = d.getElementById("instructionModal");
    if (welcome && welcome.style.display !== "none") d.getElementById("closeModal")?.click();
    const button = d.getElementById("startButton");
    button?.click();
    setStartLabel(button?.textContent?.replace(" Game", "") ?? "Start");
  };

  // The game moves on arrow keys, so the touch buttons press arrow keys.
  const press = (key: Arrow) =>
    frame.current?.contentDocument?.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true }),
    );
  const hold = (key: Arrow) => {
    stop();
    press(key);
    repeat.current = window.setInterval(() => press(key), 55);
  };
  function stop() {
    if (repeat.current !== null) window.clearInterval(repeat.current);
    repeat.current = null;
  }

  return (
    <div>
      {/* the bezel */}
      <div className="rounded-[16px] bg-[#1a1714] p-2.5 shadow-[0_50px_90px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.06)] sm:p-3.5">
        <div
          ref={box}
          className="relative overflow-hidden rounded-[7px] bg-black"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          {live ? (
            <iframe
              ref={frame}
              src={SRC}
              title="Trigonometric Wave Rider — my first game, 2024"
              onLoad={onLoad}
              className="absolute top-0 left-0 origin-top-left border-0"
              style={{ width: W, height: H, transform: `scale(${scale})` }}
            />
          ) : (
            <>
              <Image
                src="/work/wave-rider.jpg"
                alt="Trigonometric Wave Rider mid-game: a ball riding a sine wave while blocks fall."
                fill
                sizes="(max-width: 1024px) 92vw, 52vw"
                className="object-contain opacity-60"
              />
              <button
                type="button"
                onClick={onPlay}
                className="group absolute inset-0 grid place-items-center"
              >
                <span className="inline-flex items-center gap-3 rounded-full bg-amber py-3 pr-6 pl-4 text-[15px] text-void shadow-[0_10px_30px_rgb(0_0_0/0.5)] transition-transform duration-300 group-hover:scale-105">
                  <span className="grid size-7 place-items-center rounded-full bg-void/90">
                    <span className="ml-[3px] h-0 w-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-amber" />
                  </span>
                  Play it here
                </span>
              </button>
            </>
          )}

          {over !== null ? (
            <p
              role="status"
              className="led-panel led pointer-events-none absolute inset-x-4 top-4 rounded-[10px] px-4 py-2.5 text-center text-[15px] font-[800] sm:text-[18px]"
            >
              GAME OVER · SCORE {over}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-[12.5px] text-ash">
        <span className="face-display text-[15px] italic">Exactly as I made it, in 2024</span>
        {live ? (
          <span className="pointer-coarse:hidden">Click the game, then use ← → to ride</span>
        ) : null}
      </div>

      {live ? (
        <div className="mt-4 hidden items-center justify-center gap-3 pointer-coarse:flex">
          {(["ArrowLeft", "ArrowRight"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-label={key === "ArrowLeft" ? "Move left" : "Move right"}
              onPointerDown={(e) => {
                e.preventDefault();
                hold(key);
              }}
              onPointerUp={stop}
              onPointerLeave={stop}
              onPointerCancel={stop}
              onContextMenu={(e) => e.preventDefault()}
              className={`led-panel grid h-14 w-20 touch-none select-none place-items-center rounded-[14px] border border-white/[0.08] text-[22px] text-ivory active:bg-white/[0.08] ${key === "ArrowLeft" ? "order-1" : "order-3"}`}
            >
              {key === "ArrowLeft" ? "◀" : "▶"}
            </button>
          ))}
          <button
            type="button"
            onClick={startStop}
            className="order-2 h-14 min-w-24 rounded-[14px] bg-amber px-5 text-[15px] text-void"
          >
            {startLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
