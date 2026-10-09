"use client";

import { useEffect, useReducer, useRef } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

// Shield hero scene: two layered surfaces. The front layer is an invoice whose line items are
// checked one by one before submission; verified items are committed to the provision record
// behind it, flagged items go to the review queue, and every step lands in the append-only audit
// trail. A pure reducer drives everything, so the first render is identical on server and client,
// and the flow only advances while the scene is on screen. All data is fictional.

type LineItem = { name: string; amount: number };
type QueueItem = { id: string; reason: string; status: "review" | "approved" | "corrected"; at: number };
type LedgerRow = { invoice: string; count: number; total: number };
type AuditRow = { seq: number; text: string };

type State = {
  n: number;
  scan: number;
  tick: number;
  seq: number;
  queue: QueueItem[];
  ledger: LedgerRow[];
  audit: AuditRow[];
};

const CATALOG: LineItem[] = [
  { name: "Ayaktan muayene", amount: 640 },
  { name: "Tam kan sayımı", amount: 185 },
  { name: "Toraks BT", amount: 2340 },
  { name: "Fizik tedavi seansı", amount: 410 },
  { name: "Paket dışı malzeme", amount: 1280 },
  { name: "Yatış günü", amount: 3150 },
  { name: "Biyokimya paneli", amount: 520 },
  { name: "Konsültasyon", amount: 720 },
];
const REASONS = ["Ön onay belgesi eksik", "Tanı–işlem uyumsuzluğu", "Paket limiti aşıldı", "Mükerrer kalem"];
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
const reasonFor = (n: number) => REASONS[Math.floor(hash(n * 11 + 5) * REASONS.length)];
const decisionFor = (n: number): "approved" | "corrected" => (hash(n * 17 + 1) < 0.65 ? "approved" : "corrected");

function itemsFor(n: number): LineItem[] {
  return CATALOG.map((item, i) => ({ item, key: hash(n * 13 + i) }))
    .sort((a, b) => a.key - b.key)
    .slice(0, ITEMS_PER_INVOICE)
    .map(({ item }) => item);
}

