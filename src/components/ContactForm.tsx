"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT_EMAIL, type ContactPath, type ProductValue } from "@/lib/site";
import { contactProducts, contactView } from "@/lib/contactContent";
import { trackEvent } from "@/lib/analytics";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import CopyEmail from "@/components/CopyEmail";
import {
  ERROR_LIMIT,
  HONEYPOT_FIELD,
  LIMITS,
  MESSAGE_MIN,
  detailOptions,
  isOrganizationRequired,
  roleOptions,
  sanitizeLoi,
  validateLoi,
  type LoiErrorCode,
  type LoiFields,
  type LoiPayload,
} from "@/lib/loi";

const copy = defineContent({
  tr: {
    errors: {
      organizationMissing: "Kurum adını giriniz.",
      organizationLong: (max: number) => `Kurum adı en fazla ${max} karakter olabilir.`,
      organizationChars: "Kurum adı geçersiz karakterler içeriyor.",
      nameMissing: "Adınızı giriniz.",
      nameLong: (max: number) => `Ad en fazla ${max} karakter olabilir.`,
      nameChars: "Ad yalnızca harf, boşluk, nokta, kesme ve tire içerebilir.",
      email: "Geçerli bir e-posta adresi giriniz.",
      role: "Rolünüzü seçiniz.",
      detail: "Bir seçenek seçiniz.",
      messageShort: (min: number) => `Lütfen talebinizi en az ${min} karakterle açıklayınız.`,
      messageLong: (max: number) => `Mesaj en fazla ${max} karakter olabilir.`,
      messageMarkup: "Mesaj HTML, betik veya bağlantı kodu içeremez.",
      path: "Lütfen bir temas yolu ve ürün seçiniz.",
      consent: "Devam etmek için aydınlatma metnini onaylamanız gerekir.",
    },
    optional: "isteğe bağlı",
    sentTitle: "Talebiniz alındı.",
    // The intro call answer is a calendar invite; the other paths get an email reply. Same one-day window.
    sentBody: {
      intro: "En geç 1 iş günü içinde tanışma görüşmesi için takvim daveti e-postanıza iletilecektir.",
      academic: "En geç 1 iş günü içinde e-postayla dönüş yapılacaktır.",
      pilot: "En geç 1 iş günü içinde e-postayla dönüş yapılacaktır.",
    } as Record<ContactPath, string>,
    nextTitle: "Sonraki adımlar",
    summary: { path: "Talep", organization: "Kurum", product: "Ürün", role: "Rol" },
    newRequest: "Yeni talep oluştur",
    fallback: "Eklemek istediğiniz bir şey olursa doğrudan şu adrese yazabilirsiniz:",
    sendFailed: "Talebiniz şu anda iletilemedi. Lütfen birkaç dakika sonra tekrar deneyin ya da doğrudan şu adrese yazın:",
    rateLimited: "Kısa sürede çok sayıda talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin ya da doğrudan şu adrese yazın:",
    honeypot: "Web sitesi (boş bırakınız)",
    productLegend: "Hangi ürün?",
    organization: "Kurum adı",
    organizationLoose: "Kurum / üniversite",
    name: "Ad soyad",
    namePlaceholder: "Ad Soyad",
    role: "Rolünüz",
    choose: "Seçiniz",
    detail: { intro: "", academic: "Çalışma alanı", pilot: "Pilot türü" } as Record<ContactPath, string>,
    email: "Kurumsal e-posta",
    emailPlain: "E-posta",
    emailPlaceholder: "ad.soyad@kurum.com.tr",
    freeMail: "Mümkünse kurumsal alan adınıza ait bir e-posta adresi kullanmanızı öneririz.",
    message: "Mesaj",
    messageHint: "Düz metin; lütfen hasta verisi paylaşmayınız.",
    consentBefore: "Kişisel verilerimin, talebimin yanıtlanması amacıyla",
    consentLink: "KVKK Aydınlatma Metni",
    consentAfter: "kapsamında işleneceğini okudum ve anladım.",
    submitNote: (email: string) => `Gönder'e tıkladığınızda talebiniz doğrudan ${email} adresine iletilir.`,
    preparing: "Gönderiliyor",
  },
  en: {
    errors: {
      organizationMissing: "Enter your organisation's name.",
      organizationLong: (max: number) => `Organisation name can be at most ${max} characters.`,
      organizationChars: "Organisation name contains characters that are not allowed.",
      nameMissing: "Enter your name.",
      nameLong: (max: number) => `Name can be at most ${max} characters.`,
      nameChars: "Name can only contain letters, spaces, full stops, apostrophes and hyphens.",
      email: "Enter a valid email address.",
      role: "Select your role.",
      detail: "Select an option.",
      messageShort: (min: number) => `Please describe your request in at least ${min} characters.`,
      messageLong: (max: number) => `Message can be at most ${max} characters.`,
      messageMarkup: "The message cannot contain HTML, scripts or link code.",
      path: "Select a way to start and a product.",
      consent: "To continue, confirm that you have read the privacy notice.",
    },
    optional: "optional",
    sentTitle: "Your request has been received.",
    sentBody: {
      intro: "A calendar invitation for the intro call will be sent to your email within one business day.",
      academic: "We will reply by email within one business day.",
      pilot: "We will reply by email within one business day.",
    } as Record<ContactPath, string>,
    nextTitle: "Next steps",
    summary: { path: "Request", organization: "Organisation", product: "Product", role: "Role" },
    newRequest: "Start a new request",
    fallback: "If you want to add anything, write to us directly at:",
    sendFailed: "Your request could not be sent right now. Please try again in a few minutes, or write to us directly at:",
    rateLimited: "Too many requests were sent in a short time. Please try again in a few minutes, or write to us directly at:",
    honeypot: "Website (leave empty)",
    productLegend: "Which product?",
    organization: "Organisation",
    organizationLoose: "Organisation / university",
    name: "Full name",
    namePlaceholder: "Full name",
    role: "Your role",
    choose: "Select",
    detail: { intro: "", academic: "Area of work", pilot: "Pilot type" } as Record<ContactPath, string>,
    email: "Work email",
    emailPlain: "Email",
    emailPlaceholder: "name.surname@hospital.org",
    freeMail: "If possible, use an address on your organisation's own domain.",
    message: "Message",
    messageHint: "Plain text. Please do not share patient data.",
    consentBefore: "I have read the",
    consentLink: "Privacy Notice (KVKK)",
    consentAfter: "and understand that my personal data will be processed to answer my request.",
    submitNote: (email: string) => `When you press Send, your request goes directly to ${email}.`,
    preparing: "Sending",
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

type Fields = LoiFields;
type Errors = Partial<Record<keyof Fields | "path", string>>;

const FIELD_ORDER: (keyof Fields | "path")[] = ["path", "name", "role", "organization", "detail", "email", "message", "consent"];

function message(c: Copy, code: LoiErrorCode): string {
  const entry = c.errors[code];
  return typeof entry === "function" ? entry(ERROR_LIMIT[code] ?? 0) : entry;
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
        {optional && <span className="text-[11px] font-normal text-white/55">{optional}</span>}
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
  path: ContactPath;
  product: ProductValue;
  onProductChange: (product: ProductValue) => void;
};

export default function ContactForm({ locale, path, product, onProductChange }: ContactFormProps) {
  const uid = useId();
  const c = copy[locale];
  const view = contactView(locale, path, product);
  const products = contactProducts(locale);
  const accent = view.accent;
  const inputClass = `${inputBase} ${accent.inputFocus}`;
  const hasProduct = path !== "academic";
  const roles = roleOptions(locale, path, product);
  const details = detailOptions(locale, path, product);
  // Only a pilot needs a named institution and a work address; an individual researcher can write too.
  const formal = isOrganizationRequired(path);
  const [fields, setFields] = useState<Fields>({
    organization: "",
    name: "",
    email: "",
    role: "",
    detail: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [sendError, setSendError] = useState<"failed" | "rate" | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Role and detail lists change with the path and product (a physician never sees billing roles);
  // a choice that is not in the current list counts as not chosen.
  const role = roles.includes(fields.role) ? fields.role : "";
  const detail = details.includes(fields.detail) ? fields.detail : "";

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const emailDomain = fields.email.split("@")[1]?.toLowerCase().trim();
  const freeMail = !!emailDomain && freeMailDomains.includes(emailDomain);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setSendError(null);

    // Honeypot filled → almost certainly a bot. Show the normal success state but send nothing.
    if (honeypotRef.current?.value) {
      setStatus("sent");
      return;
    }

    const clean = sanitizeLoi({ ...fields, role, detail });
    setFields(clean);
    const sentProduct = hasProduct ? product : null;
    const codes = validateLoi(clean, path, sentProduct, locale);
    const found: Errors = Object.fromEntries(
      Object.entries(codes).map(([key, code]) => [key, message(c, code as LoiErrorCode)]),
    );
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Focus the first invalid field in the order the form shows them, not the order they were validated.
      const first = FIELD_ORDER.find((key) => found[key]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    setStatus("submitting");
    const payload: LoiPayload = { ...clean, locale, path, product: sentProduct, [HONEYPOT_FIELD]: "" };
    try {
      const res = await fetch("/api/loi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        // Enumerated values only: no organisation, name, role or message content is sent to analytics.
        trackEvent("loi_submitted", { path, product: sentProduct ?? "none" });
        setStatus("sent");
        return;
      }
      setSendError(res.status === 429 ? "rate" : "failed");
    } catch {
      setSendError("failed");
    }
    setStatus("idle");
  };

  const startOver = () => {
    setFields((f) => ({ ...f, message: "", consent: false }));
    setErrors({});
    setSendError(null);
    setStatus("idle");
  };

  const errorProps = (key: keyof Fields) => ({
    id: `${uid}-${key}`,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
  });

  const border = (key: keyof Fields) => (errors[key] ? "border-rose-400/50" : "border-white/[0.1]");
  const productLabel = products.find((p) => p.value === product)?.label ?? "";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-navy-850">
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
            <CheckCircle2 className="h-8 w-8 text-white/80" strokeWidth={1.6} />
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">{c.sentTitle}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">{c.sentBody[path]}</p>
            <dl className="mt-8 w-full divide-y divide-hairline rounded-xl border border-hairline text-sm">
              {[
                [c.summary.path, view.path.label],
                ...(fields.organization ? [[c.summary.organization, fields.organization]] : []),
                ...(hasProduct ? [[c.summary.product, productLabel]] : []),
                [c.summary.role, fields.role],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-white/55">{k}</dt>
                  <dd className="text-right text-white/85">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 w-full">
              <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.nextTitle}</p>
              <ol className="mt-3 divide-y divide-hairline rounded-xl border border-hairline">
                {view.nextSteps.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[28px_1fr] gap-3 px-4 py-3.5">
                    <span className="font-mono text-[12px] text-white/55 tabular-nums">{i + 1}</span>
                    <span>
                      <span className="block text-[13.5px] font-medium text-white">{step.title}</span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-white/60">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <button
              type="button"
              onClick={startOver}
              className="mt-8 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-colors duration-150 ease-out hover:bg-white/5"
            >
              {c.newRequest}
            </button>
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

            <div className="flex items-center gap-3">
              <view.path.icon className="h-4 w-4 text-white/60" strokeWidth={1.7} aria-hidden="true" />
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">{view.path.label}</p>
            </div>

            {/* Product first: the physician and the revenue cycle manager get different roles and pilot types. */}
            {hasProduct && (
              <fieldset>
                <legend className="text-[13px] font-medium text-white/80">{c.productLegend}</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {products.map(({ value, icon: Icon, label, hint, accent: cardAccent }) => {
                    const checked = product === value;
                    return (
                      <label
                        key={value}
                        className={`relative flex cursor-pointer flex-col rounded-xl border p-3.5 transition-colors duration-150 ease-out has-[:focus-visible]:ring-2 ${cardAccent.focusRing} ${
                          checked ? cardAccent.selectedCard : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        <input
                          type="radio"
                          id={`${uid}-product-${value}`}
                          name="product"
                          value={value}
                          checked={checked}
                          onChange={() => {
                            onProductChange(value);
                            if (errors.path) setErrors((e) => ({ ...e, path: undefined }));
                          }}
                          className="sr-only"
                        />
                        <Icon
                          className={`h-4 w-4 transition-colors duration-150 ease-out ${checked ? cardAccent.text : "text-white/55"}`}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span className="mt-3 text-[13px] font-medium text-white">{label}</span>
                        <span className="mt-0.5 text-[11.5px] leading-snug text-white/55">{hint}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.path && <p className="mt-1.5 text-xs text-rose-300">{errors.path}</p>}
              </fieldset>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
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
              <Field label={c.role} htmlFor={`${uid}-role`} error={errors.role}>
                <select
                  {...errorProps("role")}
                  value={role}
                  onChange={(e) => set("role", e.target.value)}
                  className={`${inputClass} ${border("role")} [&>option]:bg-navy-850 ${role ? "" : "text-white/60"}`}
                >
                  <option value="" disabled>
                    {c.choose}
                  </option>
                  {roles.map((r) => (
                    <option key={r} value={r} className="text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                className="sm:col-span-2"
                label={formal ? c.organization : c.organizationLoose}
                htmlFor={`${uid}-organization`}
                error={errors.organization}
                optional={formal ? undefined : c.optional}
              >
                <input
                  {...errorProps("organization")}
                  autoComplete="organization"
                  maxLength={LIMITS.organization}
                  value={fields.organization}
                  onChange={(e) => set("organization", e.target.value)}
                  placeholder={view.placeholders.organization}
                  className={`${inputClass} ${border("organization")}`}
                />
              </Field>
              {details.length > 0 && (
                <Field
                  className="sm:col-span-2"
                  label={c.detail[path]}
                  htmlFor={`${uid}-detail`}
                  error={errors.detail}
                >
                  <select
                    {...errorProps("detail")}
                    value={detail}
                    onChange={(e) => set("detail", e.target.value)}
                    className={`${inputClass} ${border("detail")} [&>option]:bg-navy-850 ${detail ? "" : "text-white/60"}`}
                  >
                    <option value="" disabled>
                      {c.choose}
                    </option>
                    {details.map((d) => (
                      <option key={d} value={d} className="text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </div>

            <Field
              label={formal ? c.email : c.emailPlain}
              htmlFor={`${uid}-email`}
              error={errors.email}
              hint={formal && freeMail ? c.freeMail : undefined}
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
              optional={MESSAGE_MIN[path] === 0 ? c.optional : undefined}
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
                rows={path === "intro" ? 3 : 5}
                maxLength={LIMITS.message}
                value={fields.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder={view.placeholders.message}
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
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-titanium"
                />
                <span>
                  {c.consentBefore}{" "}
                  <Link
                    href={localizedPath(locale, "/legal/privacy")}
                    className="text-white/80 underline decoration-white/30 underline-offset-2 transition-colors duration-150 ease-out hover:text-white hover:decoration-white/70"
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

            {sendError && (
              <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/[0.06] px-4 py-3 text-[13px] leading-relaxed text-rose-100">
                {sendError === "rate" ? c.rateLimited : c.sendFailed}{" "}
                <CopyEmail locale={locale} className="text-white" />
              </p>
            )}

            <div className="flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-white/55">{c.submitNote(CONTACT_EMAIL)}</p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90 disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {c.preparing}
                  </>
                ) : (
                  <>
                    {view.path.submit} <ArrowUpRight className="h-4 w-4" />
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
