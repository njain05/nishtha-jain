"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { setDeck } from "@/lib/vinyl/deck";
import { Fallback } from "./Fallback";

/** WebGL never renders on the server; the page paints its text first. */
const Stage = dynamic(() => import("./Stage").then((m) => m.Stage), { ssr: false });

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    // Release the probe context straight away; browsers cap how many are alive.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/** If the scene throws — a driver bug, a lost context — fall back, don't go blank. */
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Turntable scene failed; showing the fallback record.", error);
    setDeck({ scene: "unavailable" });
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function StageLoader() {
  const [gl, setGl] = useState<boolean | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const ok = webglAvailable();
    setGl(ok);
    if (!ok) setDeck({ scene: "unavailable" });
  }, []);

  // Stop drawing the deck once it has scrolled away; the music carries on.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      {gl === null ? null : gl ? (
        <SceneBoundary fallback={<Fallback />}>
          <Stage active={onScreen} />
        </SceneBoundary>
      ) : (
        <Fallback />
      )}
    </div>
  );
}
