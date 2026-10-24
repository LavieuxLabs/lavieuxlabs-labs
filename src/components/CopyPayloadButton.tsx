"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { writeClipboard } from "@/lib/clipboard";
import type { Locale } from "@/i18n/config";

const copy: Record<Locale, { label: string; done: string; failed: string }> = {
  tr: { label: "FHIR JSON", done: "Kopyalandı", failed: "Kopyalanamadı" },
  en: { label: "FHIR JSON", done: "Copied", failed: "Could not copy" },
};

type CopyPayloadButtonProps = {
  locale: Locale;
  /** Built on click, so the payload always matches what the panel shows at that moment. */
  getPayload: () => unknown;
  /** Accessible name, e.g. "Copy case 3 as FHIR JSON". */
  ariaLabel: string;
};

/**
 * Small neutral button that copies a simulated FHIR payload as formatted JSON, with a short
 * "Copied" confirmation. It is data tooling, so it never takes a product accent.
 */
export default function CopyPayloadButton({ locale, getPayload, ariaLabel }: CopyPayloadButtonProps) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  const t = copy[locale];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await writeClipboard(JSON.stringify(getPayload(), null, 2));
    setState(ok ? "done" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1600);
  };

  const Icon = state === "done" ? Check : Copy;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] inline-flex shrink-0 items-center gap-1.5 rounded-md border border-hairline px-2 py-1 text-[11px] text-white/60 transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-white print:hidden"
    >
      <Icon className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
      <span aria-live="polite">{state === "idle" ? t.label : state === "done" ? t.done : t.failed}</span>
    </button>
  );
}
