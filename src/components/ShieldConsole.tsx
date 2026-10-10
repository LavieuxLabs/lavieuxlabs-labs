"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { dateLocale, defineContent, groupDigits, type Locale } from "@/i18n/config";

// Interactive Shield example in a data-table idiom (Geist data table / macOS Instruments): a
// pre-claim queue, the rule-engine matches behind the selected claim's risk score, a decision
// control, and an append-only audit trail whose entries are hash-chained (FNV-1a over the entry
// and the previous hash). ICD-10 codes are real; SUT references name the real annex categories
// (EK-2B fee-for-service, EK-2C diagnosis-based package). Claims and amounts are fictional.

type Factor = { rule: string; weight: number };
type Decision = "approved" | "corrected" | "held";

type Claim = {
  id: string;
  icd: string;
  annex: "EK-2B" | "EK-2C";
  amount: number;
  factors: Factor[];
};

type AuditEntry = { seq: number; time: string; actor: string; event: string; ref: string; prev: string; hash: string };

const THRESHOLD = 40;

const CLAIMS: Claim[] = [
  {
    id: "CLM-24817",
    icd: "M54.5",
    annex: "EK-2B",
    amount: 4820,
    factors: [
      { rule: "R-112", weight: 34 },
      { rule: "R-047", weight: 26 },
      { rule: "R-203", weight: 18 },
    ],
  },
  {
    id: "CLM-24822",
    icd: "K35.8",
    annex: "EK-2C",
    amount: 38150,
    factors: [
      { rule: "R-310", weight: 29 },
      { rule: "R-088", weight: 22 },
      { rule: "R-019", weight: 10 },
    ],
  },
  {
    id: "CLM-24830",
    icd: "E11.9",
    annex: "EK-2B",
    amount: 1240,
    factors: [
      { rule: "R-156", weight: 21 },
      { rule: "R-002", weight: 13 },
    ],
  },
  {
    id: "CLM-24836",
    icd: "R07.4",
    annex: "EK-2B",
    amount: 2960,
    factors: [{ rule: "R-074", weight: 12 }],
  },
];

