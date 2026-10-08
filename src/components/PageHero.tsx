import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

type Crumb = { href?: string; label: string };

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  breadcrumbs?: Crumb[];
  /** Decorative visual shown beside the copy on large screens and beneath it on small ones. */
  visual?: ReactNode;
  /** Full-width content under the hero grid (e.g. a stats strip). */
  below?: ReactNode;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, description, breadcrumbs, visual, below, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <Reveal>
            <nav aria-label="Konum" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                {breadcrumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="h-3 w-3" />}
                    {c.href ? (
                      <Link href={c.href} className="transition-colors hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-white/70">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        <div
          className={visual ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6" : ""}
        >
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[56px]">
                {title}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">{description}</div>
            </Reveal>
            {children && (
              <Reveal delay={0.24} className="mt-10">
                {children}
              </Reveal>
            )}
          </div>
          {visual && (
            <Reveal
              delay={0.2}
              y={0}
              className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[520px]"
            >
              {visual}
            </Reveal>
          )}
        </div>
        {below && (
          <Reveal delay={0.3} className="mt-14">
            {below}
          </Reveal>
        )}
      </div>
    </section>
  );
}
