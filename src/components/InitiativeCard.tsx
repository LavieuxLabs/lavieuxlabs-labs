"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Pill, ShieldCheck } from "lucide-react";

export type InitiativeSpec = {
  value: string;
  label: string;
};

export type InitiativeCardProps = {
  name: string;
  /** Plain technical label above the name, e.g. "Klinik karar destek · ilaç güvenliği". */
  category: string;
  /** Two or three plain sentences. */
  summary: string;
  specs: InitiativeSpec[];
  icon: "pill" | "shield";
  accent: "teal" | "indigo";
  href: string;
  className?: string;
};

// Literal class strings so Tailwind can detect them at build time.
const accents = {
  teal: { icon: "text-pharma", link: "text-teal-200 hover:text-teal-100" },
  indigo: { icon: "text-shield", link: "text-indigo-200 hover:text-indigo-100" },
} as const;

const icons = { pill: Pill, shield: ShieldCheck };

// Numbers are data and render in Geist Mono; worded values stay in the sans face.
const hasDigit = (value: string) => /\d/.test(value);

export default function InitiativeCard({
  name,
  category,
  summary,
  specs,
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
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
      className={`flex flex-col rounded-2xl border border-white/[0.06] bg-navy-850 p-6 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-8 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4 w-4 ${tone.icon}`} strokeWidth={1.7} aria-hidden="true" />
        <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{category}</p>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[28px]">{name}</h3>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">{summary}</p>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]">
        {specs.map((s) => (
          <div key={s.label} className="flex flex-col-reverse bg-navy-850 p-4 sm:p-5">
            <dt className="mt-1 text-xs leading-snug text-white/50">{s.label}</dt>
            <dd
              className={`text-lg font-medium tracking-[-0.01em] text-white sm:text-xl ${
                hasDigit(s.value) ? "font-mono tabular-nums" : ""
              }`}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-8">
        <Link
          href={href}
          className={`group/link inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150 ease-out ${tone.link}`}
        >
          {name} ayrıntıları
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 ease-out group-hover/link:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
}
