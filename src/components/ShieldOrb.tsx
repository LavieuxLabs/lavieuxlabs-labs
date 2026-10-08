"use client";

import { useRef } from "react";
import { fibonacciSphere, perspective, rotateYX, useCanvasLoop, type CanvasFrame, type Vec3 } from "@/lib/useCanvasLoop";

// Geometric audit & protection rings: a dense data core inside concentric gyroscope rings, each
// turning slowly on its own axis. Two rings carry append-only "log entries" that light up one by
// one; another carries a pre-claim verification sweep.

type Ring = {
  radius: number;
  /** Orientation of the ring plane (radians around X, then Z). */
  tiltX: number;
  tiltZ: number;
  /** Spin around the ring's own normal, radians per second. */
  speed: number;
  tone: "silver" | "indigo";
  log?: { slots: number; rate: number; offset: number };
  sweep?: boolean;
  ticks?: number;
};

const RINGS: Ring[] = [
  { radius: 0.5, tiltX: 1.15, tiltZ: 0.25, speed: 0.32, tone: "indigo", sweep: true },
  { radius: 0.66, tiltX: -0.55, tiltZ: 0.95, speed: -0.2, tone: "silver", log: { slots: 36, rate: 2.2, offset: 0 } },
  { radius: 0.82, tiltX: 1.42, tiltZ: -0.45, speed: 0.14, tone: "indigo" },
  { radius: 0.98, tiltX: 0.4, tiltZ: 1.25, speed: -0.09, tone: "silver", log: { slots: 48, rate: 1.6, offset: 11 } },
  { radius: 1.14, tiltX: 1.57, tiltZ: 0.08, speed: 0.05, tone: "silver", ticks: 72 },
];

const SEGMENTS = 96;
const CHUNK = 4; // segments per stroke; each chunk gets its own depth-based alpha
const CORE_POINTS = 180;
const CORE_RADIUS = 0.27;

const RGB = { silver: "203, 213, 225", indigo: "165, 180, 252" };

/** Point at angle θ on a ring lying in the XZ plane, oriented by the ring's tilts. */
function ringPoint(ring: Ring, theta: number, out: Vec3) {
  const x = Math.cos(theta) * ring.radius;
  const z = Math.sin(theta) * ring.radius;
  // Tilt around X
  const cx = Math.cos(ring.tiltX);
  const sx = Math.sin(ring.tiltX);
  const y1 = -z * sx;
  const z1 = z * cx;
  // Tilt around Z
  const cz = Math.cos(ring.tiltZ);
  const sz = Math.sin(ring.tiltZ);
  out[0] = x * cz - y1 * sz;
  out[1] = x * sz + y1 * cz;
  out[2] = z1;
  return out;
}

type Projected = { x: number; y: number; z: number; p: number };

