// CKD-EPI 2021 creatinine equation (Inker et al., N Engl J Med 2021), race-free:
//   eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200 × 0.9938^Age × 1.012 [female]
// Scr in mg/dL, age in years, result in mL/min/1.73 m². Single source for the calculator and for the
// coefficient table on /standartlar/ckd-epi-2021.

export type Sex = "female" | "male";

export const CKD_EPI_2021 = {
  intercept: 142,
  kappa: { female: 0.7, male: 0.9 },
  alpha: { female: -0.241, male: -0.302 },
  upperExponent: -1.2,
  ageBase: 0.9938,
  femaleFactor: 1.012,
} as const;

/** Inputs the equation was developed for: adults; creatinine within a plausible laboratory range. */
export const LIMITS = { scr: { min: 0.1, max: 20 }, age: { min: 18, max: 110 } } as const;

export function egfrCkdEpi2021(scr: number, age: number, sex: Sex): number {
  const c = CKD_EPI_2021;
  const ratio = scr / c.kappa[sex];
  return (
    c.intercept *
    Math.min(ratio, 1) ** c.alpha[sex] *
    Math.max(ratio, 1) ** c.upperExponent *
    c.ageBase ** age *
    (sex === "female" ? c.femaleFactor : 1)
  );
}

export type KdigoStage = "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5";

/** KDIGO GFR categories, by the lower bound of each band (mL/min/1.73 m²). */
export const KDIGO_BANDS: { stage: KdigoStage; min: number; range: string }[] = [
  { stage: "G1", min: 90, range: "≥90" },
  { stage: "G2", min: 60, range: "60–89" },
  { stage: "G3a", min: 45, range: "45–59" },
  { stage: "G3b", min: 30, range: "30–44" },
  { stage: "G4", min: 15, range: "15–29" },
  { stage: "G5", min: 0, range: "<15" },
];

/** Stage of a reported (rounded) eGFR, so the shown number and the stage always agree. */
export function kdigoStage(egfr: number): KdigoStage {
  const rounded = Math.round(egfr);
  return KDIGO_BANDS.find((b) => rounded >= b.min)!.stage;
}
