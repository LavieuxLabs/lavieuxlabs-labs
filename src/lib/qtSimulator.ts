import type { Locale } from "@/i18n/config";

// Teaching model for the PharmaDeux QT simulator. It does NOT predict a QTc change in ms: there is no
// reliable per-pair number for that, and a score must not be presented as a measurement. Instead it
// takes a measured baseline QTc and the patient's risk factors and computes the Tisdale QT risk score
// (Tisdale et al., 2013; points 0–21; ≤6 low, 7–10 moderate, ≥11 high), using the factors this example
// patient can have. "QT-prolonging" means QT prolongation is listed in the drug's product information
// (KÜB/SmPC). ATC codes are real.

export type Drug = { id: string; atc: string; name: Record<Locale, string>; dose: string; qt: boolean };

export const DRUGS: Drug[] = [
  { id: "amiodarone", atc: "C01BD01", name: { tr: "Amiodaron", en: "Amiodarone" }, dose: "200 mg", qt: true },
  { id: "ciprofloxacin", atc: "J01MA02", name: { tr: "Siprofloksasin", en: "Ciprofloxacin" }, dose: "500 mg", qt: true },
  { id: "levofloxacin", atc: "J01MA12", name: { tr: "Levofloksasin", en: "Levofloxacin" }, dose: "500 mg", qt: true },
  { id: "haloperidol", atc: "N05AD01", name: { tr: "Haloperidol", en: "Haloperidol" }, dose: "5 mg", qt: true },
  { id: "azithromycin", atc: "J01FA10", name: { tr: "Azitromisin", en: "Azithromycin" }, dose: "500 mg", qt: true },
  { id: "amoxicillin", atc: "J01CA04", name: { tr: "Amoksisilin", en: "Amoxicillin" }, dose: "1000 mg", qt: false },
  { id: "metformin", atc: "A10BA02", name: { tr: "Metformin", en: "Metformin" }, dose: "1000 mg", qt: false },
];

export const BASELINE_QTC = [430, 455, 480] as const;
export type Baseline = (typeof BASELINE_QTC)[number];

export type Patient = { age68: boolean; female: boolean; loopDiuretic: boolean; lowK: boolean; qtc: Baseline };

export type Factor = { key: string; points: number };
export type QtResult = { factors: Factor[]; score: number; tier: "low" | "moderate" | "high"; qtDrugs: number };

/** Tisdale factors available in this example (no acute MI, sepsis or heart failure in this patient). */
export function tisdale(patient: Patient, a: Drug, b: Drug): QtResult {
  const qtDrugs = [a, b].filter((d) => d.qt).length;
  const factors: Factor[] = [];
  if (patient.age68) factors.push({ key: "age", points: 1 });
  if (patient.female) factors.push({ key: "female", points: 1 });
  if (patient.loopDiuretic) factors.push({ key: "loop", points: 1 });
  if (patient.lowK) factors.push({ key: "lowK", points: 2 });
  if (patient.qtc >= 450) factors.push({ key: "qtc450", points: 2 });
  if (qtDrugs >= 1) factors.push({ key: "oneDrug", points: 3 });
  if (qtDrugs >= 2) factors.push({ key: "twoDrugs", points: 3 });
  const score = factors.reduce((n, f) => n + f.points, 0);
  return { factors, score, qtDrugs, tier: score >= 11 ? "high" : score >= 7 ? "moderate" : "low" };
}
