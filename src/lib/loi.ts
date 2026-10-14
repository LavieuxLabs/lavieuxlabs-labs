// Contact request (intro call, academic partnership, pilot / LOI): field limits, option lists,
// sanitising and validation shared by the contact form (browser) and the /api/loi route handler
// (server). The server re-runs the same checks, because the API can be called without the form.
// Validation returns error codes; the form maps them to localised messages.

import { CONTACT_PATHS, PRODUCT_VALUES, type ContactPath, type ProductValue } from "@/lib/site";
import { defineContent, locales, type Locale } from "@/i18n/config";

export const LIMITS = {
  organization: 120,
  name: 80,
  email: 254,
  message: 2000,
} as const;

/** The intro call needs no message; academic and pilot requests need a short description. */
export const MESSAGE_MIN: Record<ContactPath, number> = { intro: 0, academic: 20, pilot: 20 };

/** Name of the honeypot input. Real users never see it; bots that auto-fill every field do. */
export const HONEYPOT_FIELD = "website_hp";

type Options = {
  /** Who is writing. Product paths list the people who buy or use that product. */
  roles: Record<ProductValue | "academic", string[]>;
  /** Pilot type per product (pilot path only). */
  pilotTypes: Record<ProductValue, string[]>;
  /** Area of work (academic path only). */
  academicFocus: string[];
};

export const CONTACT_OPTIONS = defineContent<Options>({
  tr: {
    roles: {
      pharmadeux: [
        "Hekim",
        "Klinik eczacı",
        "Başhekim / başhekim yardımcısı",
        "Eczacılık hizmetleri sorumlusu",
        "Bilgi işlem / HBYS sorumlusu",
        "Diğer",
      ],
      shield: [
        "Gelir döngüsü yöneticisi",
        "Fatura / provizyon sorumlusu",
        "Döner sermaye / mali işler",
        "Hastane yöneticisi",
        "Bilgi işlem / HBYS sorumlusu",
        "Diğer",
      ],
      academic: [
        "Hekim",
        "Klinik eczacı",
        "Farmakolog",
        "Tıp fakültesi araştırmacısı",
        "Eczacılık fakültesi araştırmacısı",
        "Diğer",
      ],
    },
    pilotTypes: {
      pharmadeux: ["Retrospektif reçete doğrulaması", "CDSS gölge modu"],
      shield: ["Retrospektif fatura testi", "Gönderim öncesi pilot"],
    },
    academicFocus: [
      "Klinik doğrulama çalışması",
      "Farmakoloji kuralları",
      "Organ risk protokolleri",
      "Ortak fon başvurusu",
      "Diğer",
    ],
  },
  en: {
    roles: {
      pharmadeux: [
        "Physician",
        "Clinical pharmacist",
        "Chief medical officer / deputy",
        "Head of pharmacy services",
        "IT / HIS lead",
        "Other",
      ],
      shield: [
        "Revenue cycle manager",
        "Billing / pre-authorisation lead",
        "Finance office",
        "Hospital manager",
        "IT / HIS lead",
        "Other",
      ],
      academic: [
        "Physician",
        "Clinical pharmacist",
        "Pharmacologist",
        "Medical faculty researcher",
        "Pharmacy faculty researcher",
        "Other",
      ],
    },
    pilotTypes: {
      pharmadeux: ["Retrospective prescription validation", "CDSS shadow mode"],
      shield: ["Retrospective claims test", "Pre-submission pilot"],
    },
    academicFocus: [
      "Clinical validation study",
      "Pharmacology rules",
      "Organ risk protocols",
      "Joint funding application",
      "Other",
    ],
  },
});

/** Role options for a path and product. */
export function roleOptions(locale: Locale, path: ContactPath, product: ProductValue) {
  const o = CONTACT_OPTIONS[locale];
  return path === "academic" ? o.roles.academic : o.roles[product];
}

/** Second select: pilot type (pilot), area of work (academic); the intro call has none. */
export function detailOptions(locale: Locale, path: ContactPath, product: ProductValue): string[] {
  const o = CONTACT_OPTIONS[locale];
  if (path === "pilot") return o.pilotTypes[product];
  if (path === "academic") return o.academicFocus;
  return [];
}

export type LoiFields = {
  organization: string;
  name: string;
  email: string;
  role: string;
  detail: string;
  message: string;
  consent: boolean;
};

