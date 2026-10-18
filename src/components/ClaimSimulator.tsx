"use client";

import { useEffect, useId, useState } from "react";
import ShareLinkButton from "@/components/ShareLinkButton";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";

// Shield claim check simulator. The rule set is fictional (rule IDs, weights) and labelled as such; it
// names no SUT article numbers, because invented legal references would read as real. ICD-10 codes are
// real and used with their real meaning. Score = Σ triggered rule weights (0–100), threshold 40.
// The selection is mirrored to the URL (?item=angio&code=I20.9&pre=0&repeat=0&signed=1) and a shared
// link opens with the same inputs, hence the same score.

type ItemId = "angio" | "vent" | "ct";
type Rule = { id: string; weight: number };

const ITEMS: { id: ItemId; icd: string[]; compatible: string[] }[] = [
  { id: "angio", icd: ["I20.9", "I21.9", "M54.5"], compatible: ["I20.9", "I21.9"] },
  { id: "vent", icd: ["J96.0", "J18.9", "R51"], compatible: ["J96.0", "J18.9"] },
  { id: "ct", icd: ["R07.4", "J18.9", "M54.5"], compatible: ["R07.4", "J18.9"] },
];

const RULES: Record<string, Rule> = {
  mismatch: { id: "R-112", weight: 34 },
  preapproval: { id: "R-047", weight: 26 },
  repeat: { id: "R-203", weight: 18 },
  unsigned: { id: "R-019", weight: 10 },
};
const THRESHOLD = 40;

type Checks = { preapproval: boolean; repeat: boolean; signed: boolean };
const DEFAULT_CHECKS: Checks = { preapproval: false, repeat: false, signed: true };

function claimFromSearch(search: string): { item: ItemId; icd: string; checks: Checks } | null {
  const q = new URLSearchParams(search);
  if (!["item", "code", "pre", "repeat", "signed"].some((k) => q.has(k))) return null;
  const item = ITEMS.find((i) => i.id === q.get("item")) ?? ITEMS[0];
  const code = q.get("code");
  const icd = code && item.icd.includes(code) ? code : item.icd[0];
  const flag = (k: string, fallback: boolean) => (q.has(k) ? q.get(k) === "1" || q.get(k) === "true" : fallback);
  return {
    item: item.id,
    icd,
    checks: { preapproval: flag("pre", DEFAULT_CHECKS.preapproval), repeat: flag("repeat", DEFAULT_CHECKS.repeat), signed: flag("signed", DEFAULT_CHECKS.signed) },
  };
}

function claimToUrl(s: { item: ItemId; icd: string; checks: Checks }, href: string): string {
  const url = new URL(href);
  url.searchParams.set("item", s.item);
  url.searchParams.set("code", s.icd);
  url.searchParams.set("pre", s.checks.preapproval ? "1" : "0");
  url.searchParams.set("repeat", s.checks.repeat ? "1" : "0");
  url.searchParams.set("signed", s.checks.signed ? "1" : "0");
  return url.toString();
}

