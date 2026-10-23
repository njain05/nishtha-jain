import type { PatternKind } from "@/data/tracks";
import { mulberry32 } from "@/lib/rng";

/**
 * Sleeve art for the projects that have no screen to photograph, printed in
 * one ink like a screen-printed sleeve. Each is drawn from what the project
 * does — a pipeline, two bots sharing a state, a timetable, a QR code — and
 * seeded by the track, so it is identical on every visit.
 */

function seedOf(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Five stages; the lines bunch and fan out between them, like data through a pipeline. */
function flow(rand: () => number) {
  const stages = [-4, 22, 50, 78, 104];
  const centre = stages.map(() => 30 + rand() * 40);
  const spread = stages.map((_, i) => (i % 2 === 0 ? 3.1 : 0.5 + rand() * 0.6));
  const lines = 26;
  const paths: string[] = [];
  for (let k = 0; k < lines; k++) {
    const off = k - (lines - 1) / 2;
    const pts = stages.map((x, s) => [x, centre[s] + off * spread[s]] as const);
    let d = `M${pts[0][0]} ${r1(pts[0][1])}`;
    for (let s = 1; s < pts.length; s++) {
      const [x0, y0] = pts[s - 1];
      const [x1, y1] = pts[s];
      const xm = (x0 + x1) / 2;
      d += ` C${xm} ${r1(y0)} ${xm} ${r1(y1)} ${x1} ${r1(y1)}`;
    }
    paths.push(d);
  }
  return (
    <g fill="none" stroke="currentColor" strokeWidth={0.32}>
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

/** Two bots, two suns; where their rays cross is the state they share. */
function radial(rand: () => number) {
  const rays: string[] = [];
  for (const [cx, cy] of [
    [37, 50],
    [63, 50],
  ]) {
    const n = 96;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const len = i % 2 === 0 ? 40 : 22 + rand() * 14;
      rays.push(
        `M${r1(cx + Math.cos(a) * 3.5)} ${r1(cy + Math.sin(a) * 3.5)}L${r1(cx + Math.cos(a) * len)} ${r1(cy + Math.sin(a) * len)}`,
      );
    }
  }
  return (
    <>
      <path d={rays.join("")} stroke="currentColor" strokeWidth={0.28} />
      <circle cx={37} cy={50} r={2.2} fill="currentColor" />
      <circle cx={63} cy={50} r={2.2} fill="currentColor" />
    </>
  );
}

/** A week of periods, every class placed without a clash. */
function grid(rand: () => number) {
  const cols = 6;
  const rows = 8;
  const w = 100 / cols;
  const h = 100 / rows;
  const blocks: { x: number; y: number; hgt: number; o: number }[] = [];
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      if (rand() < 0.58) {
        const span = rand() < 0.3 && r < rows - 1 ? 2 : 1;
        blocks.push({
          x: c * w,
          y: r * h,
          hgt: span * h,
          o: [1, 0.55, 0.28][Math.floor(rand() * 3)],
        });
        r += span;
      } else r += 1;
    }
  }
  const lines: string[] = [];
  for (let c = 1; c < cols; c++) lines.push(`M${r1(c * w)} 0V100`);
  for (let r = 1; r < rows; r++) lines.push(`M0 ${r1(r * h)}H100`);
  return (
    <>
      <path d={lines.join("")} stroke="currentColor" strokeWidth={0.2} opacity={0.5} />
      {blocks.map((b) => (
        <rect
          key={`${b.x}-${b.y}`}
          x={r1(b.x + 1.1)}
          y={r1(b.y + 1.1)}
          width={r1(w - 2.2)}
          height={r1(b.hgt - 2.2)}
          rx={0.8}
          fill="currentColor"
          opacity={b.o}
        />
      ))}
    </>
  );
}

