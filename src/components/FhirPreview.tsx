"use client";

import { Fragment, useId, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Download } from "lucide-react";
import CopyPayloadButton from "@/components/CopyPayloadButton";
import { medicationRequest, qtcObservation, tisdaleObservation } from "@/lib/fhirPayload";
import { DRUGS, tisdale } from "@/lib/qtSimulator";
import { useQtState } from "@/lib/qtStore";
import { trackEvent } from "@/lib/analytics";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";

// Example FHIR R4 payloads for hospital IT, generated live from the QT simulator above: one
// MedicationRequest per selected drug (WHO ATC), the selected measured QTc (Observation, LOINC 8636-3)
// and the Tisdale score as its own Observation. Fixed timestamp so prerender and hydration match.
// Highlighting is neutral (weight and opacity), because the data layer carries no product colour.

const AUTHORED = "2026-10-12T09:00:00+03:00";

const copy = defineContent({
  tr: {
    toggle: "Örnek FHIR R4 yükünü göster",
    hide: "Örnek yükü gizle",
    tabs: { observation: "Observation · QTc", score: "Observation · Tisdale" },
    tabsAria: "FHIR kaynağı",
    copyAria: (name: string) => `${name} JSON'unu kopyala`,
    download: "Örnek Bundle indir (JSON)",
    caption: "QT simülatöründeki seçimden üretilir · kurgusal veri · her kaynak HTEST (test verisi) etiketi taşır.",
    apiLabel: "OpenAPI / Postman",
    apiBody: "Henüz yayımlanmadı. Arayüz belgesi pilot öncesi teknik keşifte bilgi işlem ekibinizle paylaşılır.",
    apiCta: "Teknik görüşme isteyin",
    tablet: "tablet",
    factors: {
      age: "Yaş ≥68",
      female: "Kadın",
      loop: "Loop diüretik",
      lowK: "K⁺ ≤3,5 mmol/L",
      qtc450: "QTc ≥450 ms",
      oneDrug: "QT uzatan ilaç",
      twoDrugs: "≥2 QT uzatan ilaç",
    } as Record<string, string>,
  },
  en: {
    toggle: "Show example FHIR R4 payload",
    hide: "Hide example payload",
    tabs: { observation: "Observation · QTc", score: "Observation · Tisdale" },
    tabsAria: "FHIR resource",
    copyAria: (name: string) => `Copy the ${name} JSON`,
    download: "Download example Bundle (JSON)",
    caption: "Generated from the QT simulator selection · fictional data · every resource carries the HTEST (test data) tag.",
    apiLabel: "OpenAPI / Postman",
    apiBody: "Not published yet. The interface document is shared with your IT team during the pre-pilot technical review.",
    apiCta: "Request a technical call",
    tablet: "tablet",
    factors: {
      age: "Age ≥68",
      female: "Female",
      loop: "Loop diuretic",
      lowK: "K⁺ ≤3.5 mmol/L",
      qtc450: "QTc ≥450 ms",
      oneDrug: "QT-prolonging drug",
      twoDrugs: "≥2 QT-prolonging drugs",
    } as Record<string, string>,
  },
});

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

/** JSON with neutral syntax emphasis: keys bright, strings softer, numbers and literals in full white. */
function highlight(json: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of json.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(<Fragment key={i++}>{json.slice(last, start)}</Fragment>);
    if (m[1] && m[2]) {
      out.push(
        <span key={i++} className="text-white/85">
          {m[1]}
        </span>,
        <Fragment key={i++}>{m[2]}</Fragment>,
      );
    } else if (m[1]) {
      out.push(
        <span key={i++} className="text-white/60">
          {m[1]}
        </span>,
      );
    } else {
      out.push(
        <span key={i++} className="font-medium text-white">
          {m[0]}
        </span>,
      );
    }
    last = start + m[0].length;
  }
  if (last < json.length) out.push(<Fragment key={i++}>{json.slice(last)}</Fragment>);
  return out;
}

