"use client";

import { useRef } from "react";
import { useCanvasLoop, type CanvasFrame } from "@/lib/useCanvasLoop";

// PharmaDeux hero scene: a transparent glass capsule turning slowly in 3D. Its granules drift out,
// calmly, toward three metabolic telemetry nodes rendered as plain HTML cards (crisp type, readable
// by assistive tech). The canvas only draws the capsule and the particle paths; it measures where
// the cards sit so the particles always land on their edges. Values are illustrative.

type V3 = [number, number, number];

type Telemetry = {
  code: string;
  label: string;
  value: string;
  status: string;
  /** Fill of the hairline meter, 0–1. */
  level: number;
  /** Card placement inside the square stage. */
  position: string;
  /** Which edge of the card particles arrive at. */
  edge: "bottom" | "left";
};

const TELEMETRY: Telemetry[] = [
  {
    code: "P06",
    label: "Hepatik klirens",
    value: "%12",
    status: "Stabil",
    level: 0.12,
    position: "left-0 top-[2%]",
    edge: "bottom",
  },
  {
    code: "P07",
    label: "QTc (Fridericia)",
    value: "410 ms",
    status: "Tisdale: düşük risk",
    level: 0.4,
    position: "right-0 top-[24%] sm:top-[17%]",
    edge: "left",
  },
  {
    code: "P05",
    label: "eGFR · nefrotoksik yük",
    value: "Normal",
    status: "Kümülatif eşik altında",
    level: 0.34,
    position: "right-0 bottom-[9%] sm:bottom-[7%]",
    edge: "left",
  },
];

const PHARMA = "79, 193, 182";
const GLASS = "220, 235, 248";
const GRANULES = 140;

type Granule = { u: number; rho: number; phi: number; speed: number; size: number };
type Release = { node: number; t: number; speed: number; from: [number, number]; ctrl: [number, number] };

function hash(i: number) {
  const s = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return s - Math.floor(s);
}

const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

