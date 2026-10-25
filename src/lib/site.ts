import { defineContent, type Locale, type RoutePath } from "@/i18n/config";

// Single contact address for the whole site, the JSON-LD and the /api/loi recipient.
export const CONTACT_EMAIL = "contact@lavieuxlabs.com";

// Canonical origin for metadata, JSON-LD, sitemap and OG images. Override per environment with
// NEXT_PUBLIC_SITE_URL (no trailing slash).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lavieuxlabs.com").replace(/\/$/, "");

export const CONSENT_STORAGE_KEY = "lavieux_cookie_consent";

// The natural person who determines the purposes and means of personal-data processing for this website.
// This role does not change PharmaDeux ownership or create authority to sign for its contributors.
export const DATA_CONTROLLER = {
  name: "Tarık Ziya Eren",
  address: null as string | null,
};

// Last content change of each legal page, ISO 8601, rendered per locale with formatDate(). Dates come from the git
// history (last commit that changed the page) and from the dated, uncommitted edits after it. Each page shows its own
// date; the footer shows the latest. Update a page's date whenever its text changes.
export const LEGAL_UPDATED = {
  "/legal/privacy": "2026-10-24",
  "/legal/cookies": "2026-10-24",
  "/legal/terms": "2026-10-24",
  "/legal/quality": "2026-10-24",
} as const;
export type LegalPath = keyof typeof LEGAL_UPDATED;
export const LEGAL_LAST_UPDATED: string = Object.values(LEGAL_UPDATED).sort().reverse()[0];

// Last content change of the standards hub and each reference page, ISO 8601: the date of the last commit that changed
// the page's text. Rendered as "Son güncelleme" and used as the JSON-LD dateModified. This is not the PharmaDeux metrics
// date (metrics.lastUpdated), which tracks product progress. Update a page's date whenever its text changes.
export const STANDARDS_UPDATED = {
  "/standartlar": "2026-10-24",
  "/standartlar/tisdale-score": "2026-10-24",
  "/standartlar/ckd-epi-2021": "2026-10-24",
  "/standartlar/kumulatif-organ-yuku": "2026-10-24",
  "/standartlar/fhir-r4-entegrasyonu": "2026-10-24",
  "/standartlar/sut-fatura-denetimi": "2026-10-24",
} as const;
export type StandardPath = keyof typeof STANDARDS_UPDATED;

// Revision of the printable pilot protocol (PilotProtocol letterhead): last change of its text.
export const PILOT_PROTOCOL_REVISION = "2026-10-24";

// Last content change of every page (sitemap lastModified), ISO 8601. Standards and legal pages read their own
// sources above; the other pages carry the date of the last commit that changed their text.
export const PAGE_UPDATED: Record<RoutePath, string> = {
  "/": "2026-10-24",
  "/initiatives/pharmadeux": "2026-10-24",
  "/initiatives/shield": "2026-10-24",
  "/about": "2026-10-24",
  "/contact": "2026-10-24",
  ...STANDARDS_UPDATED,
  ...LEGAL_UPDATED,
};

// Latest content change across the site (verification imprint).
export const SITE_LAST_MODIFIED: string = Object.values(PAGE_UPDATED).sort().reverse()[0];

// How the organisation describes itself. LavieuxLabs is an independent student venture, not a unit,
// partner or technopark company of the university; every imprint, header and JSON-LD reads from here.
export const organizationProfile = defineContent({
  tr: {
    short: "Bağımsız sağlık teknolojileri Ar-Ge girişimi",
    positioning:
      "LavieuxLabs, Konya Teknik Üniversitesi öğrencileri tarafından geliştirilen, bağımsız bir klinik karar destek ve sağlık teknolojileri Ar-Ge girişimidir.",
    stage: "Henüz şirketleşmedik; projeler Ar-Ge ve prototip aşamasında.",
    independence: "Üniversitenin resmi bir birimi, ortağı veya teknokent firması değiliz.",
  },
  en: {
    short: "Independent health technology R&D venture",
    positioning:
      "LavieuxLabs is an independent clinical decision support and health technology R&D venture built by students of Konya Technical University.",
    stage: "We are not incorporated yet. The projects are at the R&D and prototype stage.",
    independence: "We are not an official unit, partner or technopark company of the university.",
  },
});

// Contact has two axes: how the visitor wants to start (path) and which product it concerns. The
// 15-minute intro call is the default, so a first contact never starts with a Letter of Intent.
export const CONTACT_PATHS = ["intro", "academic", "pilot"] as const;
export type ContactPath = (typeof CONTACT_PATHS)[number];
export const PRODUCT_VALUES = ["pharmadeux", "shield"] as const;
export type ProductValue = (typeof PRODUCT_VALUES)[number];

/** Locale-free contact link; components prefix it with localizedPath(). */
export const contactHref = (path: ContactPath, product?: ProductValue) =>
  `/contact?path=${path}${product ? `&product=${product}` : ""}`;

// Postal address stays in Turkish (it is an address); institution and unit names are translated.
const officeNames = defineContent({
  tr: { institution: "Konya Teknik Üniversitesi", unit: "Mühendislik ve Doğa Bilimleri Fakültesi" },
  en: { institution: "Konya Technical University", unit: "Faculty of Engineering and Natural Sciences" },
});