/** Truchet tiles: one rule, many outcomes — a fair picture of judging ideas. */
function truchet(rand: () => number) {
  const n = 8;
  const s = 100 / n;
  const arcs: string[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const X = x * s;
      const Y = y * s;
      const q = s / 2;
      if (rand() < 0.5) {
        arcs.push(`M${X + q} ${Y}A${q} ${q} 0 0 1 ${X} ${Y + q}`);
        arcs.push(`M${X + s} ${Y + q}A${q} ${q} 0 0 0 ${X + q} ${Y + s}`);
      } else {
        arcs.push(`M${X + q} ${Y}A${q} ${q} 0 0 0 ${X + s} ${Y + q}`);
        arcs.push(`M${X} ${Y + q}A${q} ${q} 0 0 1 ${X + q} ${Y + s}`);
      }
    }
  return <path d={arcs.join("")} fill="none" stroke="currentColor" strokeWidth={2.4} />;
}

/** A QR code, the kind you scan at the venue — and only there. */
function dots(rand: () => number) {
  const n = 25;
  const m = 100 / n;
  // The three finder squares, each with a one-module quiet border; null elsewhere.
  const finder = (x: number, y: number) => {
    for (const [ox, oy] of [
      [0, 0],
      [n - 7, 0],
      [0, n - 7],
    ]) {
      const fx = x - ox;
      const fy = y - oy;
      if (fx < -1 || fy < -1 || fx > 7 || fy > 7) continue;
      if (fx < 0 || fy < 0 || fx > 6 || fy > 6) return false;
      const edge = fx === 0 || fy === 0 || fx === 6 || fy === 6;
      const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
      return edge || core;
    }
    return null;
  };
  const cells: string[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const f = finder(x, y);
      const on = f === null ? rand() < 0.46 : f;
      if (on) cells.push(`${x},${y}`);
    }
  return (
    <g fill="currentColor">
      {cells.map((c) => {
        const [x, y] = c.split(",").map(Number);
        return (
          <rect
            key={c}
            x={r1(x * m + 0.3)}
            y={r1(y * m + 0.3)}
            width={3.4}
            height={3.4}
            rx={0.9}
          />
        );
      })}
    </g>
  );
}

/** Two sets of rings crossing: a moiré, a signal only the right reader sees. */
function interference() {
  const rings: string[] = [];
  for (const [cx, cy] of [
    [41, 45],
    [59, 55],
  ])
    for (let r = 2; r < 80; r += 2.3)
      rings.push(
        `M${r1(cx - r)} ${cy}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0`,
      );
  return <path d={rings.join("")} fill="none" stroke="currentColor" strokeWidth={0.42} />;
}

/** A street of buildings and the line of what they're worth, rising. */
function skyline(rand: () => number) {
  const base = 90;
  const blocks: { x: number; w: number; h: number }[] = [];
  let x = 2;
  while (x < 96) {
    const w = 6 + rand() * 8;
    blocks.push({ x, w: Math.min(w, 98 - x), h: 18 + rand() * 46 });
    x += w + 1.4;
  }
  const windows: string[] = [];
  for (const b of blocks)
    for (let wy = base - b.h + 3; wy < base - 3; wy += 3.4)
      for (let wx = b.x + 1.6; wx < b.x + b.w - 1.6; wx += 2.6)
        if (rand() < 0.42) windows.push(`M${r1(wx)} ${r1(wy)}h1.1v1.4h-1.1z`);
  const trend: string[] = [];
  for (let i = 0; i <= 10; i++)
    trend.push(`${i === 0 ? "M" : "L"}${i * 10} ${r1(38 - i * 2.6 + (rand() - 0.5) * 7)}`);
  return (
    <>
      {blocks.map((b) => (
        <rect
          key={b.x}
          x={r1(b.x)}
          y={r1(base - b.h)}
          width={r1(b.w)}
          height={r1(b.h)}
          fill="currentColor"
          fillOpacity={0.1}
          stroke="currentColor"
          strokeWidth={0.4}
        />
      ))}
      <path d={windows.join("")} fill="currentColor" />
      <path d={`M0 ${base}H100`} stroke="currentColor" strokeWidth={0.5} />
      <path d={trend.join("")} fill="none" stroke="currentColor" strokeWidth={0.7} />
    </>
  );
}

