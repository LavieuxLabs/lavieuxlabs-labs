"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { CONTACT_EMAIL, solutions, type SolutionValue } from "@/lib/site";
import { solutionContent } from "@/lib/solutionContent";

const requestTypes = ["Niyet Mektubu (LOI) / Pilot", "Ürün demosu", "Retrospektif doğrulama iş birliği", "Genel bilgi"];

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
  return solutions.some((s) => s.value === value);
}

function validate(f: Fields, solution: SolutionValue): Errors {
  const errors: Errors = {};

  if (f.organization.length < 2) errors.organization = "Kurum adını giriniz.";
  else if (f.organization.length > LIMITS.organization)
    errors.organization = `Kurum adı en fazla ${LIMITS.organization} karakter olabilir.`;
  else if (!ORGANIZATION_PATTERN.test(f.organization)) errors.organization = "Kurum adı geçersiz karakterler içeriyor.";

  if (f.name.length < 2) errors.name = "İlgili kişinin adını giriniz.";
  else if (f.name.length > LIMITS.name) errors.name = `Ad en fazla ${LIMITS.name} karakter olabilir.`;
  else if (!NAME_PATTERN.test(f.name)) errors.name = "Ad yalnızca harf, boşluk, nokta, kesme ve tire içerebilir.";

  if (f.title) {
    if (f.title.length > LIMITS.title) errors.title = `Unvan en fazla ${LIMITS.title} karakter olabilir.`;
    else if (!ORGANIZATION_PATTERN.test(f.title)) errors.title = "Unvan geçersiz karakterler içeriyor.";
  }

  if (!EMAIL_PATTERN.test(f.email)) errors.email = "Geçerli bir e-posta adresi giriniz.";

  if (f.message.length < MESSAGE_MIN) errors.message = `Lütfen talebinizi en az ${MESSAGE_MIN} karakterle açıklayınız.`;
  else if (f.message.length > LIMITS.message) errors.message = `Mesaj en fazla ${LIMITS.message} karakter olabilir.`;
  else if (MARKUP_PATTERN.test(f.message)) errors.message = "Mesaj HTML, betik veya bağlantı kodu içeremez.";

  if (!isSolution(solution) || !requestTypes.includes(f.requestType))
    errors.solution = "Lütfen geçerli bir çözüm ve talep türü seçiniz.";

  if (!f.consent) errors.consent = "Devam etmek için aydınlatma metnini onaylamanız gerekir.";
  return errors;
}

