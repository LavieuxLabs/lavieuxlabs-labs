"use client";

import { useRef } from "react";
import { fibonacciSphere, perspective, rotateYX, useCanvasLoop, type CanvasFrame, type Vec3 } from "@/lib/useCanvasLoop";

// Pharmacological point-cloud sphere: a dense silver molecule cloud, an emerald "receptor" glow at
// the core, and 18 bonded surface nodes — one per safety plane — with binding pulses travelling
// along the bonds.

const PLANE_COUNT = 18;
const NODE_RADIUS = 1.07;
const BOND_SEGMENTS = 10;
const DEPTH_BUCKETS = 8;

type Pulse = { edge: number; t: number; forward: boolean; hops: number };

type Model = {
  points: Vec3[];
  nodes: Vec3[];
  edges: [number, number][];
};

// Deterministic jitter so the cloud reads as molecular texture but is identical on every render.
function hash(i: number) {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildModel(pointCount: number): Model {
  const points = fibonacciSphere(pointCount).map((p, i) => {
    const r = 1 + (hash(i) - 0.5) * 0.05;
    return [p[0] * r, p[1] * r, p[2] * r] as Vec3;
  });
  const nodes = fibonacciSphere(PLANE_COUNT);

  // Bond each plane node to its two nearest neighbours (deduplicated).
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push(i < j ? [i, j] : [j, i]);
        }
      });
  });
  return { points, nodes, edges };
}

/** Normalised linear interpolation between two unit vectors, lifted to `radius`. */
function arcPoint(a: Vec3, b: Vec3, t: number, radius: number, out: Vec3) {
  const x = a[0] + (b[0] - a[0]) * t;
  const y = a[1] + (b[1] - a[1]) * t;
  const z = a[2] + (b[2] - a[2]) * t;
  const len = Math.hypot(x, y, z) || 1;
  out[0] = (x / len) * radius;
  out[1] = (y / len) * radius;
  out[2] = (z / len) * radius;
  return out;
}

