"use client";

import { useId, useState } from "react";
import { KDIGO_BANDS, LIMITS, egfrCkdEpi2021, kdigoStage, type KdigoStage, type Sex } from "@/lib/ckdEpi";
import { defineContent, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    panel: "hesaplayıcı · CKD-EPI 2021",
    scr: "Serum kreatinin",
    scrUnit: "mg/dL",
    scrHint: "µmol/L ise 88,4'e bölün.",
    age: "Yaş",
    ageUnit: "yıl",
    sex: "Cinsiyet",
    female: "Kadın",
    male: "Erkek",
    result: "eGFR",
    unit: "mL/dk/1,73 m²",
    stage: "KDIGO evresi",
    invalidScr: `Kreatinin ${LIMITS.scr.min}–${LIMITS.scr.max} mg/dL aralığında olmalı.`,
    invalidAge: `Denklem ${LIMITS.age.min}–${LIMITS.age.max} yaş erişkinler içindir.`,
    stages: {
      G1: "Normal veya yüksek filtrasyon",
      G2: "Hafif azalmış filtrasyon",
      G3a: "Hafif–orta azalmış filtrasyon",
      G3b: "Orta–ağır azalmış filtrasyon",
      G4: "Ağır azalmış filtrasyon",
      G5: "Böbrek yetmezliği",
    } as Record<KdigoStage, string>,
    note: "Örnek hesaplayıcı · klinik karar için kullanılmaz. Kararlı kreatinin varsayar; akut böbrek hasarında, gebelikte ve 18 yaş altında geçerli değildir. KDIGO evresi tek bir değerden değil, en az 3 ay süren bulgudan konur.",
  },
  en: {
    panel: "calculator · CKD-EPI 2021",
    scr: "Serum creatinine",
    scrUnit: "mg/dL",
    scrHint: "For µmol/L, divide by 88.4.",
    age: "Age",
    ageUnit: "years",
    sex: "Sex",
    female: "Female",
    male: "Male",
    result: "eGFR",
    unit: "mL/min/1.73 m²",
    stage: "KDIGO category",
    invalidScr: `Creatinine must be between ${LIMITS.scr.min} and ${LIMITS.scr.max} mg/dL.`,
    invalidAge: `The equation is for adults aged ${LIMITS.age.min}–${LIMITS.age.max}.`,
    stages: {
      G1: "Normal or high filtration",
      G2: "Mildly decreased filtration",
      G3a: "Mildly to moderately decreased filtration",
      G3b: "Moderately to severely decreased filtration",
      G4: "Severely decreased filtration",
      G5: "Kidney failure",
    } as Record<KdigoStage, string>,
    note: "Example calculator · not for clinical decisions. It assumes stable creatinine; it is not valid in acute kidney injury, pregnancy or under 18. A KDIGO category is assigned from findings lasting at least 3 months, not from a single value.",
  },
});

// Clinical state colours only for reduced filtration: amber G3, rose G4–G5; G1–G2 stay neutral.
const stageTone: Record<KdigoStage, string> = {
  G1: "text-white",
  G2: "text-white",
  G3a: "text-amber-300",
  G3b: "text-amber-300",
  G4: "text-rose-300",
  G5: "text-rose-300",
};

// Accepts "1,2" as well as "1.2" (Turkish decimal comma).
const parse = (v: string) => Number(v.trim().replace(",", "."));

const inputClass =
  "w-full min-w-0 rounded-md border border-hairline bg-navy-900 px-2.5 py-2 font-mono text-[13px] text-white tabular-nums transition-colors duration-150 ease-out focus:border-white/30 focus:outline-none";

