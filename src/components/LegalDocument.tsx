import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import CopyEmail from "@/components/CopyEmail";
import { LINK } from "@/components/paper/Editorial";
import { LEGAL_ENTITY, LEGAL_UPDATED, navigation, type LegalPath } from "@/lib/site";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    breadcrumb: "Sayfa konumu",
    home: "Ana sayfa",
    legal: "Yasal",
    centre: "Yasal belgeler",
    facts: "Belge künyesi",
    updated: "Son güncelleme",
    contents: "İçindekiler",
    entity: "Unvan",
    address: "Adres",
    mersis: "MERSİS No",
    email: "E-posta",
  },
  en: {
    breadcrumb: "Breadcrumb",
    home: "Home",
    legal: "Legal",
    centre: "Legal documents",
    facts: "Document details",
    updated: "Last updated",
    contents: "Contents",
    entity: "Name",
    address: "Address",
    mersis: "MERSIS no.",
    email: "Email",
  },
});

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export type LegalFact = { label: string; value: string };

type LegalDocumentProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  summary: ReactNode;
  /** Short facts for the document details (type, legal basis, scope…); the date is added here. */
  facts: LegalFact[];
  sections: LegalSection[];
  currentHref: LegalPath;
};

const TOC_LINK =
  "-ml-px block border-l border-transparent py-1.5 pl-4 text-[14px] leading-snug text-ink-2 transition-colors duration-150 ease-out hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/**
 * Legal documents on the paper surface (Academic Editorial): breadcrumb, a row of the four documents with the current
 * one marked, title and summary beside the document details, then the text in the nine content columns with a
 * contents list on the left (folded into a <details> on phones). The text keeps its own section ids. Styles for the
 * text are scoped to `.legal-paper`; the dark `.legal-prose` class is not used here. No entrance motion.
 */
export default function LegalDocument({ locale, eyebrow, title, summary, facts, sections, currentHref }: LegalDocumentProps) {
  const c = copy[locale];
  const docs = navigation[locale].legal;
  const href = (path: string) => localizedPath(locale, path);
  const updated = LEGAL_UPDATED[currentHref];

  const toc = (
    <ol className="mt-3 border-l border-rule">
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className={TOC_LINK}>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      <section aria-labelledby="legal-title" className="pt-16">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 sm:pt-10 sm:pb-12 lg:px-8">
          <nav aria-label={c.breadcrumb}>
            <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
              <li>
                <Link href={href("/")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.home}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li>{c.legal}</li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li aria-current="page" className="text-ink-2">
                {title}
              </li>
            </ol>
          </nav>

          {/* The four documents; the current one is marked. */}
          <nav aria-label={c.centre} className="mt-5 print:hidden">
            <ul className="flex flex-wrap gap-x-6 border-b border-rule">
              {docs.map((doc) => {
                const active = doc.href === currentHref;
                return (
                  <li key={doc.href}>
                    <Link
                      href={href(doc.href)}
                      aria-current={active ? "page" : undefined}
                      className={`-mb-px inline-flex min-h-11 items-center border-b-2 text-[14px] transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                        active ? "border-ink font-medium text-ink" : "border-transparent text-ink-2 hover:text-ink"
                      }`}
                    >
                      {doc.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-serif text-[17px] text-ink-3">{eyebrow}</p>
              <h1
                id="legal-title"
                className="mt-2 max-w-[24ch] font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:text-[44px]"
              >
                {title}
              </h1>
              <div className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-ink-2">{summary}</div>
              {locale === "en" && (
                <p className="mt-4 max-w-[64ch] text-[14px] leading-[1.6] text-ink-3">
                  This is an English translation for convenience. If it differs from the{" "}
                  <a href={currentHref} hrefLang="tr" lang="tr" className={LINK}>
                    Turkish version
                  </a>
                  , the Turkish version prevails.
                </p>
              )}
            </div>
            <aside aria-labelledby="legal-facts" className="self-end border-t-2 border-ink pt-4 lg:col-span-4">
              <h2 id="legal-facts" className="font-serif text-[20px] font-semibold text-ink">
                {c.facts}
              </h2>
              <dl className="mt-3 divide-y divide-rule border-t border-rule">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                    <dt className="text-[13px] text-ink-3">{f.label}</dt>
                    <dd className="text-[14px] leading-snug text-ink">{f.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                  <dt className="text-[13px] text-ink-3">{c.updated}</dt>
                  <dd className="text-[14px] leading-snug text-ink">
                    <time dateTime={updated} className="font-mono tabular-nums">
                      {formatDate(locale, updated)}
                    </time>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <div className="border-t border-rule">
        <div className="mx-auto grid max-w-7xl gap-x-10 px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-20 lg:grid-cols-12 lg:px-8">
          {/* Contents: a sticky column on wide screens, a folded list on phones. Only one is shown at a time. */}
          <nav aria-labelledby="legal-toc" className="hidden lg:col-span-3 lg:block print:hidden">
            <div className="sticky top-24">
              <p id="legal-toc" className="font-serif text-[17px] text-ink-3">
                {c.contents}
              </p>
              {toc}
            </div>
          </nav>
          <details className="group/toc mb-8 border-y border-rule lg:hidden print:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-serif text-[17px] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [&::-webkit-details-marker]:hidden">
              <ChevronRight
                className="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-150 ease-out group-open/toc:rotate-90"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {c.contents}
            </summary>
            <nav aria-label={c.contents} className="pb-3">
              {toc}
            </nav>
          </details>

          <article className="legal-paper min-w-0 lg:col-span-9">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-20 border-t border-rule py-8 first:border-t-0 first:pt-0 sm:py-10 sm:first:pt-0">
                <h2>{s.title}</h2>
                {s.content}
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}

/** Data controller details as label / value rows on rules. */
export function ControllerDetails({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const rows: { label: string; value: ReactNode }[] = [
    { label: c.entity, value: LEGAL_ENTITY.name },
    ...(LEGAL_ENTITY.address ? [{ label: c.address, value: LEGAL_ENTITY.address }] : []),
    ...(LEGAL_ENTITY.mersis ? [{ label: c.mersis, value: LEGAL_ENTITY.mersis }] : []),
    { label: c.email, value: <CopyEmail locale={locale} tone="paper" className="text-ink" /> },
  ];
  return (
    <dl className="mt-5 max-w-[68ch] divide-y divide-rule border-y border-rule">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-0.5 py-2.5 text-[15px] sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center sm:gap-4">
          <dt className="text-ink-3">{r.label}</dt>
          <dd className="text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
