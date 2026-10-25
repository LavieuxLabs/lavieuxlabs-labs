import { CONTACT_EMAIL, SITE_URL, STANDARDS_UPDATED, office, type StandardPath } from "@/lib/site";
import { TEAM, TEAM_LEAD, teamCopy } from "@/lib/team";
import { metrics } from "@/lib/metrics";
import { defineContent, type Locale } from "@/i18n/config";
import { absoluteUrl } from "@/i18n/metadata";

// Schema.org structured data. LavieuxLabs is a plain Organization: an unincorporated student venture, not a
// research institute or a care provider, and not presented as the holder of rights in the software. Product
// entries state regulatory status plainly (no CE mark yet) and carry no offers, since nothing is on sale. One
// organization node (@id) is shared by both languages; WebSite, products and breadcrumbs are emitted per locale.

const ORG_ID = `${SITE_URL}/#organization`;
// The team lead is one Person node: a member of the organization and, separately, creator of Shield, an
// independent project. No founder is named: who founded the venture is not stated anywhere on the site.
const PERSON_ID = `${SITE_URL}/#tarik-ziya-eren`;

const inLanguage: Record<Locale, string> = { tr: "tr-TR", en: "en" };

const copy = defineContent({
  tr: {
    orgDescription:
      "Konya Teknik Üniversitesi öğrencilerinin kurduğu, henüz şirketleşmemiş bağımsız öğrenci Ar-Ge girişimi. İlaç güvenliği için PharmaDeux ve hastane faturalaması için Shield prototiplerini geliştirir.",
    knowsAbout: [
      "Klinik karar destek sistemleri",
      "İlaç güvenliği",
      "Farmakovijilans",
      "HL7 FHIR",
    ],
    home: "Ana sayfa",
    pharma: {
      subCategory: "Klinik karar destek sistemi (CDSS)",
      description:
        "Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi. MDR 2017/745 Kural 11 kapsamında Sınıf IIa hedefli tıbbi cihaz yazılımı (SaMD) olarak geliştirilmektedir; henüz CE işareti yoktur.",
      features: [
        `${metrics.safetyPlanes} güvenlik düzleminde ilaç-ilaç etkileşimi, organ toksisitesi ve kümülatif yük kontrolü`,
        "Kural kimliği ve eşik değeriyle gerekçeli uyarı",
        "HL7 FHIR R4 veri modeli",
        "Yalnızca eklenebilir denetim kaydı",
      ],
      requirements: "HL7 FHIR R4 uyumlu hastane bilgi sistemi",
    },
    shield: {
      subCategory: "Hastane gelir bütünlüğü ve provizyon denetimi",
      description:
        "Hastane fatura ve provizyon kalemlerindeki SUT/SGK red riskini gönderim öncesinde gösteren prototip. Riskli kalemi gerekçesiyle uzman incelemesine yönlendirir. Gerçek faturalarda doğrulanmadı; tanı koymaz ve tedavi kararı vermez.",
      features: [
        "Gönderim öncesi red riski kontrolü",
        "Kural katkılarından oluşan 0–100 kural skoru (ret olasılığı değil)",
        "Uzman inceleme kuyruğu",
        "Yalnızca eklenebilir denetim kaydı ve kurum bazında izolasyon (tasarım ilkesi)",
      ],
      audience: "Hastane gelir döngüsü ve provizyon ekipleri",
    },
  },
  en: {
    orgDescription:
      "An independent student R&D venture founded by students of Konya Technical University and not yet incorporated. It develops the PharmaDeux medication-safety and Shield hospital-billing prototypes.",
    knowsAbout: [
      "Clinical decision support systems",
      "Medication safety",
      "Pharmacovigilance",
      "HL7 FHIR",
    ],
    home: "Home",
    pharma: {
      subCategory: "Clinical decision support system (CDSS)",
      description:
        "Clinical decision support software alerting physicians to cumulative organ burden and toxicity at the moment of prescription. Developed as medical device software (SaMD) targeting Class IIa under MDR 2017/745 Rule 11; it does not have a CE mark yet.",
      features: [
        `Drug–drug interaction, organ toxicity and cumulative burden checks across ${metrics.safetyPlanes} safety planes`,
        "Alerts shown with the rule ID and threshold that triggered them",
        "HL7 FHIR R4 data model",
        "Append-only audit log",
      ],
      requirements: "Hospital information system with HL7 FHIR R4 support",
    },
    shield: {
      subCategory: "Hospital revenue integrity and claim pre-check",
      description:
        "An independent prototype by Tarık Ziya Eren, presented on the LavieuxLabs website. It flags SUT/SGK rejection risk on hospital claim and provision line items before submission and routes a risky item to specialist review with the reason attached. It has not been validated on real claims; it does not diagnose or make treatment decisions.",
      features: [
        "Rejection risk check before submission",
        "0–100 rule score built from rule contributions (not a probability of rejection)",
        "Specialist review queue",
        "Append-only audit log and per-institution isolation (design principle)",
      ],
      audience: "Hospital revenue cycle and claims teams",
    },
  },
});

