import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import CopyEmail from "@/components/CopyEmail";
import type { Locale } from "@/i18n/config";

type CtaPanelProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  aside?: ReactNode;
  accent?: "teal" | "indigo";
};

export default function CtaPanel({
  locale,
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  aside,
  accent = "teal",
}: CtaPanelProps) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-navy-850 px-6 py-12 sm:px-12 sm:py-16">
            <div className={`grid gap-12 ${aside ? "lg:grid-cols-[1.1fr_1fr] lg:gap-16" : ""}`}>
              <div>
                <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{eyebrow}</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  {title}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">{description}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={primaryHref}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors ${accent === "teal" ? "hover:bg-teal-100" : "hover:bg-indigo-100"}`}
                  >
                    {primaryLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <CopyEmail locale={locale} variant="button" />
                </div>
              </div>
              {aside}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