const copy = defineContent({
  tr: {
    panel: "Fatura uygunluk simülatörü",
    shareAria: "Bu kalemin parametrelerini içeren bağlantıyı kopyala",
    item: "Branş ve fatura kalemi",
    items: {
      angio: "Kardiyoloji · Koroner anjiyografi",
      vent: "Yoğun bakım · Ventilatör takibi",
      ct: "Radyoloji · Toraks BT",
    } as Record<ItemId, string>,
    diagnosis: "Tanı (ICD-10)",
    icd: {
      "I20.9": "Angina pektoris, tanımlanmamış",
      "I21.9": "Akut miyokard enfarktüsü, tanımlanmamış",
      "M54.5": "Bel ağrısı",
      "J96.0": "Akut solunum yetmezliği",
      "J18.9": "Pnömoni, tanımlanmamış",
      R51: "Baş ağrısı",
      "R07.4": "Göğüs ağrısı, tanımlanmamış",
    } as Record<string, string>,
    checks: { preapproval: "Ön onay belgesi var", repeat: "30 gün içinde aynı işlem", signed: "Epikriz imzalı" },
    rules: {
      mismatch: "Tanı–işlem uyumsuzluğu: tanı kodu bu işlemi gerekçelendirmiyor.",
      preapproval: "Ön onay belgesi eksik: kalem belge gerektiriyor, dosyada yok.",
      repeat: "30 gün içinde tekrar eden işlem: aynı kalem kısa aralıkla yeniden faturalanıyor.",
      unsigned: "Epikriz imzasız: dosya kapanmamış.",
    } as Record<string, string>,
    score: "Red riski (Σ kural katkısı)",
    matches: "Kural eşleşmeleri",
    none: "Kural tetiklenmedi.",
    status: { review: "İncelemede · uzmana gider", below: "Eşik altı · gönderilebilir" },
    threshold: (t: number) => `Eşik ${t}`,
    standard: "Standart",
    standardLink: "SUT fatura denetimi",
    note: "Kurgusal kural seti · kurgusal veri. Gerçek kurallar SUT, paket tanımları ve kurum sözleşmesinden türetilir; bu örnekte mevzuat madde numarası gösterilmez. ICD-10 kodları gerçektir.",
    savings: "Geçmiş faturalar üzerinde doğrulanmış tasarruf metriği henüz yayımlanmamıştır.",
  },
  en: {
    panel: "Claim check simulator",
    shareAria: "Copy a link with this line item's parameters",
    item: "Department and line item",
    items: {
      angio: "Cardiology · Coronary angiography",
      vent: "Intensive care · Ventilator monitoring",
      ct: "Radiology · Chest CT",
    } as Record<ItemId, string>,
    diagnosis: "Diagnosis (ICD-10)",
    icd: {
      "I20.9": "Angina pectoris, unspecified",
      "I21.9": "Acute myocardial infarction, unspecified",
      "M54.5": "Low back pain",
      "J96.0": "Acute respiratory failure",
      "J18.9": "Pneumonia, unspecified",
      R51: "Headache",
      "R07.4": "Chest pain, unspecified",
    } as Record<string, string>,
    checks: { preapproval: "Pre-approval document on file", repeat: "Same procedure within 30 days", signed: "Discharge summary signed" },
    rules: {
      mismatch: "Diagnosis–procedure mismatch: the diagnosis code does not justify this procedure.",
      preapproval: "Pre-approval document missing: the item needs one and the file has none.",
      repeat: "Repeated within 30 days: the same item is billed again at a short interval.",
      unsigned: "Discharge summary unsigned: the file is not closed.",
    } as Record<string, string>,
    score: "Rejection risk (Σ rule contributions)",
    matches: "Rule matches",
    none: "No rule triggered.",
    status: { review: "In review · goes to a specialist", below: "Below threshold · can be submitted" },
    threshold: (t: number) => `Threshold ${t}`,
    standard: "Standard",
    standardLink: "SUT billing audit",
    note: "Fictional rule set · fictional data. Real rules are derived from SUT (Turkey's reimbursement rules), package definitions and the institution's contract. This example shows no legal article numbers. ICD-10 codes are real.",
    savings: "No savings metric validated on historical claims has been published yet.",
  },
});

const selectClass =
  "w-full rounded-md border border-hairline bg-navy-900 px-2.5 py-2 text-[13px] text-white transition-colors duration-150 ease-out focus:border-white/30 focus:outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-white/60";

// Same tiers as the Shield console: ≥70 rose, ≥40 amber, below emerald.
const tier = (s: number) =>
  s >= 70 ? { text: "text-rose-300", bar: "bg-rose-400/70" } : s >= THRESHOLD ? { text: "text-amber-300", bar: "bg-amber-400/70" } : { text: "text-emerald-300", bar: "bg-emerald-400/70" };