const copy = defineContent({
  tr: {
    procedures: {
      "CLM-24817": "Toraks BT",
      "CLM-24822": "Apendektomi paketi",
      "CLM-24830": "Biyokimya paneli",
      "CLM-24836": "Acil müdahale",
    } as Record<string, string>,
    icd: {
      "M54.5": "Bel ağrısı",
      "K35.8": "Akut apandisit, diğer",
      "E11.9": "Tip 2 diyabet, komplikasyonsuz",
      "R07.4": "Göğüs ağrısı, tanımlanmamış",
    } as Record<string, string>,
    annex: { "EK-2B": "Hizmet başı", "EK-2C": "Tanıya dayalı paket" },
    rules: {
      "R-112": "Tanı–işlem uyumsuzluğu",
      "R-047": "Ön onay belgesi eksik",
      "R-203": "30 gün içinde tekrar eden işlem",
      "R-310": "Paket dışı malzeme kalemi",
      "R-088": "Yatış süresi paket limitini aşıyor",
      "R-019": "Epikriz imzasız",
      "R-156": "Aynı gün mükerrer tetkik",
      "R-002": "Hekim branş kodu eksik",
      "R-074": "Triaj seviyesi ile işlem düzeyi sınırda",
    } as Record<string, string>,
    decisions: { approved: "Onaylandı", corrected: "Düzeltmede", held: "Durduruldu" },
    actions: { approved: "Onayla", corrected: "Düzeltmeye gönder", held: "Gönderimi durdur" },
    filters: { all: "Tümü", review: "İncelemede", decided: "Karar verildi" },
    inReview: "İncelemede",
    belowThreshold: "Eşik altı",
    queue: "Ön kontrol kuyruğu",
    filterAria: "Talepleri filtrele",
    caption: "Gönderim öncesi talepler; bir satır seçerek ayrıntıları görün.",
    columns: { claim: "Talep", annex: "SUT eki", amount: "Tutar", risk: "Risk", status: "Durum" },
    empty: "Bu filtrede talep yok.",
    matchesAria: "Kural motoru eşleşmeleri",
    matches: "Kural motoru eşleşmeleri",
    riskTotal: "Red riski (Σ kural katkısı)",
    decisionAria: "Karar",
    decisionTitle: "Uzman kararı",
    overThreshold: (t: number) => `Risk eşiği ${t} aşıldı; gönderim kararı uzmana bırakıldı.`,
    recorded: "Karar denetim izine eklendi; kayıt değiştirilemez.",
    underThreshold: (t: number) => `Skor eşik (${t}) altında; talep incelemeye alınmadı.`,
    trail: "Denetim izi",
    trailHint: "Yalnızca ekleme · her kayıt önceki hash'i içerir",
    trailColumns: { seq: "Sıra", time: "Zaman", actor: "Aktör", event: "Olay", claim: "Talep" },
    footnote: "Örnek · kurgusal talepler. ICD-10 kodları gerçek; SUT sütunu ilgili eki gösterir.",
  },
  en: {
    procedures: {
      "CLM-24817": "Chest CT",
      "CLM-24822": "Appendectomy package",
      "CLM-24830": "Biochemistry panel",
      "CLM-24836": "Emergency care",
    },
    icd: {
      "M54.5": "Low back pain",
      "K35.8": "Acute appendicitis, other",
      "E11.9": "Type 2 diabetes, without complications",
      "R07.4": "Chest pain, unspecified",
    },
    annex: { "EK-2B": "Fee-for-service", "EK-2C": "Diagnosis-based package" },
    rules: {
      "R-112": "Diagnosis–procedure mismatch",
      "R-047": "Prior authorisation missing",
      "R-203": "Procedure repeated within 30 days",
      "R-310": "Out-of-package supply item",
      "R-088": "Length of stay exceeds package limit",
      "R-019": "Discharge summary unsigned",
      "R-156": "Duplicate test on the same day",
      "R-002": "Physician specialty code missing",
      "R-074": "Procedure level borderline for triage category",
    },
    decisions: { approved: "Approved", corrected: "Correcting", held: "Held" },
    actions: { approved: "Approve", corrected: "Send for correction", held: "Hold submission" },
    filters: { all: "All", review: "In review", decided: "Decided" },
    inReview: "In review",
    belowThreshold: "Below threshold",
    queue: "Pre-check queue",
    filterAria: "Filter claims",
    caption: "Claims before submission; select a row to see the details.",
    columns: { claim: "Claim", annex: "SUT annex", amount: "Amount", risk: "Risk", status: "Status" },
    empty: "No claims match this filter.",
    matchesAria: "Rule engine matches",
    matches: "Rule engine matches",
    riskTotal: "Rejection risk (Σ rule contributions)",
    decisionAria: "Decision",
    decisionTitle: "Specialist decision",
    overThreshold: (t: number) => `Risk threshold ${t} exceeded; the submission decision is left to the specialist.`,
    recorded: "Decision added to the audit trail; the entry cannot be changed.",
    underThreshold: (t: number) => `Score below the threshold (${t}); the claim was not queued for review.`,
    trail: "Audit trail",
    trailHint: "Append-only · each entry includes the previous hash",
    trailColumns: { seq: "Seq", time: "Time", actor: "Actor", event: "Event", claim: "Claim" },
    footnote:
      "Example · fictional claims. ICD-10 codes are real; the SUT column shows the relevant annex of Turkey's Health Implementation Communiqué.",
  },
});

const scoreOf = (claim: Claim) => claim.factors.reduce((sum, f) => sum + f.weight, 0);

// Intl-free so server and client render identical strings.
const formatTRY = (locale: Locale, value: number) => `₺${groupDigits(locale, value)}`;

/** 64-bit FNV-1a as two 32-bit lanes; deterministic and synchronous (works during SSR). */
function fnv1a64(input: string) {
  let h1 = 0x811c9dc5;
  let h2 = 0xcbf29ce4;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x01000193 ^ 0x5bd1e995) >>> 0;
  }
  return h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
}

function append(log: AuditEntry[], entry: Omit<AuditEntry, "seq" | "prev" | "hash">): AuditEntry[] {
  const last = log[log.length - 1];
  const seq = last ? last.seq + 1 : 1041;
  const prev = last ? last.hash : "0000000000000000";
  const hash = fnv1a64(`${prev}|${seq}|${entry.time}|${entry.actor}|${entry.event}|${entry.ref}`);
  return [...log, { ...entry, seq, prev, hash }];
}

const INITIAL_AUDIT = [
  { time: "09:12:04", actor: "system", event: "SCORE_COMPUTED", ref: "CLM-24817" },
  { time: "09:12:05", actor: "system", event: "QUEUED_FOR_REVIEW", ref: "CLM-24817" },
  { time: "09:12:05", actor: "system", event: "QUEUED_FOR_REVIEW", ref: "CLM-24822" },
  { time: "09:12:06", actor: "system", event: "BELOW_THRESHOLD", ref: "CLM-24836" },
].reduce<AuditEntry[]>((log, entry) => append(log, entry), []);

const tier = (score: number) =>
  score >= 70
    ? { text: "text-rose-300", bar: "bg-rose-400/70" }
    : score >= THRESHOLD
      ? { text: "text-amber-300", bar: "bg-amber-400/70" }
      : { text: "text-emerald-300", bar: "bg-emerald-400/70" };