// Locale-independent formatting so server and client render the same string.
const formatTRY = (value: number) => `₺${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

function step(state: State): State {
  const tick = state.tick + 1;
  let seq = state.seq;
  const audit = [...state.audit];
  const log = (text: string) => audit.push({ seq: seq++, text });

  // Resolve items that have waited long enough for an expert decision, then let them linger briefly.
  let queue = state.queue.map((item) => {
    if (item.status !== "review" || tick - item.at < DECIDE_AFTER) return item;
    const n = Number(item.id.slice(4)) - 24817;
    const status = decisionFor(n);
    log(`${status === "approved" ? "Onay" : "Düzeltme"} · ${item.id}`);
    return { ...item, status, at: tick };
  });
  queue = queue.filter((item) => item.status === "review" || tick - item.at < LINGER);

  let { n, scan, ledger } = state;
  if (scan < ITEMS_PER_INVOICE) {
    if (scan === flaggedIndex(n)) {
      queue = [...queue, { id: claimId(n), reason: reasonFor(n), status: "review" as const, at: tick }].slice(-3);
      log(`İnceleme · ${claimId(n)}`);
    }
    scan += 1;
  } else {
    const items = itemsFor(n);
    const flagged = flaggedIndex(n);
    const total = items.reduce((sum, item, i) => (i === flagged ? sum : sum + item.amount), 0);
    ledger = [{ invoice: invoiceNo(n), count: ITEMS_PER_INVOICE - 1, total }, ...ledger].slice(0, 3);
    log(`Kayıt · ${invoiceNo(n)}`);
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
  review: "bg-amber-400/10 text-amber-200/90",
  approved: "bg-emerald-400/10 text-emerald-200",
  corrected: "bg-indigo-400/10 text-indigo-200",
};
const badgeLabel = { review: "İncelemede", approved: "Onaylandı", corrected: "Düzeltmede" };

export default function ShieldMatrix() {
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
          aria-label="Fatura ön kontrolü"
          className="relative z-10 rounded-2xl border border-white/[0.08] bg-navy-800"
        >
          <header className="flex items-baseline justify-between gap-3 px-4 pt-3.5 pb-2.5">
            <div className="min-w-0">
              <p className="text-[11px] text-white/45">Fatura</p>
              <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-white font-mono tabular-nums">
                {invoiceNo(state.n)}
              </p>
            </div>
            <p className="shrink-0 text-[11px] text-white/45 font-mono tabular-nums">
              Ön kontrol {Math.min(state.scan, ITEMS_PER_INVOICE)}/{ITEMS_PER_INVOICE}
            </p>
          </header>
          <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
            {items.map((item, i) => {
              const done = i < state.scan;
              const active = i === state.scan;
              const isFlagged = done && i === flagged;
              return (
                <li
                  key={`${state.n}-${item.name}`}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 ease-out ${active ? "bg-white/[0.035]" : ""}`}
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] text-white/80">{item.name}</span>
                  <span className="shrink-0 text-[12.5px] text-white/50 font-mono tabular-nums">
                    {formatTRY(item.amount)}
                  </span>
                  <span className="flex w-[64px] shrink-0 justify-end">
                    {isFlagged ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${badge.review}`}>
                        İncelemede
                      </span>
                    ) : done ? (
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald-400/15">
                        <Check className="h-3 w-3 text-emerald-300" strokeWidth={2.5} aria-hidden="true" />
                        <span className="sr-only">Doğrulandı</span>
                      </span>
                    ) : active ? (
                      <span className="text-[10.5px] text-white/45">Kontrolde</span>
                    ) : (
                      <span className="text-[10.5px] text-white/20">Bekliyor</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Back layer: the provision record that verified items are committed to */}
        <section
          aria-label="Provizyon kaydı"
          className="relative mx-3 -mt-3 rounded-b-2xl border border-t-0 border-white/[0.08] bg-navy-850 px-4 pt-6 pb-3"
        >
          <div className="flex items-baseline justify-between">
            <p className="text-[12px] font-semibold text-white/80">Provizyon kaydı</p>
            <p className="text-[11px] text-white/40">Doğrulanan kalemler</p>
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
                  <span className="text-white/45 font-mono tabular-nums">
                    {row.count} kalem · {formatTRY(row.total)}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>
      </div>

      {/* Review queue and audit trail */}
      <aside aria-label="İnceleme kuyruğu ve denetim izi" className="w-full space-y-3 sm:w-[200px] sm:shrink-0">
        <section className="rounded-2xl border border-white/[0.08] bg-navy-850">
          <header className="flex items-center justify-between px-3.5 pt-3 pb-2">
            <p className="text-[12px] font-semibold text-white/85">İnceleme kuyruğu</p>
            <span className="rounded-full bg-white/[0.06] px-1.5 text-[11px] text-white/60 font-mono tabular-nums">
              {state.queue.length}
            </span>
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
                    <span className={`rounded-full px-1.5 py-px text-[10px] font-medium ${badge[item.status]}`}>
                      {badgeLabel[item.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-white/45">{item.reason}</p>
                </motion.li>
              ))}
            </AnimatePresence>
            {state.queue.length === 0 && (
              <li className="px-3.5 py-6 text-center text-[11px] text-white/35">Bekleyen kalem yok</li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-navy-850">
          <header className="flex items-baseline justify-between px-3.5 pt-3 pb-2">
            <p className="text-[12px] font-semibold text-white/85">Denetim izi</p>
            <p className="text-[10.5px] text-white/40">Yalnızca ekleme</p>
          </header>
          <ol className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
            {state.audit.map((row, i) => (
              <li key={row.seq} className="flex gap-2 px-3.5 py-1.5 text-[11px]">
                <span className="shrink-0 text-white/30 font-mono tabular-nums">{row.seq}</span>
                <span
                  className={`min-w-0 truncate ${i === state.audit.length - 1 ? "text-white/80" : "text-white/50"}`}
                >
                  {row.text}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <p className="px-1 text-[10.5px] text-white/30">Örnek akış · kurgusal veri</p>
      </aside>
    </div>
  );
}
