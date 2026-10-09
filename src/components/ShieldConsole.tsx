"use client";

import { useMemo, useState, type KeyboardEvent } from "react";

// Interactive Shield example in a data-table idiom (Geist data table / macOS Instruments): a
// pre-claim queue, the rule-engine matches behind the selected claim's risk score, a decision
// control, and an append-only audit trail whose entries are hash-chained (FNV-1a over the entry
// and the previous hash). ICD-10 codes are real; SUT references name the real annex categories
// (EK-2B fee-for-service, EK-2C diagnosis-based package). Claims and amounts are fictional.

type Factor = { rule: string; label: string; weight: number };
type Decision = "approved" | "corrected" | "held";

type Claim = {
  id: string;
  procedure: string;
  icd: { code: string; label: string };
  sut: { annex: "EK-2B" | "EK-2C"; label: string };
  amount: number;
  factors: Factor[];
};

type AuditEntry = { seq: number; time: string; actor: string; event: string; ref: string; prev: string; hash: string };

const THRESHOLD = 40;

const CLAIMS: Claim[] = [
  {
    id: "CLM-24817",
    procedure: "Toraks BT",
    icd: { code: "M54.5", label: "Bel ağrısı" },
    sut: { annex: "EK-2B", label: "Hizmet başı" },
    amount: 4820,
    factors: [
      { rule: "R-112", label: "Tanı–işlem uyumsuzluğu", weight: 34 },
      { rule: "R-047", label: "Ön onay belgesi eksik", weight: 26 },
      { rule: "R-203", label: "30 gün içinde tekrar eden işlem", weight: 18 },
    ],
  },
  {
    id: "CLM-24822",
    procedure: "Apendektomi paketi",
    icd: { code: "K35.8", label: "Akut apandisit, diğer" },
    sut: { annex: "EK-2C", label: "Tanıya dayalı paket" },
    amount: 38150,
    factors: [
      { rule: "R-310", label: "Paket dışı malzeme kalemi", weight: 29 },
      { rule: "R-088", label: "Yatış süresi paket limitini aşıyor", weight: 22 },
      { rule: "R-019", label: "Epikriz imzasız", weight: 10 },
    ],
  },
  {
    id: "CLM-24830",
    procedure: "Biyokimya paneli",
    icd: { code: "E11.9", label: "Tip 2 diyabet, komplikasyonsuz" },
    sut: { annex: "EK-2B", label: "Hizmet başı" },
    amount: 1240,
    factors: [
      { rule: "R-156", label: "Aynı gün mükerrer tetkik", weight: 21 },
      { rule: "R-002", label: "Hekim branş kodu eksik", weight: 13 },
    ],
  },
  {
    id: "CLM-24836",
    procedure: "Acil müdahale",
    icd: { code: "R07.4", label: "Göğüs ağrısı, tanımlanmamış" },
    sut: { annex: "EK-2B", label: "Hizmet başı" },
    amount: 2960,
    factors: [{ rule: "R-074", label: "Triaj seviyesi ile işlem düzeyi sınırda", weight: 12 }],
  },
];

const scoreOf = (c: Claim) => c.factors.reduce((sum, f) => sum + f.weight, 0);

