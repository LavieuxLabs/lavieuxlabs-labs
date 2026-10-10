import { defineContent, type Locale } from "@/i18n/config";

// Illustrative clinical cases for the PharmaDeux hero simulator. These are teaching examples, not
// patient data, and the site labels them that way. Values use real parameters and units:
// ALT in U/L, eGFR (CKD-EPI) in mL/min/1.73 m², QTc (Fridericia) in ms, Tisdale QT risk score in
// points (0–21; ≤6 low, 7–10 moderate, ≥11 high). Thresholds follow product labelling (KÜB/SmPC).
// Numbers live once in `measurements`; only the wording differs per locale.

export type Tone = "normal" | "caution" | "high";

type ReadingKey = "liver" | "qtc" | "renal";

export type Reading = {
  value: string;
  status: string;
  tone: Tone;
  /** Fill of the hairline meter, 0–1. */
  level: number;
};

export type ClinicalCase = {
  id: string;
  title: string;
  /** Short mono-friendly summary shown under the title in the selector. */
  meta: string;
  patient: string;
  prescription: string;
  finding: string;
  /** Tisdale score components, shown only when the QT plane is the finding. */
  tisdale?: { factor: string; points: number }[];
  readings: Record<ReadingKey, Reading>;
};

type Measurement = { value: number; tone: Tone; level: number };

const measurements: {
  id: string;
  readings: Record<ReadingKey, Measurement>;
  tisdalePoints?: number[];
}[] = [
  {
    id: "polypharmacy",
    readings: {
      liver: { value: 24, tone: "normal", level: 24 / 120 },
      qtc: { value: 410, tone: "normal", level: (410 - 350) / 200 },
      renal: { value: 90, tone: "normal", level: 90 / 120 },
    },
  },
  {
    id: "renal",
    readings: {
      liver: { value: 31, tone: "normal", level: 31 / 120 },
      qtc: { value: 432, tone: "normal", level: (432 - 350) / 200 },
      renal: { value: 34, tone: "caution", level: 34 / 120 },
    },
  },
  {
    id: "qtc",
    readings: {
      liver: { value: 29, tone: "normal", level: 29 / 120 },
      qtc: { value: 485, tone: "high", level: (485 - 350) / 200 },
      renal: { value: 58, tone: "normal", level: 58 / 120 },
    },
    tisdalePoints: [1, 1, 1, 2, 3, 3],
  },
];

type CaseText = {
  title: string;
  meta: string;
  patient: string;
  prescription: string;
  finding: string;
  tisdaleFactors?: string[];
  status: Record<ReadingKey, string>;
};