function organization(locale: Locale) {
  const place = office(locale);
  return {
    // A plain Organization: an unincorporated student venture, not a research institute or a care provider.
    "@type": "Organization",
    "@id": ORG_ID,
    name: "LavieuxLabs",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: copy[locale].orgDescription,
    email: CONTACT_EMAIL,
    // No postal address: the only address on the site is the university faculty where the team studies,
    // which is not the venture's own office. The city is enough to place it.
    location: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: place.city, addressCountry: "TR" } },
    member: { "@id": PERSON_ID },
    areaServed: "TR",
    knowsAbout: copy[locale].knowsAbout,
  };
}

/** Person node for a team member; the lead keeps the shared PERSON_ID used across pages. */
function teamMember(locale: Locale, m: (typeof TEAM)[number]) {
  const links = [m.github, m.linkedin].filter((url): url is string => !!url);
  return {
    "@type": "Person",
    "@id": m.id === TEAM_LEAD.id ? PERSON_ID : `${SITE_URL}/#${m.id}`,
    name: m.name,
    jobTitle: teamCopy[locale][m.id].role,
    ...(links.length ? { sameAs: links } : {}),
  };
}

function teamLead(locale: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: TEAM_LEAD.name,
    jobTitle: teamCopy[locale][TEAM_LEAD.id].role,
    ...(TEAM_LEAD.github || TEAM_LEAD.linkedin
      ? { sameAs: [TEAM_LEAD.github, TEAM_LEAD.linkedin].filter((url): url is string => !!url) }
      : {}),
  };
}

export function homeJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(locale),
      teamLead(locale),
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
  const url = absoluteUrl(locale, path);
  const members = TEAM.map((m) => teamMember(locale, m));
  // The software is created by the team members together; the venture only publishes the page. No rights holder
  // is stated, because the sharing of rights between members is not documented on the site.
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...members,
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#software`,
        name: "PharmaDeux CDSS",
        url,
        applicationCategory: "HealthApplication",
        applicationSubCategory: c.subCategory,
        operatingSystem: "Web",
        inLanguage: inLanguage[locale],
        description: c.description,
        featureList: c.features,
        softwareRequirements: c.requirements,
        audience: { "@type": "MedicalAudience", audienceType: "Clinician" },
        creativeWorkStatus: "Prototype",
        creator: members.map((p) => ({ "@id": p["@id"] })),
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "PharmaDeux CDSS",
        inLanguage: inLanguage[locale],
        isPartOf: { "@id": `${absoluteUrl(locale, "/")}#website` },
        about: { "@id": `${url}#software` },
        publisher: { "@id": ORG_ID },
      },
      breadcrumb(locale, "PharmaDeux CDSS", path),
    ],
  };
}

