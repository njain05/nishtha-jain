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

/** The page's active typefaces, read from the stylesheet so the label always matches it. */
function activeType() {
  const cs = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    display: read("--font-display", "Georgia, serif"),
    weight: read("--display-weight", "400"),
    body: read("--font-body", "system-ui, sans-serif"),
  };
}

/** Set a line no wider than `max`, shrinking the size if a face runs wide. */
function fitText(
  x: CanvasRenderingContext2D,
  text: string,
  font: (px: number) => string,
  px: number,
  max: number,
  y: number,
) {
  let size = px;
  x.font = font(size);
  while (x.measureText(text).width > max && size > 12) {
    size -= 2;
    x.font = font(size);
  }
  x.fillText(text, 0, y);
}

/** The two labels: cream and red on Side A, pink and plum on Side B. */
const LABELS = {
  A: {
    paper: ["#f4ecd9", "#ebe0c7", "#d9cbaa"],
    fibre: "90,60,30",
    ink: "#2a1c16",
    accent: "#b8331f",
    ring: "  NOW PLAYING  ·  SIDE A — WHAT I BUILD  ·  SIDE B — WHAT I LOVE  ·  ",
    line: "Built in Ludhiana",
  },
  B: {
    paper: ["#ffe0ee", "#ffc9e1", "#f7a8cb"],
    fibre: "150,40,90",
    ink: "#4a1438",
    accent: "#d10a6c",
    ring: "  NOW PLAYING  ·  SIDE B — WHAT I LOVE  ·  SIDE A — WHAT I BUILD  ·  ",
    line: "What I love",
  },
} as const;

export async function makeLabel(side: "A" | "B" = "A"): Promise<THREE.Texture> {
  const L = LABELS[side];
  // Both labels are drawn when the deck loads, before anyone has turned the
  // record over, so Side B names its own face rather than reading the page's.
  const t =
    side === "B"
      ? { ...activeType(), display: `"Fraunces", Georgia, serif`, weight: "600" }
      : activeType();
  await Promise.all([
    document.fonts.load(`italic ${t.weight} 110px ${t.display}`),
    document.fonts.load(`${t.weight} 40px ${t.display}`),
    document.fonts.load(`700 26px ${t.body}`),
    document.fonts.load(`400 24px ${t.body}`),
  ]).catch(() => undefined);

  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const x = c.getContext("2d");
  if (!x) return new THREE.Texture();

  const mid = S / 2;
  const ink = L.ink;
  const red = L.accent;

  // paper
  const paper = x.createRadialGradient(mid, mid - 80, 40, mid, mid, mid);
  paper.addColorStop(0, L.paper[0]);
  paper.addColorStop(0.85, L.paper[1]);
  paper.addColorStop(1, L.paper[2]);
  x.fillStyle = paper;
  x.beginPath();
  x.arc(mid, mid, mid, 0, Math.PI * 2);
  x.fill();

  // paper fibres
  for (let i = 0; i < 9000; i++) {
    x.fillStyle = `rgba(${L.fibre},${Math.random() * 0.05})`;
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

  // ring of small type — uppercase stamps, as on a real label
  x.fillStyle = red;
  x.font = `700 22px ${t.body}`;
  ringText(x, L.ring, mid * 0.825);

  // the name, in the display italic
  x.fillStyle = red;
  // Max width keeps the line's corners inside the ring of small type at r ≈ 0.8.
  fitText(
    x,
    "Nishtha Jain",
    (px) => `italic ${t.weight} ${px}px ${t.display}`,
    112,
    mid * 1.32,
    -168,
  );

  x.fillStyle = ink;
  fitText(x, L.line, (px) => `${t.weight} ${px}px ${t.display}`, 40, mid * 1.2, -84);

  // side and speed, either side of the spindle (no face here has a ⅓ glyph)
  x.font = `700 26px ${t.body}`;
  x.fillText(`SIDE ${side}`, -148, 4);
  x.fillText("33 RPM", 148, 4);

  x.font = `400 22px ${t.body}`;
  x.fillText("STEREO  ·  2026", 0, 100);

  x.fillStyle = red;
  fitText(
    x,
    "Made by hand",
    (px) => `italic ${t.weight} ${px}px ${t.display}`,
    34,
    mid * 0.9,
    150,
  );

  // spindle hole
  x.fillStyle = "#0d0b0a";
  x.beginPath();
  x.arc(0, 0, 20, 0, Math.PI * 2);
  x.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
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