export default function ClaimSimulator({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const uid = useId();
  const [itemId, setItemState] = useState<ItemId>("angio");
  const item = ITEMS.find((i) => i.id === itemId)!;
  const [icd, setIcdState] = useState(item.icd[0]);
  const [checks, setChecksState] = useState<Checks>(DEFAULT_CHECKS);

  const sync = (next: { item: ItemId; icd: string; checks: Checks }) => {
    window.history.replaceState(window.history.state, "", claimToUrl(next, window.location.href));
    trackEvent("simulator_run", { tool: "claim", item: next.item });
  };
  const setItem = (id: ItemId, code: string) => {
    setItemState(id);
    setIcdState(code);
    sync({ item: id, icd: code, checks });
  };
  const setIcd = (code: string) => {
    setIcdState(code);
    sync({ item: itemId, icd: code, checks });
  };
  const setChecks = (next: Checks) => {
    setChecksState(next);
    sync({ item: itemId, icd, checks: next });
  };

  // A shared link opens the simulator with the same inputs (applied after hydration).
  useEffect(() => {
    const shared = claimFromSearch(window.location.search);
    if (!shared) return;
    const frame = requestAnimationFrame(() => {
      setItemState(shared.item);
      setIcdState(shared.icd);
      setChecksState(shared.checks);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const triggered = [
    !item.compatible.includes(icd) && "mismatch",
    !checks.preapproval && "preapproval",
    checks.repeat && "repeat",
    !checks.signed && "unsigned",
  ].filter((k): k is string => Boolean(k));
  const score = Math.min(100, triggered.reduce((n, k) => n + RULES[k].weight, 0));
  const t = tier(score);

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-navy-850">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-2.5">
        <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.panel}</p>
        <ShareLinkButton
          locale={locale}
          ariaLabel={c.shareAria}
          getUrl={() => claimToUrl({ item: itemId, icd, checks }, window.location.href)}
          onCopy={() => trackEvent("simulator_share", { tool: "claim" })}
        />
      </div>

      <div className="grid gap-px bg-hairline sm:grid-cols-2">
        <div className="space-y-3 bg-navy-850 px-5 py-4">
          <label htmlFor={`${uid}-item`} className="block">
            <span className="text-[11.5px] text-white/55">{c.item}</span>
            <select
              id={`${uid}-item`}
              value={itemId}
              onChange={(e) => {
                const next = ITEMS.find((i) => i.id === e.target.value)!;
                setItem(next.id, next.icd[0]);
              }}
              className={`mt-1.5 ${selectClass}`}
            >
              {ITEMS.map((i) => (
                <option key={i.id} value={i.id}>
                  {c.items[i.id]}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor={`${uid}-icd`} className="block">
            <span className="text-[11.5px] text-white/55">{c.diagnosis}</span>
            <select id={`${uid}-icd`} value={icd} onChange={(e) => setIcd(e.target.value)} className={`mt-1.5 ${selectClass}`}>
              {item.icd.map((code) => (
                <option key={code} value={code}>
                  {code} · {c.icd[code]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset className="space-y-2.5 bg-navy-850 px-5 py-4">
          <legend className="sr-only">{c.panel}</legend>
          {(Object.keys(c.checks) as (keyof typeof c.checks)[]).map((key) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-[12.5px] text-white/75">
              <input
                type="checkbox"
                checked={checks[key]}
                onChange={(e) => setChecks({ ...checks, [key]: e.target.checked })}
                className="h-3.5 w-3.5 cursor-pointer accent-titanium"
              />
              {c.checks[key]}
            </label>
          ))}
        </fieldset>
      </div>

      <div aria-live="polite" className="border-t border-hairline">
        <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4">
          <p className="text-[12px] text-white/55">{c.score}</p>
          <p className={`font-mono text-[22px] font-medium tabular-nums ${t.text}`}>
            {score}
            <span className="text-white/55">/100</span>
          </p>
        </div>
        <div className="px-5 pb-4" aria-hidden="true">
          <span className="relative block h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span className={`block h-full rounded-full transition-[width] duration-150 ease-out ${t.bar}`} style={{ width: `${score}%` }} />
          </span>
        </div>
        <p className="border-t border-hairline px-5 py-2.5 text-[12px] text-white/55">
          {c.matches} · <span className="font-mono tabular-nums">{c.threshold(THRESHOLD)}</span>
        </p>
        <ul className="divide-y divide-hairline border-t border-hairline">
          {triggered.length === 0 && <li className="px-5 py-2.5 text-[12.5px] text-white/55">{c.none}</li>}
          {triggered.map((k) => (
            <li key={k} className="grid grid-cols-[52px_1fr_auto] items-baseline gap-3 px-5 py-2.5 text-[12.5px]">
              <span className="font-mono text-white/55 tabular-nums">{RULES[k].id}</span>
              <span className="leading-relaxed text-white/75">{c.rules[k]}</span>
              <span className="font-mono text-white/70 tabular-nums">+{RULES[k].weight}</span>
            </li>
          ))}
        </ul>
        <p className={`border-t border-hairline px-5 py-3 text-[12.5px] font-medium ${score >= THRESHOLD ? "text-amber-200" : "text-white/75"}`}>
          {score >= THRESHOLD ? c.status.review : c.status.below}
        </p>
        <dl className="border-t border-hairline text-[12.5px]">
          <div className="grid grid-cols-[96px_1fr] gap-3 px-5 py-2.5">
            <dt className="text-white/55">{c.standard}</dt>
            <dd>
              <Link href={localizedPath(locale, "/standartlar/sut-fatura-denetimi")} className="text-white/80 underline decoration-white/30 underline-offset-2 transition-colors duration-150 ease-out hover:text-white hover:decoration-white/70">
                {c.standardLink}
              </Link>
            </dd>
          </div>
        </dl>
      </div>
      <div className="border-t border-hairline px-5 py-3 text-[11px] leading-relaxed text-white/55">
        <p>{c.note}</p>
        <p className="mt-1.5 text-white/70">{c.savings}</p>
      </div>
    </div>
  );
}
