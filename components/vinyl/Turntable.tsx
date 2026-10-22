"use client";

import { RoundedBox } from "@react-three/drei";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { anim, toggleDeck, trackArm } from "@/lib/vinyl/deck";
import {
  BEARING_Y,
  BODY_H,
  FOOT_H,
  HEADSHELL_AT,
  HEADSHELL_OFFSET,
  LABEL_R,
  MAT_H,
  PIVOT,
  PLATTER,
  PLINTH,
  RECORD,
  STYLUS_IN_SHELL,
  TOP,
} from "@/lib/vinyl/geometry";
import { makeGrooveMaps, makeLabel, makePlatterRim } from "@/lib/vinyl/textures";

function useMaterials() {
  return useMemo(() => {
    const satin = new THREE.MeshPhysicalMaterial({
      color: "#1b1917",
      roughness: 0.4,
      metalness: 0.12,
      clearcoat: 0.55,
      clearcoatRoughness: 0.32,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: "#e7e7e4",
      metalness: 1,
      roughness: 0.14,
    });
    const alu = new THREE.MeshStandardMaterial({
      color: "#c4c4c0",
      metalness: 1,
      roughness: 0.32,
    });
    const rubber = new THREE.MeshStandardMaterial({ color: "#0e0d0c", roughness: 0.95 });
    const felt = new THREE.MeshStandardMaterial({ color: "#151413", roughness: 1 });
    const dark = new THREE.MeshStandardMaterial({
      color: "#232120",
      roughness: 0.55,
      metalness: 0.3,
    });
    const led = new THREE.MeshStandardMaterial({
      color: "#3a2608",
      emissive: new THREE.Color("#ffb43a"),
      emissiveIntensity: 0,
    });
    return { satin, chrome, alu, rubber, felt, dark, led };
  }, []);
}

function Plinth({ m }: { m: ReturnType<typeof useMaterials> }) {
  const feet: [number, number][] = [
    [-1.8, -1.3],
    [1.8, -1.3],
    [-1.8, 1.3],
    [1.8, 1.3],
  ];
  return (
    <group>
      <RoundedBox
        args={[PLINTH.w, BODY_H, PLINTH.d]}
        radius={0.07}
        smoothness={5}
        position={[0, FOOT_H + BODY_H / 2, 0]}
        material={m.satin}
        castShadow
        receiveShadow
      />
      {feet.map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh position={[0, FOOT_H / 2, 0]} material={m.rubber} castShadow>
            <cylinderGeometry args={[0.3, 0.32, FOOT_H, 40]} />
          </mesh>
          <mesh position={[0, FOOT_H * 0.78, 0]} material={m.alu}>
            <cylinderGeometry args={[0.305, 0.305, 0.035, 40]} />
          </mesh>
        </group>
      ))}

      {/* start/stop, the two speed buttons, and the power LED */}
      <RoundedBox
        args={[0.52, 0.035, 0.3]}
        radius={0.012}
        position={[-1.55, TOP + 0.017, 1.38]}
        material={m.dark}
        castShadow
      />
      <RoundedBox
        args={[0.22, 0.03, 0.16]}
        radius={0.01}
        position={[-0.98, TOP + 0.015, 1.45]}
        material={m.alu}
      />
      <RoundedBox
        args={[0.22, 0.03, 0.16]}
        radius={0.01}
        position={[-0.7, TOP + 0.015, 1.45]}
        material={m.alu}
      />
      <mesh position={[-2.02, TOP + 0.006, 1.45]} material={m.led}>
        <cylinderGeometry args={[0.035, 0.035, 0.012, 20]} />
      </mesh>

      {/* pitch slider */}
      <mesh position={[1.95, TOP + 0.002, 0.62]} material={m.rubber}>
        <boxGeometry args={[0.06, 0.004, 1.05]} />
      </mesh>
      <RoundedBox
        args={[0.22, 0.07, 0.12]}
        radius={0.015}
        position={[1.95, TOP + 0.035, 0.62]}
        material={m.alu}
        castShadow
      />
    </group>
  );
}