export default function FhirPreview({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<string>("drug1");
  const qt = useQtState();

  const payloads = useMemo(() => {
    const drugs = [qt.drug1, qt.drug2].map((id) => DRUGS.find((d) => d.id === id)!);
    const requests = drugs.map((d) =>
      medicationRequest(
        `sim-${d.id}`,
        { atc: d.atc, display: d.id, text: `${d.name[locale]} ${d.dose} ${c.tablet}`, doseMg: Number.parseInt(d.dose, 10) },
        AUTHORED,
      ),
    );
    const observation = qtcObservation("sim-qtc", qt.patient.qtc, AUTHORED);
    const result = tisdale(qt.patient, drugs[0], drugs[1]);
    const score = tisdaleObservation(
      "sim-tisdale",
      result.factors.map((f) => ({ factor: c.factors[f.key], points: f.points })),
      AUTHORED,
    );
    const resources = [...requests, observation, score];
    const full = {
      resourceType: "Bundle",
      id: "pharmadeux-qt-simulator",
      meta: { tag: [{ system: "http://terminology.hl7.org/CodeSystem/v3-ActReason", code: "HTEST", display: "test health data" }] },
      type: "collection",
      timestamp: AUTHORED,
      entry: resources.map((r) => ({ fullUrl: `urn:uuid:${r.id}`, resource: r })),
    };
    const tabs = [
      { key: "drug1", label: `MedicationRequest · ${drugs[0].name[locale]}`, payload: requests[0] as object },
      { key: "drug2", label: `MedicationRequest · ${drugs[1].name[locale]}`, payload: requests[1] as object },
      { key: "observation", label: c.tabs.observation, payload: observation as object },
      { key: "score", label: c.tabs.score, payload: score as object },
    ];
    return { tabs, full };
  }, [qt, locale, c]);

  const active = payloads.tabs.find((t) => t.key === tab) ?? payloads.tabs[0];
  const current = active.payload;
  const json = JSON.stringify(current, null, 2);

  const download = () => {
    const blob = new Blob([JSON.stringify(payloads.full, null, 2)], { type: "application/fhir+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lavieuxlabs-fhir-r4-example-bundle.json";
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("fhir_download", { source: "qt_simulator" });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-navy-850">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left text-[13px] font-medium text-white transition-colors duration-150 ease-out hover:bg-navy-800"
      >
        {open ? c.hide : c.toggle}
        <ChevronDown className={`h-4 w-4 text-white/55 transition-transform duration-150 ease-out ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={`${uid}-panel`} className="border-t border-hairline">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-2.5">
            <div role="tablist" aria-label={c.tabsAria} className="flex flex-wrap rounded-md border border-hairline bg-white/[0.03] p-0.5">
              {payloads.tabs.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active.key === key}
                  onClick={() => setTab(key)}
                  className={`rounded-[5px] px-2.5 py-1 font-mono text-[11.5px] transition-colors duration-150 ease-out ${
                    active.key === key ? "bg-white/[0.1] text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <CopyPayloadButton locale={locale} ariaLabel={c.copyAria(active.label)} getPayload={() => {
                  trackEvent("fhir_copy", { resource: active.key });
                  return current;
                }} />
              <button
                type="button"
                onClick={download}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-hairline px-2 py-1 text-[11px] text-white/60 transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-white print:hidden"
              >
                <Download className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
                {c.download}
              </button>
            </div>
          </div>
          <pre
            role="tabpanel"
            tabIndex={0}
            className="max-h-[420px] overflow-auto bg-navy-900 px-5 py-4 font-mono text-[12px] leading-relaxed text-white/50"
          >
            <code>{highlight(json)}</code>
          </pre>
          <p className="border-t border-hairline px-5 py-2.5 text-[11px] text-white/55">{c.caption}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-3.5">
        <p className="min-w-0 text-[12.5px] leading-relaxed text-white/60">
          <span className="mr-2 text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.apiLabel}</span>
          {c.apiBody}
        </p>
        <Link
          href={localizedPath(locale, "/contact")}
          className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] text-white/80 transition-colors duration-150 ease-out hover:text-white"
        >
          {c.apiCta}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