const text = defineContent<CaseText[]>({
  tr: [
    {
      title: "Normal polifarmasi",
      meta: "eGFR 90 · QTc 410 ms",
      patient: "66 yaş, erkek",
      prescription: "Ramipril · Atorvastatin · Metformin · Asetilsalisilik asit · Pantoprazol",
      finding: "Eşiği aşan bulgu yok. Beş ilacın 10 ikili kombinasyonu ve kümülatif yükleri kontrol edildi.",
      status: { liver: "Stabil", qtc: "Tisdale 0 · düşük risk", renal: "Doz ayarı gerekmez" },
    },
    {
      title: "Renal doz eşiği",
      meta: "Metformin + Siprofloksasin · eGFR 34",
      patient: "71 yaş, erkek · tip 2 diyabet",
      prescription: "Metformin 1000 mg 2×1 · Siprofloksasin 500 mg 2×1",
      finding:
        "eGFR 30–45 aralığında: metformin günlük dozu en fazla 1000 mg olmalı; siprofloksasin dozu böbrek fonksiyonuna göre kontrol edilmeli. Florokinolon ile metformin birlikte kullanıldığında kan şekeri izlenmeli.",
      status: { liver: "Stabil", qtc: "Tisdale 4 · düşük risk", renal: "Renal doz ayarı gerekli" },
    },
    {
      title: "Kardiyak risk (QTc uzaması)",
      meta: "Amiodaron + Azitromisin · QTc 485 ms",
      patient: "74 yaş, kadın · furosemid kullanıyor",
      prescription: "Amiodaron 200 mg 1×1 · Azitromisin 500 mg 1×1",
      finding:
        "İki QT uzatan ilaç ve QTc 485 ms. Tisdale 11: yüksek risk. EKG izlemi ve QT'yi uzatmayan bir antibiyotik seçeneği değerlendirilmeli.",
      tisdaleFactors: ["Yaş ≥68", "Kadın", "Loop diüretik", "QTc ≥450 ms", "QT uzatan ilaç", "≥2 QT uzatan ilaç"],
      status: { liver: "Stabil", qtc: "Tisdale 11 · yüksek risk", renal: "Doz ayarı gerekmez" },
    },
  ],
  en: [
    {
      title: "Routine polypharmacy",
      meta: "eGFR 90 · QTc 410 ms",
      patient: "66 years, male",
      prescription: "Ramipril · Atorvastatin · Metformin · Acetylsalicylic acid · Pantoprazole",
      finding:
        "No finding above threshold. All 10 pairwise combinations of the five drugs and their cumulative burden were checked.",
      status: { liver: "Stable", qtc: "Tisdale 0 · low risk", renal: "No dose adjustment" },
    },
    {
      title: "Renal dose threshold",
      meta: "Metformin + Ciprofloxacin · eGFR 34",
      patient: "71 years, male · type 2 diabetes",
      prescription: "Metformin 1000 mg twice daily · Ciprofloxacin 500 mg twice daily",
      finding:
        "eGFR in the 30–45 range: the daily metformin dose should not exceed 1000 mg, and the ciprofloxacin dose should be checked against renal function. Monitor blood glucose when a fluoroquinolone is given with metformin.",
      status: { liver: "Stable", qtc: "Tisdale 4 · low risk", renal: "Renal dose adjustment needed" },
    },
    {
      title: "Cardiac risk (QTc prolongation)",
      meta: "Amiodarone + Azithromycin · QTc 485 ms",
      patient: "74 years, female · on furosemide",
      prescription: "Amiodarone 200 mg once daily · Azithromycin 500 mg once daily",
      finding:
        "Two QT-prolonging drugs and a QTc of 485 ms. Tisdale 11: high risk. Consider ECG monitoring and an antibiotic that does not prolong the QT interval.",
      tisdaleFactors: [
        "Age ≥68",
        "Female",
        "Loop diuretic",
        "QTc ≥450 ms",
        "QT-prolonging drug",
        "≥2 QT-prolonging drugs",
      ],
      status: { liver: "Stable", qtc: "Tisdale 11 · high risk", renal: "No dose adjustment" },
    },
  ],
});

function build(locale: Locale): ClinicalCase[] {
  return measurements.map((m, i) => {
    const t = text[locale][i];
    const reading = (key: ReadingKey): Reading => ({
      value: String(m.readings[key].value),
      status: t.status[key],
      tone: m.readings[key].tone,
      level: m.readings[key].level,
    });
    return {
      id: m.id,
      title: t.title,
      meta: t.meta,
      patient: t.patient,
      prescription: t.prescription,
      finding: t.finding,
      tisdale: m.tisdalePoints?.map((points, k) => ({ factor: t.tisdaleFactors?.[k] ?? "", points })),
      readings: { liver: reading("liver"), qtc: reading("qtc"), renal: reading("renal") },
    };
  });
}

export const CLINICAL_CASES: Record<Locale, ClinicalCase[]> = { tr: build("tr"), en: build("en") };

// ── Custom case ───────────────────────────────────────────────────────────────
// One fixed patient whose kidney function and antibiotic can be changed. Clinical logic:
// · QTc is the patient's measured ECG value (485 ms) and does not change with the order; what
//   changes is the Tisdale score: amiodarone alone gives 8 (moderate), adding azithromycin adds the
//   "≥2 QT-prolonging drugs" factor (+3) for 11 (high).
// · Metformin 1000 mg twice daily = 2000 mg/day. At eGFR 30–44 the SmPC maximum is 1000 mg/day;
//   below 30 it is contraindicated. At eGFR 90 no adjustment is needed.

export const EGFR_OPTIONS = [90, 30] as const;
export type CustomParams = { egfr: (typeof EGFR_OPTIONS)[number]; azithromycin: boolean };

const CUSTOM_QTC = 485;
const CUSTOM_ALT = 29;

