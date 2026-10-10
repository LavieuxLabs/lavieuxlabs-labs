import { defineContent, type Locale } from "@/i18n/config";

export const CONTACT_EMAIL = "lavieuxlabs@gmail.com";

// Canonical origin for metadata, JSON-LD, sitemap and OG images. Override per environment with
// NEXT_PUBLIC_SITE_URL (no trailing slash).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lavieuxlabs.com").replace(/\/$/, "");

// Last content revision, ISO 8601 (sitemap lastModified).
export const SITE_LAST_MODIFIED = "2026-10-09";

export const CONSENT_STORAGE_KEY = "lavieux_cookie_consent";

// Legal entity details shown in the policies. Fill in once the company registration is final;
// fields left null are omitted from the rendered text.
export const LEGAL_ENTITY = {
  name: "LavieuxLabs",
  address: null as string | null,
  mersis: null as string | null,
};

// ISO 8601; rendered per locale with formatDate().
export const LEGAL_LAST_UPDATED = "2026-10-08";

export const SOLUTION_VALUES = ["pharmadeux", "shield", "academic"] as const;
export type SolutionValue = (typeof SOLUTION_VALUES)[number];

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
        description: "Fatura gönderilmeden önce red riski kontrolü",
        icon: "shield" as "pill" | "shield",
      },
    ],
    productsLabel: "Ürünler",
    allProducts: "Tüm ürünler",
    links: [
      { href: "/#standartlar", label: "Standartlar" },
      { href: "/about", label: "Hakkımızda" },
      { href: "/contact", label: "İletişim" },
    ] as NavLink[],
    cta: "Pilot başvurusu (LOI)",
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
        title: "Ürünler",
        links: [
          { href: "/initiatives/pharmadeux", label: "PharmaDeux CDSS" },
          { href: "/initiatives/shield", label: "Shield" },
          { href: "/#platformlar", label: "Tüm ürünler" },
        ],
      },
      {
        title: "Kurumsal",
        links: [
          { href: "/about", label: "Hakkımızda" },
          { href: "/contact", label: "İletişim" },
          { href: "/contact?solution=pharmadeux", label: "Pilot başvurusu (LOI)" },
        ],
      },
      {
        title: "Standartlar",
        links: [
          { href: "/#standartlar", label: "Sekiz kural" },
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
        description: "Claim rejection risk check before submission",
        icon: "shield",
      },
    ],
    productsLabel: "Products",
    allProducts: "All products",
    links: [
      { href: "/#standartlar", label: "Standards" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    cta: "Apply for a pilot (LOI)",
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
        title: "Products",
        links: [
          { href: "/initiatives/pharmadeux", label: "PharmaDeux CDSS" },
          { href: "/initiatives/shield", label: "Shield" },
          { href: "/#platformlar", label: "All products" },
        ],
      },
      {
        title: "Company",
        links: [
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
          { href: "/contact?solution=pharmadeux", label: "Apply for a pilot (LOI)" },
        ],
      },
      {
        title: "Standards",
        links: [
          { href: "/#standartlar", label: "Eight rules" },
          { href: "/#yaklasim", label: "Verification and decision" },
          { href: "/legal/quality", label: "Quality and MDR" },
        ],
      },
    ],
  },
});
