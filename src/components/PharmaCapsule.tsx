"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useCanvasLoop, type CanvasFrame } from "@/lib/useCanvasLoop";
import {
  CLINICAL_CASES,
  EGFR_OPTIONS,
  buildCustomCase,
  type CustomParams,
  type Reading,
  type Tone,
} from "@/lib/clinicalCases";
import Link from "next/link";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import CopyPayloadButton from "@/components/CopyPayloadButton";
import { caseToFhirBundle } from "@/lib/fhirPayload";
import { useClientValue } from "@/lib/useClientValue";

// PharmaDeux hero scene: a Chinese-red-and-porcelain capsule turning slowly in 3D. Its granules drift out,
// calmly, toward three telemetry cards (liver ALT, QTc, renal eGFR) rendered as plain HTML. Below
// the stage, three example cases can be selected, or one patient's eGFR and antibiotic can be
// changed ("customise"); the cards update their readings with a 150ms
// transition and only the card concerned changes state. The canvas draws the capsule and the
// particle paths and measures where the cards sit so particles land on their edges.
// A case can be opened from outside: `?case=polypharmacy|renal|qtc` (or 1–3) and `#vaka-1…3` on load, or the
// `pharmadeux:case` window event while the page is open. A mono simulation stamp and a
// "copy as FHIR JSON" button sit under the case details.

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
    standard: "Standart",
    standards: {
      "/standartlar/kumulatif-organ-yuku": "Kümülatif organ yükü",
      "/standartlar/ckd-epi-2021": "CKD-EPI 2021 ve renal doz",
      "/standartlar/tisdale-score": "Tisdale QT risk skoru",
    },
    caption: "Örnek vakalar · gerçek hasta verisi değildir · klinik karar için kullanılmaz",
    customize: "Özelleştir",
    customTitle: "Özel vaka: eGFR ve antibiyotik",
    customizeAria: "Vakayı özelleştirin",
    azithromycin: "Azitromisin",
    added: "Ekli",
    removed: "Yok",
    stampCase: "VAKA",
    stampCustom: "ÖZEL",
    stampAria: "Simülasyon damgası",
    copyAria: (label: string) => `${label} verisini FHIR JSON olarak kopyala`,
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
    standard: "Standard",
    standards: {
      "/standartlar/kumulatif-organ-yuku": "Cumulative organ burden",
      "/standartlar/ckd-epi-2021": "CKD-EPI 2021 and renal dosing",
      "/standartlar/tisdale-score": "Tisdale QT risk score",
    },
    caption: "Example cases · not real patient data · not for clinical decisions",
    customize: "Customise",
    customTitle: "Custom case: eGFR and antibiotic",
    customizeAria: "Customise the case",
    azithromycin: "Azithromycin",
    added: "Added",
    removed: "None",
    stampCase: "CASE",
    stampCustom: "CUSTOM",
    stampAria: "Simulation stamp",
    copyAria: (label: string) => `Copy ${label} data as FHIR JSON`,
  },
});

// Semantic tone only on the card concerned: neutral, caution (amber) or high risk (rose).
const toneText: Record<Tone, string> = {
  normal: "text-white/50",
  caution: "text-amber-200",
  high: "text-rose-300",
};
const toneBar: Record<Tone, string> = {
  normal: "bg-white/45",
  caution: "bg-amber-300/80",
  high: "bg-rose-400/80",
};
const toneBorder: Record<Tone, string> = {
  normal: "border-hairline",
  caution: "border-white/[0.14]",
  high: "border-white/[0.14]",
};

// Pharmaceutical capsule: glossy translucent Chinese Red cap (lake red), opaque porcelain-white body.
// The red is the object's own colour and stays inside the shell: granules and the particle flow are
// white ice crystals, so no hue reaches the telemetry cards, where colour means a clinical state.
const CAP = "200, 42, 53";
const BODY = "248, 250, 252";
const ICE = "236, 242, 250";
const FROST = "214, 222, 232";
const GLASS = "222, 228, 236";
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

