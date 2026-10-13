import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { RailMarker } from "@/components/TelemetryRails";
import { metrics } from "@/lib/metrics";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    home: "Ana sayfa",
    hub: "Standartlar",
    references: "Kaynaklar",
    related: "İlgili",
    updated: "Son güncelleme",
    disclaimer:
      "Bu sayfa bilgilendirme amaçlıdır ve klinik karar için kullanılmaz. Karar için ürün bilgisi (KÜB/KT), güncel kılavuzlar ve hekimin değerlendirmesi esastır.",
  },
  en: {
    home: "Home",
    hub: "Standards",
    references: "References",
    related: "Related",
    updated: "Last updated",
    disclaimer:
      "This page is for information only and is not for clinical decisions. Decisions rest on the product information (SmPC/PIL), current guidelines and the physician's judgement.",
  },
});

type StandardDocProps = {
  locale: Locale;
  /** Breadcrumb label of this page; omit on the hub itself. */
  crumb?: string;
  eyebrow: string;
  title: string;
  description: string;
  jsonLd: Record<string, unknown>;
  references?: string[];
  related?: { href: string; label: string }[];
  /** Full-width block above the prose column (e.g. the hub's searchable index); prose styles do not apply. */
  wide?: ReactNode;
  children: ReactNode;
};

/**
 * Shell for the standards & reference pages: hero with breadcrumbs, datasheet prose (legal-prose
 * typography: neutral, no accent in the data layer), references, related links and a last-updated line
 * read from the metrics source of truth.
 */
export default function StandardDoc({ locale, crumb, eyebrow, title, description, jsonLd, references, related, wide, children }: StandardDocProps) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);
  return (
    <main className="relative flex-1 overflow-x-clip">
      <JsonLd data={jsonLd} />
      <PageHero
        locale={locale}
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[
          { href: "/", label: c.home },
          ...(crumb ? [{ href: "/standartlar", label: c.hub }, { label: crumb }] : [{ label: c.hub }]),
        ]}
      />

      <section className="relative pb-24 sm:pb-32">
        <RailMarker className="top-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {wide && <div className="mb-14">{wide}</div>}
          <div className="max-w-3xl">
            <div className="legal-prose">{children}</div>

            {references && references.length > 0 && (
              <div className="mt-14 border-t border-hairline pt-6">
                <h2 className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.references}</h2>
                <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-white/70">
                  {references.map((ref, i) => (
                    <li key={ref} lang="en" className="grid grid-cols-[24px_1fr] gap-2">
                      <span className="font-mono text-white/50 tabular-nums">{i + 1}</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {related && related.length > 0 && (
              <div className="mt-10 border-t border-hairline pt-6">
                <h2 className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.related}</h2>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {related.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={href(r.href)}
                        className="inline-flex items-center gap-1.5 text-[13.5px] text-white/80 transition-colors duration-150 ease-out hover:text-white"
                      >
                        {r.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-10 border-t border-hairline pt-6 text-xs leading-relaxed text-white/55">
              {c.disclaimer}{" "}
              <span className="whitespace-nowrap">
                {c.updated}: <span className="tabular-nums">{formatDate(locale, metrics.lastUpdated)}</span>
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
