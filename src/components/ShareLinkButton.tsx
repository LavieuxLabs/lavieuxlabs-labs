"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { writeClipboard } from "@/lib/clipboard";
import type { Locale } from "@/i18n/config";

const copy: Record<Locale, { label: string; done: string; failed: string }> = {
  tr: { label: "Bağlantıyı kopyala", done: "Kopyalandı", failed: "Kopyalanamadı" },
  en: { label: "Copy link", done: "Copied", failed: "Could not copy" },
};

/** Copies a shareable URL of the current simulator state; neutral data tooling, never printed. */
export default function ShareLinkButton({ locale, getUrl, ariaLabel }: { locale: Locale; getUrl: () => string; ariaLabel: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  const t = copy[locale];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await writeClipboard(getUrl());
    setState(ok ? "done" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1600);
  };

  const Icon = state === "done" ? Check : Link2;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-hairline px-2 py-1 text-[11px] text-white/60 transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-white print:hidden"
    >
      <Icon className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
      <span aria-live="polite">{state === "idle" ? t.label : state === "done" ? t.done : t.failed}</span>
    </button>
  );
}