export default function EgfrCalculator({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const uid = useId();
  const [scr, setScr] = useState(locale === "tr" ? "1,0" : "1.0");
  const [age, setAge] = useState("60");
  const [sex, setSex] = useState<Sex>("female");

  const scrN = parse(scr);
  const ageN = parse(age);
  const scrOk = Number.isFinite(scrN) && scrN >= LIMITS.scr.min && scrN <= LIMITS.scr.max;
  const ageOk = Number.isInteger(ageN) && ageN >= LIMITS.age.min && ageN <= LIMITS.age.max;
  const value = scrOk && ageOk ? egfrCkdEpi2021(scrN, ageN, sex) : null;
  const stage = value === null ? null : kdigoStage(value);
  const band = stage ? KDIGO_BANDS.find((b) => b.stage === stage)! : null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-navy-850">
      <div className="border-b border-hairline px-5 py-3 text-[11px] font-medium tracking-wider text-white/50 uppercase">
        {/* "eGFR" keeps its lowercase "e": it is part of the abbreviation, so it is exempt from uppercasing. */}
        <span className="normal-case">eGFR</span> {c.panel}
      </div>

      <div className="grid gap-px bg-hairline sm:grid-cols-3">
        <label htmlFor={`${uid}-scr`} className="block bg-navy-850 px-5 py-4">
          <span className="block text-[11.5px] text-white/55">
            {c.scr} <span className="font-mono">({c.scrUnit})</span>
          </span>
          <input
            id={`${uid}-scr`}
            inputMode="decimal"
            value={scr}
            onChange={(e) => setScr(e.target.value)}
            aria-invalid={!scrOk}
            aria-describedby={`${uid}-scr-hint`}
            className={`mt-1.5 ${inputClass}`}
          />
          <span id={`${uid}-scr-hint`} className="mt-1.5 block text-[11px] text-white/55">
            {c.scrHint}
          </span>
        </label>
        <label htmlFor={`${uid}-age`} className="block bg-navy-850 px-5 py-4">
          <span className="block text-[11.5px] text-white/55">
            {c.age} <span className="font-mono">({c.ageUnit})</span>
          </span>
          <input
            id={`${uid}-age`}
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            aria-invalid={!ageOk}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <div className="bg-navy-850 px-5 py-4">
          <span className="block text-[11.5px] text-white/55" id={`${uid}-sex`}>
            {c.sex}
          </span>
          <span role="group" aria-labelledby={`${uid}-sex`} className="mt-1.5 flex rounded-md border border-hairline bg-white/[0.03] p-0.5">
            {(["female", "male"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={sex === s}
                onClick={() => setSex(s)}
                className={`flex-1 rounded-[5px] px-2 py-1.5 text-[12.5px] transition-colors duration-150 ease-out ${
                  sex === s ? "bg-white/[0.1] text-white print:font-semibold print:underline" : "text-white/55 hover:text-white"
                }`}
              >
                {c[s]}
              </button>
            ))}
          </span>
        </div>
      </div>

      <div aria-live="polite" className="border-t border-hairline">
        {value === null || !stage || !band ? (
          <div className="px-5 py-4 text-[12.5px] text-amber-200">
            {!scrOk && <span className="block">{c.invalidScr}</span>}
            {!ageOk && <span className="block">{c.invalidAge}</span>}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4">
              <span className="text-[12px] text-white/55">{c.result}</span>
              <span className={`font-mono text-[26px] font-medium tabular-nums ${stageTone[stage]}`}>
                {Math.round(value)}
                <span className="ml-1.5 font-sans text-[12.5px] font-normal text-white/55">{c.unit}</span>
              </span>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3 border-t border-hairline px-5 py-3 text-[12.5px]">
              <span className="text-white/55">{c.stage}</span>
              <span className="min-w-0">
                <span className={`font-mono font-medium ${stageTone[stage]}`}>{stage}</span>
                <span className="ml-2 font-mono text-white/55 tabular-nums">{band.range}</span>
                <span className="mt-0.5 block text-white/75">{c.stages[stage]}</span>
              </span>
            </div>
          </>
        )}
      </div>
      <div className="border-t border-hairline px-5 py-3 text-[11px] leading-relaxed text-white/55">{c.note}</div>
    </div>
  );
}
