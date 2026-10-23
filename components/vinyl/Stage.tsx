"use client";

import { ContactShadows, Environment, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type VignetteEffect } from "postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { anim, setDeck, useDeck } from "@/lib/vinyl/deck";
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
  const base = useRef({ position: new THREE.Vector3(), target: new THREE.Vector3() });
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const target = base.current.target;
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
    base.current.position.copy(cam.position);

    // Fog starts just past the deck, wherever the camera ended up, so it
    // only ever fades the floor — never the turntable itself.
    if (scene.fog instanceof THREE.Fog) {
      const d = cam.position.distanceTo(target);
      scene.fog.near = d + 3;
      scene.fog.far = d + 13;
    }
  }, [camera, size, scene]);

  // While the record is up in the air being turned over, step back and look
  // up a little, so the whole turn stays in frame on any screen.
  const back = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  useFrame(() => {
    const { position, target } = base.current;
    const k = anim.lift;
    back.current
      .subVectors(position, target)
      .normalize()
      .multiplyScalar(k * 3);
    camera.position.copy(position).add(back.current);
    look.current.copy(target).setY(target.y + k * 1.2);
    camera.lookAt(look.current);
  });
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

const ROOM = {
  background: [new THREE.Color("#0c0a09"), new THREE.Color("#ffd2e6")],
  floor: [new THREE.Color("#17130f"), new THREE.Color("#f7b3d2")],
  lamp: [new THREE.Color("#ffd8a6"), new THREE.Color("#fff1f7")],
} as const;

/**
 * Carries the room from Side A to Side B as the record turns: the dark
 * listening room with one warm lamp becomes a bright pink one, lit all
 * round, with the vignette lifting off the corners.
 */
function Room({
  floor,
  lamp,
  fill,
  vignette,
}: {
  floor: React.RefObject<THREE.MeshStandardMaterial | null>;
  lamp: React.RefObject<THREE.SpotLight | null>;
  fill: React.RefObject<THREE.AmbientLight | null>;
  vignette: React.RefObject<VignetteEffect | null>;
}) {
  const { scene } = useThree();
  // Applied every frame, not only on change: parts of the room (the floor)
  // mount late, after the HDR loads, and must pick up the current side too.
  useFrame(() => {
    const t = anim.tint;
    if (scene.background instanceof THREE.Color)
      scene.background.copy(ROOM.background[0]).lerp(ROOM.background[1], t);
    if (scene.fog instanceof THREE.Fog)
      scene.fog.color.copy(ROOM.background[0]).lerp(ROOM.background[1], t);
    floor.current?.color.copy(ROOM.floor[0]).lerp(ROOM.floor[1], t);
    if (lamp.current) {
      lamp.current.color.copy(ROOM.lamp[0]).lerp(ROOM.lamp[1], t);
      lamp.current.intensity = 320 + t * 80;
    }
    if (fill.current) fill.current.intensity = 0.03 + t * 0.9;
    scene.environmentIntensity = 0.42 + t * 0.55;
    if (vignette.current) vignette.current.darkness = 0.72 - t * 0.6;
  });
  return null;
}

/** Mounts only once everything inside Suspense has loaded, so it marks the scene ready. */
function Ready() {
  useEffect(() => {
    setDeck({ scene: "ready" });
  }, []);
  return null;
}

export function Stage({ active = true }: { active?: boolean }) {
  const reduced = useReducedMotion();
  const [dpr, setDpr] = useState(1.75);
  const { side } = useDeck();
  const floor = useRef<THREE.MeshStandardMaterial>(null);
  const lamp = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.AmbientLight>(null);
  const vignette = useRef<VignetteEffect>(null);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows="percentage"
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
      <Room floor={floor} lamp={lamp} fill={fill} vignette={vignette} />

      {/* one warm lamp above and to the left — a desk at night */}
      <spotLight
        ref={lamp}
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
      <ambientLight ref={fill} intensity={0.03} />

      <Suspense fallback={null}>
        <Environment files="/hdri/studio_small_09_1k.hdr" environmentIntensity={0.42} />
        <Lean still={reduced}>
          <Turntable />
        </Lean>
        <Ready />
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial ref={floor} color="#17130f" roughness={0.94} />
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
        <Vignette ref={vignette} offset={0.32} darkness={0.72} />
        {/* AgX suits the dark room; Neutral keeps Side B's pinks from turning grey. */}
        <ToneMapping mode={side === "B" ? ToneMappingMode.NEUTRAL : ToneMappingMode.AGX} />
      </EffectComposer>
    </Canvas>
  );
}