export default function PharmaGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    model: null as Model | null,
    pointCount: 0,
    tiltX: 0,
    tiltY: 0,
    pulses: [] as Pulse[],
    spawnIn: 0.4,
    buckets: Array.from({ length: DEPTH_BUCKETS }, () => [] as number[]),
    xs: new Float32Array(0),
    ys: new Float32Array(0),
    sizes: new Float32Array(0),
  });

  useCanvasLoop(canvasRef, ({ ctx, width, height, time, dt, pointer }: CanvasFrame) => {
    const s = state.current;
    const pointCount = width < 480 ? 800 : 1500;
    if (!s.model || s.pointCount !== pointCount) {
      s.model = buildModel(pointCount);
      s.pointCount = pointCount;
      s.pulses = [];
      s.xs = new Float32Array(pointCount);
      s.ys = new Float32Array(pointCount);
      s.sizes = new Float32Array(pointCount);
    }
    const { points, nodes, edges } = s.model;

    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.34;
    if (R <= 0) return;

    // Gentle pointer parallax, eased.
    const targetX = pointer.active ? pointer.y * 0.22 : 0;
    const targetY = pointer.active ? pointer.x * 0.35 : 0;
    s.tiltX += (targetX - s.tiltX) * Math.min(1, dt * 3);
    s.tiltY += (targetY - s.tiltY) * Math.min(1, dt * 3);

    const spin = time * 0.14 + s.tiltY;
    const tilt = 0.42 + s.tiltX;
    const tmp: Vec3 = [0, 0, 0];

    // Receptor glow at the core.
    const breathe = 0.85 + 0.15 * Math.sin(time * 1.3);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.35);
    glow.addColorStop(0, `rgba(94, 234, 212, ${0.26 * breathe})`);
    glow.addColorStop(0.35, `rgba(16, 185, 129, ${0.1 * breathe})`);
    glow.addColorStop(1, "rgba(16, 185, 129, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - R * 1.4, cy - R * 1.4, R * 2.8, R * 2.8);

    // Orbit ring (binding plane), projected orthographically under the current tilt.
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(153, 246, 228, 0.12)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 1.32, R * 1.32 * Math.abs(Math.sin(tilt)), 0, 0, Math.PI * 2);
    ctx.stroke();

    // Point cloud, bucketed by depth: back-to-front order with only a handful of fillStyle changes.
    const { xs, ys, sizes } = s;
    for (const b of s.buckets) b.length = 0;
    for (let i = 0; i < points.length; i++) {
      rotateYX(points[i], spin, tilt, tmp);
      const p = perspective(tmp[2]);
      xs[i] = cx + tmp[0] * R * p;
      ys[i] = cy + tmp[1] * R * p;
      const depth = (tmp[2] + 1) / 2;
      sizes[i] = Math.max(0.7, (0.65 + depth * 1.25) * p * (R / 190));
      // Jittered points can sit slightly outside the unit sphere, so clamp both ends.
      s.buckets[Math.max(0, Math.min(DEPTH_BUCKETS - 1, Math.floor(depth * DEPTH_BUCKETS)))].push(i);
    }
    for (let b = 0; b < DEPTH_BUCKETS; b++) {
      const depth = (b + 0.5) / DEPTH_BUCKETS;
      ctx.fillStyle = `rgba(236, 241, 247, ${(0.1 + Math.pow(depth, 1.4) * 0.9).toFixed(3)})`;
      for (const i of s.buckets[b]) {
        const size = sizes[i];
        ctx.fillRect(xs[i] - size / 2, ys[i] - size / 2, size, size);
      }
    }

    // Bonds between the 18 safety-plane nodes, drawn as surface arcs.
    const projected = nodes.map((n) => {
      const v = rotateYX([n[0] * NODE_RADIUS, n[1] * NODE_RADIUS, n[2] * NODE_RADIUS], spin, tilt, [0, 0, 0]);
      const p = perspective(v[2]);
      return { x: cx + v[0] * R * p, y: cy + v[1] * R * p, z: v[2], p };
    });

    ctx.lineWidth = 0.9;
    for (const [a, b] of edges) {
      const za = projected[a].z;
      const zb = projected[b].z;
      const front = ((za + zb) / 2 + 1) / 2;
      ctx.strokeStyle = `rgba(94, 234, 212, ${(0.05 + Math.pow(front, 2) * 0.5).toFixed(3)})`;
      ctx.beginPath();
      for (let k = 0; k <= BOND_SEGMENTS; k++) {
        arcPoint(nodes[a], nodes[b], k / BOND_SEGMENTS, NODE_RADIUS, tmp);
        rotateYX(tmp, spin, tilt, tmp);
        const p = perspective(tmp[2]);
        const x = cx + tmp[0] * R * p;
        const y = cy + tmp[1] * R * p;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Binding pulses travelling along bonds, chaining from node to node.
    s.spawnIn -= dt;
    if (s.spawnIn <= 0 && s.pulses.length < 6) {
      s.pulses.push({ edge: Math.floor(Math.random() * edges.length), t: 0, forward: Math.random() < 0.5, hops: 0 });
      s.spawnIn = 0.6 + Math.random() * 0.8;
    }
    const nextPulses: Pulse[] = [];
    for (const pulse of s.pulses) {
      pulse.t += dt * 0.55;
      const [a, b] = edges[pulse.edge];
      const from = pulse.forward ? a : b;
      const to = pulse.forward ? b : a;
      if (pulse.t >= 1) {
        if (pulse.hops < 4 && Math.random() < 0.65) {
          const options = edges.map((e, i) => ({ e, i })).filter(({ e, i }) => i !== pulse.edge && (e[0] === to || e[1] === to));
          if (options.length) {
            const pick = options[Math.floor(Math.random() * options.length)];
            nextPulses.push({ edge: pick.i, t: 0, forward: pick.e[0] === to, hops: pulse.hops + 1 });
          }
        }
        continue;
      }
      nextPulses.push(pulse);
      arcPoint(nodes[from], nodes[to], pulse.t, NODE_RADIUS, tmp);
      rotateYX(tmp, spin, tilt, tmp);
      const p = perspective(tmp[2]);
      const x = cx + tmp[0] * R * p;
      const y = cy + tmp[1] * R * p;
      const front = (tmp[2] + 1) / 2;
      const fade = Math.sin(pulse.t * Math.PI) * (0.25 + front * 0.75);
      const halo = ctx.createRadialGradient(x, y, 0, x, y, 10 * p);
      halo.addColorStop(0, `rgba(110, 231, 183, ${(0.6 * fade).toFixed(3)})`);
      halo.addColorStop(1, "rgba(110, 231, 183, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(x - 10 * p, y - 10 * p, 20 * p, 20 * p);
      ctx.fillStyle = `rgba(236, 253, 245, ${fade.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6 * p, 0, Math.PI * 2);
      ctx.fill();
    }
    s.pulses = nextPulses;

    // Plane nodes: bright rings on the visible hemisphere, faint dots behind.
    for (const n of projected) {
      const front = (n.z + 1) / 2;
      if (n.z > -0.15) {
        ctx.strokeStyle = `rgba(153, 246, 228, ${(0.25 + front * 0.6).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3.4 * n.p, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(240, 253, 250, ${(0.15 + front * 0.8).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.3 * n.p, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="18 güvenlik düzlemini temsil eden, birbirine bağlı düğümlere sahip dönen moleküler nokta bulutu küresi"
      className={`block h-full w-full ${className}`}
    />
  );
}
