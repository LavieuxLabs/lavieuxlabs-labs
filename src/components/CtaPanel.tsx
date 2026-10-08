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
          <div className="relative isolate overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] px-6 py-12 backdrop-blur-sm sm:px-12 sm:py-16">
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              <div
                className={`absolute -top-32 -right-24 h-80 w-80 rounded-full blur-3xl ${
                  accent === "teal" ? "bg-teal-400/10" : "bg-indigo-400/12"
                }`}
              />
              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-400/[0.06] blur-3xl" />
            </div>

            <div className={`grid gap-12 ${aside ? "lg:grid-cols-[1.1fr_1fr] lg:gap-16" : ""}`}>
              <div>
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {eyebrow}
                </p>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">{description}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={primaryHref}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#06080d] transition-colors hover:bg-teal-200"
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