const customText = defineContent({
  tr: {
    title: "Kendi vakanız",
    patient: "74 yaş, kadın · tip 2 diyabet · furosemid kullanıyor",
    drugs: {
      metformin: "Metformin 1000 mg 2×1",
      amiodarone: "Amiodaron 200 mg 1×1",
      azithromycin: "Azitromisin 500 mg 1×1",
    },
    tisdaleFactors: ["Yaş ≥68", "Kadın", "Loop diüretik", "QTc ≥450 ms", "QT uzatan ilaç", "≥2 QT uzatan ilaç"],
    qtHigh:
      "İki QT uzatan ilaç ve QTc 485 ms. Tisdale 11: yüksek risk. EKG izlemi ve QT'yi uzatmayan bir antibiyotik seçeneği değerlendirilmeli.",
    qtModerate:
      "Tek QT uzatan ilaç (amiodaron) ve QTc 485 ms. Tisdale 8: orta risk. EKG ile potasyum ve magnezyum izlemi değerlendirilmeli.",
    renal:
      "eGFR 30: metformin günlük dozu en fazla 1000 mg olmalı (reçetede 2000 mg). eGFR 30'un altına düşerse metformin kontrendike.",
    status: {
      liver: "Stabil",
      qtHigh: "Tisdale 11 · yüksek risk",
      qtModerate: "Tisdale 8 · orta risk",
      renalOk: "Doz ayarı gerekmez",
      renalAdjust: "Renal doz ayarı gerekli",
    },
  },
  en: {
    title: "Your case",
    patient: "74 years, female · type 2 diabetes · on furosemide",
    drugs: {
      metformin: "Metformin 1000 mg twice daily",
      amiodarone: "Amiodarone 200 mg once daily",
      azithromycin: "Azithromycin 500 mg once daily",
    },
    tisdaleFactors: [
      "Age ≥68",
      "Female",
      "Loop diuretic",
      "QTc ≥450 ms",
      "QT-prolonging drug",
      "≥2 QT-prolonging drugs",
    ],
    qtHigh:
      "Two QT-prolonging drugs and a QTc of 485 ms. Tisdale 11: high risk. Consider ECG monitoring and an antibiotic that does not prolong the QT interval.",
    qtModerate:
      "One QT-prolonging drug (amiodarone) and a QTc of 485 ms. Tisdale 8: moderate risk. Consider ECG, potassium and magnesium monitoring.",
    renal:
      "eGFR 30: the daily metformin dose should not exceed 1000 mg (2000 mg prescribed). Below an eGFR of 30, metformin is contraindicated.",
    status: {
      liver: "Stable",
      qtHigh: "Tisdale 11 · high risk",
      qtModerate: "Tisdale 8 · moderate risk",
      renalOk: "No dose adjustment",
      renalAdjust: "Renal dose adjustment needed",
    },
  },
});

export function buildCustomCase(locale: Locale, params: CustomParams): ClinicalCase {
  const t = customText[locale];
  const points = [1, 1, 1, 2, 3, ...(params.azithromycin ? [3] : [])];
  const tisdale = points.map((p, i) => ({ factor: t.tisdaleFactors[i], points: p }));
  const high = params.azithromycin;
  const renalAdjust = params.egfr < 45;
  const drugs = [t.drugs.metformin, t.drugs.amiodarone, ...(params.azithromycin ? [t.drugs.azithromycin] : [])];

  return {
    id: "custom",
    title: t.title,
    meta: `eGFR ${params.egfr} · QTc ${CUSTOM_QTC} ms`,
    patient: t.patient,
    prescription: drugs.join(" · "),
    finding: [high ? t.qtHigh : t.qtModerate, ...(renalAdjust ? [t.renal] : [])].join(" "),
    tisdale,
    readings: {
      liver: { value: String(CUSTOM_ALT), status: t.status.liver, tone: "normal", level: CUSTOM_ALT / 120 },
      qtc: {
        value: String(CUSTOM_QTC),
        status: high ? t.status.qtHigh : t.status.qtModerate,
        tone: high ? "high" : "caution",
        level: (CUSTOM_QTC - 350) / 200,
      },
      renal: {
        value: String(params.egfr),
        status: renalAdjust ? t.status.renalAdjust : t.status.renalOk,
        tone: renalAdjust ? "caution" : "normal",
        level: params.egfr / 120,
      },
    },
  };
}
