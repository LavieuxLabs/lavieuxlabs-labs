import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import CopyEmail from "@/components/CopyEmail";
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED, navigation } from "@/lib/site";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    breadcrumb: "Konum",
    home: "Ana sayfa",
    legal: "Yasal",
    centre: "Dokümantasyon merkezi",
    facts: "Belge künyesi",
    updated: "Son güncelleme",
    contents: "İçindekiler",
    entity: "Unvan",
    address: "Adres",
    mersis: "MERSİS No",
    email: "E-posta",
    types: {
      "/legal/privacy": "Aydınlatma metni",
      "/legal/cookies": "Politika",
      "/legal/quality": "Beyan",
      "/legal/terms": "Şartlar",
    } as Record<string, string>,
  },
  en: {
    breadcrumb: "Breadcrumb",
    home: "Home",
    legal: "Legal",
    centre: "Documentation centre",
    facts: "Document details",
    updated: "Last updated",
    contents: "Contents",
    entity: "Name",
    address: "Address",
    mersis: "MERSIS no.",
    email: "Email",
    types: {
      "/legal/privacy": "Privacy notice",
      "/legal/cookies": "Policy",
      "/legal/quality": "Statement",
      "/legal/terms": "Terms",
    },
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
  /** Three short facts for the document plate (type, legal basis, scope…); the date is added here. */
  facts: LegalFact[];
  sections: LegalSection[];
  currentHref: string;
};

const LABEL = "text-[11px] font-medium tracking-wider text-white/50 uppercase";
const PLATE = "grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]";

/**
 * Legal documents as a corporate documentation centre: a strip of all four documents, a datasheet
 * plate with the document's details, a plain contents list and the text on hairlines. Neutral
 * colours only (no accent links, no section numbers).
 */
export default function LegalDocument({
  locale,
  eyebrow,
  title,
  summary,
  facts,
  sections,
  currentHref,
}: LegalDocumentProps) {
  const c = copy[locale];
  const docs = navigation[locale].legal;

  return (
    <main className="relative flex-1 overflow-x-clip">
      <section className="relative isolate pt-32 pb-12 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label={c.breadcrumb}>
            <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium tracking-wider text-white/55 uppercase">
              <li>
                <Link href={localizedPath(locale, "/")} className="transition-colors duration-150 ease-out hover:text-white">
                  {c.home}
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                <span>{c.legal}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                <span aria-current="page" className="text-white/70">
                  {title}
                </span>
              </li>
            </ol>
          </nav>

          {/* Documentation centre: every legal document, the current one marked */}
          <nav aria-label={c.centre} className="mt-8">
            <p className={LABEL}>{c.centre}</p>
            <ul className={`mt-3 grid-cols-2 lg:grid-cols-4 ${PLATE}`}>
              {docs.map((doc) => {
                const active = doc.href === currentHref;
                return (
                  <li key={doc.href} className="bg-navy-900">
                    <Link
                      href={localizedPath(locale, doc.href)}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex h-full flex-col px-4 py-3.5 transition-colors duration-150 ease-out ${
                        active ? "bg-navy-850" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 top-0 h-px ${active ? "bg-white/70" : "bg-transparent"}`}
                      />
                      <span className={LABEL}>{c.types[doc.href]}</span>
                      <span className={`mt-1 text-[13.5px] leading-snug ${active ? "text-white" : "text-white/70"}`}>
                        {doc.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p className={`mt-14 ${LABEL}`}>{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">{title}</h1>
          <div className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">{summary}</div>

          {/* Document plate */}
          <dl aria-label={c.facts} className={`mt-10 grid-cols-2 lg:grid-cols-4 ${PLATE}`}>
            {facts.map((f) => (
              <div key={f.label} className="bg-navy-900 p-4 sm:p-5">
                <dt className={LABEL}>{f.label}</dt>
                <dd className="mt-1.5 text-[13.5px] leading-snug text-white/85">{f.value}</dd>
              </div>
            ))}
            <div className="bg-navy-900 p-4 sm:p-5">
              <dt className={LABEL}>{c.updated}</dt>
              <dd className="mt-1.5 text-[13.5px] leading-snug text-white/85">
                <time dateTime={LEGAL_LAST_UPDATED}>{formatDate(locale, LEGAL_LAST_UPDATED)}</time>
              </dd>
            </div>
          </dl>
          {locale === "en" && (
            <p className="mt-4 max-w-2xl text-xs leading-relaxed text-white/55">
              This is an English translation for convenience. If it differs from the{" "}
              <a
                href={currentHref}
                hrefLang="tr"
                lang="tr"
                className="text-white/80 underline decoration-white/25 underline-offset-4 transition-colors duration-150 ease-out hover:text-white hover:decoration-white/60"
              >
                Turkish version
              </a>
              , the Turkish version prevails.
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[240px_1fr] lg:gap-16 lg:px-8">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label={c.contents}>
            <p className={LABEL}>{c.contents}</p>
            <ol className="mt-4 border-l border-white/[0.06]">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[13px] leading-snug text-white/60 transition-colors duration-150 ease-out hover:border-white/50 hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="legal-prose max-w-3xl min-w-0">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 border-t border-white/[0.06] py-10 first:border-t-0 first:pt-0"
            >
              <h2>{s.title}</h2>
              {s.content}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

/** Data controller details as a datasheet (label · value on hairlines). */
export function ControllerDetails({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const rows: { label: string; value: ReactNode }[] = [
    { label: c.entity, value: LEGAL_ENTITY.name },
    ...(LEGAL_ENTITY.address ? [{ label: c.address, value: LEGAL_ENTITY.address }] : []),
    ...(LEGAL_ENTITY.mersis ? [{ label: c.mersis, value: LEGAL_ENTITY.mersis }] : []),
    { label: c.email, value: <CopyEmail locale={locale} className="text-white/85" /> },
  ];
  return (
    <dl className="mt-6 divide-y divide-white/[0.06] border-t border-white/[0.06]">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[120px_1fr] gap-4 py-3 text-[14px]">
          <dt className="text-white/55">{r.label}</dt>
          <dd className="text-white/85">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
