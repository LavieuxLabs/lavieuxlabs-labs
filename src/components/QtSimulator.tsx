"use client";

import { useEffect, useId } from "react";
import { BASELINE_QTC, DRUGS, tisdale, type Baseline, type Patient } from "@/lib/qtSimulator";
import { qtFromSearch, qtToUrl, setQtState, useQtState, type QtState } from "@/lib/qtStore";
import ShareLinkButton from "@/components/ShareLinkButton";
import Cite from "@/components/Cite";
import { defineContent, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    panel: "QT risk simülatörü",
    shareAria: "Bu vakanın parametrelerini içeren bağlantıyı kopyala",
    drugA: "İlaç 1",
    drugB: "İlaç 2",
    qtTag: "QT uzatıcı",
    patient: "Örnek hasta",
    baseline: "Ölçülen QTc (Fridericia)",
    toggles: { age68: "Yaş ≥68", female: "Kadın", loopDiuretic: "Loop diüretik", lowK: "K⁺ ≤3,5 mmol/L" },
    factors: {
      age: "Yaş ≥68",
      female: "Kadın",
      loop: "Loop diüretik",
      lowK: "K⁺ ≤3,5 mmol/L",
      qtc450: "QTc ≥450 ms",
      oneDrug: "QT uzatan ilaç",
      twoDrugs: "≥2 QT uzatan ilaç",
    } as Record<string, string>,
    score: "Tisdale skoru",
    points: "puan",
    tiers: { low: "düşük risk", moderate: "orta risk", high: "yüksek risk" },
    rule: "Tetiklenen kural",
    rules: {
      two: "İki ilacın ürün bilgisinde QT uzaması var; etkiler toplanabilir (farmakodinamik etkileşim).",
      one: "Reçetede bir QT uzatan ilaç var; Tisdale skoruna 3 puan ekler.",
      none: "Seçilen ilaçların ürün bilgisinde QT uzaması yok; ilaç kaynaklı puan eklenmez.",
    },
    advice: {
      high: "EKG izlemi ve QT uzatmayan bir alternatifin değerlendirilmesi önerilir.",
      moderate: "EKG izlemi ve elektrolit kontrolü önerilir.",
      low: "Ek QT önlemi gerekmez; rutin izlem sürer.",
    },
    note: "Örnek hasta · kurgusal veri · klinik karar için kullanılmaz. Model QTc'deki değişimi ms olarak tahmin etmez; ölçülen QTc'yi ve risk faktörlerini Tisdale skoruna (0–21) dönüştürür. Bu hastada akut MI, sepsis ve kalp yetmezliği yok.",
  },
  en: {
    panel: "QT risk simulator",
    shareAria: "Copy a link with this case's parameters",
    drugA: "Drug 1",
    drugB: "Drug 2",
    qtTag: "QT-prolonging",
    patient: "Example patient",
    baseline: "Measured QTc (Fridericia)",
    toggles: { age68: "Age ≥68", female: "Female", loopDiuretic: "Loop diuretic", lowK: "K⁺ ≤3.5 mmol/L" },
    factors: {
      age: "Age ≥68",
      female: "Female",
      loop: "Loop diuretic",
      lowK: "K⁺ ≤3.5 mmol/L",
      qtc450: "QTc ≥450 ms",
      oneDrug: "QT-prolonging drug",
      twoDrugs: "≥2 QT-prolonging drugs",
    } as Record<string, string>,
    score: "Tisdale score",
    points: "points",
    tiers: { low: "low risk", moderate: "moderate risk", high: "high risk" },
    rule: "Rule triggered",
    rules: {
      two: "Both drugs list QT prolongation in their product information; the effects can add up (pharmacodynamic interaction).",
      one: "The order contains one QT-prolonging drug; it adds 3 points to the Tisdale score.",
      none: "Neither drug lists QT prolongation in its product information; no drug points are added.",
    },
    advice: {
      high: "ECG monitoring and a non-QT-prolonging alternative should be considered.",
      moderate: "ECG monitoring and an electrolyte check are advised.",
      low: "No extra QT measure needed; routine monitoring continues.",
    },
    note: "Example patient · fictional data · not for clinical decisions. The model does not predict a QTc change in ms; it turns the measured QTc and the risk factors into the Tisdale score (0–21). This patient has no acute MI, sepsis or heart failure.",
  },
});

// Clinical state colours only: rose high, amber moderate, emerald low.
const tierText = { low: "text-emerald-300", moderate: "text-amber-300", high: "text-rose-300" } as const;
const tierBar = { low: "bg-emerald-400/70", moderate: "bg-amber-400/70", high: "bg-rose-400/70" } as const;

const selectClass =
  "w-full rounded-md border border-hairline bg-navy-900 px-2.5 py-2 text-[13px] text-white transition-colors duration-150 ease-out focus:border-white/30 focus:outline-none";

