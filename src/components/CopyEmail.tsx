"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";
import type { Locale } from "@/i18n/config";

const copy: Record<Locale, { action: string; done: string; failed: string }> = {
  tr: { action: "E-posta adresini kopyala", done: "Kopyalandı", failed: "Kopyalanamadı" },
  en: { action: "Copy email address", done: "Copied", failed: "Could not copy" },
};

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / insecure context: copy through a temporary selection.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

type CopyEmailProps = {
  locale: Locale;
  /** "inline" sits in text (footer, cards); "button" is a bordered secondary button. */
  variant?: "inline" | "button";
  className?: string;
};

/**
 * Shows the contact address and copies it on click, with a 2 s "Copied" confirmation. A plain
 * mailto link does nothing on machines without a configured mail client; copying always works.
 */
export default function CopyEmail({ locale, variant = "inline", className = "" }: CopyEmailProps) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  const t = copy[locale];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await writeClipboard(CONTACT_EMAIL);
    setState(ok ? "done" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  const Icon = state === "done" ? Check : Copy;
  const base =
    variant === "button"
      ? "inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm text-white/80 hover:border-white/30 hover:text-white"
      : "inline-flex items-center gap-2 text-left hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      title={t.action}
      className={`group cursor-pointer transition-colors duration-150 ease-out ${base} ${className}`}
    >
      <span className="font-mono">{CONTACT_EMAIL}</span>
      <Icon
        aria-hidden="true"
        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-150 ease-out ${
          state === "done" ? "text-white" : "text-white/55 group-hover:text-white/80"
        }`}
      />
      <span className="sr-only">{t.action}</span>
      <span aria-live="polite" className={state === "idle" ? "sr-only" : "text-[11px] font-medium text-white/70"}>
        {state === "done" ? t.done : state === "failed" ? t.failed : ""}
      </span>
    </button>
  );
}