export default function ShieldOrb({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    core: fibonacciSphere(CORE_POINTS),
    tiltX: 0,
    tiltY: 0,
    ringPoints: RINGS.map(() => Array.from({ length: SEGMENTS + 1 }, () => ({ x: 0, y: 0, z: 0, p: 1 }) as Projected)),
  });

  useCanvasLoop(canvasRef, ({ ctx, width, height, time, dt, pointer }: CanvasFrame) => {
    const s = state.current;
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.38;
    if (R <= 0) return;

    const targetX = pointer.active ? pointer.y * 0.2 : 0;
    const targetY = pointer.active ? pointer.x * 0.3 : 0;
    s.tiltX += (targetX - s.tiltX) * Math.min(1, dt * 3);
    s.tiltY += (targetY - s.tiltY) * Math.min(1, dt * 3);

    const spin = time * 0.07 + s.tiltY;
    const tilt = 0.32 + s.tiltX;
    const tmp: Vec3 = [0, 0, 0];
    const rv: Vec3 = [0, 0, 0]; // scratch for ring points (must not alias `tmp`)
    const sweepFrom: Projected = { x: 0, y: 0, z: 0, p: 1 };

    const project = (v: Vec3, out: Projected) => {
      rotateYX(v, spin, tilt, tmp);
      const p = perspective(tmp[2]);
      out.x = cx + tmp[0] * R * p;
      out.y = cy + tmp[1] * R * p;
      out.z = tmp[2];
      out.p = p;
      return out;
    };

    // Indigo field glow.
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3);
    glow.addColorStop(0, "rgba(129, 140, 248, 0.24)");
    glow.addColorStop(0.4, "rgba(99, 102, 241, 0.08)");
    glow.addColorStop(1, "rgba(99, 102, 241, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - R * 1.35, cy - R * 1.35, R * 2.7, R * 2.7);

    // Project every ring once per frame.
    RINGS.forEach((ring, ri) => {
      const pts = s.ringPoints[ri];
      const phase = time * ring.speed;
      for (let k = 0; k <= SEGMENTS; k++) {
        project(ringPoint(ring, phase + (k / SEGMENTS) * Math.PI * 2, rv), pts[k]);
      }
    });

    const strokeRings = (frontPass: boolean) => {
      RINGS.forEach((ring, ri) => {
        const pts = s.ringPoints[ri];
        for (let k = 0; k < SEGMENTS; k += CHUNK) {
          const mid = pts[k + CHUNK / 2];
          if (mid.z >= 0 !== frontPass) continue;
          const front = (mid.z / ring.radius + 1) / 2;
          ctx.strokeStyle = `rgba(${RGB[ring.tone]}, ${(0.08 + Math.pow(front, 1.5) * 0.55).toFixed(3)})`;
          ctx.lineWidth = 0.6 + front * 0.6;
          ctx.beginPath();
          ctx.moveTo(pts[k].x, pts[k].y);
          for (let j = 1; j <= CHUNK; j++) ctx.lineTo(pts[k + j].x, pts[k + j].y);
          ctx.stroke();
        }
      });
    };

    const drawRingDetails = (frontPass: boolean) => {
      RINGS.forEach((ring) => {
        const phase = time * ring.speed;
        const o: Projected = { x: 0, y: 0, z: 0, p: 1 };

        if (ring.ticks) {
          for (let k = 0; k < ring.ticks; k++) {
            project(ringPoint(ring, phase + (k / ring.ticks) * Math.PI * 2, rv), o);
            if (o.z >= 0 !== frontPass) continue;
            const front = (o.z / ring.radius + 1) / 2;
            const major = k % 6 === 0;
            ctx.fillStyle = `rgba(${RGB.silver}, ${((major ? 0.3 : 0.12) + front * 0.5).toFixed(3)})`;
            const size = (major ? 2 : 1.2) * o.p;
            ctx.fillRect(o.x - size / 2, o.y - size / 2, size, size);
          }
        }

        // Append-only log: entries light up in order; the ring resets after a short hold.
        if (ring.log) {
          const { slots, rate, offset } = ring.log;
          const cycle = slots + 6;
          const written = Math.floor((time * rate + offset) % cycle);
          for (let k = 0; k < slots; k++) {
            project(ringPoint(ring, phase + (k / slots) * Math.PI * 2, rv), o);
            if (o.z >= 0 !== frontPass) continue;
            const front = (o.z / ring.radius + 1) / 2;
            const lit = k < written;
            const head = k === written - 1;
            const size = (head ? 3.2 : 2.2) * o.p;
            if (head) {
              const halo = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, 9 * o.p);
              halo.addColorStop(0, `rgba(199, 210, 254, ${(0.55 * (0.3 + front)).toFixed(3)})`);
              halo.addColorStop(1, "rgba(199, 210, 254, 0)");
              ctx.fillStyle = halo;
              ctx.fillRect(o.x - 9 * o.p, o.y - 9 * o.p, 18 * o.p, 18 * o.p);
            }
            ctx.fillStyle = head
              ? `rgba(238, 242, 255, ${(0.5 + front * 0.5).toFixed(3)})`
              : lit
                ? `rgba(${RGB.indigo}, ${(0.2 + front * 0.6).toFixed(3)})`
                : `rgba(${RGB.silver}, ${(0.05 + front * 0.12).toFixed(3)})`;
            ctx.fillRect(o.x - size / 2, o.y - size / 2, size, size);
          }
        }

        // Pre-claim verification sweep: a bright arc travelling around the inner ring.
        if (ring.sweep) {
          const start = time * 1.1;
          const span = 0.9;
          const steps = 18;
          ctx.lineCap = "round";
          for (let k = 0; k < steps; k++) {
            const t0 = start + (k / steps) * span;
            const t1 = start + ((k + 1) / steps) * span;
            const a = project(ringPoint(ring, phase + t0, rv), sweepFrom);
            const b = project(ringPoint(ring, phase + t1, rv), o);
            if (a.z >= 0 !== frontPass) continue;
            const front = (a.z / ring.radius + 1) / 2;
            ctx.strokeStyle = `rgba(199, 210, 254, ${((k / steps) * (0.3 + front * 0.6)).toFixed(3)})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
          ctx.lineCap = "butt";
        }
      });
    };

    // Back halves → core → front halves, so the core sits inside the gyroscope.
    strokeRings(false);
    drawRingDetails(false);

    const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * CORE_RADIUS * 1.8);
    coreGlow.addColorStop(0, "rgba(199, 210, 254, 0.35)");
    coreGlow.addColorStop(1, "rgba(129, 140, 248, 0)");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    const coreSpin = -time * 0.45;
    const corePoint: Projected = { x: 0, y: 0, z: 0, p: 1 };
    for (const v of s.core) {
      rotateYX(v, coreSpin, 0.6, rv);
      const front = (rv[2] + 1) / 2;
      rv[0] *= CORE_RADIUS;
      rv[1] *= CORE_RADIUS;
      rv[2] *= CORE_RADIUS;
      project(rv, corePoint);
      ctx.fillStyle = `rgba(${front > 0.6 ? "238, 242, 255" : RGB.indigo}, ${(0.12 + front * 0.75).toFixed(3)})`;
      const size = (0.7 + front * 1.1) * corePoint.p;
      ctx.fillRect(corePoint.x - size / 2, corePoint.y - size / 2, size, size);
    }

    strokeRings(true);
    drawRingDetails(true);
  });

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Veri çekirdeği etrafında farklı eksenlerde dönen, denetim kayıtlarını temsil eden konsantrik koruma halkaları"
      className={`block h-full w-full ${className}`}
    />
  );
}
