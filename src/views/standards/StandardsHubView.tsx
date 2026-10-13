import Link from "next/link";
import StandardDoc from "@/components/StandardDoc";
import StandardsIndex, { type StandardEntry } from "@/components/StandardsIndex";
import { standardsHubJsonLd } from "@/lib/structuredData";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/standartlar", {
  tr: {
    title: "Standartlar ve referanslar",
    description:
      "PharmaDeux ve Shield'ın dayandığı klinik, teknik ve idari standartlar: Tisdale QT risk skoru, CKD-EPI 2021 eGFR, HL7 FHIR R4 entegrasyonu ve SUT fatura denetimi; formüller, eşikler, kodlar ve kaynaklar.",
  },
  en: {
    title: "Standards and references",
    description:
      "The clinical, technical and administrative standards behind PharmaDeux and Shield: the Tisdale QT risk score, CKD-EPI 2021 eGFR, HL7 FHIR R4 integration and SUT billing audit, with formulas, thresholds, codes and sources.",
  },
});

const copy = defineContent<{
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  entries: StandardEntry[];
  more: string;
  moreLinks: { href: string; label: string }[];
}>({
  tr: {
    eyebrow: "Standartlar ve referanslar",
    title: "Kural motorunun dayandığı standartlar.",
    description:
      "Her skorun, formülün ve kodun kaynağını tek yerde topladık. Hekim formülün kaynağını, bilgi işlem ekibi veri modelini buradan doğrulayabilir.",
    intro: "Her sayfa formülü veya veri modelini, eşikleri, kullanılan kodları ve orijinal kaynağı içerir.",
    entries: [
      {
        href: "/standartlar/tisdale-score",
        category: "clinical",
        title: "Tisdale QT risk skoru",
        summary: "On risk faktörüyle hastanede yatan hastada QT uzaması riski; 0–21 puan, ≥11 yüksek risk.",
        codes: ["0–21 puan", "QTc ≥450 ms", "Fridericia"],
        source: "Tisdale JE et al. Circ Cardiovasc Qual Outcomes 2013",
      },
      {
        href: "/standartlar/ckd-epi-2021",
        category: "clinical",
        title: "CKD-EPI 2021 eGFR",
        summary: "Irk katsayısı olmadan kreatininden eGFR; KDIGO kategorileri ve renal doz kontrol ilkeleri.",
        codes: ["LOINC 98979-8", "mL/dk/1,73 m²", "G1–G5"],
        source: "Inker LA et al. N Engl J Med 2021",
      },
      {
        href: "/standartlar/fhir-r4-entegrasyonu",
        category: "technical",
        title: "HL7 FHIR R4 entegrasyonu",
        summary: "MedicationRequest ve Observation kaynakları, kod sistemleri, örnek JSON ve entegrasyon mimarisi.",
        codes: ["FHIR R4", "ATC", "LOINC", "UCUM"],
        source: "HL7 International · FHIR R4 (v4.0.1)",
      },
      {
        href: "/standartlar/sut-fatura-denetimi",
        category: "administrative",
        title: "SUT fatura denetimi",
        summary: "Shield'ın gönderim öncesi kural motoru: dört denetim düzlemi, 0–100 risk skoru ve denetim izi.",
        codes: ["EK-2B", "EK-2C", "ICD-10", "0–100"],
        source: "SGK · Sağlık Uygulama Tebliği (SUT)",
      },
    ],
    more: "Kalite ve regülasyon durumu için",
    moreLinks: [
      { href: "/legal/quality", label: "Kalite, bilgi güvenliği ve MDR" },
      { href: "/#standartlar", label: "Sekiz kural" },
    ],
  },
  en: {
    eyebrow: "Standards and references",
    title: "The standards the rule engine stands on.",
    description:
      "The source of every score, formula and code in one place. Physicians can check where a formula comes from, and IT teams can check the data model.",
    intro: "Each page gives the formula or data model, the thresholds, the codes used and the original source.",
    entries: [
      {
        href: "/standartlar/tisdale-score",
        category: "clinical",
        title: "Tisdale QT risk score",
        summary: "QT prolongation risk in hospitalised patients from ten risk factors; 0–21 points, ≥11 high risk.",
        codes: ["0–21 points", "QTc ≥450 ms", "Fridericia"],
        source: "Tisdale JE et al. Circ Cardiovasc Qual Outcomes 2013",
      },
      {
        href: "/standartlar/ckd-epi-2021",
        category: "clinical",
        title: "CKD-EPI 2021 eGFR",
        summary: "eGFR from creatinine without a race coefficient; KDIGO categories and renal dose check principles.",
        codes: ["LOINC 98979-8", "mL/min/1.73 m²", "G1–G5"],
        source: "Inker LA et al. N Engl J Med 2021",
      },
      {
        href: "/standartlar/fhir-r4-entegrasyonu",
        category: "technical",
        title: "HL7 FHIR R4 integration",
        summary: "MedicationRequest and Observation resources, code systems, example JSON and integration architecture.",
        codes: ["FHIR R4", "ATC", "LOINC", "UCUM"],
        source: "HL7 International · FHIR R4 (v4.0.1)",
      },
      {
        href: "/standartlar/sut-fatura-denetimi",
        category: "administrative",
        title: "SUT billing audit",
        summary: "Shield's pre-submission rule engine: four audit planes, a 0–100 risk score and the audit trail.",
        codes: ["EK-2B", "EK-2C", "ICD-10", "0–100"],
        source: "SGK · Health Implementation Communiqué (SUT)",
      },
    ],
    more: "For quality and regulatory status, see",
    moreLinks: [
      { href: "/legal/quality", label: "Quality, information security and MDR" },
      { href: "/#standartlar", label: "Eight rules" },
    ],
  },
});

export default function StandardsHubView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <StandardDoc
      locale={locale}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      jsonLd={standardsHubJsonLd(
        locale,
        c.entries.map((e) => ({ name: e.title, path: e.href })),
      )}
      wide={<StandardsIndex locale={locale} entries={c.entries} />}
    >
      <p className="!mt-0">{c.intro}</p>
      <p>
        {c.more}{" "}
        {c.moreLinks.map((l, i) => (
          <span key={l.href}>
            {i > 0 && " · "}
            <Link href={localizedPath(locale, l.href)}>{l.label}</Link>
          </span>
        ))}
        .
      </p>
    </StandardDoc>
  );
}
