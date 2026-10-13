"use client";

import { useId, useState } from "react";
import { defineContent, type Locale } from "@/i18n/config";

// SUT risk calculator for /standartlar/sut-fatura-denetimi. Rule IDs and weights are the fictional
// example rule set shared with the Shield console and claim simulator; no SUT article numbers.
// Score = min(100, Σ weights of the checked rules); claims at or above the threshold go to review.

type RuleId = "R-002" | "R-156" | "R-310" | "R-088" | "R-112" | "R-047" | "R-203" | "R-019";
type PlaneId = "authority" | "duplicate" | "diagnosis" | "supply";

const THRESHOLD = 40;
const HIGH = 70;

const PLANES: { id: PlaneId; rules: { id: RuleId; weight: number }[] }[] = [
  { id: "authority", rules: [{ id: "R-002", weight: 13 }] },
  {
    id: "duplicate",
    rules: [
      { id: "R-156", weight: 21 },
      { id: "R-310", weight: 29 },
      { id: "R-088", weight: 22 },
    ],
  },
  { id: "diagnosis", rules: [{ id: "R-112", weight: 34 }] },
  {
    id: "supply",
    rules: [
      { id: "R-047", weight: 26 },
      { id: "R-203", weight: 18 },
      { id: "R-019", weight: 10 },
    ],
  },
];
const WEIGHT = Object.fromEntries(PLANES.flatMap((p) => p.rules.map((r) => [r.id, r.weight]))) as Record<RuleId, number>;

// Same example claim as the contribution table on the page: 34 + 26 + 18 = 78.
const DEFAULT: RuleId[] = ["R-112", "R-047", "R-203"];

const copy = defineContent({
  tr: {
    panel: "SUT risk simülatörü · örnek kural seti",
    rules: "Tetiklenen kurallar",
    planes: {
      authority: "1. Branş ve hekim yetkisi",
      duplicate: "2. Mükerrer işlem ve paket aşımı",
      diagnosis: "3. Tanı–işlem tutarlılığı (ICD-10)",
      supply: "4. Tıbbi malzeme, ilaç ve belge koşulları",
    } as Record<PlaneId, string>,
    labels: {
      "R-002": "Hekim branş kodu eksik",
      "R-156": "Aynı gün mükerrer tetkik",
      "R-310": "Paket dışı malzeme kalemi",
      "R-088": "Yatış süresi paket limitini aşıyor",
      "R-112": "Tanı–işlem uyumsuzluğu",
      "R-047": "Ön onay belgesi eksik",
      "R-203": "30 gün içinde tekrar eden işlem",
      "R-019": "Epikriz imzasız",
    } as Record<RuleId, string>,
    score: "Risk skoru",
    points: "puan",
    none: "Kural tetiklenmedi",
    capped: (sum: number) => `Toplam ${sum}; skor 100'de sınırlanır.`,
    threshold: `Eşik ${THRESHOLD}`,
    band: "Risk bandı",
    high: "Yüksek risk",
    review: "İnceleme gerekli",
    low: "Düşük risk",
    queue: "Kuyruk",
    queued: "Uzman inceleme kuyruğuna düşer",
    notQueued: "Kuyruğa düşmez; gönderim akışında kalır",
    reset: "Sıfırla",
    note: "Örnek kural seti üzerinden gösterimdir · kurgusal veri. R- kodları SUT madde numarası değildir. Nihai karar kurum uzmanına aittir.",
  },
  en: {
    panel: "SUT risk simulator · example rule set",
    rules: "Triggered rules",
    planes: {
      authority: "1. Specialty and physician authority",
      duplicate: "2. Duplicate procedures and package overrun",
      diagnosis: "3. Diagnosis–procedure consistency (ICD-10)",
      supply: "4. Medical supply, drug and document conditions",
    } as Record<PlaneId, string>,
    labels: {
      "R-002": "Physician specialty code missing",
      "R-156": "Duplicate test on the same day",
      "R-310": "Out-of-package supply item",
      "R-088": "Length of stay exceeds package limit",
      "R-112": "Diagnosis–procedure mismatch",
      "R-047": "Prior authorisation missing",
      "R-203": "Procedure repeated within 30 days",
      "R-019": "Discharge summary unsigned",
    } as Record<RuleId, string>,
    score: "Risk score",
    points: "points",
    none: "No rule triggered",
    capped: (sum: number) => `Total ${sum}; the score is capped at 100.`,
    threshold: `Threshold ${THRESHOLD}`,
    band: "Risk band",
    high: "High risk",
    review: "Review required",
    low: "Low risk",
    queue: "Queue",
    queued: "Goes to the specialist review queue",
    notQueued: "Not queued; stays in the submission flow",
    reset: "Reset",
    note: "Shown on the example rule set · fictional data. R- codes are not SUT article numbers. The final decision rests with the institution's specialist.",
  },
});

