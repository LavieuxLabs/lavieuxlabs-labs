import { defineContent } from "@/i18n/config";
import { metrics, testsLabel, trlLabel } from "@/lib/metrics";

type Card = {
  alt: string;
  eyebrow: string;
  title: string;
  specs: { value: string; label: string }[];
  /** The page's surface: "paper" for paper pages (home, PharmaDeux), the dark ground (default) otherwise. */
  surface?: "dark" | "paper";
};

// OpenGraph card copy for the pages that have their own image. The route files under
// src/app/(tr) and src/app/en pick their locale; the layout is in src/lib/ogImage.tsx.
export const ogCards = defineContent<Record<"home" | "pharmadeux" | "shield", Card>>({
  tr: {
    home: {
      alt: "LavieuxLabs · İlaç güvenliği için PharmaDeux; sitede ayrıca bağımsız proje Shield tanıtılıyor",
      eyebrow: "Bağımsız öğrenci Ar-Ge girişimi",
      title: "İlaç güvenliği için PharmaDeux. Sitede ayrıca bağımsız proje Shield tanıtılıyor.",
      specs: [
        { value: trlLabel("tr"), label: "PharmaDeux · öz değerlendirme" },
        { value: testsLabel("tr"), label: "PharmaDeux otomatik testi" },
        { value: "Henüz yok", label: "Klinik kanıt" },
      ],
      surface: "paper",
    },
    pharmadeux: {
      alt: "PharmaDeux CDSS · Reçete yazılırken ilaç güvenliğini kontrol eder",
      eyebrow: "PharmaDeux CDSS · klinik karar destek",
      title: "Reçete yazılırken ilaç güvenliğini kontrol eder.",
      specs: [
        { value: String(metrics.safetyPlanes), label: "Güvenlik düzlemi" },
        { value: testsLabel("tr"), label: "Otomatik test" },
        { value: "FHIR R4", label: "Veri standardı" },
        { value: trlLabel("tr"), label: "Ekibin öz değerlendirmesi" },
      ],
      surface: "paper",
    },
    shield: {
      alt: "Shield · Red riskini fatura gönderilmeden önce görün",
      eyebrow: "Shield · bağımsız prototip",
      title: "Red riskini fatura gönderilmeden önce görün.",
      specs: [
        { value: "0–100", label: "Kural skoru" },
        { value: "ICD-10 · SUT", label: "Kod sistemleri" },
        { value: "Uzman onayı", label: "Karar" },
        { value: "Prototip", label: "Aşama" },
      ],
      surface: "paper",
    },
  },
  en: {
    home: {
      alt: "LavieuxLabs · PharmaDeux for medication safety; the site also presents Shield, an independent project",
      eyebrow: "Independent student R&D venture",
      title: "PharmaDeux for medication safety. The site also presents Shield, an independent project.",
      specs: [
        { value: trlLabel("en"), label: "PharmaDeux · self-assessed" },
        { value: testsLabel("en"), label: "PharmaDeux automated tests" },
        { value: "None yet", label: "Clinical evidence" },
      ],
      surface: "paper",
    },
    pharmadeux: {
      alt: "PharmaDeux CDSS · Checks medication safety while the prescription is written",
      eyebrow: "PharmaDeux CDSS · clinical decision support",
      title: "Checks medication safety while the prescription is written.",
      specs: [
        { value: String(metrics.safetyPlanes), label: "Safety planes" },
        { value: testsLabel("en"), label: "Automated tests" },
        { value: "FHIR R4", label: "Data standard" },
        { value: trlLabel("en"), label: "Team self-assessment" },
      ],
      surface: "paper",
    },
    shield: {
      alt: "Shield · See rejection risk before the claim is submitted",
      eyebrow: "Shield · independent prototype",
      title: "See rejection risk before the claim is submitted.",
      specs: [
        { value: "0–100", label: "Rule score" },
        { value: "ICD-10 · SUT", label: "Code systems" },
        { value: "Specialist", label: "Decision" },
        { value: "Prototype", label: "Stage" },
      ],
      surface: "paper",
    },
  },
});
