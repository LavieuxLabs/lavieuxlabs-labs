import Link from "next/link";
import StandardDoc from "@/components/StandardDoc";
import StandardsIndex, { type StandardEntry } from "@/components/StandardsIndex";
import StandardsGrid from "@/components/StandardsGrid";
import SectionHeader from "@/components/SectionHeader";
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
  rules: { eyebrow: string; title: string; description: string };
  index: { eyebrow: string; title: string; description: string };
  entries: StandardEntry[];
  more: string;
  moreLinks: { href: string; label: string }[];
}>({
  tr: {
    eyebrow: "Standartlar ve referanslar",
    title: "Kural motorunun dayandığı standartlar.",
    description:
      "Her skorun, formülün ve kodun kaynağını tek yerde topladık. Hekim formülün kaynağını, bilgi işlem ekibi veri modelini buradan doğrulayabilir.",
    rules: {
      eyebrow: "İlkeler",
      title: "İki üründe de uyduğumuz sekiz kural.",
      description:
        "Hangi standardı referans aldığımızı ve her birinde nerede olduğumuzu tek tek yazdık. Henüz tamamlanmamış olanları da öyle belirttik.",
    },
    index: {
      eyebrow: "Referans sayfaları",
      title: "Skorlar, formüller ve veri modelleri.",
      description: "Her sayfa formülü veya veri modelini, eşikleri, kullanılan kodları ve orijinal kaynağı içerir.",
    },
    entries: [
      {
        href: "/standartlar/tisdale-score",
        category: "clinical",
        title: "Tisdale QT risk skoru",
        summary: "On risk faktörüyle hastanede yatan hastada QT uzaması riski; 0–21 puan, ≥11 yüksek risk.",
        codes: ["0–21 puan", "QTc ≥450 ms", "Fridericia"],
        source: "Tisdale JE et al. Circ Cardiovasc Qual Outcomes 2013",
        product: "PharmaDeux · QT risk motoru",
        status: "Algoritmik olarak uygulandı · sentetik testten geçiyor",
      },
      {
        href: "/standartlar/ckd-epi-2021",
        category: "clinical",
        title: "CKD-EPI 2021 eGFR",
        summary: "Irk katsayısı olmadan kreatininden eGFR; KDIGO kategorileri ve renal doz kontrol ilkeleri.",
        codes: ["LOINC 98979-8", "mL/dk/1,73 m²", "G1–G5"],
        source: "Inker LA et al. N Engl J Med 2021",
        product: "PharmaDeux · renal doz kontrolü",
        status: "Algoritmik olarak uygulandı · sentetik testten geçiyor",
      },
      {
        href: "/standartlar/fhir-r4-entegrasyonu",
        category: "technical",
        title: "HL7 FHIR R4 entegrasyonu",
        summary: "MedicationRequest ve Observation kaynakları, kod sistemleri, örnek JSON ve entegrasyon mimarisi.",
        codes: ["FHIR R4", "ATC", "LOINC", "UCUM"],
        source: "HL7 International · FHIR R4 (v4.0.1)",
        product: "PharmaDeux ve Shield · veri katmanı",
        status: "Veri modeli entegre · canlı HBYS bağlantısı yok",
      },
      {
        href: "/standartlar/sut-fatura-denetimi",
        category: "administrative",
        title: "SUT fatura denetimi",
        summary: "Shield'ın gönderim öncesi kural motoru: dört denetim düzlemi, 0–100 risk skoru ve denetim izi.",
        codes: ["EK-2B", "EK-2C", "ICD-10", "0–100"],
        source: "SGK · Sağlık Uygulama Tebliği (SUT)",
        product: "Shield · fatura denetimi",
        status: "4 düzlemden 3'ü uygulandı · sentetik faturalarla test ediliyor",
      },
    ],
    more: "Kalite ve regülasyon durumu için",
    moreLinks: [
      { href: "/legal/quality", label: "Kalite, bilgi güvenliği ve MDR" },
    ],
  },
  en: {
    eyebrow: "Standards and references",
    title: "The standards the rule engine stands on.",
    description:
      "The source of every score, formula and code in one place. Physicians can check where a formula comes from, and IT teams can check the data model.",
    rules: {
      eyebrow: "Principles",
      title: "Eight rules both products follow.",
      description:
        "We list each standard we work against and where we stand on it. Where something is not finished yet, we say so.",
    },
    index: {
      eyebrow: "Reference pages",
      title: "Scores, formulas and data models.",
      description: "Each page gives the formula or data model, the thresholds, the codes used and the original source.",
    },
    entries: [
      {
        href: "/standartlar/tisdale-score",
        category: "clinical",
        title: "Tisdale QT risk score",
        summary: "QT prolongation risk in hospitalised patients from ten risk factors; 0–21 points, ≥11 high risk.",
        codes: ["0–21 points", "QTc ≥450 ms", "Fridericia"],
        source: "Tisdale JE et al. Circ Cardiovasc Qual Outcomes 2013",
        product: "PharmaDeux · QT risk engine",
        status: "Implemented algorithmically · passes synthetic tests",
      },
      {
        href: "/standartlar/ckd-epi-2021",
        category: "clinical",
        title: "CKD-EPI 2021 eGFR",
        summary: "eGFR from creatinine without a race coefficient; KDIGO categories and renal dose check principles.",
        codes: ["LOINC 98979-8", "mL/min/1.73 m²", "G1–G5"],
        source: "Inker LA et al. N Engl J Med 2021",
        product: "PharmaDeux · renal dose check",
        status: "Implemented algorithmically · passes synthetic tests",
      },
      {
        href: "/standartlar/fhir-r4-entegrasyonu",
        category: "technical",
        title: "HL7 FHIR R4 integration",
        summary: "MedicationRequest and Observation resources, code systems, example JSON and integration architecture.",
        codes: ["FHIR R4", "ATC", "LOINC", "UCUM"],
        source: "HL7 International · FHIR R4 (v4.0.1)",
        product: "PharmaDeux and Shield · data layer",
        status: "Data model integrated · no live HIS connection",
      },
      {
        href: "/standartlar/sut-fatura-denetimi",
        category: "administrative",
        title: "SUT billing audit",
        summary: "Shield's pre-submission rule engine: four audit planes, a 0–100 risk score and the audit trail.",
        codes: ["EK-2B", "EK-2C", "ICD-10", "0–100"],
        source: "SGK · Health Implementation Communiqué (SUT)",
        product: "Shield · billing audit",
        status: "3 of 4 planes implemented · tested on synthetic claims",
      },
    ],
    more: "For quality and regulatory status, see",
    moreLinks: [
      { href: "/legal/quality", label: "Quality, information security and MDR" },
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
      wide={
        <>
          <section id="ilkeler" className="scroll-mt-24">
            <SectionHeader {...c.rules} />
            <div className="mt-10">
              <StandardsGrid locale={locale} />
            </div>
          </section>
          <section id="referanslar" className="mt-24 scroll-mt-24 sm:mt-32">
            <SectionHeader {...c.index} />
            <div className="mt-10">
              <StandardsIndex locale={locale} entries={c.entries} />
            </div>
          </section>
        </>
      }
    >
      <p className="!mt-0">
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
