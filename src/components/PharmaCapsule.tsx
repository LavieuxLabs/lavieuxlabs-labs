"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useCanvasLoop, type CanvasFrame } from "@/lib/useCanvasLoop";
import {
  CLINICAL_CASES,
  EGFR_OPTIONS,
  buildCustomCase,
  type CustomParams,
  type Reading,
  type Tone,
} from "@/lib/clinicalCases";
import { defineContent, type Locale } from "@/i18n/config";

// PharmaDeux hero scene: a transparent glass capsule turning slowly in 3D. Its granules drift out,
// calmly, toward three telemetry cards (liver ALT, QTc, renal eGFR) rendered as plain HTML. Below
// the stage, three example cases can be selected, or one patient's eGFR and antibiotic can be
// changed ("customise"); the cards update their readings with a 150ms
// transition and only the card concerned changes state. The canvas draws the capsule and the
// particle paths and measures where the cards sit so particles land on their edges.

type V3 = [number, number, number];

type NodeKey = "liver" | "qtc" | "renal";

type TelemetryNode = {
  key: NodeKey;
  code: string;
  /** Card placement inside the stage. */
  position: string;
  /** Which edge of the card particles arrive at. */
  edge: "bottom" | "left";
};

const TELEMETRY: TelemetryNode[] = [
  { key: "liver", code: "P06", position: "left-0 top-[2%]", edge: "bottom" },
  { key: "qtc", code: "P07", position: "right-0 top-[24%] sm:top-[17%]", edge: "left" },
  { key: "renal", code: "P05", position: "right-0 bottom-[9%] sm:bottom-[7%]", edge: "left" },
];

const copy = defineContent({
  tr: {
    nodes: {
      liver: { label: "Karaciğer · ALT", unit: "U/L" },
      qtc: { label: "QTc (Fridericia)", unit: "ms" },
      renal: { label: "Böbrek · eGFR", unit: "mL/dk/1,73 m²" },
    },
    telemetry: "Örnek vaka telemetrisi",
    chooseCase: "Örnek vaka seçin",
    case: "Vaka",
    patient: "Hasta",
    prescription: "Reçete",
    finding: "Bulgu",
    caption: "Örnek vakalar · gerçek hasta verisi değildir · klinik karar için kullanılmaz",
    customize: "Özelleştir",
    customizeAria: "Vakayı özelleştirin",
    azithromycin: "Azitromisin",
    added: "Ekli",
    removed: "Yok",
  },
  en: {
    nodes: {
      liver: { label: "Liver · ALT", unit: "U/L" },
      qtc: { label: "QTc (Fridericia)", unit: "ms" },
      renal: { label: "Kidney · eGFR", unit: "mL/min/1.73 m²" },
    },
    telemetry: "Example case telemetry",
    chooseCase: "Choose an example case",
    case: "Case",
    patient: "Patient",
    prescription: "Order",
    finding: "Finding",
    caption: "Example cases · not real patient data · not for clinical decisions",
    customize: "Customise",
    customizeAria: "Customise the case",
    azithromycin: "Azithromycin",
    added: "Added",
    removed: "None",
  },
});

// Semantic tone only on the card concerned: neutral, caution (amber) or high risk (rose).
const toneText: Record<Tone, string> = {
  normal: "text-white/50",
  caution: "text-amber-200",
  high: "text-rose-300",
};
const toneBar: Record<Tone, string> = {
  normal: "bg-pharma/70",
  caution: "bg-amber-300/80",
  high: "bg-rose-400/80",
};
const toneBorder: Record<Tone, string> = {
  normal: "border-white/[0.06]",
  caution: "border-white/[0.14]",
  high: "border-white/[0.14]",
};

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

