"use client";

import { useCallback, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT_EMAIL, type ContactPath, type ProductValue } from "@/lib/site";
import { contactProducts, contactView } from "@/lib/contactContent";
import { trackEvent } from "@/lib/analytics";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import CopyEmail from "@/components/CopyEmail";
import { BUTTON, BUTTON_OUTLINE, LINK } from "@/components/paper/Editorial";
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
      path: "Lütfen bir temas yolu ve proje seçiniz.",
    },
    optional: "isteğe bağlı",
    sentTitle: "Talebiniz alındı.",
    // No response-time promise: the team has no verified service level.
    sentBody: {
      intro: "Görüşme zamanını birlikte belirlemek için size e-postayla yazacağız.",
      academic: "Talebinize e-postayla dönüş yapacağız.",
      pilot: "Talebinize e-postayla dönüş yapacağız.",
    } as Record<ContactPath, string>,
    nextTitle: "Sonraki adımlar",
    summary: { path: "Talep", organization: "Kurum", product: "Proje", role: "Rol" },
    newRequest: "Yeni talep oluştur",
    fallback: "Eklemek istediğiniz bir şey olursa doğrudan şu adrese yazabilirsiniz:",
    sendFailed: "Talebiniz şu anda iletilemedi. Lütfen birkaç dakika sonra tekrar deneyin ya da doğrudan şu adrese yazın:",
    rateLimited: "Kısa sürede çok sayıda talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin ya da doğrudan şu adrese yazın:",
    honeypot: "Web sitesi (boş bırakınız)",
    productLegend: "Hangi proje?",
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
    messageHint: "Düz metin. Hasta verisi veya gerçek fatura verisi yazmayınız.",
    // What a request is and is not, said before the visitor writes anything.
    requestNote: {
      intro: "Bu form bir görüşme talebi iletir. Görüşme zamanını e-postayla birlikte belirleriz; gönderim bir randevu onayı değildir.",
      academic: "Bu form bir iş birliği önerisi iletir. Bir anlaşma yapılmış veya ortak çalışma başlamış olmaz.",
      pilot: "Bu form bir pilot talebi iletir. Niyet Mektubu (LOI) veya sözleşme yerine geçmez.",
    } as Record<ContactPath, string>,
    dataNote: "Bu forma hasta verisi veya gerçek fatura verisi yazmayınız.",
    noticeBefore: "Göndermeden önce",
    consentLink: "KVKK Aydınlatma Metni",
    noticeAfter: "ni inceleyiniz. Formun gönderilmesi açık rıza beyanı veya metni kabul ettiğiniz anlamına gelmez.",
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
      path: "Select a way to start and a project.",
    },
    optional: "optional",
    sentTitle: "Your request has been received.",
    sentBody: {
      intro: "We will email you to agree on a time for the call.",
      academic: "We will reply to your request by email.",
      pilot: "We will reply to your request by email.",
    } as Record<ContactPath, string>,
    nextTitle: "Next steps",
    summary: { path: "Request", organization: "Organisation", product: "Project", role: "Role" },
    newRequest: "Start a new request",
    fallback: "If you want to add anything, write to us directly at:",
    sendFailed: "Your request could not be sent right now. Please try again in a few minutes, or write to us directly at:",
    rateLimited: "Too many requests were sent in a short time. Please try again in a few minutes, or write to us directly at:",
    honeypot: "Website (leave empty)",
    productLegend: "Which project?",
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
    messageHint: "Plain text. Do not enter patient data or real claim data.",
    requestNote: {
      intro: "This form sends a request for a call. We agree on a time with you by email; sending it does not confirm an appointment.",
      academic: "This form sends a collaboration proposal. It does not create an agreement or start a joint study.",
      pilot: "This form sends a pilot request. It does not replace a Letter of Intent (LOI) or an agreement.",
    } as Record<ContactPath, string>,
    dataNote: "Do not enter patient data or real claim data in this form.",
    noticeBefore: "Before sending, review the",
    consentLink: "Privacy Notice (KVKK)",
    noticeAfter: ". Sending the form is not a declaration of explicit consent or acceptance of the notice.",
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

