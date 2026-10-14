"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { SITE_LAST_MODIFIED } from "@/lib/site";
import { metrics } from "@/lib/metrics";
import { defineContent, formatDate, groupDigits, type Locale } from "@/i18n/config";

// Verification imprint: what can be stated today, stated plainly. This is an R&D site, not a product
// environment, so it shows no "all services operational" status, no live pass/fail counter and no
// certification claim. The audit-trail demo hashes with FNV-1a, not SHA-256, and says so.

const copy = defineContent({
  tr: {
    open: "Doğrulama künyesi",
    title: "Doğrulama künyesi",
    rows: {
      tests: "Otomatik test",
      testsValue: (n: string) => `${n}+ · kural motoru ve klinik ölçüm protokolleri`,
      lifecycle: "IEC 62304",
      lifecycleValue: "Mimari uyum · sertifika henüz yok",
      ce: "CE işareti",
      ceValue: "Henüz yok · MDR Sınıf IIa hedefi",
      audit: "Denetim izi (örnek konsol)",
      auditValue: "FNV-1a 64-bit özet zinciri · tarayıcıda hesaplanır",
      env: "Ortam",
      envValue: "Bu site bir ürün ortamı değildir; canlı klinik servis yoktur.",
      updated: "Son içerik güncellemesi",
    },
  },
  en: {
    open: "Verification imprint",
    title: "Verification imprint",
    rows: {
      tests: "Automated tests",
      testsValue: (n: string) => `${n}+ · rule engine and clinical measurement protocols`,
      lifecycle: "IEC 62304",
      lifecycleValue: "Architecture aligned · not certified yet",
      ce: "CE mark",
      ceValue: "Not yet · MDR Class IIa target",
      audit: "Audit trail (example console)",
      auditValue: "FNV-1a 64-bit digest chain · computed in the browser",
      env: "Environment",
      envValue: "This site is not a product environment. No live clinical service runs here.",
      updated: "Last content update",
    },
  },
});

export default function VerificationImprint({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const uid = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const rows: [string, string, boolean?][] = [
    [c.rows.tests, c.rows.testsValue(groupDigits(locale, metrics.automatedTests)), true],
    [c.rows.lifecycle, c.rows.lifecycleValue],
    [c.rows.ce, c.rows.ceValue],
    [c.rows.audit, c.rows.auditValue],
    [c.rows.env, c.rows.envValue],
    [c.rows.updated, formatDate(locale, SITE_LAST_MODIFIED), true],
  ];

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-[13px] text-white/60 transition-colors duration-150 ease-out hover:text-white"
      >
        {c.open}
        <ChevronUp className={`h-3.5 w-3.5 transition-transform duration-150 ease-out ${open ? "" : "rotate-180"}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={`${uid}-panel`}
          role="dialog"
          aria-label={c.title}
          className="absolute right-0 bottom-full z-20 mb-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-hairline bg-navy-800 shadow-2xl shadow-black/40"
        >
          <p className="border-b border-hairline px-4 py-2.5 text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.title}</p>
          <dl className="divide-y divide-hairline text-[12px]">
            {rows.map(([label, value, mono]) => (
              <div key={label} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-2">
                <dt className="text-white/55">{label}</dt>
                <dd className={`leading-snug text-white/80 ${mono ? "tabular-nums" : ""}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
