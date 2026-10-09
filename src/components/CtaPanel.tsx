import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/lib/site";

type CtaPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  aside?: ReactNode;
  accent?: "teal" | "indigo";
};

export default function CtaPanel({
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
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-navy-850 px-6 py-12 sm:px-12 sm:py-16">
            <div className={`grid gap-12 ${aside ? "lg:grid-cols-[1.1fr_1fr] lg:gap-16" : ""}`}>
              <div>
                <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-white/60">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                  {eyebrow}
                </p>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">{description}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={primaryHref}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors ${accent === "teal" ? "hover:bg-teal-100" : "hover:bg-indigo-100"}`}
                  >
                    {primaryLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-mono text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                    {CONTACT_EMAIL}
                  </a>
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