export default function PharmaCapsule({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const cases = CLINICAL_CASES[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  // null = the customisable case is active.
  const [caseIndex, setCaseIndex] = useState<number | null>(0);
  const [params, setParams] = useState<CustomParams>({ egfr: 90, azithromycin: true });
  const active = caseIndex === null ? buildCustomCase(locale, params) : cases[caseIndex];
  const customise = (next: Partial<CustomParams>) => {
    setParams((p) => ({ ...p, ...next }));
    setCaseIndex(null);
  };
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

  const onCaseKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = cases.length - 1;
    const current = caseIndex ?? 0;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? current === last
          ? 0
          : current + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? current === 0
            ? last
            : current - 1
          : null;
    if (next === null) return;
    e.preventDefault();
    setCaseIndex(next);
    document.getElementById(`case-${cases[next].id}`)?.focus();
  };

  return (
    <div className="w-full">
      <div ref={stageRef} className="relative aspect-[4/5] w-full sm:aspect-square">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block h-full w-full"
        />
        <ul aria-label={c.telemetry} className="contents">
          {TELEMETRY.map((node, k) => {
            const reading: Reading = active.readings[node.key];
            return (
              <li
                key={node.code}
                ref={(el) => {
                  nodeRefs.current[k] = el;
                }}
                className={`absolute ${node.position} w-[148px] rounded-2xl border bg-navy-850 px-3.5 py-3 transition-colors duration-150 ease-out sm:w-[176px] ${toneBorder[reading.tone]}`}
              >
                <span className="block text-[11px] font-semibold tracking-[0.01em] text-pharma">{node.code}</span>
                <span className="mt-1.5 block text-[12px] leading-tight text-white/60">{c.nodes[node.key].label}</span>
                <span className="mt-0.5 flex flex-wrap items-baseline gap-x-1">
                  <span className="font-mono text-[19px] font-semibold tracking-[-0.01em] text-white tabular-nums sm:text-[21px]">
                    {reading.value}
                  </span>
                  <span className="text-[11px] text-white/55">{c.nodes[node.key].unit}</span>
                </span>
                <span className="mt-2.5 block h-[3px] overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                  <span
                    className={`block h-full rounded-full transition-[width,background-color] duration-150 ease-out ${toneBar[reading.tone]}`}
                    style={{ width: `${Math.min(1, Math.max(0.02, reading.level)) * 100}%` }}
                  />
                </span>
                <span
                  className={`mt-2 block text-[11px] leading-tight transition-colors duration-150 ease-out ${toneText[reading.tone]}`}
                >
                  {reading.status}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Case selector: frameless segments on a hairline */}
      <div
        role="radiogroup"
        aria-label={c.chooseCase}
        className="mt-4 grid grid-cols-3 border-t border-white/[0.06]"
      >
        {cases.map((item, i) => {
          const selected = i === caseIndex;
          return (
            <button
              key={item.id}
              id={`case-${item.id}`}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (caseIndex === null && i === 0) ? 0 : -1}
              onClick={() => setCaseIndex(i)}
              onKeyDown={onCaseKey}
              className="group relative flex flex-col px-2 pt-3 pb-2 text-left transition-colors duration-150 ease-out hover:bg-white/[0.02] focus-visible:bg-white/[0.04] focus-visible:outline-none sm:px-3"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -top-px h-px transition-colors duration-150 ease-out ${
                  selected ? "bg-white/70" : "bg-transparent"
                }`}
              />
              <span className="block text-[11px] font-medium tracking-wider text-white/55 uppercase">
                {c.case} <span className="font-mono tabular-nums">{i + 1}</span>
              </span>
              <span
                className={`mt-1 block text-[12.5px] leading-snug transition-colors duration-150 ease-out sm:text-[13px] ${
                  selected ? "text-white" : "text-white/55 group-hover:text-white/80"
                }`}
              >
                {item.title}
              </span>
              <span className="mt-0.5 hidden text-[11px] text-white/55 sm:block">{item.meta}</span>
            </button>
          );
        })}
      </div>

      {/* Customisable case: one patient, two parameters */}
      <div
        role="group"
        aria-label={c.customizeAria}
        className="relative flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] px-2 py-2.5 sm:px-3"
      >
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 -top-px h-px transition-colors duration-150 ease-out ${
            caseIndex === null ? "bg-white/70" : "bg-transparent"
          }`}
        />
        <span
          className={`text-[11px] font-medium tracking-wider uppercase transition-colors duration-150 ease-out ${
            caseIndex === null ? "text-white" : "text-white/55"
          }`}
        >
          {c.customize}
        </span>
        <Segmented
          label="eGFR"
          active={caseIndex === null}
          options={EGFR_OPTIONS.map((v) => ({ key: String(v), label: String(v), mono: true }))}
          value={String(params.egfr)}
          onSelect={(key) => customise({ egfr: Number(key) as CustomParams["egfr"] })}
        />
        <Segmented
          label={c.azithromycin}
          active={caseIndex === null}
          options={[
            { key: "on", label: c.added },
            { key: "off", label: c.removed },
          ]}
          value={params.azithromycin ? "on" : "off"}
          onSelect={(key) => customise({ azithromycin: key === "on" })}
        />
      </div>

      {/* What the engine reports for the selected case */}
      <dl aria-live="polite" className="divide-y divide-white/[0.06] border-y border-white/[0.06] text-[12.5px]">
        <div className="grid grid-cols-[64px_1fr] gap-3 py-2">
          <dt className="text-white/55">{c.patient}</dt>
          <dd className="text-white/75">{active.patient}</dd>
        </div>
        <div className="grid grid-cols-[64px_1fr] gap-3 py-2">
          <dt className="text-white/55">{c.prescription}</dt>
          <dd className="text-white/75">{active.prescription}</dd>
        </div>
        <div className="grid grid-cols-[64px_1fr] gap-3 py-2">
          <dt className="text-white/55">{c.finding}</dt>
          <dd className="leading-relaxed text-white/75">{active.finding}</dd>
        </div>
        {active.tisdale && (
          <div className="grid grid-cols-[64px_1fr] gap-3 py-2">
            <dt className="text-white/55">Tisdale</dt>
            <dd className="flex flex-wrap gap-x-3 gap-y-1 text-white/60">
              {active.tisdale.map((t) => (
                <span key={t.factor}>
                  {t.factor} <span className="font-mono text-white/80 tabular-nums">+{t.points}</span>
                </span>
              ))}
              <span>
                ={" "}
                <span className="font-mono text-white tabular-nums">
                  {active.tisdale.reduce((n, t) => n + t.points, 0)}
                </span>
              </span>
            </dd>
          </div>
        )}
      </dl>
      <p className="mt-2 text-[10.5px] text-white/55">
        {c.caption}
      </p>
    </div>
  );
}

type SegmentedOption = { key: string; label: string; mono?: boolean };

/** Small segmented control. `active` is false while a preset case is shown, so the stored choice reads as muted. */
function Segmented({
  label,
  options,
  value,
  active,
  onSelect,
}: {
  label: string;
  options: SegmentedOption[];
  value: string;
  active: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-[11.5px] text-white/55">{label}</span>
      <span role="group" aria-label={label} className="flex rounded-md border border-white/[0.06] bg-white/[0.03] p-0.5">
        {options.map((o) => {
          const selected = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={active && selected}
              onClick={() => onSelect(o.key)}
              className={`rounded-[5px] px-2 py-0.5 text-[11.5px] transition-colors duration-150 ease-out ${
                o.mono ? "font-mono tabular-nums" : ""
              } ${
                selected
                  ? active
                    ? "bg-white/[0.1] text-white"
                    : "bg-white/[0.04] text-white/70"
                  : "text-white/55 hover:text-white"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </span>
    </span>
  );
}