export function shieldJsonLd(locale: Locale) {
  const c = copy[locale].shield;
  const path = "/initiatives/shield";
  const url = absoluteUrl(locale, path);
  // Creator and publisher are different parties: Shield is Tarık Ziya Eren's project (creator), and
  // LavieuxLabs only publishes the web page that presents it. The software node has no publisher.
  return {
    "@context": "https://schema.org",
    "@graph": [
      teamLead(locale),
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#software`,
        name: "Shield",
        url,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: c.subCategory,
        operatingSystem: "Web",
        inLanguage: inLanguage[locale],
        description: c.description,
        featureList: c.features,
        audience: { "@type": "BusinessAudience", audienceType: c.audience },
        creativeWorkStatus: "Prototype",
        creator: { "@id": PERSON_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Shield",
        inLanguage: inLanguage[locale],
        isPartOf: { "@id": `${absoluteUrl(locale, "/")}#website` },
        about: { "@id": `${url}#software` },
        publisher: { "@id": ORG_ID },
      },
      breadcrumb(locale, "Shield", path),
    ],
  };
}

// ── Standards & reference portal ─────────────────────────────────────────────
// Reference pages carry no reviewedBy: a named reviewer is only added when one has actually reviewed
// the page. dateModified is the page's own content date (STANDARDS_UPDATED), not the product metrics date.

const STANDARDS_PATH = "/standartlar" satisfies StandardPath;
const standardsName: Record<Locale, string> = { tr: "Standartlar ve referanslar", en: "Standards and references" };

function standardsBreadcrumb(locale: Locale, page?: { name: string; path: string }) {
  const items = [
    { "@type": "ListItem", position: 1, name: copy[locale].home, item: absoluteUrl(locale, "/") },
    { "@type": "ListItem", position: 2, name: standardsName[locale], item: absoluteUrl(locale, STANDARDS_PATH) },
  ];
  if (page) items.push({ "@type": "ListItem", position: 3, name: page.name, item: absoluteUrl(locale, page.path) });
  return { "@type": "BreadcrumbList", itemListElement: items };
}

export function standardsHubJsonLd(locale: Locale, pages: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl(locale, STANDARDS_PATH)}#page`,
        name: standardsName[locale],
        url: absoluteUrl(locale, STANDARDS_PATH),
        inLanguage: inLanguage[locale],
        dateModified: STANDARDS_UPDATED[STANDARDS_PATH],
        publisher: { "@id": ORG_ID },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: pages.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absoluteUrl(locale, p.path) })),
        },
      },
      standardsBreadcrumb(locale),
    ],
  };
}

type StandardPage = {
  locale: Locale;
  path: StandardPath;
  name: string;
  description: string;
  /** MedicalWebPage for clinical references, TechnicalArticle for integration documentation. */
  kind: "medical" | "technical";
  /** Main entity (e.g. a MedicalRiskScore) described by the page. */
  about?: Record<string, unknown>;
  citations: string[];
};

export function standardPageJsonLd({ locale, path, name, description, kind, about, citations }: StandardPage) {
  const page = {
    "@type": kind === "medical" ? "MedicalWebPage" : "TechnicalArticle",
    "@id": `${absoluteUrl(locale, path)}#page`,
    ...(kind === "medical" ? { name } : { headline: name, proficiencyLevel: "Expert" }),
    description,
    url: absoluteUrl(locale, path),
    inLanguage: inLanguage[locale],
    dateModified: STANDARDS_UPDATED[path],
    isPartOf: { "@id": `${absoluteUrl(locale, STANDARDS_PATH)}#page` },
    publisher: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
    ...(kind === "medical" ? { audience: { "@type": "MedicalAudience", audienceType: "Clinician" } } : {}),
    ...(about ? (kind === "medical" ? { mainEntity: about } : { about }) : {}),
    citation: citations,
  };
  return { "@context": "https://schema.org", "@graph": [page, standardsBreadcrumb(locale, { name, path })] };
}
