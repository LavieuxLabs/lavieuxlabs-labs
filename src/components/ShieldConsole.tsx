"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, PenLine, X } from "lucide-react";

type Factor = { rule: string; label: string; weight: number };

type Claim = {
  id: string;
  service: string;
  unit: string;
  amount: string;
  score: number;
  factors: Factor[];
};

type Decision = "approved" | "corrected" | "rejected";

type AuditEntry = {
  seq: number;
  time: string;
  actor: string;
  action: string;
  ref: string;
};

// Fictional sample data for the illustrative console.
const claims: Claim[] = [
  {
    id: "CLM-24817",
    service: "Ayakta tedavi · Görüntüleme",
    unit: "Radyoloji",
    amount: "₺4.820",
    score: 78,
    factors: [
      { rule: "R-112", label: "Tanı kodu ile işlem kodu uyumsuz", weight: 34 },
      { rule: "R-047", label: "Ön onay belgesi eksik", weight: 26 },
      { rule: "R-203", label: "30 gün içinde tekrar eden işlem", weight: 18 },
    ],
  },
  {
    id: "CLM-24822",
    service: "Yatarak tedavi · Paket",
    unit: "Genel Cerrahi",
    amount: "₺38.150",
    score: 61,
    factors: [
      { rule: "R-310", label: "Paket dışı malzeme kalemi", weight: 29 },
      { rule: "R-088", label: "Yatış süresi paket limitini aşıyor", weight: 22 },
      { rule: "R-019", label: "Epikriz raporu imzasız", weight: 10 },
    ],
  },
  {
    id: "CLM-24830",
    service: "Ayakta tedavi · Laboratuvar",
    unit: "Biyokimya",
    amount: "₺1.240",
    score: 34,
    factors: [
      { rule: "R-156", label: "Aynı gün mükerrer tetkik kalemi", weight: 21 },
      { rule: "R-002", label: "Hekim branş kodu eksik", weight: 13 },
    ],
  },
  {
    id: "CLM-24836",
    service: "Acil · Müdahale",
    unit: "Acil Servis",
    amount: "₺2.960",
    score: 12,
    factors: [{ rule: "R-074", label: "Triaj kodu ile işlem düzeyi sınırda", weight: 12 }],
  },
];

const decisionLabels: Record<Decision, string> = {
  approved: "Gönderime onaylandı",
  corrected: "Düzeltmeye gönderildi",
  rejected: "Gönderim durduruldu",
};

const riskTone = (score: number) =>
  score >= 70
    ? {
        text: "text-rose-300",
        bar: "bg-rose-400",
        chip: "border-rose-400/30 bg-rose-400/10 text-rose-200",
        label: "Yüksek",
      }
    : score >= 40
      ? {
          text: "text-amber-300",
          bar: "bg-amber-400",
          chip: "border-amber-400/30 bg-amber-400/10 text-amber-200",
          label: "Orta",
        }
      : {
          text: "text-emerald-300",
          bar: "bg-emerald-400",
          chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
          label: "Düşük",
        };

const initialAudit: AuditEntry[] = [
  { seq: 1041, time: "09:12:04", actor: "system", action: "SCORE_COMPUTED · ruleset v3.8.1", ref: "CLM-24817" },
  { seq: 1042, time: "09:12:05", actor: "system", action: "QUEUED_FOR_REVIEW · risk ≥ 40", ref: "CLM-24817" },
];

function timestamp() {
  return new Date().toLocaleTimeString("tr-TR", { hour12: false });
}

