import { defineContent, type Locale } from "@/i18n/config";
import type { StandardPath } from "@/lib/clinicalCases";
import { metrics } from "@/lib/metrics";

// PharmaDeux safety planes grouped by clinical domain. Keep in sync with the engine's plane registry.
// Read by the PharmaDeux page (grouped summary with the full list on demand) and the home page figure.
// Plane numbers (P01…) follow this order; the case workspace's readings use the same codes (P05 renal,
// P06 liver, P07 QT).

/** A safety plane; planes with a reference page carry its locale-free path and render as a link. */
export type Plane = string | { name: string; href: StandardPath };
export type PlaneGroup = { title: string; summary: string; planes: Plane[] };

const groups = defineContent<{ groups: PlaneGroup[] }>({
  tr: {
    groups: [
      {
        title: "Etkileşim",
        summary: "İki ilaç arasındaki ve ilaç ile hastalık arasındaki etkileşim, aynı tedavinin tekrarı, alerji.",
        planes: ["İlaç-ilaç etkileşimi", "Terapötik duplikasyon", "İlaç-hastalık etkileşimi", "Alerji ve kontrendikasyon"],
      },
      {
        title: "Organ toksisitesi",
        summary: "Böbrek, karaciğer, kalp (QT uzaması) ve kan üzerindeki toksik etki.",
        planes: ["Nefrotoksisite", "Hepatotoksisite", { name: "Kardiyotoksisite / QT uzaması", href: "/standartlar/tisdale-score" }, "Hematolojik toksisite"],
      },
      {
        title: "Kümülatif yük",
        summary: "Tek tek kabul edilebilir ilaçların aynı sistemde topladığı yük: antikolinerjik, serotonerjik, sedatif, kanama ve potasyum.",
        planes: [
          { name: "Antikolinerjik yük", href: "/standartlar/kumulatif-organ-yuku" },
          "Serotonerjik yük",
          "Sedatif / MSS depresan yük",
          "Kanama riski yükü",
          "Hiperkalemi riski",
        ],
      },
      {
        title: "Hasta ve doz",
        summary: "Doz aralığı ve dozun böbrek, karaciğer fonksiyonuna, yaşa, gebelik ve emzirmeye uygunluğu.",
        planes: [
          "Doz aralığı uygunluğu",
          { name: "Renal doz ayarı", href: "/standartlar/ckd-epi-2021" },
          "Hepatik doz ayarı",
          "Geriatrik uygunluk",
          "Gebelik ve laktasyon",
        ],
      },
    ],
  },
  en: {
    groups: [
      {
        title: "Interactions",
        summary: "Interactions between two drugs and between a drug and a disease, duplicated therapy, allergy.",
        planes: ["Drug–drug interaction", "Therapeutic duplication", "Drug–disease interaction", "Allergy and contraindication"],
      },
      {
        title: "Organ toxicity",
        summary: "Toxic effects on the kidney, liver, heart (QT prolongation) and blood.",
        planes: ["Nephrotoxicity", "Hepatotoxicity", { name: "Cardiotoxicity / QT prolongation", href: "/standartlar/tisdale-score" }, "Haematological toxicity"],
      },
      {
        title: "Cumulative burden",
        summary: "The load that drugs acceptable on their own add up to in one system: anticholinergic, serotonergic, sedative, bleeding and potassium.",
        planes: [
          { name: "Anticholinergic burden", href: "/standartlar/kumulatif-organ-yuku" },
          "Serotonergic burden",
          "Sedative / CNS depressant burden",
          "Bleeding risk burden",
          "Hyperkalaemia risk",
        ],
      },
      {
        title: "Patient and dose",
        summary: "Dose range, and whether the dose suits kidney and liver function, age, pregnancy and breastfeeding.",
        planes: [
          "Dose range check",
          { name: "Renal dose adjustment", href: "/standartlar/ckd-epi-2021" },
          "Hepatic dose adjustment",
          "Geriatric appropriateness",
          "Pregnancy and lactation",
        ],
      },
    ],
  },
});

// The lists are drawn as "N checks under four headings"; their total must equal the JSON count, otherwise
// the sentences (templated from metrics.safetyPlanes) and the lists would disagree.
for (const lang of ["tr", "en"] as const) {
  const drawn = groups[lang].groups.reduce((n, g) => n + g.planes.length, 0);
  if (drawn !== metrics.safetyPlanes) {
    throw new Error(`safetyPlanes (${lang}): groups list ${drawn} planes, projectMetrics.json says ${metrics.safetyPlanes}`);
  }
}

export const safetyPlaneGroups = (locale: Locale) => groups[locale].groups;