/* ── Side B ─────────────────────────────────────────────── */

/** A concert crowd's lightsticks, rows of them, shrinking toward the stage. */
function ocean(rand: () => number) {
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  for (let row = 0; row < 15; row++) {
    const depth = row / 14; // 0 = front, 1 = by the stage
    const y = 97 - (1 - (1 - depth) ** 1.6) * 68;
    const gap = 9 - depth * 6.2;
    const r = 2.1 - depth * 1.55;
    for (let x = -gap / 2 + (row % 2) * (gap / 2); x < 104; x += gap)
      dots.push({
        x: x + (rand() - 0.5) * gap * 0.5,
        y: y + (rand() - 0.5) * 1.6,
        r,
        o: 0.45 + rand() * 0.55,
      });
  }
  return (
    <g fill="currentColor">
      {dots.map((d) => (
        <circle
          key={`${r1(d.x)}-${r1(d.y)}`}
          cx={r1(d.x)}
          cy={r1(d.y)}
          r={r1(d.r)}
          opacity={r1(d.o)}
        />
      ))}
    </g>
  );
}

/** Sixteen episodes, the usual run; most of them watched, one under way. */
function episodes() {
  const cells = [];
  const size = 10.4;
  const gap = 1.6;
  const top = 50 - size - gap / 2;
  for (let i = 0; i < 16; i++) {
    const x = 2.4 + (i % 8) * (size + gap);
    const y = top + Math.floor(i / 8) * (size + gap);
    const watched = i < 11;
    cells.push(
      <g key={i}>
        <rect
          x={r1(x)}
          y={r1(y)}
          width={size}
          height={size}
          rx={1.6}
          fill="currentColor"
          fillOpacity={watched ? 0.9 : i === 11 ? 0.35 : 0}
          stroke="currentColor"
          strokeWidth={0.5}
        />
        <text
          x={r1(x + size / 2)}
          y={r1(y + size / 2 + 1.9)}
          textAnchor="middle"
          fontSize={5.2}
          fontWeight={700}
          fill={watched ? "var(--window)" : "currentColor"}
        >
          {i + 1}
        </text>
      </g>,
    );
  }
  return <>{cells}</>;
}