export default function ShieldConsole() {
  const [selectedId, setSelectedId] = useState(claims[0].id);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [audit, setAudit] = useState<AuditEntry[]>(initialAudit);

  const selected = claims.find((c) => c.id === selectedId) ?? claims[0];
  const tone = riskTone(selected.score);
  const decided = decisions[selected.id];

  const decide = (decision: Decision) => {
    setDecisions((d) => ({ ...d, [selected.id]: decision }));
    // Append-only: entries are only ever added, never edited or removed.
    setAudit((log) => [
      ...log,
      {
        seq: log[log.length - 1].seq + 1,
        time: timestamp(),
        actor: "reviewer.demo",
        action: `DECISION_${decision.toUpperCase()} · ${selected.factors.map((f) => f.rule).join(", ")}`,
        ref: selected.id,
      },
    ]);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-navy-850/80 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 font-mono text-[11px] text-white/40">shield / inceleme-kuyruğu</span>
        </div>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/40">
          Örnek · kurgusal veri
        </span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Queue */}
        <div className="border-b border-white/[0.08] lg:border-r lg:border-b-0">
          <p className="px-4 pt-4 pb-2 text-[11px] font-medium uppercase tracking-wide text-white/35">
            İşlem öncesi kuyruk · {claims.length} kayıt
          </p>
          <ul className="px-2 pb-2" role="listbox" aria-label="İnceleme kuyruğu">
            {claims.map((c) => {
              const t = riskTone(c.score);
              const active = c.id === selectedId;
              const d = decisions[c.id];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => setSelectedId(c.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className={`w-9 font-mono text-sm font-medium ${t.text}`}>{c.score}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[12px] text-white/85">{c.id}</span>
                      <span className="block truncate text-xs text-white/45">{c.service}</span>
                    </span>
                    {d ? (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wide text-white/50">
                        Karar verildi
                      </span>
                    ) : (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wide ${t.chip}`}
                      >
                        {t.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Detail */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[12px] text-white/50">{selected.id}</p>
              <p className="mt-1 text-sm text-white">{selected.service}</p>
              <p className="text-xs text-white/45">
                {selected.unit} · {selected.amount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/35">Red riski</p>
              <p className={`text-4xl font-semibold tracking-tight ${tone.text}`}>
                {selected.score}
                <span className="text-base text-white/30">/100</span>
              </p>
            </div>
          </div>

          <p className="mt-6 text-[11px] font-medium uppercase tracking-wide text-white/35">Skor bileşenleri</p>
          <ul className="mt-3 space-y-3">
            {selected.factors.map((f) => (
              <li key={f.rule}>
                <div className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="text-white/75">
                    <span className="mr-2 font-mono text-[11px] text-white/35">{f.rule}</span>
                    {f.label}
                  </span>
                  <span className="font-mono text-white/60">+{f.weight}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    key={`${selected.id}-${f.rule}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${f.weight}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${tone.bar}`}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/[0.08] pt-5">
            {decided ? (
              <p className="flex items-center gap-2 text-sm text-white/70">
                <Lock className="h-4 w-4 text-white/40" />
                {decisionLabels[decided]} · karar denetim izine yazıldı
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => decide("approved")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-[13px] text-emerald-100 hover:bg-emerald-400/20"
                >
                  <Check className="h-3.5 w-3.5" /> Onayla
                </button>
                <button
                  type="button"
                  onClick={() => decide("corrected")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-[13px] text-white/80 hover:bg-white/5"
                >
                  <PenLine className="h-3.5 w-3.5" /> Düzeltmeye gönder
                </button>
                <button
                  type="button"
                  onClick={() => decide("rejected")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-[13px] text-rose-100 hover:bg-rose-400/20"
                >
                  <X className="h-3.5 w-3.5" /> Gönderimi durdur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit log */}
      <div className="border-t border-white/[0.08] bg-navy-950">
        <div className="flex items-center justify-between px-4 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-white/35">audit_log · append-only</p>
          <Lock className="h-3.5 w-3.5 text-white/30" />
        </div>
        <ol className="max-h-44 overflow-y-auto px-4 pb-4 font-mono text-[11.5px] leading-6">
          <AnimatePresence initial={false}>
            {audit.map((e) => (
              <motion.li
                key={e.seq}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 whitespace-nowrap text-white/50"
              >
                <span className="text-white/25">#{e.seq}</span>
                <span>{e.time}</span>
                <span className="text-indigo-300/80">{e.actor}</span>
                <span className="truncate text-white/70">{e.action}</span>
                <span className="ml-auto text-white/35">{e.ref}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  );
}
