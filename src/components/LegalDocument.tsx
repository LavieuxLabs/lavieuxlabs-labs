import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { CONTACT_EMAIL, LEGAL_ENTITY, LEGAL_LAST_UPDATED, legalLinks } from "@/lib/site";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  summary: ReactNode;
  sections: LegalSection[];
  currentHref: string;
};

export default function LegalDocument({ eyebrow, title, summary, sections, currentHref }: LegalDocumentProps) {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <section className="relative isolate pt-32 pb-12 sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Konum">
            <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium tracking-wider text-white/40 uppercase">
              <li>
                <Link href="/" className="hover:text-white">
                  Ana sayfa
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <span>Yasal</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <span aria-current="page" className="text-white/70">
                  {title}
                </span>
              </li>
            </ol>
          </nav>
          <p className="mt-8 text-[11px] font-medium tracking-wider text-white/50 uppercase">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">{title}</h1>
          <div className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">{summary}</div>
          <p className="mt-6 font-mono text-xs text-white/35">Son güncelleme: {LEGAL_LAST_UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8 sm:pb-32">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="İçindekiler" className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/35">İçindekiler</p>
            <ol className="mt-4 space-y-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-2.5 text-[13px] leading-snug text-white/55 hover:text-white">
                    <span className="font-mono text-[10.5px] text-white/30">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <nav
            aria-label="Diğer politikalar"
            className="mt-4 hidden rounded-2xl border border-white/[0.06] p-5 lg:block"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/35">Diğer politikalar</p>
            <ul className="mt-4 space-y-2">
              {legalLinks
                .filter((l) => l.href !== currentHref)
                .map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-white/55 hover:text-teal-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </aside>

        <article className="legal-prose max-w-3xl min-w-0">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 border-t border-white/[0.06] py-10 first:border-t-0 first:pt-0"
            >
              <h2>
                <span className="mr-3 font-mono text-sm text-teal-300/60">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

export function ControllerDetails() {
  return (
    <ul>
      <li>
        <strong>Unvan:</strong> {LEGAL_ENTITY.name}
      </li>
      {LEGAL_ENTITY.address && (
        <li>
          <strong>Adres:</strong> {LEGAL_ENTITY.address}
        </li>
      )}
      {LEGAL_ENTITY.mersis && (
        <li>
          <strong>MERSİS No:</strong> {LEGAL_ENTITY.mersis}
        </li>
      )}
      <li>
        <strong>E-posta:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </li>
    </ul>
  );
}