const officeAddress = {
  street: "Akademi Mah. Yeni İstanbul Cad. No: 363/6",
  postalCode: "42250",
  district: "Selçuklu",
  city: "Konya",
  country: "Türkiye",
};

export function office(locale: Locale) {
  return { ...officeNames[locale], ...officeAddress };
}

export const OFFICE_ADDRESS_LINE = `${officeAddress.street}, ${officeAddress.postalCode} ${officeAddress.district} / ${officeAddress.city}`;

// The map query uses the Turkish names Google knows; only the interface language follows the page.
const officeMapQuery = encodeURIComponent(
  `${officeNames.tr.institution} ${officeNames.tr.unit}, ${OFFICE_ADDRESS_LINE}`,
);
export const officeMapEmbedUrl = (locale: Locale) =>
  `https://www.google.com/maps?q=${officeMapQuery}&hl=${locale}&z=15&output=embed`;
export const OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${officeMapQuery}`;

type NavLink = { href: string; label: string };

// Navigation copy. Hrefs are locale-free; components prefix them with localizedPath().
export const navigation = defineContent({
  tr: {
    products: [
      {
        href: "/initiatives/pharmadeux",
        name: "PharmaDeux CDSS",
        description: "Reçete anında ilaç güvenliği kontrolü",
        icon: "pill" as "pill" | "shield",
      },
      {
        href: "/initiatives/shield",
        name: "Shield",
        description: "Bağımsız proje · fatura gönderilmeden önce red riski kontrolü",
        icon: "shield" as "pill" | "shield",
      },
    ],
    productsLabel: "Projeler",
    allProducts: "Tüm projeler",
    links: [
      { href: "/standartlar", label: "Standartlar" },
      { href: "/about", label: "Hakkımızda" },
    ] as NavLink[],
    cta: "İletişim",
    homeAria: "LavieuxLabs ana sayfa",
    mainNav: "Ana navigasyon",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    legal: [
      { href: "/legal/privacy", label: "Gizlilik ve KVKK Politikası" },
      { href: "/legal/cookies", label: "Çerez Politikası" },
      { href: "/legal/quality", label: "Kalite, Bilgi Güvenliği ve MDR" },
      { href: "/legal/terms", label: "Kullanım Şartları" },
    ] as NavLink[],
    footerColumns: [
      {
        title: "Projeler",
        links: [
          { href: "/initiatives/pharmadeux", label: "PharmaDeux CDSS" },
          { href: "/initiatives/shield", label: "Shield" },
          { href: "/#platformlar", label: "Tüm projeler" },
        ],
      },
      {
        title: "Kurumsal",
        links: [
          { href: "/about", label: "Hakkımızda" },
          { href: "/contact", label: "İletişim" },
          { href: "/contact?path=pilot", label: "Pilot başvurusu (LOI)" },
        ],
      },
      {
        title: "Standartlar",
        links: [
          { href: "/standartlar", label: "Standartlar ve referanslar" },
          { href: "/standartlar/sut-fatura-denetimi", label: "SUT fatura denetimi" },
          { href: "/standartlar#ilkeler", label: "Sekiz kural" },
          { href: "/#yaklasim", label: "Doğrulama ve karar" },
          { href: "/legal/quality", label: "Kalite ve MDR" },
        ],
      },
    ] as { title: string; links: NavLink[] }[],
  },
  en: {
    products: [
      {
        href: "/initiatives/pharmadeux",
        name: "PharmaDeux CDSS",
        description: "Medication safety check at the moment of prescribing",
        icon: "pill",
      },
      {
        href: "/initiatives/shield",
        name: "Shield",
        description: "Independent project · claim rejection risk check before submission",
        icon: "shield",
      },
    ],
    productsLabel: "Projects",
    allProducts: "All projects",
    links: [
      { href: "/standartlar", label: "Standards" },
      { href: "/about", label: "About" },
    ],
    cta: "Contact",
    homeAria: "LavieuxLabs home",
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    legal: [
      { href: "/legal/privacy", label: "Privacy Policy (KVKK)" },
      { href: "/legal/cookies", label: "Cookie Policy" },
      { href: "/legal/quality", label: "Quality, Information Security and MDR" },
      { href: "/legal/terms", label: "Terms of Use" },
    ],
    footerColumns: [
      {
        title: "Projects",
        links: [
          { href: "/initiatives/pharmadeux", label: "PharmaDeux CDSS" },
          { href: "/initiatives/shield", label: "Shield" },
          { href: "/#platformlar", label: "All projects" },
        ],
      },
      {
        title: "Organisation",
        links: [
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
          { href: "/contact?path=pilot", label: "Apply for a pilot (LOI)" },
        ],
      },
      {
        title: "Standards",
        links: [
          { href: "/standartlar", label: "Standards and references" },
          { href: "/standartlar/sut-fatura-denetimi", label: "SUT billing audit" },
          { href: "/standartlar#ilkeler", label: "Eight rules" },
          { href: "/#yaklasim", label: "Verification and decision" },
          { href: "/legal/quality", label: "Quality and MDR" },
        ],
      },
    ],
  },
});