const FIELD_ORDER: (keyof Fields | "path")[] = ["path", "name", "role", "organization", "detail", "email", "message"];

function message(c: Copy, code: LoiErrorCode): string {
  const entry = c.errors[code];
  return typeof entry === "function" ? entry(ERROR_LIMIT[code] ?? 0) : entry;
}

export type ContactTone = "dark" | "paper";

// A failed submit focuses the first invalid field and the browser scrolls it into view. The margins keep it clear
// of the fixed 64px navbar with its label above it (top) and its error message below it (bottom).
const FIELD_SCROLL = "scroll-mt-28 scroll-mb-16";

// Literal classes per surface. Dark: the panel on the dark ground. Paper: ink on paper, white fields with a
// grey border (≥3:1), 16px field text so phones do not zoom, 44px+ targets; the product name keeps its accent.
const skins = {
  dark: {
    shell: "relative overflow-hidden rounded-2xl border border-hairline bg-navy-850",
    form: "space-y-6 p-6 sm:p-8",
    label: "text-[13px] font-medium text-white/80",
    optional: "text-[11px] font-normal text-white/55",
    error: "text-xs text-rose-300",
    hint: "text-xs text-white/55",
    input:
      `${FIELD_SCROLL} w-full rounded-lg border bg-navy-900/70 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:ring-2`,
    border: "border-white/[0.1]",
    borderError: "border-rose-400/50",
    select: "[&>option]:bg-navy-850",
    selectEmpty: "text-white/60",
    option: "text-white",
    note: "text-[13px] leading-relaxed text-white/60",
    dataNote: "text-[13px] font-medium leading-relaxed text-white/80",
    legend: "text-[13px] font-medium text-white/80",
    consent: "flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-white/60",
    consentBox: `${FIELD_SCROLL} mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-titanium`,
    consentLink:
      "text-white/80 underline decoration-white/30 underline-offset-2 transition-colors duration-150 ease-out hover:text-white hover:decoration-white/70",
    consentError: "pl-7",
    alert: "rounded-lg border border-rose-400/30 bg-rose-400/[0.06] px-4 py-3 text-[13px] leading-relaxed text-rose-100",
    alertEmail: "text-white",
    submitRow: "border-t border-hairline pt-6",
    submitNote: "text-xs leading-relaxed text-white/55",
    submit:
      "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90 disabled:opacity-70",
    sent: "flex flex-col items-start p-7 sm:p-10",
    sentTitle: "text-2xl font-semibold tracking-[-0.03em] text-white",
    sentBody: "mt-3 max-w-md text-sm leading-relaxed text-white/60",
    summary: "mt-8 w-full divide-y divide-hairline rounded-xl border border-hairline text-sm",
    summaryRow: "px-4 py-3",
    summaryKey: "text-white/55",
    summaryValue: "text-right text-white/85",
    nextTitle: "text-[11px] font-medium tracking-wider text-white/50 uppercase",
    nextList: "mt-3 divide-y divide-hairline rounded-xl border border-hairline",
    nextItem: "px-4 py-3.5",
    nextNumber: "font-mono text-[12px] text-white/55 tabular-nums",
    nextStepTitle: "block text-[13.5px] font-medium text-white",
    nextStepBody: "mt-1 block text-[12.5px] leading-relaxed text-white/60",
    again:
      "mt-8 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-colors duration-150 ease-out hover:bg-white/5",
    fallback: "mt-6 text-xs text-white/55",
    fallbackEmail: "text-white/80",
  },
  paper: {
    shell: "relative border-t-2 border-ink",
    form: "space-y-7 pt-5",
    label: "text-[15px] font-medium text-ink",
    optional: "text-[13px] font-normal text-ink-3",
    error: "text-[14px] text-rose-700",
    hint: "text-[14px] text-ink-3",
    input: `${FIELD_SCROLL} w-full rounded-md border bg-white px-3.5 py-3 text-[16px] text-ink placeholder:text-ink-3 outline-none transition-colors duration-150 ease-out focus:border-ink focus:ring-2 focus:ring-ink/25`,
    border: "border-ink-3",
    borderError: "border-rose-700",
    select: "",
    selectEmpty: "text-ink-3",
    option: "text-ink",
    note: "text-[15px] leading-[1.6] text-ink-2",
    dataNote: "text-[15px] font-medium leading-[1.6] text-ink",
    legend: "text-[15px] font-medium text-ink",
    consent: "flex cursor-pointer items-start gap-3 text-[15px] leading-[1.6] text-ink-2",
    consentBox: `${FIELD_SCROLL} mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer accent-ink`,
    consentLink: LINK,
    consentError: "pl-[30px]",
    alert: "border border-rose-700/60 bg-white px-4 py-3 text-[15px] leading-[1.6] text-ink",
    alertEmail: "text-ink",
    submitRow: "border-t border-rule pt-6",
    submitNote: "text-[14px] leading-[1.6] text-ink-3",
    submit: `${BUTTON} shrink-0 gap-2 disabled:opacity-70`,
    sent: "flex flex-col items-start pt-6",
    sentTitle: "font-serif text-[30px] leading-[1.1] font-medium tracking-[-0.015em] text-ink",
    sentBody: "mt-3 max-w-[56ch] text-[17px] leading-[1.6] text-ink-2",
    summary: "mt-8 w-full divide-y divide-rule border-y border-rule text-[15px]",
    summaryRow: "py-3",
    summaryKey: "text-ink-3",
    summaryValue: "text-right text-ink",
    nextTitle: "font-serif text-[20px] font-medium text-ink",
    nextList: "mt-3 divide-y divide-rule border-y border-rule",
    nextItem: "py-4",
    nextNumber: "font-serif text-[20px] leading-none text-ink-3",
    nextStepTitle: "block text-[16px] font-semibold text-ink",
    nextStepBody: "mt-1 block text-[15px] leading-[1.6] text-ink-2",
    again: `mt-8 ${BUTTON_OUTLINE}`,
    fallback: "mt-6 text-[15px] text-ink-2",
    fallbackEmail: "text-ink",
  },
} satisfies Record<ContactTone, Record<string, string>>;