export default function PharmaCapsule() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const state = useRef({
    granules: Array.from({ length: GRANULES }, (_, i): Granule => ({
      u: hash(i) * 2 - 1,
      rho: Math.sqrt(hash(i + 500)) * 0.82,
      phi: hash(i + 1000) * Math.PI * 2,
      speed: (0.12 + hash(i + 1500) * 0.28) * (hash(i + 2000) < 0.5 ? -1 : 1),
      size: 0.9 + hash(i + 2500) * 1.2,
    })),
    yaw: 0,
    roll: 0,
    releases: [] as Release[],
    spawnIn: 0.8,
    nextNode: 0,
  });

  useCanvasLoop(canvasRef, ({ ctx, width, height, time, dt, pointer }: CanvasFrame) => {
    const s = state.current;
    const S = Math.min(width, height);
    const stage = stageRef.current;
    if (S <= 0 || !stage) return;

    // Where each telemetry card's arrival edge sits, in canvas coordinates.
    const stageRect = stage.getBoundingClientRect();
    const anchors = TELEMETRY.map((node, k): [number, number] | null => {
      const el = nodeRefs.current[k];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const x = r.left - stageRect.left;
      const y = r.top - stageRect.top;
      return node.edge === "bottom" ? [x + r.width * 0.5, y + r.height] : [x, y + r.height * 0.5];
    });

    // ── Capsule pose ────────────────────────────────────────────────────────
    const ease = Math.min(1, dt * 2.5);
    s.yaw += ((pointer.active ? pointer.x * 0.3 : 0) - s.yaw) * ease;
    s.roll += ((pointer.active ? pointer.y * 0.08 : 0) - s.roll) * ease;
    const yaw = 0.55 * Math.sin(time * 0.26) + s.yaw;
    const roll = -0.42 + 0.05 * Math.sin(time * 0.19) + s.roll;
    const axis: V3 = [Math.cos(yaw) * Math.cos(roll), Math.cos(yaw) * Math.sin(roll), -Math.sin(yaw)];
    let e1 = cross(axis, [0, 0, 1]);
    if (Math.hypot(...e1) < 1e-3) e1 = [0, 1, 0];
    e1 = norm(e1);
    const e2 = norm(cross(axis, e1));

    const cx = width * 0.4;
    const cy = height * 0.58;
    const L = S * 0.14;
    const r = S * 0.08;
    const D = S * 2.4;
    const project = (x: number, y: number, z: number) => {
      const p = D / (D - z);
      return { x: cx + x * p, y: cy + y * p, p };
    };

    const P1 = project(-axis[0] * L, -axis[1] * L, -axis[2] * L);
    const P2 = project(axis[0] * L, axis[1] * L, axis[2] * L);
    const r1 = r * P1.p;
    const r2 = r * P2.p;
    let dx = P2.x - P1.x;
    let dy = P2.y - P1.y;
    const dl = Math.hypot(dx, dy);
    if (dl < 1e-3) {
      dx = 1;
      dy = 0;
    } else {
      dx /= dl;
      dy /= dl;
    }
    const theta = Math.atan2(dy, dx);
    const nx = -dy;
    const ny = dx;
    const mx = (P1.x + P2.x) / 2;
    const my = (P1.y + P2.y) / 2;

    const stadium = new Path2D();
    stadium.arc(P1.x, P1.y, r1, theta + Math.PI / 2, theta + (3 * Math.PI) / 2);
    stadium.arc(P2.x, P2.y, r2, theta - Math.PI / 2, theta + Math.PI / 2);
    stadium.closePath();

    const nearestEnd = (tx: number, ty: number) => {
      const d1 = (P1.x - tx) ** 2 + (P1.y - ty) ** 2;
      const d2 = (P2.x - tx) ** 2 + (P2.y - ty) ** 2;
      return d1 < d2
        ? { x: P1.x - dx * r1 * 0.8, y: P1.y - dy * r1 * 0.8 }
        : { x: P2.x + dx * r2 * 0.8, y: P2.y + dy * r2 * 0.8 };
    };

    // ── Hairline paths to the telemetry nodes ───────────────────────────────
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    anchors.forEach((anchor) => {
      if (!anchor) return;
      const from = nearestEnd(anchor[0], anchor[1]);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo((from.x + anchor[0]) / 2, Math.min(from.y, anchor[1]) - S * 0.03, anchor[0], anchor[1]);
      ctx.stroke();
    });

    // ── Calm, precise particle flow ─────────────────────────────────────────
    s.spawnIn -= dt;
    if (s.spawnIn <= 0 && dt > 0) {
      const node = s.nextNode;
      s.nextNode = (s.nextNode + 1) % TELEMETRY.length;
      const anchor = anchors[node];
      if (anchor) {
        const from = nearestEnd(anchor[0], anchor[1]);
        s.releases.push({
          node,
          t: 0,
          speed: 0.22 + Math.random() * 0.05,
          from: [from.x, from.y],
          ctrl: [(from.x + anchor[0]) / 2, Math.min(from.y, anchor[1]) - S * 0.03],
        });
      }
      s.spawnIn = 0.9 + Math.random() * 0.5;
    }

    s.releases = s.releases.filter((rel) => {
      rel.t += dt * rel.speed;
      const anchor = anchors[rel.node];
      if (rel.t >= 1 || !anchor) return false;
      const t = rel.t;
      const u = 1 - t;
      const x = u * u * rel.from[0] + 2 * u * t * rel.ctrl[0] + t * t * anchor[0];
      const y = u * u * rel.from[1] + 2 * u * t * rel.ctrl[1] + t * t * anchor[1];
      // Fade in leaving the capsule, fade out arriving at the card.
      const a = Math.sin(t * Math.PI) * 0.85;
      ctx.fillStyle = `rgba(${PHARMA}, ${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    // ── Capsule: granules first, then the glass layers over them ───────────
    ctx.save();
    ctx.clip(stadium);
    for (const g of s.granules) {
      const u = g.u * (L + r) * 0.92;
      const over = Math.abs(u) - L;
      const radial = over > 0 ? Math.sqrt(Math.max(0, r * r - over * over)) : r;
      const rho = g.rho * radial;
      const phi = g.phi + time * g.speed;
      const c = Math.cos(phi) * rho;
      const sn = Math.sin(phi) * rho;
      const x = axis[0] * u + e1[0] * c + e2[0] * sn;
      const y = axis[1] * u + e1[1] * c + e2[1] * sn;
      const z = axis[2] * u + e1[2] * c + e2[2] * sn;
      const p = project(x, y, z);
      const front = Math.max(0, Math.min(1, (z / r + 1) / 2));
      ctx.fillStyle =
        g.u < 0
          ? `rgba(${PHARMA}, ${(0.35 + front * 0.5).toFixed(3)})`
          : `rgba(${GLASS}, ${(0.22 + front * 0.45).toFixed(3)})`;
      const size = g.size * p.p;
      ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    }

    // Axial tint: the cap half is clinical teal, the body half is clear glass.
    const axial = ctx.createLinearGradient(P1.x - dx * r1, P1.y - dy * r1, P2.x + dx * r2, P2.y + dy * r2);
    axial.addColorStop(0, `rgba(${PHARMA}, 0.26)`);
    axial.addColorStop(0.5, `rgba(${PHARMA}, 0.18)`);
    axial.addColorStop(0.5, `rgba(${GLASS}, 0.05)`);
    axial.addColorStop(1, `rgba(${GLASS}, 0.07)`);
    ctx.fillStyle = axial;
    ctx.fill(stadium);

    // Fresnel: glass brightens toward its silhouette edges.
    const R = Math.max(r1, r2);
    const fresnel = ctx.createLinearGradient(mx - nx * R, my - ny * R, mx + nx * R, my + ny * R);
    fresnel.addColorStop(0, `rgba(${GLASS}, 0.26)`);
    fresnel.addColorStop(0.2, `rgba(${GLASS}, 0.04)`);
    fresnel.addColorStop(0.5, `rgba(${GLASS}, 0)`);
    fresnel.addColorStop(0.8, `rgba(${GLASS}, 0.04)`);
    fresnel.addColorStop(1, `rgba(${GLASS}, 0.2)`);
    ctx.fillStyle = fresnel;
    ctx.fill(stadium);

    // Specular streak running along the body.
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.26)";
    ctx.lineWidth = r * 0.15;
    ctx.beginPath();
    ctx.moveTo(P1.x + dx * r1 * 0.1 - nx * r * 0.55, P1.y + dy * r1 * 0.1 - ny * r * 0.55);
    ctx.lineTo(P2.x - dx * r2 * 0.5 - nx * r * 0.55, P2.y - dy * r2 * 0.5 - ny * r * 0.55);
    ctx.stroke();
    ctx.lineCap = "butt";
    ctx.restore();

    // Rim and the seam between the two halves (a circle seen at an angle → ellipse).
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = `rgba(${GLASS}, 0.5)`;
    ctx.stroke(stadium);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${GLASS}, 0.36)`;
    ctx.beginPath();
    ctx.ellipse(mx, my, Math.max(0.5, r * Math.abs(axis[2])), r * ((P1.p + P2.p) / 2), theta, 0, Math.PI * 2);
    ctx.stroke();
  });

  return (
    <div ref={stageRef} className="relative h-full w-full">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 block h-full w-full" />
      <ul aria-label="Örnek metabolik telemetri" className="contents">
        {TELEMETRY.map((node, k) => (
          <li
            key={node.code}
            ref={(el) => {
              nodeRefs.current[k] = el;
            }}
            className={`absolute ${node.position} w-[140px] rounded-2xl border border-white/[0.08] bg-navy-850 px-3.5 py-3 sm:w-[172px]`}
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-[0.01em] text-pharma">{node.code}</span>
              <span className="mt-1.5 text-[12px] leading-tight text-white/60">{node.label}</span>
              <span className="mt-0.5 text-[19px] font-semibold tracking-[-0.01em] text-white font-mono tabular-nums sm:text-[21px]">
                {node.value}
              </span>
              <span className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                <span className="block h-full rounded-full bg-pharma/70" style={{ width: `${node.level * 100}%` }} />
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-[11px] leading-tight text-white/50">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" aria-hidden="true" />
                {node.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="absolute bottom-0 left-0 text-[10.5px] text-white/35">Örnek telemetri · hasta verisi değildir</p>
    </div>
  );
}