/** A field of stars, one of them with a world going round it. */
function stars(rand: () => number) {
  const field: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < 150; i++)
    field.push({ x: rand() * 100, y: rand() * 100, r: 0.15 + rand() ** 3 * 0.75 });
  const sparkle = (x: number, y: number, s: number) =>
    `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;
  return (
    <>
      <g fill="currentColor">
        {field.map((p) => (
          <circle key={`${r1(p.x)}-${r1(p.y)}`} cx={r1(p.x)} cy={r1(p.y)} r={r1(p.r)} />
        ))}
      </g>
      <ellipse
        cx={52}
        cy={56}
        rx={30}
        ry={11}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.5}
        transform="rotate(-18 52 56)"
      />
      <circle cx={52} cy={56} r={5.5} fill="currentColor" />
      <circle cx={79} cy={47} r={2} fill="currentColor" />
      <path d={sparkle(20, 22, 5)} fill="currentColor" />
      <path d={sparkle(84, 16, 3.4)} fill="currentColor" />
      <path d={sparkle(14, 80, 2.6)} fill="currentColor" />
    </>
  );
}

/** A sung phrase as a waveform: breath, swell, held note, fall. */
function voice(rand: () => number) {
  const bars: string[] = [];
  const n = 54;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const env = Math.sin(Math.PI * t) ** 0.7 * (0.55 + 0.45 * Math.sin(t * 9 + 1)) + 0.06;
    const h = Math.max(1.2, env * 40 * (0.75 + rand() * 0.5));
    const x = 6 + t * 88;
    bars.push(`M${r1(x)} ${r1(50 - h)}V${r1(50 + h)}`);
  }
  return (
    <path d={bars.join("")} stroke="currentColor" strokeWidth={0.95} strokeLinecap="round" />
  );
}

/** Two staves of a melody. */
function staff(rand: () => number) {
  const lines: string[] = [];
  const notes: { x: number; y: number; up: boolean }[] = [];
  for (const top of [22, 62]) {
    for (let k = 0; k < 5; k++) lines.push(`M4 ${top + k * 4}H96`);
    for (let x = 14; x < 92; x += 8 + rand() * 6) {
      const step = Math.floor(rand() * 11) - 1; // a step is half a line gap
      notes.push({ x, y: top + 16 - step * 2, up: step < 4 });
    }
    lines.push(`M4 ${top}V${top + 16}M96 ${top}V${top + 16}`);
  }
  return (
    <>
      <path d={lines.join("")} stroke="currentColor" strokeWidth={0.4} />
      {notes.map((n) => (
        <g key={`${r1(n.x)}-${n.y}`}>
          <ellipse
            cx={r1(n.x)}
            cy={n.y}
            rx={2.3}
            ry={1.6}
            transform={`rotate(-20 ${r1(n.x)} ${n.y})`}
            fill="currentColor"
          />
          <path
            d={n.up ? `M${r1(n.x + 2)} ${n.y}v-12` : `M${r1(n.x - 2)} ${n.y}v12`}
            stroke="currentColor"
            strokeWidth={0.5}
          />
        </g>
      ))}
    </>
  );
}

/** A lens stopped down: six blades round a hexagon of light. */
function aperture() {
  const R = 42;
  const r = 15;
  const blades = [];
  for (let i = 0; i < 6; i++) {
    const a0 = (i / 6) * Math.PI * 2;
    const a1 = ((i + 1) / 6) * Math.PI * 2;
    const p0 = [50 + Math.cos(a0) * r, 50 + Math.sin(a0) * r];
    const p1 = [50 + Math.cos(a1) * r, 50 + Math.sin(a1) * r];
    const q = [50 + Math.cos(a0 + 1.25) * R, 50 + Math.sin(a0 + 1.25) * R];
    const q2 = [50 + Math.cos(a1 + 1.25) * R, 50 + Math.sin(a1 + 1.25) * R];
    blades.push(
      <path
        key={i}
        d={`M${r1(p0[0])} ${r1(p0[1])}L${r1(q[0])} ${r1(q[1])}A${R} ${R} 0 0 1 ${r1(q2[0])} ${r1(q2[1])}L${r1(p1[0])} ${r1(p1[1])}Z`}
        fill="currentColor"
        fillOpacity={i % 2 ? 0.55 : 0.8}
        stroke="var(--window)"
        strokeWidth={0.8}
      />,
    );
  }
  return (
    <>
      <circle cx={50} cy={50} r={R + 3} fill="none" stroke="currentColor" strokeWidth={1.4} />
      {blades}
    </>
  );
}

export function Pattern({ kind, seed }: { kind: PatternKind; seed: string }) {
  const rand = mulberry32(seedOf(seed));
  let art: React.ReactNode;
  if (kind === "flow") art = flow(rand);
  else if (kind === "radial") art = radial(rand);
  else if (kind === "grid") art = grid(rand);
  else if (kind === "truchet") art = truchet(rand);
  else if (kind === "dots") art = dots(rand);
  else if (kind === "interference") art = interference();
  else if (kind === "skyline") art = skyline(rand);
  else if (kind === "ocean") art = ocean(rand);
  else if (kind === "episodes") art = episodes();
  else if (kind === "stars") art = stars(rand);
  else if (kind === "voice") art = voice(rand);
  else if (kind === "staff") art = staff(rand);
  else art = aperture();

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      aria-hidden
    >
      {art}
    </svg>
  );
}
