import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { LINK } from "@/components/paper/Editorial";
import { metrics } from "@/lib/metrics";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    home: "Ana sayfa",
    hub: "Standartlar",
    crumbs: "Sayfa konumu",
    toc: "Bu sayfada",
    references: "Kaynaklar",
    related: "İlgili sayfalar",
    updated: "Son güncelleme",
    disclaimer:
      "Bu sayfa bilgilendirme amaçlıdır ve klinik karar için kullanılmaz. Karar için ürün bilgisi (KÜB/KT), güncel kılavuzlar ve hekimin değerlendirmesi esastır.",
  },
  en: {
    home: "Home",
    hub: "Standards",
    crumbs: "Breadcrumb",
    toc: "On this page",
    references: "References",
    related: "Related pages",
    updated: "Last updated",
    disclaimer:
      "This page is for information only and is not for clinical decisions. Decisions rest on the product information (SmPC/PIL), current guidelines and the physician's judgement.",
  },
});

type StandardDocProps = {
  locale: Locale;
  /** Breadcrumb label of this page. */
  crumb: string;
  /** Short category line above the title (e.g. "Klinik standart: QT riski"). */
  eyebrow: string;
  title: string;
  description: string;
  jsonLd: Record<string, unknown>;
  /** The page's h2 sections, in order; each h2 in the content carries the same id. Ids are the same in both languages. */
  toc: { id: string; label: string }[];
  references?: string[];
  related?: { href: string; label: string }[];
  children: ReactNode;
};

const URL_RE = /(https?:\/\/[^\s]+[^\s.,;)])/g;

/** A reference string with its URL (if any) as a link. Only the URL is linked; the citation text stays as written. */
function Reference({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={`[overflow-wrap:anywhere] ${LINK}`}>
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Shell for the standards reference pages on the paper surface (Academic Editorial): breadcrumb, title and
 * summary; on wide screens a contents list in the left three columns beside the datasheet column; numbered
 * references, related pages and a last-updated line from the metrics source of truth. No entrance motion.
 */
export default function StandardDoc({ locale, crumb, eyebrow, title, description, jsonLd, toc, references, related, children }: StandardDocProps) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);
  const contents = [...toc, ...(references?.length ? [{ id: "referanslar", label: c.references }] : [])];

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      <JsonLd data={jsonLd} />

      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 sm:pt-10 sm:pb-12 lg:px-8">
          <nav aria-label={c.crumbs}>
            <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
              <li>
                <Link href={href("/")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.home}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li>
                <Link href={href("/standartlar")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.hub}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li aria-current="page" className="text-ink-2">
                {crumb}
              </li>
            </ol>
          </nav>
          <p className="mt-6 font-serif text-[17px] text-ink-3 sm:mt-8">{eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-2 max-w-[24ch] font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:text-[44px]"
          >
            {title}
          </h1>
          <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-ink-2">{description}</p>
        </div>
      </section>

      <div className="border-t border-rule">
        <div className="mx-auto grid max-w-7xl gap-x-10 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:grid-cols-12 lg:px-8">
          {/* Contents: wide screens only; the column is short enough to read straight through on a phone. */}
          <nav aria-labelledby="toc-title" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <p id="toc-title" className="font-serif text-[17px] text-ink-3">
                {c.toc}
              </p>
              <ol className="mt-3 space-y-0.5 border-l border-rule">
                {contents.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[14px] leading-snug text-ink-2 transition-colors duration-150 ease-out hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0 lg:col-span-9">
            <div className="paper-prose">{children}</div>

            {references && references.length > 0 && (
              <section id="referanslar" aria-labelledby="referanslar-title" className="mt-12 scroll-mt-20 border-t border-rule pt-6">
                <h2 id="referanslar-title" className="font-serif text-[22px] font-medium text-ink">
                  {c.references}
                </h2>
                <ol className="mt-3 max-w-[72ch] divide-y divide-rule border-y border-rule">
                  {references.map((ref, i) => (
                    <li key={ref} lang={/[ğışİĞŞ]/.test(ref) ? "tr" : "en"} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 py-2.5 text-[14px] leading-[1.55] text-ink-2">
                      <span className="text-ink-3 tabular-nums">{i + 1}.</span>
                      <span>
                        <Reference text={ref} />
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {related && related.length > 0 && (
              <section aria-labelledby="ilgili-title" className="mt-10">
                <h2 id="ilgili-title" className="font-serif text-[22px] font-medium text-ink">
                  {c.related}
                </h2>
                <ul className="mt-2 flex flex-wrap gap-x-6">
                  {related.map((r) => (
                    <li key={r.href}>
                      <Link href={href(r.href)} className={`inline-flex min-h-11 items-center text-[15px] text-ink ${LINK}`}>
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="mt-8 max-w-[72ch] border-t border-rule pt-5 text-[14px] leading-[1.6] text-ink-3">
              {c.disclaimer}{" "}
              <span className="whitespace-nowrap">
                {c.updated}: {formatDate(locale, metrics.lastUpdated)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * A formula in readable mathematical notation: Newsreader, superscripts, terms that wrap at the operators instead
 * of scrolling. `plain` is the linear form read by screen readers. The tokens themselves are not changed.
 */
export function Formula({ plain, caption, children }: { plain: string; caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="mt-4 max-w-[68ch] border border-rule bg-white px-5 py-4">
      <p role="math" aria-label={plain} className="font-serif text-[19px] leading-[1.8] text-ink sm:text-[21px]">
        {children}
      </p>
      {caption && <figcaption className="mt-2 text-[14px] text-ink-3">{caption}</figcaption>}
    </figure>
  );
}

/** One term of a formula; it stays on one line and the formula wraps between terms. */
export function Term({ children }: { children: ReactNode }) {
  return <span className="inline-block whitespace-nowrap">{children}</span>;
}

/** An interactive tool or code panel that keeps its dark ground on the paper page. */
export function ToolPanel({ children }: { children: ReactNode }) {
  return <div className="panel-dark max-w-[68ch] [color-scheme:dark]">{children}</div>;
}