function buildMailto(f: Fields, solution: SolutionValue) {
  const solutionLabel = solutions.find((s) => s.value === solution)?.label ?? solution;
  const subject = `[${solutionLabel}] ${f.requestType} — ${f.organization}`;
  const body = [
    `Kurum: ${f.organization}`,
    `İlgili kişi: ${f.name}${f.title ? ` (${f.title})` : ""}`,
    `E-posta: ${f.email}`,
    `İlgilenilen çözüm: ${solutionLabel}`,
    `Talep türü: ${f.requestType}`,
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
  optional?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-[13px] font-medium text-white/80">
        {label}
        {optional && <span className="font-mono text-[10.5px] font-normal text-white/30">opsiyonel</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-rose-300">
          {error}
        </p>
      ) : (
        hint && <div className="mt-1.5 text-xs text-white/40">{hint}</div>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg border bg-navy-900/70 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:ring-2";

type ContactFormProps = {
  solution: SolutionValue;
  onSolutionChange: (solution: SolutionValue) => void;
};

export default function ContactForm({ solution, onSolutionChange }: ContactFormProps) {
  const uid = useId();
  const content = solutionContent[solution];
  const accent = content.accent;
  const inputClass = `${inputBase} ${accent.inputFocus}`;
  const [fields, setFields] = useState<Fields>({
    organization: "",
    name: "",
    title: "",
    email: "",
    requestType: requestTypes[0],
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
    const found = validate(clean, solution);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const link = buildMailto(clean, solution);
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
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">Talebiniz hazırlandı.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              E-posta istemciniz, bilgilerinizi içeren bir taslakla açıldı. Göndermeniz yeterli; ekibimiz talebinizi
              inceleyerek {fields.email.trim()} adresinden size dönüş yapacaktır.
            </p>
            <dl className="mt-8 w-full divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] text-sm">
              {[
                ["Kurum", fields.organization],
                ["Çözüm", solutions.find((s) => s.value === solution)?.label],
                ["Talep türü", fields.requestType],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-white/45">{k}</dt>
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
                  E-posta istemcisini tekrar aç
                </a>
              )}
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
              >
                Formu düzenle
              </button>
            </div>
            <p className="mt-6 text-xs text-white/40">
              E-posta istemciniz açılmadıysa talebinizi doğrudan{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={`font-mono hover:underline ${accent.text}`}>
                {CONTACT_EMAIL}
              </a>{" "}
              adresine iletebilirsiniz.
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
              <label htmlFor={`${uid}-${HONEYPOT_FIELD}`}>Web sitesi (boş bırakınız)</label>
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
              <legend className="text-[13px] font-medium text-white/80">İlgilenilen çözüm</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {solutions.map((s) => {
                  const { icon: Icon, hint, accent: cardAccent } = solutionContent[s.value];
                  const checked = solution === s.value;
                  return (
                    <label
                      key={s.value}
                      className={`relative flex cursor-pointer flex-col rounded-xl border p-3.5 transition-colors duration-150 ease-out has-[:focus-visible]:ring-2 ${cardAccent.focusRing} ${
                        checked
                          ? cardAccent.selectedCard
                          : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]"
                      }`}
                    >
                      <input
                        type="radio"
                        id={`${uid}-solution-${s.value}`}
                        name="solution"
                        value={s.value}
                        checked={checked}
                        onChange={() => {
                          onSolutionChange(s.value);
                          if (errors.solution) setErrors((e) => ({ ...e, solution: undefined }));
                        }}
                        className="sr-only"
                      />
                      <Icon
                        className={`h-4 w-4 transition-colors duration-150 ease-out ${checked ? cardAccent.text : "text-white/40"}`}
                        strokeWidth={1.8}
                      />
                      <span className="mt-3 text-[13px] font-medium text-white">{s.label}</span>
                      <span className="mt-0.5 text-[11.5px] leading-snug text-white/45">{hint}</span>
                    </label>
                  );
                })}
              </div>
              {errors.solution && <p className="mt-1.5 text-xs text-rose-300">{errors.solution}</p>}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                label="Kurum adı"
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
              <Field label="İlgili kişi" htmlFor={`${uid}-name`} error={errors.name}>
                <input
                  {...errorProps("name")}
                  autoComplete="name"
                  maxLength={LIMITS.name}
                  value={fields.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ad Soyad"
                  className={`${inputClass} ${border("name")}`}
                />
              </Field>
              <Field label="Talep türü" htmlFor={`${uid}-requestType`}>
                <select
                  id={`${uid}-requestType`}
                  value={fields.requestType}
                  onChange={(e) => set("requestType", e.target.value)}
                  className={`${inputClass} border-white/[0.1] [&>option]:bg-navy-850`}
                >
                  {requestTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field
                className="sm:col-span-2"
                label="Unvan / görev"
                htmlFor={`${uid}-title`}
                error={errors.title}
                optional
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
              label="Kurumsal e-posta"
              htmlFor={`${uid}-email`}
              error={errors.email}
              hint={
                freeMail ? "Mümkünse kurumsal alan adınıza ait bir e-posta adresi kullanmanızı öneririz." : undefined
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
                placeholder="ad.soyad@kurum.com.tr"
                className={`${inputClass} ${border("email")}`}
              />
            </Field>

            <Field
              label="Mesaj"
              htmlFor={`${uid}-message`}
              error={errors.message}
              hint={
                <span className="flex justify-between gap-4">
                  <span>Düz metin; lütfen hasta verisi paylaşmayınız.</span>
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
                  Kişisel verilerimin, talebimin yanıtlanması amacıyla{" "}
                  <Link href="/legal/privacy" className={`underline-offset-2 hover:underline ${accent.text}`}>
                    KVKK Aydınlatma Metni
                  </Link>{" "}
                  kapsamında işleneceğini okudum ve anladım.
                </span>
              </label>
              {errors.consent && (
                <p id={`${uid}-consent-error`} className="mt-1.5 pl-7 text-xs text-rose-300">
                  {errors.consent}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-white/40">
                Gönder&apos;e tıkladığınızda talebiniz, e-posta istemcinizde {CONTACT_EMAIL} adresine hazır bir taslak
                olarak açılır.
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors disabled:opacity-70 ${accent.buttonHover}`}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Hazırlanıyor
                  </>
                ) : (
                  <>
                    Talebi gönder <ArrowUpRight className="h-4 w-4" />
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
