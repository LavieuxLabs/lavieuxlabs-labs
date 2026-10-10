"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { CONTACT_EMAIL, SOLUTION_VALUES, type SolutionValue } from "@/lib/site";
import { solutionContent } from "@/lib/solutionContent";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import CopyEmail from "@/components/CopyEmail";

const copy = defineContent({
  tr: {
    requestTypes: ["Niyet Mektubu (LOI) / Pilot", "Ürün demosu", "Retrospektif doğrulama iş birliği", "Genel bilgi"],
    errors: {
      organizationMissing: "Kurum adını giriniz.",
      organizationLong: (max: number) => `Kurum adı en fazla ${max} karakter olabilir.`,
      organizationChars: "Kurum adı geçersiz karakterler içeriyor.",
      nameMissing: "İlgili kişinin adını giriniz.",
      nameLong: (max: number) => `Ad en fazla ${max} karakter olabilir.`,
      nameChars: "Ad yalnızca harf, boşluk, nokta, kesme ve tire içerebilir.",
      titleLong: (max: number) => `Unvan en fazla ${max} karakter olabilir.`,
      titleChars: "Unvan geçersiz karakterler içeriyor.",
      email: "Geçerli bir e-posta adresi giriniz.",
      messageShort: (min: number) => `Lütfen talebinizi en az ${min} karakterle açıklayınız.`,
      messageLong: (max: number) => `Mesaj en fazla ${max} karakter olabilir.`,
      messageMarkup: "Mesaj HTML, betik veya bağlantı kodu içeremez.",
      solution: "Lütfen geçerli bir çözüm ve talep türü seçiniz.",
      consent: "Devam etmek için aydınlatma metnini onaylamanız gerekir.",
    },
    mail: {
      organization: "Kurum",
      contact: "İlgili kişi",
      email: "E-posta",
      solution: "İlgilenilen çözüm",
      requestType: "Talep türü",
    },
    optional: "opsiyonel",
    sentTitle: "Talebiniz hazırlandı.",
    sentBody: (email: string) =>
      `E-posta istemciniz, bilgilerinizi içeren bir taslakla açıldı. Göndermeniz yeterli; ekibimiz talebinizi inceleyerek ${email} adresinden size dönüş yapacaktır.`,
    summary: { organization: "Kurum", solution: "Çözüm", requestType: "Talep türü" },
    reopen: "E-posta istemcisini tekrar aç",
    edit: "Formu düzenle",
    fallback: "E-posta istemciniz açılmadıysa talebinizi doğrudan şu adrese iletebilirsiniz:",
    honeypot: "Web sitesi (boş bırakınız)",
    solutionLegend: "İlgilenilen çözüm",
    organization: "Kurum adı",
    name: "İlgili kişi",
    namePlaceholder: "Ad Soyad",
    requestType: "Talep türü",
    title: "Unvan / görev",
    email: "Kurumsal e-posta",
    emailPlaceholder: "ad.soyad@kurum.com.tr",
    freeMail: "Mümkünse kurumsal alan adınıza ait bir e-posta adresi kullanmanızı öneririz.",
    message: "Mesaj",
    messageHint: "Düz metin; lütfen hasta verisi paylaşmayınız.",
    consentBefore: "Kişisel verilerimin, talebimin yanıtlanması amacıyla",
    consentLink: "KVKK Aydınlatma Metni",
    consentAfter: "kapsamında işleneceğini okudum ve anladım.",
    submitNote: (email: string) =>
      `Gönder'e tıkladığınızda talebiniz, e-posta istemcinizde ${email} adresine hazır bir taslak olarak açılır.`,
    preparing: "Hazırlanıyor",
    submit: "Talebi gönder",
  },
  en: {
    requestTypes: ["Letter of Intent (LOI) / Pilot", "Product demo", "Retrospective validation study", "General enquiry"],
    errors: {
      organizationMissing: "Enter your organisation's name.",
      organizationLong: (max: number) => `Organisation name can be at most ${max} characters.`,
      organizationChars: "Organisation name contains characters that are not allowed.",
      nameMissing: "Enter the contact person's name.",
      nameLong: (max: number) => `Name can be at most ${max} characters.`,
      nameChars: "Name can only contain letters, spaces, full stops, apostrophes and hyphens.",
      titleLong: (max: number) => `Job title can be at most ${max} characters.`,
      titleChars: "Job title contains characters that are not allowed.",
      email: "Enter a valid email address.",
      messageShort: (min: number) => `Please describe your request in at least ${min} characters.`,
      messageLong: (max: number) => `Message can be at most ${max} characters.`,
      messageMarkup: "The message cannot contain HTML, scripts or link code.",
      solution: "Select a valid product and request type.",
      consent: "To continue, confirm that you have read the privacy notice.",
    },
    mail: {
      organization: "Organisation",
      contact: "Contact person",
      email: "Email",
      solution: "Product of interest",
      requestType: "Request type",
    },
    optional: "optional",
    sentTitle: "Your request is ready.",
    sentBody: (email: string) =>
      `Your email client has opened a draft with your details. Send it and our team will review your request and reply to ${email}.`,
    summary: { organization: "Organisation", solution: "Product", requestType: "Request type" },
    reopen: "Open the email client again",
    edit: "Edit the form",
    fallback: "If your email client did not open, send your request directly to:",
    honeypot: "Website (leave empty)",
    solutionLegend: "Product of interest",
    organization: "Organisation",
    name: "Contact person",
    namePlaceholder: "Full name",
    requestType: "Request type",
    title: "Job title",
    email: "Work email",
    emailPlaceholder: "name.surname@hospital.org",
    freeMail: "If possible, use an address on your organisation's own domain.",
    message: "Message",
    messageHint: "Plain text. Please do not share patient data.",
    consentBefore: "I have read the",
    consentLink: "Privacy Notice (KVKK)",
    consentAfter: "and understand that my personal data will be processed to answer my request.",
    submitNote: (email: string) =>
      `When you press Send, your request opens in your email client as a draft addressed to ${email}.`,
    preparing: "Preparing",
    submit: "Send request",
  },
});

