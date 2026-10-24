"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import ContactForm, { type ContactTone } from "@/components/ContactForm";
import CopyEmail from "@/components/CopyEmail";
import { TEXT_ACTION } from "@/components/paper/Editorial";
import { type ContactPath, type ProductValue } from "@/lib/site";
import { contactPaths, contactView } from "@/lib/contactContent";
import { isContactPath, isProduct } from "@/lib/loi";
import { defineContent, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    pathLegend: "Nasıl başlamak istersiniz?",
    process: "Süreç",
    step: "Adım",
    protocolLink: "Pilot protokolü ve LOI çerçevesi",
    email: "E-posta",
    noPatientData:
      "Lütfen iletişim kanallarımız üzerinden hasta verisi, gerçek fatura verisi veya özel nitelikli kişisel veri paylaşmayınız.",
  },
  en: {
    pathLegend: "How would you like to start?",
    process: "Process",
    step: "Step",
    protocolLink: "Pilot protocol and LOI framework",
    email: "Email",
    noPatientData:
      "Please do not send patient data, real claim data or other special categories of personal data through our contact channels.",
  },
});

const LABEL = "text-[11px] font-medium tracking-wider text-white/50 uppercase";

type ContactExperienceProps = {
  locale: Locale;
  initialPath?: ContactPath;
  initialProduct?: ProductValue;
  /** "paper" on the paper contact page; "dark" (default) keeps the dark grid and panel. */
  tone?: ContactTone;
  /** Paper only: shown beside the path choice on wide screens and after the process on narrow ones. */
  aside?: ReactNode;
};