export default function QtSimulator({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const uid = useId();
  const qt = useQtState();
  const { drug1: aId, drug2: bId, patient } = qt;
  // Every change is written to the shared store (read by the FHIR preview) and mirrored to the URL.
  const commit = (next: QtState) => {
    setQtState(next);
    window.history.replaceState(window.history.state, "", qtToUrl(next, window.location.href));
  };
  const setA = (drug1: string) => commit({ ...qt, drug1 });
  const setB = (drug2: string) => commit({ ...qt, drug2 });
  const setPatient = (update: (p: Patient) => Patient) => commit({ ...qt, patient: update(qt.patient) });

  // A shared link (?drug1=…&drug2=…&qtc=…&risk=…) opens the simulator with those parameters.
  useEffect(() => {
    const shared = qtFromSearch(window.location.search);
    if (shared) setQtState(shared);
  }, []);

  const a = DRUGS.find((d) => d.id === aId)!;
  const b = DRUGS.find((d) => d.id === bId)!;
  const r = tisdale(patient, a, b);
  const rule = r.qtDrugs >= 2 ? c.rules.two : r.qtDrugs === 1 ? c.rules.one : c.rules.none;

  const drugSelect = (label: string, value: string, other: string, onChange: (v: string) => void, id: string) => (
    <label htmlFor={id} className="block">
      <span className="text-[11.5px] text-white/55">{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`mt-1.5 ${selectClass}`}>
        {DRUGS.filter((d) => d.id !== other).map((d) => (
          <option key={d.id} value={d.id}>
            {d.name[locale]} {d.dose}
            {d.qt ? ` · ${c.qtTag}` : ""}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-navy-850">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-2.5">
        <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.panel}</p>
        <ShareLinkButton locale={locale} ariaLabel={c.shareAria} getUrl={() => qtToUrl(qt, window.location.href)} />
      </div>

      {/* Inputs */}
      <div className="grid gap-px bg-hairline sm:grid-cols-2">
        <div className="space-y-3 bg-navy-850 px-5 py-4">
          {drugSelect(c.drugA, aId, bId, setA, `${uid}-a`)}
          {drugSelect(c.drugB, bId, aId, setB, `${uid}-b`)}
        </div>
        <fieldset className="bg-navy-850 px-5 py-4">
          <legend className="sr-only">{c.patient}</legend>
          <span className="text-[11.5px] text-white/55">
            {c.baseline}
            <Cite id="fridericia" />
          </span>
          <span role="group" aria-label={c.baseline} className="mt-1.5 flex rounded-md border border-hairline bg-white/[0.03] p-0.5">
            {BASELINE_QTC.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={patient.qtc === v}
                onClick={() => setPatient((p) => ({ ...p, qtc: v as Baseline }))}
                className={`flex-1 rounded-[5px] px-2 py-1 font-mono text-[12px] tabular-nums transition-colors duration-150 ease-out ${
                  patient.qtc === v ? "bg-white/[0.1] text-white print:font-semibold print:underline" : "text-white/55 hover:text-white"
                }`}
              >
                {v} ms
              </button>
            ))}
          </span>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
            {(Object.keys(c.toggles) as (keyof typeof c.toggles)[]).map((key) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 text-[12.5px] text-white/75">
                <input
                  type="checkbox"
                  checked={patient[key]}
                  onChange={(e) => setPatient((p) => ({ ...p, [key]: e.target.checked }))}
                  className="h-3.5 w-3.5 cursor-pointer accent-titanium"
                />
                {c.toggles[key]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Result */}
      <div aria-live="polite" className="border-t border-hairline">
        <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4">
          <p className="text-[12px] text-white/55">
            QTc <span className="font-mono text-white tabular-nums">{patient.qtc} ms</span> · {c.score}
            <Cite id="tisdale" />
          </p>
          <p className={`font-mono text-[22px] font-medium tabular-nums ${tierText[r.tier]}`}>
            {r.score}
            <span className="ml-1.5 font-sans text-[13px] font-normal">
              {c.points} · {c.tiers[r.tier]}
            </span>
          </p>
        </div>
        <div className="px-5 pb-4" aria-hidden="true">
          <span className="block h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span className={`block h-full rounded-full transition-[width] duration-150 ease-out ${tierBar[r.tier]}`} style={{ width: `${(r.score / 21) * 100}%` }} />
          </span>
        </div>
        <ul className="divide-y divide-hairline border-t border-hairline">
          {r.factors.map((f) => (
            <li key={f.key} className="flex items-baseline justify-between gap-3 px-5 py-2 text-[12.5px]">
              <span className="text-white/75">{c.factors[f.key]}</span>
              <span className="font-mono text-white/70 tabular-nums">+{f.points}</span>
            </li>
          ))}
        </ul>
        <dl className="divide-y divide-hairline border-t border-hairline text-[12.5px]">
          <div className="grid grid-cols-[96px_1fr] gap-3 px-5 py-2.5">
            <dt className="text-white/55">{c.rule}</dt>
            <dd className="leading-relaxed text-white/75">{rule}</dd>
          </div>
          <div className="grid grid-cols-[96px_1fr] gap-3 px-5 py-2.5">
            <dt className="text-white/55">ATC</dt>
            <dd className="font-mono text-white/75 tabular-nums">
              {a.atc} · {b.atc}
            </dd>
          </div>
          <div className="grid grid-cols-[96px_1fr] gap-3 px-5 py-2.5">
            <dt className="sr-only">{c.score}</dt>
            <dd className="col-span-2 leading-relaxed text-white/75">{c.advice[r.tier]}</dd>
          </div>
        </dl>
      </div>
      <p className="border-t border-hairline px-5 py-3 text-[11px] leading-relaxed text-white/55">{c.note}</p>
    </div>
  );
}
