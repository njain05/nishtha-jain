"use client";

import { useEffect } from "react";

/**
 * Where the camera is along the journey, measured in stations rather than in
 * page percent.
 *
 * Raw scroll fraction drifts out of step with the content because sections
 * are wildly different heights — the hero is one screen, the work section is
 * six. This interpolates between the sections' actual centres, so when you
 * are reading section three the camera is at station three, exactly.
 */
let station = 0;
export const getStation = () => station;

export function useScrollProgress() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-graha]"));
    if (els.length === 0) return;

    const read = () => {
      const eye = window.scrollY + window.innerHeight / 2;
      const centres = els.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });

      if (eye <= centres[0]) {
        // Above the first centre: ease in from just behind station zero.
        const span = Math.max(1, centres[0]);
        station = -0.85 * (1 - eye / span);
        return;
      }
      const last = centres.length - 1;
      if (eye >= centres[last]) {
        const tail = Math.max(1, document.documentElement.scrollHeight - centres[last]);
        station = last + Math.min(1, (eye - centres[last]) / tail);
        return;
      }
      for (let i = 0; i < last; i++) {
        if (eye >= centres[i] && eye <= centres[i + 1]) {
          const f = (eye - centres[i]) / Math.max(1, centres[i + 1] - centres[i]);
          station = i + f;
          return;
        }
      }
    };

    read();
    const raf = requestAnimationFrame(read);
    const timers = [80, 300, 900].map((d) => window.setTimeout(read, d));
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      for (const t of timers) window.clearTimeout(t);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);
}
