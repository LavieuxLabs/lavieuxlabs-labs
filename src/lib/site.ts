export const CONTACT_EMAIL = "contact@lavieuxlabs.com";

export const CONSENT_STORAGE_KEY = "lavieux_cookie_consent";

// Legal entity details shown in the policies. Fill in once the company registration is final;
// fields left null are omitted from the rendered text.
export const LEGAL_ENTITY = {
  name: "LavieuxLabs",
  address: null as string | null,
  mersis: null as string | null,
};

export const LEGAL_LAST_UPDATED = "8 Ekim 2026";

export const solutions = [
  { value: "pharmadeux", label: "PharmaDeux CDSS" },
  { value: "shield", label: "Shield" },
  { value: "academic", label: "Akademik İş Birliği" },
] as const;

export type SolutionValue = (typeof solutions)[number]["value"];

export const OFFICE = {
  institution: "Konya Teknik Üniversitesi",
  unit: "Mühendislik ve Doğa Bilimleri Fakültesi",
  street: "Akademi Mah. Yeni İstanbul Cad. No: 363/6",
  postalCode: "42250",
  district: "Selçuklu",
  city: "Konya",
  country: "Türkiye",
};

export const OFFICE_ADDRESS_LINE = `${OFFICE.street}, ${OFFICE.postalCode} ${OFFICE.district} / ${OFFICE.city}`;

const officeMapQuery = encodeURIComponent(`${OFFICE.institution} ${OFFICE.unit}, ${OFFICE_ADDRESS_LINE}`);
export const OFFICE_MAP_EMBED_URL = `https://www.google.com/maps?q=${officeMapQuery}&hl=tr&z=15&output=embed`;
export const OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${officeMapQuery}`;

export const products = [
  {
    href: "/initiatives/pharmadeux",
    name: "PharmaDeux CDSS",
    description: "Reçete anında ilaç güvenliği kontrolü",
    icon: "pill",
  },
  {
    href: "/initiatives/shield",
    name: "Shield",
    description: "Fatura gönderilmeden önce red riski kontrolü",
    icon: "shield",
  },
] as const;

export const navLinks = [
  { href: "/#standartlar", label: "Standartlar" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
];

export const legalLinks = [
  { href: "/legal/privacy", label: "Gizlilik ve KVKK Politikası" },
  { href: "/legal/cookies", label: "Çerez Politikası" },
  { href: "/legal/quality", label: "Kalite, Bilgi Güvenliği ve MDR" },
  { href: "/legal/terms", label: "Kullanım Şartları" },
];

export const footerColumns = [
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
];