/** Path cards, process steps and the form share one path and product, so all three follow the choice. */
export default function ContactExperience({
  locale,
  initialPath = "intro",
  initialProduct = "pharmadeux",
  tone = "dark",
  aside,
}: ContactExperienceProps) {
  const [path, setPath] = useState<ContactPath>(initialPath);
  const [product, setProduct] = useState<ProductValue>(initialProduct);
  const reduced = useReducedMotion();
  const c = copy[locale];
  const view = contactView(locale, path, product);

  // Keep the choice in the URL so a refresh or shared link opens the same path and product.
  const sync = (nextPath: ContactPath, nextProduct: ProductValue) => {
    const query = nextPath === "academic" ? `?path=academic` : `?path=${nextPath}&product=${nextProduct}`;
    window.history.replaceState(null, "", query);
  };
  const choosePath = (next: ContactPath) => {
    setPath(next);
    sync(next, product);
  };
  const chooseProduct = (next: ProductValue) => {
    setProduct(next);
    sync(path, next);
  };

  if (tone === "paper") {
    // Paper: one 12-column grid. Wide screens: path choice | summary, then form | process. Narrow screens read
    // in the order a visitor acts: choose, fill in the form, see what happens next, then the summary.
    return (
      <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <fieldset className="min-w-0 lg:col-span-7">
          <legend className="font-serif text-[20px] font-medium text-ink">{c.pathLegend}</legend>
          <div className="mt-3 border-t-2 border-ink">
            {contactPaths(locale).map(({ value, label, hint, rows }) => {
              const checked = path === value;
              return (
                <label
                  key={value}
                  className={`grid cursor-pointer grid-cols-[18px_minmax(0,1fr)] gap-x-3.5 border-b border-l-[3px] border-b-rule py-4 pr-4 pl-3 transition-colors duration-150 ease-out has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-ink sm:pl-4 ${
                    checked ? "border-l-ink bg-white" : "border-l-transparent hover:bg-white/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="contact-path"
                    value={value}
                    checked={checked}
                    onChange={() => choosePath(value)}
                    className="mt-1 h-[18px] w-[18px] cursor-pointer accent-ink"
                  />
                  <span className="min-w-0">
                    <span className="block text-[17px] leading-snug font-semibold text-ink">{label}</span>
                    <span className="mt-1 block max-w-[62ch] text-[15px] leading-[1.55] text-ink-2">{hint}</span>
                    <span className="mt-2 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 text-[14px] leading-snug sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                      {rows.map((row) => (
                        <span key={row.label} className="contents">
                          <span className="text-ink-3">{row.label}</span>
                          <span className="text-ink-2">{row.value}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {aside && <div className="order-last lg:order-none lg:col-span-4 lg:col-start-9 lg:row-start-1">{aside}</div>}

        <div className="min-w-0 lg:col-span-7">
          <ContactForm locale={locale} path={path} product={product} onProductChange={chooseProduct} tone="paper" />
        </div>

        <div className="space-y-10 lg:col-span-4 lg:col-start-9 lg:row-start-2">
          <section aria-labelledby="process-title" className="border-t-2 border-ink pt-4">
            <h2 id="process-title" className="font-serif text-[20px] font-medium text-ink">
              {c.process}
            </h2>
            <ol aria-live="polite" className="mt-3 divide-y divide-rule border-t border-rule">
              {view.steps.map(({ title, body }, i) => (
                <li key={title} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 py-4">
                  <span className="font-serif text-[20px] leading-none text-ink-3">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] font-semibold text-ink">{title}</span>
                    <span className="mt-1 block text-[15px] leading-[1.6] text-ink-2">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
            {path === "pilot" && (
              <a href="#pilot-protokolu" className={`mt-2 ${TEXT_ACTION}`}>
                {c.protocolLink}
              </a>
            )}
          </section>

          <section aria-labelledby="email-title" className="border-t border-rule pt-4">
            <h2 id="email-title" className="font-serif text-[17px] text-ink-3">
              {c.email}
            </h2>
            <CopyEmail locale={locale} tone="paper" className="mt-2 min-h-11 text-[15px] text-ink" />
            <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">{c.noPatientData}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Three ways in, lowest commitment first. One joined grid: shared hairlines, neutral selection. */}
      <fieldset>
        <legend className={LABEL}>{c.pathLegend}</legend>
        <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {contactPaths(locale).map(({ value, icon: Icon, label, hint, rows }) => {
            const checked = path === value;
            return (
              <label
                key={value}
                className={`group relative flex cursor-pointer flex-col p-5 transition-colors duration-150 ease-out has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white/30 has-[:focus-visible]:ring-inset sm:p-6 ${
                  checked ? "bg-navy-800" : "bg-navy-850 hover:bg-white/[0.04]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-colors duration-150 ease-out ${
                    checked ? "bg-white/50" : "bg-transparent"
                  }`}
                />
                <input
                  type="radio"
                  name="contact-path"
                  value={value}
                  checked={checked}
                  onChange={() => choosePath(value)}
                  className="sr-only"
                />
                <Icon
                  className={`h-[18px] w-[18px] transition-colors duration-150 ease-out ${checked ? "text-white" : "text-white/55"}`}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-white">{label}</span>
                <span className="mt-1.5 text-[13px] leading-relaxed text-white/55">{hint}</span>
                <span className="mt-auto block pt-5">
                  <span className="-mx-5 block divide-y divide-hairline border-t border-hairline sm:-mx-6">
                    {rows.map((row) => (
                      <span key={row.label} className="grid grid-cols-[88px_1fr] gap-3 px-5 py-2 sm:px-6">
                        <span className="text-[11.5px] text-white/55">{row.label}</span>
                        <span className="text-[12.5px] leading-snug text-white/75">{row.value}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-10">
          <section aria-labelledby="process-title">
            <p id="process-title" className={LABEL}>
              {c.process}
            </p>
            <div aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.ol
                  key={`${path}-${product}`}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 space-y-6"
                >
                  {view.steps.map(({ icon: Icon, title, body }, i) => (
                    <li key={title} className="flex gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${view.accent.text}`}>
                        <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/55">
                          {c.step} <span className="font-mono tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        </p>
                        <h2 className="mt-0.5 text-[15px] font-medium text-white">{title}</h2>
                        <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
                      </div>
                    </li>
                  ))}
                </motion.ol>
              </AnimatePresence>
            </div>
          </section>

          {path === "pilot" && (
            <a
              href="#pilot-protokolu"
              className="group flex items-center justify-between gap-4 border-y border-hairline py-3 text-sm text-white/70 transition-colors duration-150 ease-out hover:text-white"
            >
              {c.protocolLink}
              <ArrowDown
                className="h-4 w-4 text-white/55 transition-transform duration-150 ease-out group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          )}

          <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6">
            <p className={LABEL}>{c.email}</p>
            <CopyEmail locale={locale} className="mt-3 text-sm text-white" />
            <p className="mt-4 text-xs leading-relaxed text-white/55">{c.noPatientData}</p>
          </div>
        </div>

        <ContactForm locale={locale} path={path} product={product} onProductChange={chooseProduct} />
      </div>
    </div>
  );
}

/**
 * Reads `?path=intro|academic|pilot&product=pharmadeux|shield`. Older links used `?solution=`:
 * `academic` maps to the academic path, a product name to the pilot path, since those links said LOI.
 */
export function ContactExperienceFromParams({
  locale,
  tone,
  aside,
}: {
  locale: Locale;
  tone?: ContactTone;
  aside?: ReactNode;
}) {
  const params = useSearchParams();
  const legacy = params.get("solution");
  const rawPath = params.get("path") ?? (legacy === "academic" ? "academic" : isProduct(legacy) ? "pilot" : null);
  const rawProduct = params.get("product") ?? legacy;
  return (
    <ContactExperience
      locale={locale}
      initialPath={isContactPath(rawPath) ? rawPath : undefined}
      initialProduct={isProduct(rawProduct) ? rawProduct : undefined}
      tone={tone}
      aside={aside}
    />
  );
}
