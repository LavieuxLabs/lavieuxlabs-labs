"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";
import { writeClipboard } from "@/lib/clipboard";
import type { Locale } from "@/i18n/config";

const copy: Record<Locale, { action: string; done: string; failed: string }> = {
  tr: { action: "E-posta adresini kopyala", done: "Kopyalandı", failed: "Kopyalanamadı" },
  en: { action: "Copy email address", done: "Copied", failed: "Could not copy" },
};

type CopyEmailProps = {
  locale: Locale;
  /** Address to show and copy; defaults to the site contact address. */
  email?: string;
  /** "inline" sits in text (footer, cards); "button" is a bordered secondary button. */
  variant?: "inline" | "button";
  /** "paper" on the light home surface; "dark" everywhere else. */
  tone?: "dark" | "paper";
  className?: string;
};

/**
 * Shows the contact address and copies it on click, with a 2 s "Copied" confirmation. A plain
 * mailto link does nothing on machines without a configured mail client; copying always works.
 */
export default function CopyEmail({
  locale,
  email = CONTACT_EMAIL,
  variant = "inline",
  tone = "dark",
  className = "",
}: CopyEmailProps) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  const t = copy[locale];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await writeClipboard(email);
    setState(ok ? "done" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  const Icon = state === "done" ? Check : Copy;
  const paper = tone === "paper";
  const base =
    variant === "button"
      ? paper
        ? "inline-flex items-center justify-center gap-2 rounded-md border border-ink/25 px-5 py-3 text-sm text-ink hover:border-ink"
        : "inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm text-white/80 hover:border-white/30 hover:text-white"
      : paper
        ? "inline-flex items-center gap-2 text-left hover:text-ink"
        : "inline-flex items-center gap-2 text-left hover:text-white";
  const iconTone = paper
    ? state === "done"
      ? "text-ink"
      : "text-ink-3 group-hover:text-ink"
    : state === "done"
      ? "text-white"
      : "text-white/55 group-hover:text-white/80";

  return (
    <button
      type="button"
      onClick={onClick}
      title={t.action}
      className={`group cursor-pointer transition-colors duration-150 ease-out ${base} ${className}`}
    >
      <span className="font-mono">{email}</span>
      <Icon
        aria-hidden="true"
        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-150 ease-out ${iconTone}`}
      />
      <span className="sr-only">{t.action}</span>
      <span
        aria-live="polite"
        className={state === "idle" ? "sr-only" : `text-[11px] font-medium ${paper ? "text-ink-2" : "text-white/70"}`}
      >
        {state === "done" ? t.done : state === "failed" ? t.failed : ""}
      </span>
    </button>
  );
}