function Record({
  m,
  label,
  grooves,
}: {
  m: ReturnType<typeof useMaterials>;
  label: THREE.Texture | null;
  grooves: ReturnType<typeof makeGrooveMaps>;
}) {
  const vinyl = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0b0b0c",
        roughness: 1,
        roughnessMap: grooves.roughnessMap,
        normalMap: grooves.normalMap,
        normalScale: new THREE.Vector2(0.55, 0.55),
        anisotropy: 0.85,
        anisotropyMap: grooves.anisotropyMap,
        clearcoat: 0.12,
        clearcoatRoughness: 0.2,
      }),
    [grooves],
  );
  const edge = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.25 }),
    [],
  );
  const paper = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#efe5cf", roughness: 0.78 }),
    [],
  );

  useEffect(() => {
    paper.map = label;
    paper.color.set(label ? "#ffffff" : "#efe5cf");
    paper.needsUpdate = true;
  }, [label, paper]);

  return (
    <group position={[0, PLATTER.h + MAT_H, 0]}>
      <mesh position={[0, RECORD.h / 2, 0]} material={edge} castShadow>
        <cylinderGeometry args={[RECORD.r, RECORD.r, RECORD.h, 160, 1, true]} />
      </mesh>
      <mesh
        position={[0, RECORD.h + 0.0004, 0]}
        rotation-x={-Math.PI / 2}
        material={vinyl}
        receiveShadow
      >
        <circleGeometry args={[RECORD.r, 256]} />
      </mesh>
      <mesh position={[0, RECORD.h + 0.0012, 0]} rotation-x={-Math.PI / 2} material={paper}>
        <circleGeometry args={[LABEL_R, 128]} />
      </mesh>
      <mesh position={[0, RECORD.h + 0.05, 0]} material={m.chrome} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.1, 24]} />
      </mesh>
    </group>
  );
}