export type LoiErrorCode =
  | "organizationMissing"
  | "organizationLong"
  | "organizationChars"
  | "nameMissing"
  | "nameLong"
  | "nameChars"
  | "email"
  | "role"
  | "detail"
  | "messageShort"
  | "messageLong"
  | "messageMarkup"
  | "path"
  | "consent";

export type LoiErrors = Partial<Record<keyof LoiFields | "path", LoiErrorCode>>;

// C0/C1 control characters, zero-width / bidi override characters (used to disguise content).
const CONTROL_CHARS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;
const LINE_BREAKS = /[\r\n\u2028\u2029]+/g;

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const ORGANIZATION_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} .,&'’()\/+-]*$/u;
// Practical subset of RFC 5321: ASCII local part without leading/trailing/double dots,
// hostname labels of 1–63 chars, alphabetic TLD.
const EMAIL_PATTERN =
  /^(?=.{6,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
// Markup or script-URL vectors that have no place in a plain-text enquiry. Bare comparisons
// such as "eGFR < 30" stay valid; event handlers only matter inside tags, which are already blocked.
const MARKUP_PATTERN = /<\s*\/?\s*[a-z!][^>]*>|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html/i;

/** Single-line field: drop control chars and line breaks (blocks header injection), collapse whitespace. */
function cleanLine(value: string) {
  return value
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(LINE_BREAKS, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Multi-line field: keep line breaks, drop other control chars, cap blank-line runs. */
function cleanText(value: string) {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeLoi(f: LoiFields): LoiFields {
  return {
    ...f,
    organization: cleanLine(f.organization),
    name: cleanLine(f.name),
    email: cleanLine(f.email).toLowerCase(),
    role: cleanLine(f.role),
    detail: cleanLine(f.detail),
    message: cleanText(f.message),
  };
}

export function isContactPath(value: unknown): value is ContactPath {
  return CONTACT_PATHS.some((v) => v === value);
}

export function isProduct(value: unknown): value is ProductValue {
  return PRODUCT_VALUES.some((v) => v === value);
}

export function isLocale(value: unknown): value is Locale {
  return locales.some((l) => l === value);
}

export function validateLoi(f: LoiFields, path: unknown, product: unknown, locale: Locale): LoiErrors {
  const errors: LoiErrors = {};

  if (f.organization.length < 2) errors.organization = "organizationMissing";
  else if (f.organization.length > LIMITS.organization) errors.organization = "organizationLong";
  else if (!ORGANIZATION_PATTERN.test(f.organization)) errors.organization = "organizationChars";

  if (f.name.length < 2) errors.name = "nameMissing";
  else if (f.name.length > LIMITS.name) errors.name = "nameLong";
  else if (!NAME_PATTERN.test(f.name)) errors.name = "nameChars";

  if (!EMAIL_PATTERN.test(f.email)) errors.email = "email";

  // Path and product decide which options are valid; the academic path has no product.
  if (!isContactPath(path) || (path !== "academic" && !isProduct(product))) {
    errors.path = "path";
    return errors;
  }
  const productForOptions: ProductValue = isProduct(product) ? product : "pharmadeux";
  if (!roleOptions(locale, path, productForOptions).includes(f.role)) errors.role = "role";
  const details = detailOptions(locale, path, productForOptions);
  if (details.length > 0 ? !details.includes(f.detail) : f.detail !== "") errors.detail = "detail";

  if (f.message.length < MESSAGE_MIN[path]) errors.message = "messageShort";
  else if (f.message.length > LIMITS.message) errors.message = "messageLong";
  else if (MARKUP_PATTERN.test(f.message)) errors.message = "messageMarkup";

  if (f.consent !== true) errors.consent = "consent";
  return errors;
}

/** Limit shown in the message for codes that mention a number. */
export const ERROR_LIMIT: Partial<Record<LoiErrorCode, number>> = {
  organizationLong: LIMITS.organization,
  nameLong: LIMITS.name,
  messageShort: MESSAGE_MIN.pilot,
  messageLong: LIMITS.message,
};

/** Request body the form posts to /api/loi. `product` is null on the academic path. */
export type LoiPayload = LoiFields & {
  locale: Locale;
  path: ContactPath;
  product: ProductValue | null;
  [HONEYPOT_FIELD]: string;
};