const decisionMeta: Record<Decision, { event: string; badge: string }> = {
  approved: { event: "DECISION_APPROVED", badge: "text-emerald-200" },
  corrected: { event: "DECISION_CORRECTION", badge: "text-indigo-200" },
  held: { event: "DECISION_HOLD", badge: "text-white/70" },
};

type Filter = "all" | "review" | "decided";
const FILTERS: Filter[] = ["all", "review", "decided"];

const shortHash = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;
const now = (locale: Locale) => new Date().toLocaleTimeString(dateLocale[locale], { hour12: false });

const cell = "px-3 py-2.5 first:pl-4 last:pr-4";
const head = "px-3 py-2 text-left text-[11px] font-medium text-white/55 first:pl-4 last:pr-4";

export default function ShieldConsole({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [selectedId, setSelectedId] = useState(CLAIMS[0].id);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [audit, setAudit] = useState<AuditEntry[]>(INITIAL_AUDIT);
  const [filter, setFilter] = useState<Filter>("all");

  const statusOf = (claim: Claim) => {
    const decided = decisions[claim.id];
    if (decided) return { label: c.decisions[decided], badge: decisionMeta[decided].badge };
    if (scoreOf(claim) >= THRESHOLD) return { label: c.inReview, badge: "text-amber-200" };
    return { label: c.belowThreshold, badge: "text-white/55" };
  };

  const rows = useMemo(
    () =>
      CLAIMS.filter((claim) => {
        if (filter === "all") return true;
        const decided = Boolean(decisions[claim.id]);
        return filter === "decided" ? decided : !decided && scoreOf(claim) >= THRESHOLD;
      }),
    [filter, decisions],
  );

  const selected = CLAIMS.find((claim) => claim.id === selectedId) ?? CLAIMS[0];
  const score = scoreOf(selected);
  const t = tier(score);
  const decided = decisions[selected.id];
  const canDecide = !decided && score >= THRESHOLD;
  const selectedStatus = statusOf(selected);

  const decide = (decision: Decision) => {
    setDecisions((d) => ({ ...d, [selected.id]: decision }));
    setAudit((log) =>
      append(log, { time: now(locale), actor: "reviewer.demo", event: decisionMeta[decision].event, ref: selected.id }),
    );
  };

  const onRowKey = (e: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedId(id);
    }
  };

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-navy-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-baseline gap-2">
          <p className="text-[13px] font-semibold text-white">{c.queue}</p>
          <span className="font-mono text-[12px] text-white/55 tabular-nums">{CLAIMS.length}</span>
        </div>
        <div role="group" aria-label={c.filterAria} className="flex rounded-lg bg-white/[0.04] p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-[12px] transition-colors duration-150 ease-out ${
                filter === f ? "bg-navy-850 text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {c.filters[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Claims table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-[13px]">
          <caption className="sr-only">{c.caption}</caption>
          <thead className="border-b border-white/[0.06]">
            <tr>
              <th scope="col" className={head}>
                {c.columns.claim}
              </th>
              <th scope="col" className={head}>
                ICD-10
              </th>
              <th scope="col" className={head}>
                {c.columns.annex}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {c.columns.amount}
              </th>
              <th scope="col" className={head}>
                {c.columns.risk}
              </th>
              <th scope="col" className={`${head} text-right`}>
                {c.columns.status}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((claim) => {
              const s = scoreOf(claim);
              const rt = tier(s);
              const status = statusOf(claim);
              const active = claim.id === selectedId;
              return (
                <tr
                  key={claim.id}
                  tabIndex={0}
                  aria-selected={active}
                  onClick={() => setSelectedId(claim.id)}
                  onKeyDown={(e) => onRowKey(e, claim.id)}
                  className={`cursor-pointer outline-none transition-colors duration-150 ease-out focus-visible:bg-white/[0.04] ${
                    active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <td className={cell}>
                    <span className="block font-mono text-[12.5px] text-white/90 tabular-nums">{claim.id}</span>
                    <span className="block text-[12px] text-white/50">{c.procedures[claim.id]}</span>
                  </td>
                  <td className={cell}>
                    <span className="block font-mono text-[12.5px] text-white/80">{claim.icd}</span>
                    <span className="block max-w-[160px] truncate text-[12px] text-white/55">{c.icd[claim.icd]}</span>
                  </td>
                  <td className={cell}>
                    <span className="block font-mono text-[12.5px] text-white/80">{claim.annex}</span>
                    <span className="block text-[12px] text-white/55">{c.annex[claim.annex]}</span>
                  </td>
                  <td className={`${cell} text-right font-mono text-white/75 tabular-nums`}>
                    {formatTRY(locale, claim.amount)}
                  </td>
                  <td className={cell}>
                    <span className="flex items-center gap-2">
                      <span className={`w-6 font-mono text-[12.5px] tabular-nums ${rt.text}`}>{s}</span>
                      <span className="h-1 w-12 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                        <span className={`block h-full rounded-full ${rt.bar}`} style={{ width: `${s}%` }} />
                      </span>
                    </span>
                  </td>
                  <td className={`${cell} text-right`}>
                    <span className={`text-[12px] font-medium ${status.badge}`}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[12px] text-white/55">
                  {c.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected claim: rule-engine matches + decision */}
      <div className="grid gap-px border-t border-white/[0.06] bg-white/[0.06] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section aria-label={c.matchesAria} className="bg-navy-850 px-4 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[12px] font-medium text-white/60">
              {c.matches} · <span className="font-mono text-white/80 tabular-nums">{selected.id}</span>
            </p>
            <p className="text-[11px] text-white/55">
              ruleset <span className="font-mono tabular-nums">v3.8.1</span>
            </p>
          </div>
          <ul className="mt-3 divide-y divide-white/[0.06]">
            {selected.factors.map((f) => (
              <li key={f.rule} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 py-2">
                <span className="font-mono text-[12px] text-white/50">{f.rule}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-white/80">{c.rules[f.rule]}</span>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                    <span className={`block h-full rounded-full ${t.bar}`} style={{ width: `${f.weight}%` }} />
                  </span>
                </span>
                <span className="font-mono text-[12.5px] text-white/70 tabular-nums">+{f.weight}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-baseline justify-between border-t border-white/[0.06] pt-2.5">
            <span className="text-[12px] text-white/55">{c.riskTotal}</span>
            <span className={`font-mono text-[15px] font-medium tabular-nums ${t.text}`}>
              {score}
              <span className="text-white/55">/100</span>
            </span>
          </div>
        </section>

        <section aria-label={c.decisionAria} className="flex flex-col bg-navy-850 px-4 py-4">
          <p className="text-[12px] font-medium text-white/60">{c.decisionTitle}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-white/55">
            {canDecide
              ? c.overThreshold(THRESHOLD)
              : decided
                ? c.recorded
                : c.underThreshold(THRESHOLD)}
          </p>
          {canDecide ? (
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {(["approved", "corrected", "held"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => decide(d)}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/85 transition-colors duration-150 ease-out hover:bg-white/[0.07]"
                >
                  {c.actions[d]}
                </button>
              ))}
            </div>
          ) : (
            <span className={`mt-auto text-[12.5px] font-medium ${selectedStatus.badge}`}>{selectedStatus.label}</span>
          )}
        </section>
      </div>

      {/* Append-only, hash-chained audit trail */}
      <section aria-label={c.trail} className="border-t border-white/[0.06] bg-navy-850">
        <div className="flex items-baseline justify-between gap-3 px-4 pt-3 pb-2">
          <p className="text-[12px] font-medium text-white/60">{c.trail}</p>
          <p className="text-[11px] text-white/55">{c.trailHint}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-[12px]">
            <thead className="border-y border-white/[0.06]">
              <tr>
                <th scope="col" className={head}>
                  {c.trailColumns.seq}
                </th>
                <th scope="col" className={head}>
                  {c.trailColumns.time}
                </th>
                <th scope="col" className={head}>
                  {c.trailColumns.actor}
                </th>
                <th scope="col" className={head}>
                  {c.trailColumns.event}
                </th>
                <th scope="col" className={head}>
                  {c.trailColumns.claim}
                </th>
                <th scope="col" className={`${head} text-right`}>
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {audit
                .slice(-5)
                .reverse()
                .map((e, i) => (
                  <tr key={e.seq} className={i === 0 ? "text-white/85" : "text-white/55"}>
                    <td className={`${cell} py-2 font-mono tabular-nums`}>{e.seq}</td>
                    <td className={`${cell} py-2 font-mono tabular-nums`}>{e.time}</td>
                    <td className={`${cell} py-2`}>{e.actor}</td>
                    <td className={`${cell} py-2 font-mono`}>{e.event}</td>
                    <td className={`${cell} py-2 font-mono tabular-nums`}>{e.ref}</td>
                    <td
                      className={`${cell} py-2 text-right font-mono tabular-nums`}
                      title={`prev ${e.prev} → ${e.hash}`}
                    >
                      {shortHash(e.hash)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="px-4 pt-2 pb-3 text-[11px] text-white/55">
          {c.footnote}
        </p>
      </section>
    </div>
  );
}
