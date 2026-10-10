import { defineContent } from "@/i18n/config";

type Card = {
  alt: string;
  eyebrow: string;
  title: string;
  titleMuted: string;
  specs: { value: string; label: string }[];
};

// OpenGraph card copy for the pages that have their own image. The route files under
// src/app/(tr) and src/app/en pick their locale; the layout is in src/lib/ogImage.tsx.
export const ogCards = defineContent<Record<"home" | "pharmadeux" | "shield", Card>>({
  tr: {
    home: {
      alt: "LavieuxLabs · İlaç güvenliği ve faturalama için karar destek yazılımı",
      eyebrow: "Sağlık teknolojileri Ar-Ge",
      title: "İlaç güvenliği ve faturalama için",
      titleMuted: "karar destek yazılımı.",
      specs: [
        { value: "18", label: "Güvenlik düzlemi" },
        { value: "2.480+", label: "Otomatik test" },
        { value: "FHIR R4", label: "Veri standardı" },
        { value: "Sınıf IIa", label: "MDR hedef sınıfı" },
      ],
    },
    pharmadeux: {
      alt: "PharmaDeux CDSS · Reçete yazılırken ilaç güvenliğini kontrol eder",
      eyebrow: "PharmaDeux CDSS · klinik karar destek",
      title: "Reçete yazılırken",
      titleMuted: "ilaç güvenliğini kontrol eder.",
      specs: [
        { value: "18", label: "Güvenlik düzlemi" },
        { value: "2.480+", label: "Otomatik test" },
        { value: "FHIR R4", label: "Veri standardı" },
        { value: "THS 4", label: "Teknoloji hazırlık seviyesi" },
      ],
    },
    shield: {
      alt: "Shield · Red riskini fatura gönderilmeden önce görün",
      eyebrow: "Shield · gelir bütünlüğü",
      title: "Red riskini fatura",
      titleMuted: "gönderilmeden önce görün.",
      specs: [
        { value: "0–100", label: "Risk skoru" },
        { value: "ICD-10 · SUT", label: "Kod sistemleri" },
        { value: "Uzman onayı", label: "Karar" },
        { value: "Append-only", label: "Denetim kaydı" },
      ],
    },
  },
  en: {
    home: {
      alt: "LavieuxLabs · Decision support software for medication safety and hospital billing",
      eyebrow: "Health technology R&D",
      title: "Medication safety and billing",
      titleMuted: "decision support software.",
      specs: [
        { value: "18", label: "Safety planes" },
        { value: "2,480+", label: "Automated tests" },
        { value: "FHIR R4", label: "Data standard" },
        { value: "Class IIa", label: "MDR target class" },
      ],
    },
    pharmadeux: {
      alt: "PharmaDeux CDSS · Checks medication safety while the prescription is written",
      eyebrow: "PharmaDeux CDSS · clinical decision support",
      title: "Checks medication safety",
      titleMuted: "while the prescription is written.",
      specs: [
        { value: "18", label: "Safety planes" },
        { value: "2,480+", label: "Automated tests" },
        { value: "FHIR R4", label: "Data standard" },
        { value: "TRL 4", label: "Technology readiness" },
      ],
    },
    shield: {
      alt: "Shield · See rejection risk before the claim is submitted",
      eyebrow: "Shield · revenue integrity",
      title: "See rejection risk before",
      titleMuted: "the claim is submitted.",
      specs: [
        { value: "0–100", label: "Risk score" },
        { value: "ICD-10 · SUT", label: "Code systems" },
        { value: "Specialist", label: "Decision" },
        { value: "Append-only", label: "Audit log" },
      ],
    },
  },
});