// On paper only the product name carries its accent (the dark step of the product scale).
const paperProductName: Record<ProductValue, string> = { pharmadeux: "text-teal-700", shield: "text-indigo-700" };

function Field({
  className,
  label,
  htmlFor,
  error,
  optional,
  hint,
  skin,
  children,
}: {
  className?: string;
  label: string;
  htmlFor: string;
  error?: string;
  optional?: string;
  hint?: ReactNode;
  skin: (typeof skins)[ContactTone];
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={`flex items-baseline justify-between gap-3 ${skin.label}`}>
        {label}
        {optional && <span className={skin.optional}>{optional}</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className={`mt-1.5 ${skin.error}`}>
          {error}
        </p>
      ) : (
        hint && <div className={`mt-1.5 ${skin.hint}`}>{hint}</div>
      )}
    </div>
  );
}

type ContactFormProps = {
  locale: Locale;
  path: ContactPath;
  product: ProductValue;
  onProductChange: (product: ProductValue) => void;
  /** "paper" on the paper contact page; "dark" (default) keeps the dark panel. */
  tone?: ContactTone;
};

export default function ContactForm({ locale, path, product, onProductChange, tone = "dark" }: ContactFormProps) {
  const uid = useId();
  const c = copy[locale];
  const skin = skins[tone];
  const paper = tone === "paper";
  const view = contactView(locale, path, product);
  const products = contactProducts(locale);
  const accent = view.accent;
  const inputClass = paper ? skin.input : `${skin.input} ${accent.inputFocus}`;
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
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [sendError, setSendError] = useState<"failed" | "rate" | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  // Stable callback ref: the success heading mounts after the form has faded out, and takes focus once.
  const sentHeading = useCallback((el: HTMLHeadingElement | null) => el?.focus(), []);

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
      // Focus the first invalid field in the order the form shows them, not the order they were validated. Wait a
      // frame so the error messages are in the layout, then scroll the field into view ourselves: scrollIntoView
      // honours the field's scroll margins (navbar and label above, error below), while the browser's own focus
      // scroll does not on phones and can leave the field under the fixed navbar.
      const first = FIELD_ORDER.find((key) => found[key]);
      if (first)
        requestAnimationFrame(() => {
          const field = document.getElementById(`${uid}-${first}`);
          field?.scrollIntoView({ block: "start" });
          field?.focus({ preventScroll: true });
        });
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
    setFields((f) => ({ ...f, message: "" }));
    setErrors({});
    setSendError(null);
    setStatus("idle");
  };

  const errorProps = (key: keyof Fields) => ({
    id: `${uid}-${key}`,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
  });

  const border = (key: keyof Fields) => (errors[key] ? skin.borderError : skin.border);
  const productLabel = products.find((p) => p.value === product)?.label ?? "";

  return (
    <div className={skin.shell}>
      {!paper && (
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r via-white/10 to-transparent ${accent.topRule}`}
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={skin.sent}
            role="status"
          >
            {!paper && <CheckCircle2 className="mb-6 h-8 w-8 text-white/80" strokeWidth={1.6} aria-hidden="true" />}
            {/* Focus moves here once the request is sent, so keyboard and screen reader users land on the result. */}
            <h2 ref={sentHeading} tabIndex={-1} className={`${skin.sentTitle} outline-none`}>
              {c.sentTitle}
            </h2>
            <p className={skin.sentBody}>{c.sentBody[path]}</p>
            <dl className={skin.summary}>
              {[
                [c.summary.path, view.path.label],
                ...(fields.organization ? [[c.summary.organization, fields.organization]] : []),
                ...(hasProduct ? [[c.summary.product, productLabel]] : []),
                [c.summary.role, fields.role],
              ].map(([k, v]) => (
                <div key={k} className={`flex justify-between gap-4 ${skin.summaryRow}`}>
                  <dt className={skin.summaryKey}>{k}</dt>
                  <dd className={skin.summaryValue}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 w-full">
              {paper ? <h3 className={skin.nextTitle}>{c.nextTitle}</h3> : <p className={skin.nextTitle}>{c.nextTitle}</p>}
              <ol className={skin.nextList}>
                {view.nextSteps.map((step, i) => (
                  <li key={step.title} className={`grid grid-cols-[28px_1fr] gap-3 ${skin.nextItem}`}>
                    <span className={skin.nextNumber}>{i + 1}</span>
                    <span>
                      <span className={skin.nextStepTitle}>{step.title}</span>
                      <span className={skin.nextStepBody}>{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <button type="button" onClick={startOver} className={skin.again}>
              {c.newRequest}
            </button>
            <p className={skin.fallback}>
              {c.fallback} <CopyEmail locale={locale} tone={tone} className={skin.fallbackEmail} />
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
            className={skin.form}
            aria-labelledby={paper ? `${uid}-title` : undefined}
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

            <div>
              {paper ? (
                <h2 id={`${uid}-title`} className="font-serif text-[26px] leading-[1.15] font-medium tracking-[-0.015em] text-ink sm:text-[30px]">
                  {view.path.label}
                </h2>
              ) : (
                <div className="flex items-center gap-3">
                  <view.path.icon className="h-4 w-4 text-white/60" strokeWidth={1.7} aria-hidden="true" />
                  <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">{view.path.label}</p>
                </div>
              )}
              {/* What the request is not, and what must never be sent, before any field. */}
              <div className={`${paper ? "mt-3 max-w-[60ch]" : "mt-3"} space-y-1.5`}>
                <p className={skin.note}>{c.requestNote[path]}</p>
                <p className={skin.dataNote}>{c.dataNote}</p>
              </div>
            </div>

            {/* Product first: the physician and the revenue cycle manager get different roles and pilot types. */}
            {hasProduct && (
              <fieldset>
                <legend className={skin.legend}>{c.productLegend}</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {products.map(({ value, icon: Icon, label, hint, accent: cardAccent }) => {
                    const checked = product === value;
                    const input = (
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
                        className={paper ? "mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer accent-ink" : "sr-only"}
                      />
                    );
                    return paper ? (
                      <label
                        key={value}
                        className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-md border bg-white p-3.5 transition-colors duration-150 ease-out has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                          checked ? "border-ink ring-1 ring-ink ring-inset" : "border-rule hover:border-ink-3"
                        }`}
                      >
                        {input}
                        <span>
                          <span className={`block font-serif text-[18px] leading-tight font-medium ${paperProductName[value]}`} lang="en">
                            {label}
                          </span>
                          <span className="mt-1 block text-[14px] leading-snug text-ink-2">{hint}</span>
                        </span>
                      </label>
                    ) : (
                      <label
                        key={value}
                        className={`relative flex cursor-pointer flex-col rounded-xl border p-3.5 transition-colors duration-150 ease-out has-[:focus-visible]:ring-2 ${cardAccent.focusRing} ${
                          checked ? cardAccent.selectedCard : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        {input}
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
                {errors.path && <p className={`mt-1.5 ${skin.error}`}>{errors.path}</p>}
              </fieldset>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={c.name} htmlFor={`${uid}-name`} error={errors.name} skin={skin}>
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
              <Field label={c.role} htmlFor={`${uid}-role`} error={errors.role} skin={skin}>
                <select
                  {...errorProps("role")}
                  value={role}
                  onChange={(e) => set("role", e.target.value)}
                  className={`${inputClass} ${border("role")} ${skin.select} ${role ? "" : skin.selectEmpty}`}
                >
                  <option value="" disabled>
                    {c.choose}
                  </option>
                  {roles.map((r) => (
                    <option key={r} value={r} className={skin.option}>
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
                skin={skin}
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
                  skin={skin}
                >
                  <select
                    {...errorProps("detail")}
                    value={detail}
                    onChange={(e) => set("detail", e.target.value)}
                    className={`${inputClass} ${border("detail")} ${skin.select} ${detail ? "" : skin.selectEmpty}`}
                  >
                    <option value="" disabled>
                      {c.choose}
                    </option>
                    {details.map((d) => (
                      <option key={d} value={d} className={skin.option}>
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
              skin={skin}
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
              skin={skin}
              hint={
                <span className="flex justify-between gap-4">
                  <span>{c.messageHint}</span>
                  <span className={paper ? "shrink-0 tabular-nums" : "font-mono tabular-nums"}>
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

            <p className={skin.consent}>
              <span>
                {c.noticeBefore}{" "}
                <Link href={localizedPath(locale, "/legal/privacy")} className={skin.consentLink}>
                  {c.consentLink}
                </Link>
                {c.noticeAfter}
              </span>
            </p>

            {sendError && (
              <p role="alert" className={skin.alert}>
                {sendError === "rate" ? c.rateLimited : c.sendFailed}{" "}
                <CopyEmail locale={locale} tone={tone} className={skin.alertEmail} />
              </p>
            )}

            <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${skin.submitRow}`}>
              <p className={skin.submitNote}>{c.submitNote(CONTACT_EMAIL)}</p>
              <button type="submit" disabled={status === "submitting"} className={skin.submit}>
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {c.preparing}
                  </>
                ) : paper ? (
                  view.path.submit
                ) : (
                  <>
                    {view.path.submit} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
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
