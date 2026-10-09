"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Pill, ShieldCheck } from "lucide-react";

export type InitiativeMetric = {
  value: string;
  label: string;
};

export type InitiativeCardProps = {
  index: string;
  name: string;
  category: string;
  summary: string;
  metrics: InitiativeMetric[];
  capabilities: string[];
  tags: string[];
  icon: "pill" | "shield";
  accent: "teal" | "indigo";
  href: string;
  className?: string;
};

// Literal class strings so Tailwind can detect them at build time.
const accents = {
  teal: {
    icon: "border-teal-400/25 bg-teal-400/10 text-teal-300",
    value: "text-teal-200",
    check: "text-teal-300",
    link: "text-teal-200 hover:text-teal-100",
    chip: "border-teal-400/20 text-teal-200/80",
    bar: "from-teal-400/60",
  },
  indigo: {
    icon: "border-indigo-400/25 bg-indigo-400/10 text-indigo-300",
    value: "text-indigo-200",
    check: "text-indigo-300",
    link: "text-indigo-200 hover:text-indigo-100",
    chip: "border-indigo-400/20 text-indigo-200/80",
    bar: "from-indigo-400/60",
  },
} as const;

const icons = { pill: Pill, shield: ShieldCheck };

export default function InitiativeCard({
  index,
  name,
  category,
  summary,
  metrics,
  capabilities,
  tags,
  icon,
  accent,
  href,
  className = "",
}: InitiativeCardProps) {
  const reduced = useReducedMotion();
  const tone = accents[accent];
  const Icon = icons[icon];

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-navy-850 transition-colors duration-150 ease-out hover:border-white/[0.14] hover:bg-navy-800 ${className}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${tone.bar} via-white/10 to-transparent`}
      />

      <div className="relative flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tone.icon}`}>
            <Icon className="h-5 w-5" strokeWidth={1.6} />
          </div>
          <span className="font-mono text-xs tracking-[0.18em] text-white/30">{index}</span>
        </div>

        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-white/45">{category}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">{name}</h3>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">{summary}</p>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08]">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse bg-navy-850 p-4 sm:p-5">
              <dt className="mt-1 text-xs leading-snug text-white/50">{m.label}</dt>
              <dd className={`font-mono text-xl font-medium tracking-tight tabular-nums sm:text-2xl ${tone.value}`}>{m.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-8 space-y-3">
          {capabilities.map((c) => (
            <li key={c} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tone.check}`} strokeWidth={2} />
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-8">
          {tags.map((t) => (
            <span
              key={t}
              className={`rounded-full border bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${tone.chip}`}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-6">
          <Link
            href={href}
            className={`group/link inline-flex items-center gap-2 text-sm font-medium transition-colors ${tone.link}`}
          >
            Platform Detaylarını İncele
            <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-out group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
