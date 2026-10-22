"use client";

import * as THREE from "three";

/**
 * Procedural maps for the record. Everything is generated at load — no image
 * files — and every value here is something you can see on a real record:
 * fine grooves that throw a radial streak of light, smooth bands between the
 * tracks, a glossy run-out near the label.
 */

const S = 1024;

/** Track gaps, as a fraction of the record's radius. Five tracks, like a real side. */
const GAPS = [0.485, 0.59, 0.695, 0.8, 0.885];
const GAP_W = 0.0065;

function regionAt(r: number) {
  if (r < 0.345) return "label" as const;
  if (r < 0.375) return "runout" as const;
  if (r > 0.965) return "edge" as const;
  for (const g of GAPS) if (Math.abs(r - g) < GAP_W) return "gap" as const;
  return "groove" as const;
}

function dataTex(data: Uint8Array) {
  const t = new THREE.DataTexture(data, S, S, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.anisotropy = 8;
  t.colorSpace = THREE.NoColorSpace;
  t.needsUpdate = true;
  return t;
}

export interface GrooveMaps {
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  anisotropyMap: THREE.Texture;
}

export function makeGrooveMaps(): GrooveMaps {
  const n = new Uint8Array(S * S * 4);
  const rough = new Uint8Array(S * S * 4);
  const an = new Uint8Array(S * S * 4);

  // Groove period of ~2.2px: fine enough to read as texture, coarse enough
  // that mipmapping turns it into sheen rather than moiré.
  const K = (2 * Math.PI) / (2.2 / (S / 2));
  const c = S / 2;

  for (let j = 0; j < S; j++) {
    for (let i = 0; i < S; i++) {
      const k = (j * S + i) * 4;
      // DataTexture rows run bottom-up, so j is already "v up".
      const ux = (i + 0.5 - c) / c;
      const uy = (j + 0.5 - c) / c;
      const r = Math.hypot(ux, uy);
      const rx = r > 0 ? ux / r : 0;
      const ry = r > 0 ? uy / r : 0;
      const reg = r > 1 ? "edge" : regionAt(r);

      let nx = 0;
      let ny = 0;
      let rv = 0.32;
      let strength = 0;

      if (reg === "groove") {
        // Louder passages cut wider grooves, so each track's sheen differs a little.
        const track = GAPS.filter((g) => r > g).length;
        const amp = 0.22 + 0.14 * Math.sin(r * 41 + track * 1.7);
        const s = amp * Math.cos(r * K);
        nx = rx * s;
        ny = ry * s;
        rv = 0.34;
        strength = 1;
      } else if (reg === "gap") {
        rv = 0.14;
        strength = 0.35;
      } else if (reg === "runout") {
        rv = 0.18;
        strength = 0.5;
      } else if (reg === "edge") {
        rv = 0.3;
        strength = 0.2;
      }

      const len = Math.hypot(nx, ny, 1);
      n[k] = ((nx / len) * 0.5 + 0.5) * 255;
      n[k + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      n[k + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      n[k + 3] = 255;

      const g = rv * 255;
      rough[k] = g;
      rough[k + 1] = g;
      rough[k + 2] = g;
      rough[k + 3] = 255;

      // Anisotropy runs radially: circular grooves spread a reflection along
      // the radius, which is the bright wedge you see on a spinning record.
      an[k] = (rx * 0.5 + 0.5) * 255;
      an[k + 1] = (ry * 0.5 + 0.5) * 255;
      an[k + 2] = strength * 255;
      an[k + 3] = 255;
    }
  }

  return { normalMap: dataTex(n), roughnessMap: dataTex(rough), anisotropyMap: dataTex(an) };
}

/** Text set around a circle, for the ring of small type on the label. */
function ringText(
  x: CanvasRenderingContext2D,
  text: string,
  radius: number,
  start = -Math.PI / 2,
) {
  const chars = [...text];
  const step = (Math.PI * 2) / chars.length;
  chars.forEach((ch, i) => {
    x.save();
    x.rotate(start + i * step);
    x.translate(0, -radius);
    x.fillText(ch, 0, 0);
    x.restore();
  });
}

export async function makeLabel(): Promise<THREE.Texture> {
  await Promise.all([
    document.fonts.load('150px "Tiro Devanagari Sanskrit"', "निष्ठा"),
    document.fonts.load('60px "Zodiak"'),
    document.fonts.load('30px "Switzer"'),
  ]).catch(() => undefined);

  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const x = c.getContext("2d");
  if (!x) return new THREE.Texture();

  const mid = S / 2;
  const ink = "#2a1c16";
  const red = "#b8331f";

  // paper
  const paper = x.createRadialGradient(mid, mid - 80, 40, mid, mid, mid);
  paper.addColorStop(0, "#f4ecd9");
  paper.addColorStop(0.85, "#ebe0c7");
  paper.addColorStop(1, "#d9cbaa");
  x.fillStyle = paper;
  x.beginPath();
  x.arc(mid, mid, mid, 0, Math.PI * 2);
  x.fill();

  // paper fibres
  for (let i = 0; i < 9000; i++) {
    x.fillStyle = `rgba(90,60,30,${Math.random() * 0.05})`;
    x.fillRect(Math.random() * S, Math.random() * S, 1 + Math.random() * 2, 1);
  }

  // rings
  x.strokeStyle = red;
  x.lineWidth = 5;
  x.beginPath();
  x.arc(mid, mid, mid * 0.955, 0, Math.PI * 2);
  x.stroke();
  x.lineWidth = 2;
  x.beginPath();
  x.arc(mid, mid, mid * 0.9, 0, Math.PI * 2);
  x.stroke();

  x.translate(mid, mid);
  x.textAlign = "center";
  x.textBaseline = "middle";

  // ring of small type
  x.fillStyle = red;
  x.font = '600 25px "Switzer", sans-serif';
  ringText(
    x,
    "  NOW PLAYING  ·  SIDE A — WHAT I BUILD  ·  SIDE B — WHAT I LOVE  ·  ",
    mid * 0.825,
  );

  // name
  x.fillStyle = red;
  x.font = '150px "Tiro Devanagari Sanskrit", serif';
  x.fillText("निष्ठा", 0, -170);
  x.fillStyle = ink;
  x.font = '60px "Zodiak", serif';
  x.fillText("nishtha jain", 0, -62);

  // side + speed, either side of the spindle
  x.font = '600 28px "Switzer", sans-serif';
  x.fillText("SIDE A", -150, 4);
  x.fillText("33⅓", 150, 4);

  x.font = '500 24px "Switzer", sans-serif';
  x.fillStyle = ink;
  x.fillText("LUDHIANA  ·  2026", 0, 104);
  x.fillStyle = red;
  x.fillText("℗ built by hand", 0, 150);

  // spindle hole
  x.fillStyle = "#0d0b0a";
  x.beginPath();
  x.arc(0, 0, 20, 0, Math.PI * 2);
  x.fill();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/**
 * The platter's rim: brushed aluminium with four rows of strobe dots — the
 * detail that makes a direct-drive deck read as one.
 */
export function makePlatterRim(): THREE.Texture {
  const W = 2048;
  const H = 128;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  if (!x) return new THREE.Texture();

  x.fillStyle = "#c9c9c6";
  x.fillRect(0, 0, W, H);
  for (let i = 0; i < 2600; i++) {
    const v = 170 + Math.random() * 60;
    x.fillStyle = `rgba(${v},${v},${v - 4},0.35)`;
    x.fillRect(Math.random() * W, Math.random() * H, 20 + Math.random() * 160, 1);
  }

  const rows: [number, number][] = [
    [180, 0.2],
    [183, 0.4],
    [222, 0.6],
    [227, 0.8],
  ];
  x.fillStyle = "#2b2b2b";
  for (const [count, v] of rows) {
    const y = (1 - v) * H;
    for (let i = 0; i < count; i++) {
      x.beginPath();
      x.arc((i + 0.5) * (W / count), y, 3.4, 0, Math.PI * 2);
      x.fill();
    }
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