// Locale-independent so server and client render identical strings.
const formatTRY = (value: number) => `₺${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

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

const decisionMeta: Record<Decision, { label: string; event: string; badge: string }> = {
  approved: { label: "Onaylandı", event: "DECISION_APPROVED", badge: "text-emerald-200" },
  corrected: { label: "Düzeltmede", event: "DECISION_CORRECTION", badge: "text-indigo-200" },
  held: { label: "Durduruldu", event: "DECISION_HOLD", badge: "text-white/70" },
};

type Filter = "all" | "review" | "decided";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "review", label: "İncelemede" },
  { value: "decided", label: "Karar verildi" },
];

const shortHash = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;
const now = () => new Date().toLocaleTimeString("tr-TR", { hour12: false });

const cell = "px-3 py-2.5 first:pl-4 last:pr-4";
const head = "px-3 py-2 text-left text-[11px] font-medium text-white/45 first:pl-4 last:pr-4";

export default function ShieldConsole() {
  const [selectedId, setSelectedId] = useState(CLAIMS[0].id);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [audit, setAudit] = useState<AuditEntry[]>(INITIAL_AUDIT);
  const [filter, setFilter] = useState<Filter>("all");

  const statusOf = (c: Claim) => {
    const decided = decisions[c.id];
    if (decided) return decisionMeta[decided];
    if (scoreOf(c) >= THRESHOLD) return { label: "İncelemede", badge: "text-amber-200" };
    return { label: "Eşik altı", badge: "text-white/55" };
  };

  const rows = useMemo(
    () =>
      CLAIMS.filter((c) => {
        if (filter === "all") return true;
        const decided = Boolean(decisions[c.id]);
        return filter === "decided" ? decided : !decided && scoreOf(c) >= THRESHOLD;
      }),
    [filter, decisions],
  );

  const selected = CLAIMS.find((c) => c.id === selectedId) ?? CLAIMS[0];
  const score = scoreOf(selected);
  const t = tier(score);
  const decided = decisions[selected.id];
  const canDecide = !decided && score >= THRESHOLD;
  const selectedStatus = statusOf(selected);

  const decide = (decision: Decision) => {
    setDecisions((d) => ({ ...d, [selected.id]: decision }));
    setAudit((log) =>
      append(log, { time: now(), actor: "reviewer.demo", event: decisionMeta[decision].event, ref: selected.id }),
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
          <p className="text-[13px] font-semibold text-white">Ön kontrol kuyruğu</p>
          <span className="font-mono text-[12px] text-white/45 tabular-nums">{CLAIMS.length}</span>
        </div>
        <div role="group" aria-label="Talepleri filtrele" className="flex rounded-lg bg-white/[0.04] p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-2.5 py-1 text-[12px] transition-colors duration-150 ease-out ${
                filter === f.value ? "bg-navy-850 text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Claims table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-[13px]">
          <caption className="sr-only">Gönderim öncesi talepler; bir satır seçerek ayrıntıları görün.</caption>
          <thead className="border-b border-white/[0.06]">
            <tr>
              <th scope="col" className={head}>
                Talep
              </th>
              <th scope="col" className={head}>
                ICD-10
              </th>
              <th scope="col" className={head}>
                SUT eki
              </th>
              <th scope="col" className={`${head} text-right`}>
                Tutar
              </th>
              <th scope="col" className={head}>
                Risk
              </th>
              <th scope="col" className={`${head} text-right`}>
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((c) => {
              const s = scoreOf(c);
              const rt = tier(s);
              const status = statusOf(c);
              const active = c.id === selectedId;
              return (
                <tr
                  key={c.id}
                  tabIndex={0}
                  aria-selected={active}
                  onClick={() => setSelectedId(c.id)}
                  onKeyDown={(e) => onRowKey(e, c.id)}
                  className={`cursor-pointer outline-none transition-colors duration-150 ease-out focus-visible:bg-white/[0.04] ${
                    active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <td className={cell}>
                    <span className="block font-mono text-[12.5px] text-white/90 tabular-nums">{c.id}</span>
                    <span className="block text-[12px] text-white/50">{c.procedure}</span>
                  </td>
                  <td className={cell}>
                    <span className="block font-mono text-[12.5px] text-white/80">{c.icd.code}</span>
                    <span className="block max-w-[160px] truncate text-[12px] text-white/45">{c.icd.label}</span>
                  </td>
                  <td className={cell}>
                    <span className="block font-mono text-[12.5px] text-white/80">{c.sut.annex}</span>
                    <span className="block text-[12px] text-white/45">{c.sut.label}</span>
                  </td>
                  <td className={`${cell} text-right font-mono text-white/75 tabular-nums`}>{formatTRY(c.amount)}</td>
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
                <td colSpan={6} className="px-4 py-8 text-center text-[12px] text-white/40">
                  Bu filtrede talep yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected claim: rule-engine matches + decision */}
      <div className="grid gap-px border-t border-white/[0.06] bg-white/[0.06] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section aria-label="Kural motoru eşleşmeleri" className="bg-navy-850 px-4 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[12px] font-medium text-white/60">
              Kural motoru eşleşmeleri · <span className="font-mono text-white/80 tabular-nums">{selected.id}</span>
            </p>
            <p className="text-[11px] text-white/40">
              ruleset <span className="font-mono tabular-nums">v3.8.1</span>
            </p>
          </div>
          <ul className="mt-3 divide-y divide-white/[0.06]">
            {selected.factors.map((f) => (
              <li key={f.rule} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 py-2">
                <span className="font-mono text-[12px] text-white/50">{f.rule}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-white/80">{f.label}</span>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                    <span className={`block h-full rounded-full ${t.bar}`} style={{ width: `${f.weight}%` }} />
                  </span>
                </span>
                <span className="font-mono text-[12.5px] text-white/70 tabular-nums">+{f.weight}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-baseline justify-between border-t border-white/[0.06] pt-2.5">
            <span className="text-[12px] text-white/55">Red riski (Σ kural katkısı)</span>
            <span className={`font-mono text-[15px] font-medium tabular-nums ${t.text}`}>
              {score}
              <span className="text-white/35">/100</span>
            </span>
          </div>
        </section>

        <section aria-label="Karar" className="flex flex-col bg-navy-850 px-4 py-4">
          <p className="text-[12px] font-medium text-white/60">Uzman kararı</p>
          <p className="mt-1 text-[12px] leading-relaxed text-white/45">
            {canDecide
              ? `Risk eşiği ${THRESHOLD} aşıldı; gönderim kararı uzmana bırakıldı.`
              : decided
                ? "Karar denetim izine eklendi; kayıt değiştirilemez."
                : `Skor eşik (${THRESHOLD}) altında; talep incelemeye alınmadı.`}
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
                  {d === "approved" ? "Onayla" : d === "corrected" ? "Düzeltmeye gönder" : "Gönderimi durdur"}
                </button>
              ))}
            </div>
          ) : (
            <span className={`mt-auto text-[12.5px] font-medium ${selectedStatus.badge}`}>{selectedStatus.label}</span>
          )}
        </section>
      </div>

      {/* Append-only, hash-chained audit trail */}
      <section aria-label="Denetim izi" className="border-t border-white/[0.06] bg-navy-850">
        <div className="flex items-baseline justify-between gap-3 px-4 pt-3 pb-2">
          <p className="text-[12px] font-medium text-white/60">Denetim izi</p>
          <p className="text-[11px] text-white/40">Yalnızca ekleme · her kayıt önceki hash&apos;i içerir</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-[12px]">
            <thead className="border-y border-white/[0.06]">
              <tr>
                <th scope="col" className={head}>
                  Sıra
                </th>
                <th scope="col" className={head}>
                  Zaman
                </th>
                <th scope="col" className={head}>
                  Aktör
                </th>
                <th scope="col" className={head}>
                  Olay
                </th>
                <th scope="col" className={head}>
                  Talep
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
        <p className="px-4 pt-2 pb-3 text-[11px] text-white/35">
          Örnek · kurgusal talepler. ICD-10 kodları gerçek; SUT sütunu ilgili eki gösterir.
        </p>
      </section>
    </div>
  );
}