function Tonearm({
  m,
  yawRef,
  pitchRef,
}: {
  m: ReturnType<typeof useMaterials>;
  yawRef: React.RefObject<THREE.Group | null>;
  pitchRef: React.RefObject<THREE.Group | null>;
}) {
  /** The S-shaped arm, laid out from the bearing toward the headshell (+z). */
  const tube = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -0.06),
      new THREE.Vector3(0.05, -0.002, 0.45),
      new THREE.Vector3(-0.035, -0.008, 1.15),
      new THREE.Vector3(0.025, -0.018, 1.7),
      new THREE.Vector3(0, HEADSHELL_AT.y, HEADSHELL_AT.z),
    ]);
    return new THREE.TubeGeometry(curve, 120, 0.025, 14, false);
  }, []);

  return (
    <group>
      {/* the arm rest the arm sits on when idle */}
      <mesh position={[PIVOT.x, TOP + 0.115, PIVOT.z + 1.5]} material={m.dark} castShadow>
        <cylinderGeometry args={[0.032, 0.04, 0.23, 20]} />
      </mesh>

      {/* base ring (does not turn) */}
      <group position={[PIVOT.x, TOP, PIVOT.z]}>
        <mesh position={[0, 0.025, 0]} material={m.dark} castShadow>
          <cylinderGeometry args={[0.27, 0.29, 0.05, 48]} />
        </mesh>
        <mesh position={[0, 0.052, 0]} material={m.alu}>
          <cylinderGeometry args={[0.2, 0.2, 0.012, 48]} />
        </mesh>
      </group>

      {/* yaw: swings across the record */}
      <group ref={yawRef} position={[PIVOT.x, TOP, PIVOT.z]}>
        <mesh position={[0, BEARING_Y / 2, 0]} material={m.alu} castShadow>
          <cylinderGeometry args={[0.075, 0.085, BEARING_Y, 32]} />
        </mesh>

        {/* pitch: lifts and lowers, about the bearing itself */}
        <group ref={pitchRef} position={[0, BEARING_Y, 0]}>
          <mesh material={m.dark}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 32]} />
          </mesh>
          <mesh geometry={tube} material={m.chrome} castShadow />

          {/* stub and counterweight behind the bearing */}
          <mesh
            position={[0, 0, -0.26]}
            rotation-x={Math.PI / 2}
            material={m.chrome}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, 0.42, 16]} />
          </mesh>
          <mesh position={[0, 0, -0.44]} rotation-x={Math.PI / 2} material={m.alu} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.26, 40]} />
          </mesh>
          <mesh position={[0, 0, -0.32]} rotation-x={Math.PI / 2} material={m.rubber}>
            <cylinderGeometry args={[0.145, 0.145, 0.04, 40]} />
          </mesh>

          {/* headshell, cartridge, stylus, finger lift */}
          <group position={[0, HEADSHELL_AT.y, HEADSHELL_AT.z]} rotation-y={HEADSHELL_OFFSET}>
            <RoundedBox
              args={[0.13, 0.025, 0.34]}
              radius={0.008}
              position={[0, 0, 0.17]}
              material={m.alu}
              castShadow
            />
            <mesh position={[0, -0.045, 0.2]} material={m.dark} castShadow>
              <boxGeometry args={[0.09, 0.07, 0.15]} />
            </mesh>
            <mesh
              position={[0, STYLUS_IN_SHELL.y + 0.006, STYLUS_IN_SHELL.z]}
              material={m.chrome}
            >
              <cylinderGeometry args={[0.004, 0.002, 0.012, 8]} />
            </mesh>
            <mesh position={[0.1, 0.004, 0.3]} material={m.alu}>
              <boxGeometry args={[0.13, 0.01, 0.03]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * The deck, drawn. Every moving part reads the shared `anim` state from
 * lib/vinyl/deck — this component owns no timing and no sound, so it can
 * mount late (slow network) or not at all (no WebGL) without breaking play.
 */
export function Turntable() {
  const m = useMaterials();
  const grooves = useMemo(makeGrooveMaps, []);
  const rim = useMemo(makePlatterRim, []);
  const [label, setLabel] = useState<THREE.Texture | null>(null);

  const platter = useRef<THREE.Group>(null);
  const yawRef = useRef<THREE.Group>(null);
  const pitchRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let alive = true;
    let made: THREE.Texture | null = null;
    makeLabel().then((t) => {
      made = t;
      if (alive) setLabel(t);
      else t.dispose();
    });
    return () => {
      alive = false;
      made?.dispose();
    };
  }, []);

  useEffect(
    () => () => {
      grooves.normalMap.dispose();
      grooves.roughnessMap.dispose();
      grooves.anisotropyMap.dispose();
      rim.dispose();
    },
    [grooves, rim],
  );

  useFrame((_, dt) => {
    trackArm(performance.now());
    // Clockwise seen from above, which is negative about +y.
    if (platter.current) platter.current.rotation.y -= anim.omega * Math.min(dt, 0.1);
    if (yawRef.current) yawRef.current.rotation.y = anim.yaw;
    if (pitchRef.current) pitchRef.current.rotation.x = anim.pitch;
    m.led.emissiveIntensity = anim.led * 2.4;
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    toggleDeck();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: a three.js scene node inside an aria-hidden canvas, not DOM. The keyboard-accessible control for the deck is the Play button in <Display>.
    <group
      onClick={onClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <Plinth m={m} />

      <group ref={platter} position={[PLATTER.x, TOP, PLATTER.z]}>
        <mesh position={[0, PLATTER.h / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[PLATTER.r, PLATTER.r, PLATTER.h, 160, 1, true]} />
          <meshStandardMaterial map={rim} metalness={1} roughness={0.3} />
        </mesh>
        <mesh
          position={[0, PLATTER.h + 0.001, 0]}
          rotation-x={-Math.PI / 2}
          material={m.felt}
          receiveShadow
        >
          <circleGeometry args={[PLATTER.r, 128]} />
        </mesh>
        <Record m={m} label={label} grooves={grooves} />
      </group>

      <Tonearm m={m} yawRef={yawRef} pitchRef={pitchRef} />
    </group>
  );
}
