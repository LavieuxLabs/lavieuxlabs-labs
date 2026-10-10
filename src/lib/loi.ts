// Pilot / LOI request: field limits, sanitising and validation shared by the contact form (browser)
// and the /api/loi route handler (server). The server re-runs the same checks, because the API can be
// called without the form. Validation returns error codes; the form maps them to localised messages.

import { SOLUTION_VALUES, type SolutionValue } from "@/lib/site";
import { defineContent, locales, type Locale } from "@/i18n/config";

export const LIMITS = {
  organization: 120,
  name: 80,
  title: 80,
  email: 254,
  message: 2000,
} as const;

export const MESSAGE_MIN = 20;

/** Name of the honeypot input. Real users never see it; bots that auto-fill every field do. */
export const HONEYPOT_FIELD = "website_hp";

export const REQUEST_TYPES = defineContent<string[]>({
  tr: ["Niyet Mektubu (LOI) / Pilot", "Ürün demosu", "Retrospektif doğrulama iş birliği", "Genel bilgi"],
  en: ["Letter of Intent (LOI) / Pilot", "Product demo", "Retrospective validation study", "General enquiry"],
});

export type LoiFields = {
  organization: string;
  name: string;
  title: string;
  email: string;
  requestType: string;
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
  | "titleLong"
  | "titleChars"
  | "email"
  | "messageShort"
  | "messageLong"
  | "messageMarkup"
  | "solution"
  | "consent";

export type LoiErrors = Partial<Record<keyof LoiFields | "solution", LoiErrorCode>>;

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
    title: cleanLine(f.title),
    email: cleanLine(f.email).toLowerCase(),
    requestType: cleanLine(f.requestType),
    message: cleanText(f.message),
  };
}

export function isSolution(value: unknown): value is SolutionValue {
  return SOLUTION_VALUES.some((v) => v === value);
}

export function isLocale(value: unknown): value is Locale {
  return locales.some((l) => l === value);
}

export function validateLoi(f: LoiFields, solution: unknown, locale: Locale): LoiErrors {
  const errors: LoiErrors = {};

  if (f.organization.length < 2) errors.organization = "organizationMissing";
  else if (f.organization.length > LIMITS.organization) errors.organization = "organizationLong";
  else if (!ORGANIZATION_PATTERN.test(f.organization)) errors.organization = "organizationChars";

  if (f.name.length < 2) errors.name = "nameMissing";
  else if (f.name.length > LIMITS.name) errors.name = "nameLong";
  else if (!NAME_PATTERN.test(f.name)) errors.name = "nameChars";

  if (f.title) {
    if (f.title.length > LIMITS.title) errors.title = "titleLong";
    else if (!ORGANIZATION_PATTERN.test(f.title)) errors.title = "titleChars";
  }

  if (!EMAIL_PATTERN.test(f.email)) errors.email = "email";

  if (f.message.length < MESSAGE_MIN) errors.message = "messageShort";
  else if (f.message.length > LIMITS.message) errors.message = "messageLong";
  else if (MARKUP_PATTERN.test(f.message)) errors.message = "messageMarkup";

  if (!isSolution(solution) || !REQUEST_TYPES[locale].includes(f.requestType)) errors.solution = "solution";

  if (f.consent !== true) errors.consent = "consent";
  return errors;
}

/** Limit shown in the message for codes that mention a number. */
export const ERROR_LIMIT: Partial<Record<LoiErrorCode, number>> = {
  organizationLong: LIMITS.organization,
  nameLong: LIMITS.name,
  titleLong: LIMITS.title,
  messageShort: MESSAGE_MIN,
  messageLong: LIMITS.message,
};

/** Request body the form posts to /api/loi. */
export type LoiPayload = LoiFields & { locale: Locale; solution: SolutionValue; [HONEYPOT_FIELD]: string };