/**
 * `layout="stage"` (default) is the hero scene: the capsule with the readings around it. `layout="workspace"` is the
 * case review panel used on the editorial product page: no canvas, the case and its readings side by side.
 * Both share the same state, deep links (`?case=…#vakalar`, `#vaka-N`) and the `pharmadeux:case` event.
 */
export default function PharmaCapsule({ locale, layout = "stage" }: { locale: Locale; layout?: "stage" | "workspace" }) {
  const c = copy[locale];
  const cases = CLINICAL_CASES[locale];
  const rootRef = useRef<HTMLDivElement>(null);
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
  const today = useClientValue(() => new Date().toISOString().slice(0, 10), "----------");

  useEffect(() => {
    const open = (n: number, instant = false) => {
      if (!Number.isInteger(n) || n < 1 || n > cases.length) return;
      setCaseIndex(n - 1);
      const reduce = instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rootRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    };
    const param = new URLSearchParams(window.location.search).get("case");
    const fromParam = param ? (/^\d$/.test(param) ? Number(param) : cases.findIndex((k) => k.id === param) + 1) : 0;
    const fromHash = /^#vaka-(\d)$/.exec(window.location.hash);
    const target = fromParam || (fromHash ? Number(fromHash[1]) : 0);
    // Older links sent `?case=…#simulator`, which is the QT simulator further down. The case workspace
    // is `#vakalar`: rewrite the hash in place (no new history entry) and jump straight to the cases.
    const legacy = fromParam > 0 && window.location.hash === "#simulator";
    if (legacy) {
      const { pathname, search } = window.location;
      window.history.replaceState(window.history.state, "", `${pathname}${search}#vakalar`);
    }
    // Deferred a frame: the stage must be laid out before it can be scrolled to.
    const frame = target ? requestAnimationFrame(() => open(target, legacy)) : 0;
    const onCase = (e: Event) => open((e as CustomEvent<number>).detail);
    window.addEventListener("pharmadeux:case", onCase);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pharmadeux:case", onCase);
    };
  }, [cases]);

  const caseRef = caseIndex === null ? "custom" : `case-${caseIndex + 1}`;
  const stamp = [
    "RX-SIM",
    today,
    caseIndex === null ? c.stampCustom : `${c.stampCase}_${String(caseIndex + 1).padStart(2, "0")}`,
  ].join(" · ");
  const caseLabel = caseIndex === null ? c.customize : `${c.case} ${caseIndex + 1}`;
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
      // Speed is random per release, so it doubles as a stable ~50/50 split between two white crystal tones.
      ctx.fillStyle = `rgba(${rel.speed > 0.245 ? FROST : ICE}, ${(a * 0.9).toFixed(3)})`;
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
          ? `rgba(${ICE}, ${(0.35 + front * 0.5).toFixed(3)})`
          : `rgba(${FROST}, ${(0.3 + front * 0.4).toFixed(3)})`;
      const size = g.size * p.p;
      ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    }

    // Axial tint: the cap half is glossy translucent Chinese Red, the body half opaque porcelain white.
    const axial = ctx.createLinearGradient(P1.x - dx * r1, P1.y - dy * r1, P2.x + dx * r2, P2.y + dy * r2);
    axial.addColorStop(0, `rgba(${CAP}, 0.74)`);
    axial.addColorStop(0.5, `rgba(${CAP}, 0.62)`);
    axial.addColorStop(0.5, `rgba(${BODY}, 0.88)`);
    axial.addColorStop(1, `rgba(${BODY}, 0.92)`);
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

  // Case selector. In the stage layout it is a row of three segments under the scene; in the workspace it is
  // the same row on small screens and a column (selection marked on the left edge) next to the case on wide ones.
  const selector = (column: boolean) => (
    <div
      role="radiogroup"
      aria-label={c.chooseCase}
      className={column ? "grid grid-cols-3 border-t border-hairline lg:grid-cols-1 lg:divide-y lg:divide-hairline" : "mt-4 grid grid-cols-3 border-t border-hairline"}
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
            className={`group relative flex flex-col text-left transition-colors duration-150 ease-out hover:bg-white/[0.02] focus-visible:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-white/60 ${
              column ? "min-h-11 px-3 pt-3 pb-2.5 sm:px-4 lg:px-5 lg:py-3.5" : "px-2 pt-3 pb-2 sm:px-3"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 -top-px h-px transition-colors duration-150 ease-out ${
                column ? "lg:inset-x-auto lg:inset-y-0 lg:top-0 lg:left-0 lg:h-auto lg:w-0.5" : ""
              } ${selected ? "bg-white/70" : "bg-transparent"}`}
            />
            <span className="block text-[11px] font-medium tracking-wider text-white/55 uppercase">
              {c.case} <span className="font-mono tabular-nums">{i + 1}</span>
            </span>
            <span
              className={`mt-1 block text-[12.5px] leading-snug transition-colors duration-150 ease-out sm:text-[13px] ${
                selected ? "text-white" : "text-white/55 group-hover:text-white/80"
              } ${column ? "lg:text-[14px]" : ""}`}
            >
              {item.title}
            </span>
            <span className="mt-0.5 hidden text-[11px] text-white/55 sm:block">{item.meta}</span>
          </button>
        );
      })}
    </div>
  );

  // Customisable case: one patient, two parameters. In the workspace it lines up with the selector column.
  const customiser = (column: boolean) => (
    <div
      role="group"
      aria-label={c.customizeAria}
      className={`relative flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline ${column ? "px-3 py-3 sm:px-4 lg:px-5" : "px-2 py-2.5 sm:px-3"}`}
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
        large={column}
        active={caseIndex === null}
        options={EGFR_OPTIONS.map((v) => ({ key: String(v), label: String(v), mono: true }))}
        value={String(params.egfr)}
        onSelect={(key) => customise({ egfr: Number(key) as CustomParams["egfr"] })}
      />
      <Segmented
        label={c.azithromycin}
        large={column}
        active={caseIndex === null}
        options={[
          { key: "on", label: c.added },
          { key: "off", label: c.removed },
        ]}
        value={params.azithromycin ? "on" : "off"}
        onSelect={(key) => customise({ azithromycin: key === "on" })}
      />
    </div>
  );

  // What the engine reports for the selected case.
  const details = (large: boolean) => {
    const row = `grid gap-3 py-2 ${large ? "grid-cols-[72px_1fr] sm:grid-cols-[96px_1fr] sm:py-2.5" : "grid-cols-[64px_1fr]"}`;
    return (
      <dl aria-live="polite" className={`divide-y divide-hairline border-y border-hairline ${large ? "text-[13px] sm:text-[14px]" : "text-[12.5px]"}`}>
        <div className={row}>
          <dt className="text-white/55">{c.patient}</dt>
          <dd className="text-white/75">{active.patient}</dd>
        </div>
        <div className={row}>
          <dt className="text-white/55">{c.prescription}</dt>
          <dd className="text-white/75">{active.prescription}</dd>
        </div>
        <div className={row}>
          <dt className="text-white/55">{c.finding}</dt>
          <dd className={`leading-relaxed ${large ? "text-white" : "text-white/75"}`}>{active.finding}</dd>
        </div>
        {active.tisdale && (
          <div className={row}>
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
        <div className={row}>
          <dt className="text-white/55">{c.standard}</dt>
          <dd>
            <Link href={localizedPath(locale, active.standard)} className="-my-2 inline-block py-2 text-white/80 underline decoration-white/30 underline-offset-2 transition-colors duration-150 ease-out hover:text-white hover:decoration-white/70">
              {c.standards[active.standard]}
            </Link>
          </dd>
        </div>
      </dl>
    );
  };

  const footer = (
    <>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p aria-label={c.stampAria} className="min-w-0 truncate font-mono text-[10.5px] text-white/55 tabular-nums">
          {stamp}
        </p>
        <CopyPayloadButton
          locale={locale}
          ariaLabel={c.copyAria(caseLabel)}
          getPayload={() => caseToFhirBundle(active, caseRef, new Date().toISOString())}
        />
      </div>
      <p className="mt-2 text-[10.5px] text-white/55">
        {c.caption}
      </p>
    </>
  );

  // Workspace: no scene. The case is the subject: selector beside it, its three readings as a row of joined
  // cells, then what the engine reports. The canvas is not rendered, so the animation loop never starts.
  if (layout === "workspace") {
    return (
      <div
        ref={rootRef}
        id="vakalar"
        className="panel-dark scroll-mt-20 overflow-hidden rounded-xl border border-hairline bg-navy-900 text-white [color-scheme:dark]"
      >
        <div className="grid lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          <div className="border-b border-hairline lg:border-r lg:border-b-0">
            <p className="px-3 pt-4 pb-3 text-[11px] font-medium tracking-wider text-white/50 uppercase sm:px-4 lg:px-5">
              {c.chooseCase}
            </p>
            {selector(true)}
            {customiser(true)}
          </div>
          <div className="min-w-0 p-4 sm:p-6">
            <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{caseLabel}</p>
            <p className="mt-1 text-[17px] font-semibold tracking-[-0.01em] text-white sm:text-[19px]">
              {caseIndex === null ? c.customTitle : active.title}
            </p>
            <ul
              aria-label={c.telemetry}
              className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline"
            >
              {TELEMETRY.map((node) => {
                const reading: Reading = active.readings[node.key];
                return (
                  // Three columns at every width: on phones the code sits above the label and the unit wraps under the value.
                  <li key={node.code} className="min-w-0 bg-navy-850 px-2.5 py-3 sm:px-4">
                    <span className="flex flex-col-reverse gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                      <span className="text-[12px] leading-tight text-white/60">{c.nodes[node.key].label}</span>
                      <span className="text-[11px] font-semibold tracking-[0.01em] text-titanium">{node.code}</span>
                    </span>
                    <span className="mt-1 flex flex-wrap items-baseline gap-x-1">
                      <span className="font-mono text-[19px] font-semibold tracking-[-0.01em] text-white tabular-nums sm:text-[21px]">
                        {reading.value}
                      </span>
                      <span className="text-[11px] text-white/55">{c.nodes[node.key].unit}</span>
                    </span>
                    <span className="mt-2 block h-[3px] overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                      <span
                        className={`block h-full rounded-full transition-[width,background-color] duration-150 ease-out ${toneBar[reading.tone]}`}
                        style={{ width: `${Math.min(1, Math.max(0.02, reading.level)) * 100}%` }}
                      />
                    </span>
                    <span className={`mt-2 block text-[11.5px] leading-tight transition-colors duration-150 ease-out sm:text-[12px] ${toneText[reading.tone]}`}>
                      {reading.status}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5">{details(true)}</div>
            {footer}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} id="vakalar" className="w-full scroll-mt-32">
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
                <span className="block text-[11px] font-semibold tracking-[0.01em] text-titanium">{node.code}</span>
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
      {selector(false)}
      {customiser(false)}
      {details(false)}
      {footer}
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
  large = false,
  onSelect,
}: {
  label: string;
  /** 44px touch targets (workspace layout). */
  large?: boolean;
  options: SegmentedOption[];
  value: string;
  active: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className={`text-white/55 ${large ? "text-[13px]" : "text-[11.5px]"}`}>{label}</span>
      <span role="group" aria-label={label} className="flex rounded-md border border-hairline bg-white/[0.03] p-0.5">
        {options.map((o) => {
          const selected = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={active && selected}
              onClick={() => onSelect(o.key)}
              className={`rounded-[5px] text-[11.5px] transition-colors duration-150 ease-out ${large ? "min-h-10 min-w-11 px-3 text-[13px]" : "px-2 py-0.5"} ${
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