type Copy = (typeof copy)[Locale];

const freeMailDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "yandex.com",
  "icloud.com",
  "live.com",
];

type Fields = {
  organization: string;
  name: string;
  title: string;
  email: string;
  requestType: string;
  message: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof Fields | "solution", string>>;

export const LIMITS = {
  organization: 120,
  name: 80,
  title: 80,
  email: 254,
  message: 2000,
} as const;

const MESSAGE_MIN = 20;

// Name of the honeypot input. Real users never see it; bots that auto-fill every field do.
const HONEYPOT_FIELD = "website_hp";

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

/** Single-line field: drop control chars and line breaks (blocks mail header injection), collapse whitespace. */
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

function sanitize(f: Fields): Fields {
  return {
    ...f,
    organization: cleanLine(f.organization),
    name: cleanLine(f.name),
    title: cleanLine(f.title),
    email: cleanLine(f.email).toLowerCase(),
    message: cleanText(f.message),
  };
}

function isSolution(value: string | null): value is SolutionValue {
  return SOLUTION_VALUES.some((v) => v === value);
}

function validate(f: Fields, solution: SolutionValue, c: Copy): Errors {
  const errors: Errors = {};
  const m = c.errors;

  if (f.organization.length < 2) errors.organization = m.organizationMissing;
  else if (f.organization.length > LIMITS.organization) errors.organization = m.organizationLong(LIMITS.organization);
  else if (!ORGANIZATION_PATTERN.test(f.organization)) errors.organization = m.organizationChars;

  if (f.name.length < 2) errors.name = m.nameMissing;
  else if (f.name.length > LIMITS.name) errors.name = m.nameLong(LIMITS.name);
  else if (!NAME_PATTERN.test(f.name)) errors.name = m.nameChars;

  if (f.title) {
    if (f.title.length > LIMITS.title) errors.title = m.titleLong(LIMITS.title);
    else if (!ORGANIZATION_PATTERN.test(f.title)) errors.title = m.titleChars;
  }

  if (!EMAIL_PATTERN.test(f.email)) errors.email = m.email;

  if (f.message.length < MESSAGE_MIN) errors.message = m.messageShort(MESSAGE_MIN);
  else if (f.message.length > LIMITS.message) errors.message = m.messageLong(LIMITS.message);
  else if (MARKUP_PATTERN.test(f.message)) errors.message = m.messageMarkup;

  if (!isSolution(solution) || !c.requestTypes.includes(f.requestType)) errors.solution = m.solution;

  if (!f.consent) errors.consent = m.consent;
  return errors;
}

function buildMailto(f: Fields, solutionLabel: string, c: Copy) {
  const subject = `[${solutionLabel}] ${f.requestType} — ${f.organization}`;
  const body = [
    `${c.mail.organization}: ${f.organization}`,
    `${c.mail.contact}: ${f.name}${f.title ? ` (${f.title})` : ""}`,
    `${c.mail.email}: ${f.email}`,
    `${c.mail.solution}: ${solutionLabel}`,
    `${c.mail.requestType}: ${f.requestType}`,
    "",
    f.message,
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function Field({
  className,
  label,
  htmlFor,
  error,
  optional,
  hint,
  children,
}: {
  className?: string;
  label: string;
  htmlFor: string;
  error?: string;
  optional?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-[13px] font-medium text-white/80">
        {label}
        {optional && <span className="font-mono text-[10.5px] font-normal text-white/55">{optional}</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-rose-300">
          {error}
        </p>
      ) : (
        hint && <div className="mt-1.5 text-xs text-white/55">{hint}</div>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg border bg-navy-900/70 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:ring-2";

type ContactFormProps = {
  locale: Locale;
  solution: SolutionValue;
  onSolutionChange: (solution: SolutionValue) => void;
};

export default function ContactForm({ locale, solution, onSolutionChange }: ContactFormProps) {
  const uid = useId();
  const c = copy[locale];
  const contents = solutionContent[locale];
  const content = contents[solution];
  const accent = content.accent;
  const inputClass = `${inputBase} ${accent.inputFocus}`;
  const [fields, setFields] = useState<Fields>({
    organization: "",
    name: "",
    title: "",
    email: "",
    requestType: c.requestTypes[0],
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [mailto, setMailto] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const emailDomain = fields.email.split("@")[1]?.toLowerCase().trim();
  const freeMail = !!emailDomain && freeMailDomains.includes(emailDomain);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    // Honeypot filled → almost certainly a bot. Show the normal success state but send nothing.
    if (honeypotRef.current?.value) {
      setMailto("");
      setStatus("sent");
      return;
    }

    const clean = sanitize(fields);
    setFields(clean);
    const found = validate(clean, solution, c);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const link = buildMailto(clean, content.label, c);
    setMailto(link);
    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("sent");
      window.location.href = link;
    }, 700);
  };

  const errorProps = (key: keyof Fields) => ({
    id: `${uid}-${key}`,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
  });

  const border = (key: keyof Fields) => (errors[key] ? "border-rose-400/50" : "border-white/[0.1]");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r via-white/10 to-transparent ${accent.topRule}`}
      />
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start p-7 sm:p-10"
            role="status"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-300" strokeWidth={1.6} />
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">{c.sentTitle}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              {c.sentBody(fields.email.trim())}
            </p>
            <dl className="mt-8 w-full divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] text-sm">
              {[
                [c.summary.organization, fields.organization],
                [c.summary.solution, content.label],
                [c.summary.requestType, fields.requestType],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-white/55">{k}</dt>
                  <dd className="text-right text-white/85">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {mailto && (
                <a
                  href={mailto}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-navy-900 ${accent.buttonHover}`}
                >
                  <Mail className="h-4 w-4" />
                  {c.reopen}
                </a>
              )}
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
              >
                {c.edit}
              </button>
            </div>
            <p className="mt-6 text-xs text-white/55">
              {c.fallback} <CopyEmail locale={locale} className="text-white/80" />
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 p-6 sm:p-8"
          >
            {/* Honeypot: off-screen rather than display:none, since some bots skip hidden inputs. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden opacity-0"
            >
              <label htmlFor={`${uid}-${HONEYPOT_FIELD}`}>{c.honeypot}</label>
              <input
                ref={honeypotRef}
                id={`${uid}-${HONEYPOT_FIELD}`}
                name={HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <fieldset>
              <legend className="text-[13px] font-medium text-white/80">{c.solutionLegend}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {SOLUTION_VALUES.map((value) => {
                  const { icon: Icon, hint, label, accent: cardAccent } = contents[value];
                  const checked = solution === value;
                  return (
                    <label
                      key={value}
                      className={`relative flex cursor-pointer flex-col rounded-xl border p-3.5 transition-colors duration-150 ease-out has-[:focus-visible]:ring-2 ${cardAccent.focusRing} ${
                        checked
                          ? cardAccent.selectedCard
                          : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]"
                      }`}
                    >
                      <input
                        type="radio"
                        id={`${uid}-solution-${value}`}
                        name="solution"
                        value={value}
                        checked={checked}
                        onChange={() => {
                          onSolutionChange(value);
                          if (errors.solution) setErrors((e) => ({ ...e, solution: undefined }));
                        }}
                        className="sr-only"
                      />
                      <Icon
                        className={`h-4 w-4 transition-colors duration-150 ease-out ${checked ? cardAccent.text : "text-white/55"}`}
                        strokeWidth={1.8}
                      />
                      <span className="mt-3 text-[13px] font-medium text-white">{label}</span>
                      <span className="mt-0.5 text-[11.5px] leading-snug text-white/55">{hint}</span>
                    </label>
                  );
                })}
              </div>
              {errors.solution && <p className="mt-1.5 text-xs text-rose-300">{errors.solution}</p>}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                label={c.organization}
                htmlFor={`${uid}-organization`}
                error={errors.organization}
              >
                <input
                  {...errorProps("organization")}
                  autoComplete="organization"
                  maxLength={LIMITS.organization}
                  value={fields.organization}
                  onChange={(e) => set("organization", e.target.value)}
                  placeholder={content.placeholders.organization}
                  className={`${inputClass} ${border("organization")}`}
                />
              </Field>
              <Field label={c.name} htmlFor={`${uid}-name`} error={errors.name}>
                <input
                  {...errorProps("name")}
                  autoComplete="name"
                  maxLength={LIMITS.name}
                  value={fields.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={c.namePlaceholder}
                  className={`${inputClass} ${border("name")}`}
                />
              </Field>
              <Field label={c.requestType} htmlFor={`${uid}-requestType`}>
                <select
                  id={`${uid}-requestType`}
                  value={fields.requestType}
                  onChange={(e) => set("requestType", e.target.value)}
                  className={`${inputClass} border-white/[0.1] [&>option]:bg-navy-850`}
                >
                  {c.requestTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field
                className="sm:col-span-2"
                label={c.title}
                htmlFor={`${uid}-title`}
                error={errors.title}
                optional={c.optional}
              >
                <input
                  {...errorProps("title")}
                  autoComplete="organization-title"
                  maxLength={LIMITS.title}
                  value={fields.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder={content.placeholders.title}
                  className={`${inputClass} ${border("title")}`}
                />
              </Field>
            </div>

            <Field
              label={c.email}
              htmlFor={`${uid}-email`}
              error={errors.email}
              hint={
                freeMail ? c.freeMail : undefined
              }
            >
              <input
                {...errorProps("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                spellCheck={false}
                maxLength={LIMITS.email}
                value={fields.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder={c.emailPlaceholder}
                className={`${inputClass} ${border("email")}`}
              />
            </Field>

            <Field
              label={c.message}
              htmlFor={`${uid}-message`}
              error={errors.message}
              hint={
                <span className="flex justify-between gap-4">
                  <span>{c.messageHint}</span>
                  <span className="font-mono tabular-nums">
                    {fields.message.length}/{LIMITS.message}
                  </span>
                </span>
              }
            >
              <textarea
                {...errorProps("message")}
                rows={5}
                maxLength={LIMITS.message}
                value={fields.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder={content.placeholders.message}
                className={`${inputClass} resize-y ${border("message")}`}
              />
            </Field>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-white/60">
                <input
                  {...errorProps("consent")}
                  type="checkbox"
                  checked={fields.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer ${accent.checkbox}`}
                />
                <span>
                  {c.consentBefore}{" "}
                  <Link
                    href={localizedPath(locale, "/legal/privacy")}
                    className={`underline-offset-2 hover:underline ${accent.text}`}
                  >
                    {c.consentLink}
                  </Link>{" "}
                  {c.consentAfter}
                </span>
              </label>
              {errors.consent && (
                <p id={`${uid}-consent-error`} className="mt-1.5 pl-7 text-xs text-rose-300">
                  {errors.consent}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-white/55">
                {c.submitNote(CONTACT_EMAIL)}
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors disabled:opacity-70 ${accent.buttonHover}`}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {c.preparing}
                  </>
                ) : (
                  <>
                    {c.submit} <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
