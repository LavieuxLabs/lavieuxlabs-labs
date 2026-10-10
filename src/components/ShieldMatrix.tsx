"use client";

import { useEffect, useReducer, useRef } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { defineContent, groupDigits, type Locale } from "@/i18n/config";

// Shield hero scene: two layered surfaces. The front layer is an invoice whose line items are
// checked one by one before submission; verified items are committed to the provision record
// behind it, flagged items go to the review queue, and every step lands in the append-only audit
// trail. A pure reducer drives everything, so the first render is identical on server and client,
// and the flow only advances while the scene is on screen. State holds indices and event kinds
// only; wording is looked up per locale at render time. All data is fictional.

type QueueItem = { id: string; reason: number; status: "review" | "approved" | "corrected"; at: number };
type LedgerRow = { invoice: string; count: number; total: number };
type AuditKind = "approved" | "corrected" | "review" | "committed";
type AuditRow = { seq: number; kind: AuditKind; ref: string };

type State = {
  n: number;
  scan: number;
  tick: number;
  seq: number;
  queue: QueueItem[];
  ledger: LedgerRow[];
  audit: AuditRow[];
};

// Line-item amounts in TRY; names are in `copy.catalog` at the same index.
const CATALOG_AMOUNTS = [640, 185, 2340, 410, 1280, 3150, 520, 720];
const REASON_COUNT = 4;

const copy = defineContent({
  tr: {
    catalog: [
      "Ayaktan muayene",
      "Tam kan sayımı",
      "Toraks BT",
      "Fizik tedavi seansı",
      "Paket dışı malzeme",
      "Yatış günü",
      "Biyokimya paneli",
      "Konsültasyon",
    ],
    reasons: ["Ön onay belgesi eksik", "Tanı–işlem uyumsuzluğu", "Paket limiti aşıldı", "Mükerrer kalem"],
    audit: { approved: "Onay", corrected: "Düzeltme", review: "İnceleme", committed: "Kayıt" },
    status: { review: "İncelemede", approved: "Onaylandı", corrected: "Düzeltmede" },
    precheckAria: "Fatura ön kontrolü",
    invoice: "Fatura",
    precheck: "Ön kontrol",
    verified: "Doğrulandı",
    checking: "Kontrolde",
    waiting: "Bekliyor",
    ledger: "Provizyon kaydı",
    ledgerHint: "Doğrulanan kalemler",
    items: "kalem",
    asideAria: "İnceleme kuyruğu ve denetim izi",
    queue: "İnceleme kuyruğu",
    queueEmpty: "Bekleyen kalem yok",
    trail: "Denetim izi",
    appendOnly: "Yalnızca ekleme",
    caption: "Örnek akış · kurgusal veri",
  },
  en: {
    catalog: [
      "Outpatient visit",
      "Complete blood count",
      "Chest CT",
      "Physiotherapy session",
      "Out-of-package supply",
      "Inpatient day",
      "Biochemistry panel",
      "Consultation",
    ],
    reasons: ["Prior authorisation missing", "Diagnosis–procedure mismatch", "Package limit exceeded", "Duplicate line item"],
    audit: { approved: "Approved", corrected: "Correction", review: "Review", committed: "Committed" },
    status: { review: "In review", approved: "Approved", corrected: "Correcting" },
    precheckAria: "Invoice pre-check",
    invoice: "Invoice",
    precheck: "Pre-check",
    verified: "Verified",
    checking: "Checking",
    waiting: "Waiting",
    ledger: "Submission record",
    ledgerHint: "Verified items",
    items: "items",
    asideAria: "Review queue and audit trail",
    queue: "Review queue",
    queueEmpty: "Nothing awaiting review",
    trail: "Audit trail",
    appendOnly: "Append-only",
    caption: "Example flow · fictional data",
  },
});

const ITEMS_PER_INVOICE = 5;
const TICK_MS = 1100;
const DECIDE_AFTER = 4;
const LINGER = 3;

