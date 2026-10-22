"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
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

  useEffect(() => {
    const ok = webglAvailable();
    setGl(ok);
    if (!ok) setDeck({ scene: "unavailable" });
  }, []);

  if (gl === null) return null;
  if (!gl) return <Fallback />;
  return (
    <SceneBoundary fallback={<Fallback />}>
      <Stage />
    </SceneBoundary>
  );
}
