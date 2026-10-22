"use client";

import { ContactShadows, Environment, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { setDeck } from "@/lib/vinyl/deck";
import { Turntable } from "./Turntable";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Half the deck's width plus a margin, in scene units: what must fit across the screen. */
const HALF_WIDTH_TO_FIT = 2.85;
const PORTRAIT_DIR = new THREE.Vector3(0.35, 15.5, 7.6).normalize();
const PORTRAIT_TARGET = new THREE.Vector3(0.05, 0.3, 0.75);

/**
 * Frames the deck for the screen it is on: a three-quarter product shot on
 * landscape; nearly top-down on a phone, with the distance solved from the
 * aspect ratio so the whole plinth fits the width of any phone, not just one.
 */
function CameraFit() {
  const { camera, size, scene } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const target = new THREE.Vector3();
    if (aspect < 0.85) {
      cam.fov = 34;
      const halfTan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * aspect;
      const distance = THREE.MathUtils.clamp(HALF_WIDTH_TO_FIT / halfTan, 12, 28);
      target.copy(PORTRAIT_TARGET);
      cam.position.copy(PORTRAIT_DIR).multiplyScalar(distance).add(target);
    } else {
      cam.fov = 28;
      target.set(0.05, 0.15, 0.55);
      cam.position.set(2.6, 7.4, 8.9);
    }
    cam.lookAt(target);
    cam.updateProjectionMatrix();

    // Fog starts just past the deck, wherever the camera ended up, so it
    // only ever fades the floor — never the turntable itself.
    if (scene.fog instanceof THREE.Fog) {
      const d = cam.position.distanceTo(target);
      scene.fog.near = d + 3;
      scene.fog.far = d + 13;
    }
  }, [camera, size, scene]);
  return null;
}

/** The scene leans a few degrees toward the pointer; a hand near the deck, not a camera orbit. */
function Lean({ children, still }: { children: React.ReactNode; still: boolean }) {
  const g = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, dt) => {
    if (!g.current || still) return;
    const k = Math.min(1, dt * 2.2);
    g.current.rotation.y += (pointer.x * 0.09 - g.current.rotation.y) * k;
    g.current.rotation.x += (-pointer.y * 0.035 - g.current.rotation.x) * k;
  });
  return <group ref={g}>{children}</group>;
}

/** Mounts only once everything inside Suspense has loaded, so it marks the scene ready. */
function Ready() {
  useEffect(() => {
    setDeck({ scene: "ready" });
  }, []);
  return null;
}

export function Stage() {
  const reduced = useReducedMotion();
  const [dpr, setDpr] = useState(1.75);

  return (
    <Canvas
      shadows
      flat
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 28, near: 0.1, far: 60, position: [2.6, 7.4, 8.9] }}
      aria-hidden
    >
      <color attach="background" args={["#0c0a09"]} />
      <fog attach="fog" args={["#0c0a09", 12, 23]} />
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
      />
      <CameraFit />

      {/* one warm lamp above and to the left — a desk at night */}
      <spotLight
        position={[-3.6, 9.5, 3.4]}
        angle={0.44}
        penumbra={0.9}
        intensity={320}
        decay={2}
        distance={32}
        color="#ffd8a6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />
      <ambientLight intensity={0.03} />

      <Suspense fallback={null}>
        <Environment files="/hdri/studio_small_09_1k.hdr" environmentIntensity={0.42} />
        <Lean still={reduced}>
          <Turntable />
        </Lean>
        <Ready />
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#17130f" roughness={0.94} />
        </mesh>
        <ContactShadows
          position={[0, 0.003, 0]}
          scale={13}
          blur={2.6}
          opacity={0.75}
          far={2.4}
          resolution={1024}
        />
      </Suspense>

      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={0.32} luminanceThreshold={0.86} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette offset={0.32} darkness={0.72} />
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </Canvas>
  );
}