function hash(i: number) {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

const invoiceNo = (n: number) => `F-2026-${String(412 + n).padStart(4, "0")}`;
const claimId = (n: number) => `CLM-${24817 + n}`;
const flaggedIndex = (n: number) => Math.floor(hash(n * 7 + 3) * ITEMS_PER_INVOICE);
const reasonFor = (n: number) => Math.floor(hash(n * 11 + 5) * REASON_COUNT);
const decisionFor = (n: number): "approved" | "corrected" => (hash(n * 17 + 1) < 0.65 ? "approved" : "corrected");

/** Catalog indices of the line items on invoice n. */
function itemsFor(n: number): number[] {
  return CATALOG_AMOUNTS.map((_, i) => ({ i, key: hash(n * 13 + i) }))
    .sort((a, b) => a.key - b.key)
    .slice(0, ITEMS_PER_INVOICE)
    .map(({ i }) => i);
}

// Intl-free formatting so server and client render the same string.
const formatTRY = (locale: Locale, value: number) => `₺${groupDigits(locale, value)}`;

function step(state: State): State {
  const tick = state.tick + 1;
  let seq = state.seq;
  const audit = [...state.audit];
  const log = (kind: AuditKind, ref: string) => audit.push({ seq: seq++, kind, ref });

  // Resolve items that have waited long enough for an expert decision, then let them linger briefly.
  let queue = state.queue.map((item) => {
    if (item.status !== "review" || tick - item.at < DECIDE_AFTER) return item;
    const n = Number(item.id.slice(4)) - 24817;
    const status = decisionFor(n);
    log(status, item.id);
    return { ...item, status, at: tick };
  });
  queue = queue.filter((item) => item.status === "review" || tick - item.at < LINGER);

  let { n, scan, ledger } = state;
  if (scan < ITEMS_PER_INVOICE) {
    if (scan === flaggedIndex(n)) {
      queue = [...queue, { id: claimId(n), reason: reasonFor(n), status: "review" as const, at: tick }].slice(-3);
      log("review", claimId(n));
    }
    scan += 1;
  } else {
    const items = itemsFor(n);
    const flagged = flaggedIndex(n);
    const total = items.reduce((sum, item, i) => (i === flagged ? sum : sum + CATALOG_AMOUNTS[item]), 0);
    ledger = [{ invoice: invoiceNo(n), count: ITEMS_PER_INVOICE - 1, total }, ...ledger].slice(0, 3);
    log("committed", invoiceNo(n));
    n += 1;
    scan = 0;
  }

  return { n, scan, tick, seq, queue, ledger, audit: audit.slice(-4) };
}

// A believable resting state: a few steps already taken, deterministic for SSR.
function initialState(): State {
  let state: State = { n: 0, scan: 0, tick: 0, seq: 1041, queue: [], ledger: [], audit: [] };
  for (let i = 0; i < 9; i++) state = step(state);
  return state;
}

const badge = {
  review: "text-amber-200/90",
  approved: "text-emerald-200",
  corrected: "text-indigo-200",
};

export default function ShieldMatrix({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.25 });
  const reduced = useReducedMotion();
  const [state, advance] = useReducer(step, undefined, initialState);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(advance, TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const items = itemsFor(state.n);
  const flagged = flaggedIndex(state.n);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, bounce: 0, duration: 0.4 };

  return (
    <div ref={rootRef} className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
      {/* Layered surfaces */}
      <div className="relative min-w-0 flex-1">
        <section
          aria-label={c.precheckAria}
          className="relative z-10 rounded-2xl border border-white/[0.06] bg-navy-800"
        >
          <header className="flex items-baseline justify-between gap-3 px-4 pt-3.5 pb-2.5">
            <div className="min-w-0">
              <p className="text-[11px] text-white/55">{c.invoice}</p>
              <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-white font-mono tabular-nums">
                {invoiceNo(state.n)}
              </p>
            </div>
            <p className="shrink-0 text-[11px] text-white/55">
              {c.precheck}{" "}
              <span className="font-mono tabular-nums">
                {Math.min(state.scan, ITEMS_PER_INVOICE)}/{ITEMS_PER_INVOICE}
              </span>
            </p>
          </header>
          <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
            {items.map((item, i) => {
              const done = i < state.scan;
              const active = i === state.scan;
              const isFlagged = done && i === flagged;
              return (
                <li
                  key={`${state.n}-${item}`}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 ease-out ${active ? "bg-white/[0.035]" : ""}`}
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] text-white/80">{c.catalog[item]}</span>
                  <span className="shrink-0 text-[12.5px] text-white/50 font-mono tabular-nums">
                    {formatTRY(locale, CATALOG_AMOUNTS[item])}
                  </span>
                  <span className="flex w-[64px] shrink-0 justify-end">
                    {isFlagged ? (
                      <span className={`text-[11px] font-medium ${badge.review}`}>{c.status.review}</span>
                    ) : done ? (
                      <span className="flex items-center">
                        <Check className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2.25} aria-hidden="true" />
                        <span className="sr-only">{c.verified}</span>
                      </span>
                    ) : active ? (
                      <span className="text-[10.5px] text-white/55">{c.checking}</span>
                    ) : (
                      <span className="text-[10.5px] text-white/55">{c.waiting}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Back layer: the provision record that verified items are committed to */}
        <section
          aria-label={c.ledger}
          className="relative mx-3 -mt-3 rounded-b-2xl border border-t-0 border-white/[0.06] bg-navy-850 px-4 pt-6 pb-3"
        >
          <div className="flex items-baseline justify-between">
            <p className="text-[12px] font-semibold text-white/80">{c.ledger}</p>
            <p className="text-[11px] text-white/55">{c.ledgerHint}</p>
          </div>
          <ul className="mt-2 divide-y divide-white/[0.06]">
            <AnimatePresence initial={false}>
              {state.ledger.map((row) => (
                <motion.li
                  key={row.invoice}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                  className="flex items-center justify-between gap-3 py-2 text-[12px]"
                >
                  <span className="text-white/70 font-mono tabular-nums">{row.invoice}</span>
                  <span className="text-white/55">
                    <span className="font-mono tabular-nums">{row.count}</span> {c.items} ·{" "}
                    <span className="font-mono tabular-nums">{formatTRY(locale, row.total)}</span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>
      </div>

      {/* Review queue and audit trail */}
      <aside aria-label={c.asideAria} className="w-full space-y-3 sm:w-[200px] sm:shrink-0">
        <section className="rounded-2xl border border-white/[0.06] bg-navy-850">
          <header className="flex items-center justify-between px-3.5 pt-3 pb-2">
            <p className="text-[12px] font-semibold text-white/85">{c.queue}</p>
            <span className="font-mono text-[12px] text-white/50 tabular-nums">{state.queue.length}</span>
          </header>
          <ul className="min-h-[104px] divide-y divide-white/[0.06] border-t border-white/[0.06]">
            <AnimatePresence initial={false}>
              {state.queue.map((item) => (
                <motion.li
                  key={item.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                  className="px-3.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-white/85 font-mono tabular-nums">{item.id}</span>
                    <span className={`text-[11px] font-medium ${badge[item.status]}`}>{c.status[item.status]}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-white/55">{c.reasons[item.reason]}</p>
                </motion.li>
              ))}
            </AnimatePresence>
            {state.queue.length === 0 && (
              <li className="px-3.5 py-6 text-center text-[11px] text-white/55">{c.queueEmpty}</li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-navy-850">
          <header className="flex items-baseline justify-between px-3.5 pt-3 pb-2">
            <p className="text-[12px] font-semibold text-white/85">{c.trail}</p>
            <p className="text-[10.5px] text-white/55">{c.appendOnly}</p>
          </header>
          <ol className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
            {state.audit.map((row, i) => (
              <li key={row.seq} className="flex gap-2 px-3.5 py-1.5 text-[11px]">
                <span className="shrink-0 text-white/55 font-mono tabular-nums">{row.seq}</span>
                <span
                  className={`min-w-0 truncate ${i === state.audit.length - 1 ? "text-white/80" : "text-white/50"}`}
                >
                  {c.audit[row.kind]} · {row.ref}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <p className="px-1 text-[10.5px] text-white/55">{c.caption}</p>
      </aside>
    </div>
  );
}
