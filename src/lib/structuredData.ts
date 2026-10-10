import { CONTACT_EMAIL, SITE_URL, office } from "@/lib/site";
import { defineContent, type Locale } from "@/i18n/config";
import { absoluteUrl } from "@/i18n/metadata";

// Schema.org structured data. LavieuxLabs is described as a ResearchOrganization, not a
// MedicalOrganization: the latter is for care providers (hospitals, clinics) and would misstate
// what the company does. Product entries state regulatory status plainly (no CE mark yet) and
// carry no offers, since nothing is on sale. One organization node (@id) is shared by both
// languages; WebSite, products and breadcrumbs are emitted per locale with inLanguage.

const ORG_ID = `${SITE_URL}/#organization`;

const inLanguage: Record<Locale, string> = { tr: "tr-TR", en: "en" };

const copy = defineContent({
  tr: {
    orgDescription:
      "İlaç güvenliği ve hastane faturalaması için test edilebilir karar destek yazılımı geliştiren sağlık teknolojileri Ar-Ge ekibi.",
    knowsAbout: [
      "Klinik karar destek sistemleri",
      "İlaç güvenliği",
      "Farmakovijilans",
      "Sağlık gelir döngüsü yönetimi",
      "HL7 FHIR",
    ],
    home: "Ana sayfa",
    pharma: {
      subCategory: "Klinik karar destek sistemi (CDSS)",
      description:
        "Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi. MDR 2017/745 Kural 11 kapsamında Sınıf IIa hedefli tıbbi cihaz yazılımı (SaMD) olarak geliştirilmektedir; henüz CE işareti yoktur.",
      features: [
        "18 güvenlik düzleminde ilaç-ilaç etkileşimi, organ toksisitesi ve kümülatif yük kontrolü",
        "Kural kimliği ve eşik değeriyle gerekçeli uyarı",
        "HL7 FHIR R4 veri modeli",
        "Yalnızca eklenebilir denetim kaydı",
      ],
      requirements: "HL7 FHIR R4 uyumlu hastane bilgi sistemi",
    },
    shield: {
      subCategory: "Hastane gelir bütünlüğü ve provizyon denetimi",
      description:
        "Hastane fatura ve provizyon süreçlerindeki SUT/SGK red risklerini işlem öncesinde tespit eden kurumsal denetim katmanı. Riskli kalemleri gerekçesiyle uzman incelemesine yönlendirir; tanı koymaz ve tedavi kararı vermez.",
      features: [
        "Gönderim öncesi red riski kontrolü",
        "Kural katkılarından oluşan 0–100 risk skoru",
        "Uzman inceleme kuyruğu",
        "Yalnızca eklenebilir denetim kaydı ve kurum bazında izolasyon",
      ],
      audience: "Hastane gelir döngüsü ve provizyon ekipleri",
    },
  },
  en: {
    orgDescription:
      "Health technology R&D team building testable decision support software for medication safety and hospital billing.",
    knowsAbout: [
      "Clinical decision support systems",
      "Medication safety",
      "Pharmacovigilance",
      "Healthcare revenue cycle management",
      "HL7 FHIR",
    ],
    home: "Home",
    pharma: {
      subCategory: "Clinical decision support system (CDSS)",
      description:
        "Clinical decision support software alerting physicians to cumulative organ burden and toxicity at the moment of prescription. Developed as medical device software (SaMD) targeting Class IIa under MDR 2017/745 Rule 11; it does not have a CE mark yet.",
      features: [
        "Drug–drug interaction, organ toxicity and cumulative burden checks across 18 safety planes",
        "Alerts shown with the rule ID and threshold that triggered them",
        "HL7 FHIR R4 data model",
        "Append-only audit log",
      ],
      requirements: "Hospital information system with HL7 FHIR R4 support",
    },
    shield: {
      subCategory: "Hospital revenue integrity and claim pre-check",
      description:
        "Pre-claim revenue integrity platform identifying reimbursement and audit risks before submission. Routes risky line items to specialist review with the reason attached; it does not diagnose or make treatment decisions.",
      features: [
        "Rejection risk check before submission",
        "0–100 risk score built from rule contributions",
        "Specialist review queue",
        "Append-only audit log and per-institution isolation",
      ],
      audience: "Hospital revenue cycle and claims teams",
    },
  },
});

function organization(locale: Locale) {
  const place = office(locale);
  return {
    "@type": "ResearchOrganization",
    "@id": ORG_ID,
    name: "LavieuxLabs",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: copy[locale].orgDescription,
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${place.street}, ${place.institution} ${place.unit}`,
      postalCode: place.postalCode,
      addressLocality: place.district,
      addressRegion: place.city,
      addressCountry: "TR",
    },
    areaServed: "TR",
    knowsAbout: copy[locale].knowsAbout,
  };
}

export function homeJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(locale),
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl(locale, "/")}#website`,
        url: absoluteUrl(locale, "/"),
        name: "LavieuxLabs",
        inLanguage: inLanguage[locale],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

function breadcrumb(locale: Locale, name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy[locale].home, item: absoluteUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(locale, path) },
    ],
  };
}

export function pharmaDeuxJsonLd(locale: Locale) {
  const c = copy[locale].pharma;
  const path = "/initiatives/pharmadeux";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "PharmaDeux CDSS",
        url: absoluteUrl(locale, path),
        applicationCategory: "HealthApplication",
        applicationSubCategory: c.subCategory,
        operatingSystem: "Web",
        inLanguage: inLanguage[locale],
        description: c.description,
        featureList: c.features,
        softwareRequirements: c.requirements,
        audience: { "@type": "MedicalAudience", audienceType: "Clinician" },
        creator: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
      },
      breadcrumb(locale, "PharmaDeux CDSS", path),
    ],
  };
}

export function shieldJsonLd(locale: Locale) {
  const c = copy[locale].shield;
  const path = "/initiatives/shield";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Shield",
        url: absoluteUrl(locale, path),
        applicationCategory: "BusinessApplication",
        applicationSubCategory: c.subCategory,
        operatingSystem: "Web",
        inLanguage: inLanguage[locale],
        description: c.description,
        featureList: c.features,
        audience: { "@type": "BusinessAudience", audienceType: c.audience },
        creator: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
      },
      breadcrumb(locale, "Shield", path),
    ],
  };
}