export default function SutRiskCalculator({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const uid = useId();
  const [on, setOn] = useState<Set<RuleId>>(() => new Set(DEFAULT));

  const toggle = (id: RuleId) =>
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const active = PLANES.flatMap((p) => p.rules.map((r) => r.id)).filter((id) => on.has(id));
  const sum = active.reduce((n, id) => n + WEIGHT[id], 0);
  const score = Math.min(100, sum);
  const [band, tone] =
    score >= HIGH ? [c.high, "text-rose-300"] : score >= THRESHOLD ? [c.review, "text-amber-300"] : [c.low, "text-emerald-300"];

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-navy-850">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.panel}</span>
        <button
          type="button"
          onClick={() => setOn(new Set(DEFAULT))}
          className="shrink-0 text-[12px] text-white/55 transition-colors duration-150 ease-out hover:text-white print:hidden"
        >
          {c.reset}
        </button>
      </div>

      <fieldset>
        <legend className="sr-only">{c.rules}</legend>
        {PLANES.map((plane) => (
          <div key={plane.id} className="border-b border-hairline">
            <div className="bg-white/[0.02] px-5 py-2 text-[11.5px] font-medium text-white/70">{c.planes[plane.id]}</div>
            {plane.rules.map((rule) => {
              const id = `${uid}-${rule.id}`;
              const checked = on.has(rule.id);
              return (
                <label
                  key={rule.id}
                  htmlFor={id}
                  className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-hairline px-5 py-2.5 text-[12.5px] transition-colors duration-150 ease-out hover:bg-white/[0.03]"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(rule.id)}
                    className="size-3.5 cursor-pointer accent-white"
                  />
                  <span className="min-w-0">
                    <span className="mr-2 font-mono text-[12px] text-white/55">{rule.id}</span>
                    <span className={checked ? "text-white" : "text-white/60"}>{c.labels[rule.id]}</span>
                  </span>
                  <span className={`font-mono tabular-nums ${checked ? "text-white" : "text-white/55"}`}>+{rule.weight}</span>
                </label>
              );
            })}
          </div>
        ))}
      </fieldset>

      <div aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4">
          <span className="text-[12px] text-white/55">{c.score}</span>
          <span className={`font-mono text-[26px] font-medium tabular-nums ${tone}`}>
            {score}
            <span className="ml-1.5 font-sans text-[12.5px] font-normal text-white/55">/ 100 {c.points}</span>
          </span>
        </div>
        <div className="px-5 pb-4">
          {/* Neutral data bar; ticks mark the review threshold and the high-risk band. */}
          <div className="relative h-1.5 rounded-full bg-white/[0.08]">
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/45 transition-[width] duration-150 ease-out" style={{ width: `${score}%` }} />
            <div className="absolute -inset-y-1 w-px bg-white/70" style={{ left: `${THRESHOLD}%` }} aria-hidden />
            <div className="absolute -inset-y-1 w-px bg-white/30" style={{ left: `${HIGH}%` }} aria-hidden />
          </div>
          <div className="relative mt-1.5 h-4 font-mono text-[11px] text-white/55 tabular-nums">
            <span className="absolute left-0">0</span>
            <span className="absolute -translate-x-1/2" style={{ left: `${THRESHOLD}%` }}>
              {THRESHOLD}
            </span>
            <span className="absolute -translate-x-1/2" style={{ left: `${HIGH}%` }}>
              {HIGH}
            </span>
            <span className="absolute right-0">100</span>
          </div>
          <div className="mt-2 font-mono text-[11.5px] break-words text-white/55 tabular-nums">
            {active.length === 0 ? c.none : `${active.map((id) => WEIGHT[id]).join(" + ")} = ${sum}`}
            {sum > 100 && <span className="block font-sans">{c.capped(sum)}</span>}
          </div>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-3 border-t border-hairline px-5 py-3 text-[12.5px]">
          <span className="text-white/55">{c.band}</span>
          <span className={`min-w-0 ${tone}`}>{band}</span>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-3 border-t border-hairline px-5 py-3 text-[12.5px]">
          <span className="text-white/55">{c.queue}</span>
          <span className="min-w-0 text-white/75">
            {score >= THRESHOLD ? c.queued : c.notQueued}
            <span className="ml-2 font-mono text-white/55 tabular-nums">· {c.threshold}</span>
          </span>
        </div>
      </div>
      <div className="border-t border-hairline px-5 py-3 text-[11px] leading-relaxed text-white/55">{c.note}</div>
    </div>
  );
}
