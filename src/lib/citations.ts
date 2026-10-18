import type { Locale } from "@/i18n/config";

// Sources behind the formulas, scores and regulations the site names. Bibliographic data only as far as
// it is certain; no DOIs or page numbers are added from memory. Titles of standards and regulations are
// their official titles (not translated).

export type CiteKey = "tisdale" | "drew2010" | "fridericia" | "ckdepi2021" | "kdigo2024" | "cockcroftGault" | "tripleWhammy" | "mdrRule11" | "iec62304";

type Citation = { term: Record<Locale, string>; what: Record<Locale, string>; refs: string[] };

export const CITATIONS: Record<CiteKey, Citation> = {
  tisdale: {
    term: { tr: "Tisdale skoru", en: "Tisdale score" },
    what: {
      tr: "Hastanede yatan hastada QT uzaması riskini öngören skor; 0–21 puan, ≤6 düşük, 7–10 orta, ≥11 yüksek risk.",
      en: "Score predicting QT prolongation risk in hospitalised patients; 0–21 points, ≤6 low, 7–10 moderate, ≥11 high risk.",
    },
    refs: [
      "Tisdale JE, Jaynes HA, Kingery JR, et al. Development and validation of a risk score to predict QT interval prolongation in hospitalized patients. Circ Cardiovasc Qual Outcomes. 2013;6(4):479–487.",
    ],
  },
  drew2010: {
    term: { tr: "AHA/ACCF torsade de pointes bildirisi", en: "AHA/ACCF torsade de pointes statement" },
    what: {
      tr: "Hastanede torsade de pointes'in önlenmesi üzerine bilimsel bildiri; QTc >500 ms veya başlangıca göre >60 ms uzama yüksek risk göstergesidir.",
      en: "Scientific statement on preventing torsade de pointes in hospital; QTc >500 ms or a >60 ms increase from baseline indicates high risk.",
    },
    refs: [
      "Drew BJ, Ackerman MJ, Funk M, et al. Prevention of torsade de pointes in hospital settings: a scientific statement from the American Heart Association and the American College of Cardiology Foundation. Circulation. 2010;121:1047–1060.",
    ],
  },
  fridericia: {
    term: { tr: "Fridericia düzeltmesi", en: "Fridericia correction" },
    what: {
      tr: "QT aralığının kalp hızına göre düzeltilmesi: QTc = QT / ∛RR (RR saniye cinsinden).",
      en: "Heart-rate correction of the QT interval: QTc = QT / ∛RR (RR in seconds).",
    },
    refs: [
      "Fridericia LS. Die Systolendauer im Elektrokardiogramm bei normalen Menschen und bei Herzkranken. Acta Med Scand. 1920;53:469–486.",
    ],
  },
  ckdepi2021: {
    term: { tr: "CKD-EPI 2021", en: "CKD-EPI 2021" },
    what: {
      tr: "Serum kreatininden ırk katsayısı kullanmadan eGFR hesaplayan denklem (mL/dk/1,73 m²).",
      en: "Equation estimating eGFR from serum creatinine without a race coefficient (mL/min/1.73 m²).",
    },
    refs: [
      "Inker LA, Eneanya ND, Coresh J, et al. New creatinine- and cystatin C–based equations to estimate GFR without race. N Engl J Med. 2021;385(19):1737–1749.",
      "Previous version (2009): Levey AS, Stevens LA, Schmid CH, et al. A new equation to estimate glomerular filtration rate. Ann Intern Med. 2009;150(9):604–612.",
    ],
  },
  kdigo2024: {
    term: { tr: "KDIGO 2024 KBH kılavuzu", en: "KDIGO 2024 CKD guideline" },
    what: {
      tr: "Kronik böbrek hastalığının değerlendirilmesi ve yönetimi kılavuzu; GFR kategorileri G1–G5 (mL/dk/1,73 m²).",
      en: "Guideline for the evaluation and management of chronic kidney disease; GFR categories G1–G5 (mL/min/1.73 m²).",
    },
    refs: [
      "Kidney Disease: Improving Global Outcomes (KDIGO) CKD Work Group. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int. 2024;105(4S):S117–S314.",
      "Previous version (2012): Kidney Disease: Improving Global Outcomes (KDIGO) CKD Work Group. KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney International Supplements. 2013.",
    ],
  },
  cockcroftGault: {
    term: { tr: "Cockcroft–Gault", en: "Cockcroft–Gault" },
    what: {
      tr: "Serum kreatinin, yaş, ağırlık ve cinsiyetten kreatinin klirensini tahmin eden denklem; sonuç vücut yüzeyine göre düzeltilmemiştir (mL/dk).",
      en: "Equation estimating creatinine clearance from serum creatinine, age, weight and sex; the result is not indexed to body surface area (mL/min).",
    },
    refs: ["Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31–41."],
  },
  tripleWhammy: {
    term: { tr: "Triple whammy (üçlü darbe)", en: "Triple whammy nephrotoxicity" },
    what: {
      tr: "Diüretik, ACE inhibitörü veya ARB ve NSAİİ'nin birlikte kullanımında renal hemodinamiden kaynaklanan akut böbrek hasarı riski.",
      en: "Risk of acute kidney injury driven by renal haemodynamics when a diuretic, an ACE inhibitor or ARB and an NSAID are used together.",
    },
    refs: [
      "Lapi F, Azoulay L, Yin H, Nessim SJ, Suissa S. Concurrent use of diuretics, angiotensin converting enzyme inhibitors, and angiotensin receptor blockers with non-steroidal anti-inflammatory drugs and risk of acute kidney injury: nested case-control study. BMJ. 2013;346:e8525.",
    ],
  },
  mdrRule11: {
    term: { tr: "MDR Kural 11", en: "MDR Rule 11" },
    what: {
      tr: "Teşhis veya tedavi kararları için bilgi sağlayan yazılımın sınıflandırma kuralı; varsayılan sınıf IIa.",
      en: "Classification rule for software that provides information used for diagnostic or therapeutic decisions; default class IIa.",
    },
    refs: [
      "Regulation (EU) 2017/745 of the European Parliament and of the Council of 5 April 2017 on medical devices — Annex VIII, Chapter III, Rule 11.",
      "MDCG 2019-11 — Guidance on Qualification and Classification of Software in Regulation (EU) 2017/745 – MDR and Regulation (EU) 2017/746 – IVDR (October 2019).",
    ],
  },
  iec62304: {
    term: { tr: "IEC 62304", en: "IEC 62304" },
    what: {
      tr: "Tıbbi cihaz yazılımı için yaşam döngüsü süreçleri standardı. LavieuxLabs için durum: mimari uyum, sertifika henüz yok.",
      en: "Life cycle process standard for medical device software. Status for LavieuxLabs: architecture aligned, not certified yet.",
    },
    refs: ["IEC 62304:2006+AMD1:2015 — Medical device software — Software life cycle processes."],
  },
};
