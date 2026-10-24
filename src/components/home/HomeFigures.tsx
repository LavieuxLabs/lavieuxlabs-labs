import Link from "next/link";
import type { ReactNode } from "react";
import { CLINICAL_CASES } from "@/lib/clinicalCases";
import { RULES, THRESHOLD, scoreClaim, type RuleKey } from "@/lib/claimRules";
import { metrics, testsLabel } from "@/lib/metrics";
import { safetyPlaneGroups } from "@/lib/safetyPlanes";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";

// Home page figures on the paper surface. Each one draws a real model already used on the site (the
// pairwise formula, a claim's path, the QTc and polypharmacy example cases, the safety planes, Shield's
// example rule set, the evidence levels), so no figure is decoration. Each has its own visual form, so the
// page does not repeat one diagram: bars, a numbered track, the decision trace (the one dot-and-line
// drawing), an input → checks → result flow, a score scale and stacked level blocks. Data is ink; colour
// appears only where a value is a clinical or review state. No motion: every figure is complete at rest.
// Type scale: 13 caption · 14 figure text · 15 emphasis.

const LINK =
  "underline decoration-ink/30 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export function Figure({ caption, children, className = "" }: { caption: ReactNode; children: ReactNode; className?: string }) {
  return (
    <figure className={`min-w-0 rounded-lg border border-rule bg-white p-5 sm:p-6 ${className}`}>
      {children}
      <figcaption className="mt-5 border-t border-rule pt-3 text-[13px] leading-relaxed text-ink-3">{caption}</figcaption>
    </figure>
  );
}

// ── Pairwise combinations ────────────────────────────────────────────────────

const pairCopy = defineContent({
  tr: {
    drugs: (n: number) => `${n} ilaç`,
    caption: "İlaç sayısına göre ikili kombinasyon sayısı, n(n−1)/2. Üçlü ve daha karmaşık etkiler bu sayıya dahil değildir.",
    label: "İlaç sayısına göre ikili kombinasyon sayısı",
  },
  en: {
    drugs: (n: number) => `${n} drugs`,
    caption: "Pairwise combinations by number of drugs, n(n−1)/2. Three-way and more complex effects are not included.",
    label: "Pairwise combinations by number of drugs",
  },
});

const PAIRS = [5, 8, 10, 15].map((n) => ({ n, pairs: (n * (n - 1)) / 2 }));
const MAX_PAIRS = PAIRS[PAIRS.length - 1].pairs;

export function PairwiseFigure({ locale }: { locale: Locale }) {
  const c = pairCopy[locale];
  return (
    <Figure caption={c.caption}>
      <ul aria-label={c.label} className="space-y-3">
        {PAIRS.map(({ n, pairs }) => (
          <li key={n} className="grid grid-cols-[64px_minmax(0,1fr)_40px] items-center gap-3 text-[14px]">
            <span className="text-ink-2">{c.drugs(n)}</span>
            <span className="h-2.5 rounded-[1px] bg-paper-band">
              <span className="block h-full rounded-[1px] bg-ink" style={{ width: `${(pairs / MAX_PAIRS) * 100}%` }} />
            </span>
            <span className="text-right font-mono text-ink tabular-nums">{pairs}</span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ── A claim's path today: a numbered track, not a dot timeline ───────────────

const pathCopy = defineContent({
  tr: {
    steps: ["Hizmet verilir", "Fatura hazırlanır", "MEDULA'ya gönderilir", "SGK inceler", "Red ya da kesinti", "İtiraz ve yeniden gönderim"],
    marked: 4,
    note: "Hata çoğu zaman 5. adımda, fatura gönderildikten sonra fark edilir.",
    caption: "Bir fatura kaleminin bugünkü yolu. MEDULA, SGK'nın provizyon ve fatura sistemidir.",
  },
  en: {
    steps: ["Service delivered", "Claim prepared", "Sent to MEDULA", "SGK reviews", "Rejection or deduction", "Appeal and resubmission"],
    marked: 4,
    note: "The error is usually found at step 5, after the claim has been sent.",
    caption: "A claim line's path today. MEDULA is the pre-authorisation and billing system of SGK, Turkey's Social Security Institution.",
  },
});

export function ClaimPathFigure({ locale }: { locale: Locale }) {
  const c = pathCopy[locale];
  return (
    <Figure caption={c.caption}>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
        {c.steps.map((step, i) => {
          const marked = i === c.marked;
          return (
            <li key={step} className={`border-t-[3px] pt-2 ${marked ? "border-ink" : "border-ink/15"}`}>
              <span className="block font-mono text-[13px] text-ink-3 tabular-nums">{i + 1}</span>
              <span className={`mt-0.5 block text-[14px] leading-snug ${marked ? "font-semibold text-ink" : "text-ink-2"}`}>{step}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-[14px] leading-snug text-ink">{c.note}</p>
    </Figure>
  );
}

// ── Decision trace (QTc example case): the page's main explanatory figure ────

const traceCopy = defineContent({
  tr: {
    rows: { patient: "Hasta", order: "İstem", measured: "Ölçüm", score: "Risk skoru", rule: "Kural", shown: "Hekime sunulan", record: "Kayıt" },
    score: (total: number, factors: number) => (
      <>
        Tisdale <span className="font-mono tabular-nums">{total}</span> puan, <span className="font-mono tabular-nums">{factors}</span> risk faktöründen
      </>
    ),
    rule: "Tisdale 11 ve üzeri yüksek risktir. Kural tetiklendi.",
    record: "Girdi, kural sürümü ve hekimin kararı yalnızca eklenebilen kayda yazılır.",
    caption: "Bir uyarının izi, örnek vaka. Kurgusal hasta. QTc bir ölçüm, Tisdale bir risk skorudur; ikisi ayrı tutulur.",
    open: "Vakayı ve puanların dökümünü simülatörde açın",
  },
  en: {
    rows: { patient: "Patient", order: "Order", measured: "Measurement", score: "Risk score", rule: "Rule", shown: "Shown to the physician", record: "Record" },
    score: (total: number, factors: number) => (
      <>
        Tisdale <span className="font-mono tabular-nums">{total}</span> points, from <span className="font-mono tabular-nums">{factors}</span> risk factors
      </>
    ),
    rule: "A Tisdale score of 11 or more is high risk. The rule fired.",
    record: "The input, rule version and the physician's decision are written to an append-only log.",
    caption: "One alert, traced. Example case with a fictional patient. QTc is a measurement and Tisdale is a risk score; they are kept apart.",
    open: "Open the case and its point breakdown in the simulator",
  },
});

export function DecisionTraceFigure({ locale }: { locale: Locale }) {
  const c = traceCopy[locale];
  const qtCase = CLINICAL_CASES[locale].find((x) => x.id === "qtc")!;
  const factors = qtCase.tisdale ?? [];
  const total = factors.reduce((n, f) => n + f.points, 0);
  // The case finding ends with what is put to the physician; the earlier sentences repeat the reading.
  const shown = qtCase.finding.split(/(?<=\.)\s+/).at(-1);

  const rows: { key: string; label: string; value: ReactNode; alert?: boolean }[] = [
    { key: "patient", label: c.rows.patient, value: qtCase.patient },
    { key: "order", label: c.rows.order, value: qtCase.prescription },
    {
      key: "measured",
      label: c.rows.measured,
      value: (
        <>
          QTc (Fridericia) <span className="font-mono tabular-nums">{qtCase.readings.qtc.value}</span> ms
        </>
      ),
    },
    { key: "score", label: c.rows.score, value: c.score(total, factors.length) },
    { key: "rule", label: c.rows.rule, value: c.rule, alert: total >= 11 },
    { key: "shown", label: c.rows.shown, value: shown },
    { key: "record", label: c.rows.record, value: c.record },
  ];

  return (
    <Figure
      caption={
        <>
          {c.caption}{" "}
          <Link href={localizedPath(locale, "/initiatives/pharmadeux?case=qtc#vakalar")} className={`text-ink-2 ${LINK}`}>
            {c.open}
          </Link>
        </>
      }
    >
      <dl>
        {rows.map((row, i) => (
          <div key={row.key} className="relative grid grid-cols-[92px_minmax(0,1fr)] gap-3 pb-3.5 pl-7 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-4 sm:pb-4">
            {i < rows.length - 1 && <span aria-hidden="true" className="absolute top-4 bottom-0 left-[6.5px] w-px bg-ink/25" />}
            <span
              aria-hidden="true"
              className={`absolute top-[5px] left-0 h-[14px] w-[14px] rounded-full border-[1.5px] ${
                row.alert ? "border-rose-700 bg-rose-700" : "border-ink bg-white"
              }`}
            />
            <dt className="text-[13px] text-ink-3">{row.label}</dt>
            <dd className={`text-[15px] leading-snug ${row.alert ? "font-medium text-rose-700" : "text-ink"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Figure>
  );
}

// ── PharmaDeux: one prescription through the four check areas ───────────────

const rxCopy = defineContent({
  tr: {
    steps: { rx: "Reçete", checks: "Kontrol alanları", result: "Sonuç" },
    checksCount: (n: number) => `${n} kontrol başlığı`,
    caption: (n: number) =>
      `Örnek: kurgusal hasta. PharmaDeux bir reçeteyi ${n} başlıkta, dört klinik grupta kontrol eder; burada her gruptan iki başlık görünüyor.`,
    all: "Başlıkların tamamı ve kaynakları",
  },
  en: {
    steps: { rx: "Prescription", checks: "Check areas", result: "Result" },
    checksCount: (n: number) => `${n} checks`,
    caption: (n: number) =>
      `Example: fictional patient. PharmaDeux checks a prescription against ${n} checks in four clinical groups; two from each group are shown here.`,
    all: "All checks and their sources",
  },
});

export function PrescriptionCheckFigure({ locale }: { locale: Locale }) {
  const c = rxCopy[locale];
  const rxCase = CLINICAL_CASES[locale].find((x) => x.id === "polypharmacy")!;
  const drugs = rxCase.prescription.split(" · ");
  const groups = safetyPlaneGroups(locale);
  const name = (p: (typeof groups)[number]["planes"][number]) => (typeof p === "string" ? p : p.name);

  return (
    <Figure
      caption={
        <>
          {c.caption(metrics.safetyPlanes)}{" "}
          <Link href={localizedPath(locale, "/initiatives/pharmadeux#mimari")} className={`text-ink-2 ${LINK}`}>
            {c.all}
          </Link>
        </>
      }
    >
      {/* A real sequence: what goes in, what is checked, what comes out. */}
      <ol className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_minmax(0,0.9fr)] md:gap-5">
        <li className="min-w-0">
          <p className="text-[13px] text-ink-3">
            <span className="font-mono tabular-nums">1</span> {c.steps.rx}
          </p>
          <p className="mt-2 text-[14px] text-ink-2">{rxCase.patient}</p>
          {/* Wraps side by side on phones, stacks in its own column on wider screens. */}
          <ul className="mt-2 flex flex-wrap gap-1.5 md:flex-col">
            {drugs.map((d) => (
              <li key={d} className="rounded-[3px] border border-rule bg-paper px-2 py-1 text-[14px] leading-snug text-ink">
                {d}
              </li>
            ))}
          </ul>
        </li>
        <li className="min-w-0">
          <p className="text-[13px] text-ink-3">
            <span className="font-mono tabular-nums">2</span> {c.steps.checks}
          </p>
          <ul className="mt-2 divide-y divide-rule border-y border-rule">
            {groups.map((g) => (
              <li key={g.title} className="py-2">
                <p className="flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink">
                  {g.title}
                  <span className="font-mono text-[13px] font-normal text-ink-3 tabular-nums">{g.planes.length}</span>
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-3">{g.planes.slice(0, 2).map(name).join(", ")}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-ink-3">{c.checksCount(metrics.safetyPlanes)}</p>
        </li>
        <li className="min-w-0">
          <p className="text-[13px] text-ink-3">
            <span className="font-mono tabular-nums">3</span> {c.steps.result}
          </p>
          <p className="mt-2 border-l-[3px] border-emerald-700 pl-3 text-[14px] leading-snug text-ink">{rxCase.finding}</p>
        </li>
      </ol>
    </Figure>
  );
}

// ── Shield: one line item's score ────────────────────────────────────────────

const EXAMPLE = { item: "angio", icd: "M54.5", checks: { preapproval: false, repeat: false, signed: true } } as const;

const scoreCopy = defineContent({
  tr: {
    item: "Kardiyoloji, koroner anjiyografi",
    diagnosis: "Tanı M54.5, bel ağrısı",
    rules: {
      mismatch: "Tanı bu işlemi gerekçelendirmiyor",
      preapproval: "Ön onay belgesi dosyada yok",
      repeat: "Aynı işlem 30 gün içinde tekrar",
      unsigned: "Epikriz imzasız",
    } as Record<RuleKey, string>,
    score: "Kural skoru",
    threshold: (t: number) => `eşik ${t}`,
    review: "Fatura uzmanının kuyruğuna gider",
    below: "Eşiğin altında",
    caption: "Bir fatura kaleminin kural skoru, tetiklenen kuralların katkılarının toplamıdır; SGK ret olasılığı değildir. Kurgusal kural seti; ICD-10 kodu gerçektir.",
    open: "Kalemi simülatörde açın",
  },
  en: {
    item: "Cardiology, coronary angiography",
    diagnosis: "Diagnosis M54.5, low back pain",
    rules: {
      mismatch: "The diagnosis does not justify this procedure",
      preapproval: "No pre-approval document on file",
      repeat: "Same procedure again within 30 days",
      unsigned: "Discharge summary unsigned",
    } as Record<RuleKey, string>,
    score: "Rule score",
    threshold: (t: number) => `threshold ${t}`,
    review: "Goes to the billing specialist's queue",
    below: "Below the threshold",
    caption: "A claim line's rule score is the sum of the rules it triggers; it is not a probability of SGK rejection. Fictional rule set; the ICD-10 code is real.",
    open: "Open the line item in the simulator",
  },
});

export function ClaimScoreFigure({ locale }: { locale: Locale }) {
  const c = scoreCopy[locale];
  const { triggered, score } = scoreClaim(EXAMPLE.item, EXAMPLE.icd, EXAMPLE.checks);
  const review = score >= THRESHOLD;
  const query = `?item=${EXAMPLE.item}&code=${EXAMPLE.icd}&pre=0&repeat=0&signed=1#simulator`;

  return (
    <Figure
      caption={
        <>
          {c.caption}{" "}
          <Link href={localizedPath(locale, `/initiatives/shield${query}`)} className={`text-ink-2 ${LINK}`}>
            {c.open}
          </Link>
        </>
      }
    >
      <p className="text-[15px] font-semibold text-ink">{c.item}</p>
      <p className="text-[14px] text-ink-3">{c.diagnosis}</p>

      <ul className="mt-4 divide-y divide-rule border-y border-rule">
        {triggered.map((k) => (
          <li key={k} className="grid grid-cols-[minmax(0,1fr)_40px] items-baseline gap-3 py-2.5 text-[14px]">
            <span className="text-ink-2">{c.rules[k]}</span>
            <span className="text-right font-mono text-ink tabular-nums">+{RULES[k].weight}</span>
          </li>
        ))}
      </ul>

      {/* 0–100 scale; segments are the triggered rules in order, the tick is the review threshold. */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between text-[14px]">
          <span className="text-ink-2">{c.score}</span>
          <span className={`font-mono text-[20px] tabular-nums ${review ? "text-amber-700" : "text-ink"}`}>{score}</span>
        </div>
        <div className="relative mt-2 h-3 rounded-[1px] bg-paper-band" role="img" aria-label={`${c.score} ${score} / 100, ${c.threshold(THRESHOLD)}`}>
          <div className="flex h-full">
            {triggered.map((k, i) => (
              <span key={k} className={`h-full ${i % 2 === 0 ? "bg-ink" : "bg-ink-3"}`} style={{ width: `${RULES[k].weight}%` }} />
            ))}
          </div>
          <span aria-hidden="true" className="absolute -top-1.5 -bottom-1.5 w-[2px] bg-amber-700" style={{ left: `${THRESHOLD}%` }} />
        </div>
        <div className="relative mt-1.5 h-4 font-mono text-[13px] text-ink-3 tabular-nums" aria-hidden="true">
          <span className="absolute left-0">0</span>
          <span className="absolute -translate-x-1/2" style={{ left: `${THRESHOLD}%` }}>
            {THRESHOLD}
          </span>
          <span className="absolute right-0">100</span>
        </div>
        <p className={`mt-3 text-[14px] font-medium ${review ? "text-amber-700" : "text-ink-2"}`}>
          {review ? c.review : c.below} <span className="font-normal text-ink-3">({c.threshold(THRESHOLD)})</span>
        </p>
      </div>
    </Figure>
  );
}

// ── Evidence levels: stacked blocks, no percentages ──────────────────────────
// A level is either reached, in progress or not started; a fill ratio would invent a measurement. Each level
// names the product it describes, so PharmaDeux's numbers are never read as Shield's.

type Level = { title: string; status: string; body: string[]; state: "done" | "current" | "none" };

const levelsCopy = defineContent<{ levels: Level[]; caption: string; here: string }>({
  tr: {
    levels: [
      {
        title: "Klinik ve kurumsal kanıt",
        status: "Henüz yok",
        body: ["İki proje için de gerçek hasta ya da fatura verisiyle ölçüm yapılmadı."],
        state: "none",
      },
      {
        title: "Sentetik doğrulama",
        status: "Devam ediyor",
        body: [
          `PharmaDeux: ${metrics.verifiedRules} kural sentetik hasta profillerinde beklenen sonucu veriyor.`,
          "Shield: kurallar sentetik faturalarla test ediliyor.",
        ],
        state: "current",
      },
      {
        title: "Kod",
        status: "Var",
        body: [`PharmaDeux: depoda ${testsLabel("tr")} otomatik test tanımı var; CI her gönderimde çalıştırır. Bu, klinik doğrulama değildir.`, "Shield: dört denetim düzleminden üçü uygulandı."],
        state: "done",
      },
    ],
    caption:
      "Kanıt düzeyleri, alttan üste. Sayılar ekibin kendi kayıtlarından alındı; bağımsız olarak doğrulanmadı. Bir düzeyin sonucu, bir üst düzeyin yerine geçmez.",
    here: "Buradayız",
  },
  en: {
    levels: [
      {
        title: "Clinical and institutional evidence",
        status: "None yet",
        body: ["No measurement on real patient or claim data for either project."],
        state: "none",
      },
      {
        title: "Synthetic verification",
        status: "In progress",
        body: [
          `PharmaDeux: ${metrics.verifiedRules} rules give the expected result on synthetic patient profiles.`,
          "Shield: rules are tested on synthetic claims.",
        ],
        state: "current",
      },
      {
        title: "Code",
        status: "In place",
        body: [`PharmaDeux: ${testsLabel("en")} automated tests defined in the repository; CI runs them on every push. This is not clinical validation.`, "Shield: three of four audit planes implemented."],
        state: "done",
      },
    ],
    caption:
      "Levels of evidence, from the bottom up. The numbers come from the team's own records and have not been independently verified. A result at one level does not stand in for the level above it.",
    here: "We are here",
  },
});

const levelBlock = {
  done: "bg-ink text-white border-ink",
  current: "border-ink text-ink bg-[repeating-linear-gradient(135deg,var(--color-paper-band)_0_6px,white_6px_12px)]",
  none: "border-dashed border-ink/40 text-ink-2 bg-white",
} as const;

export function EvidenceLevelsFigure({ locale }: { locale: Locale }) {
  const c = levelsCopy[locale];
  return (
    <Figure caption={c.caption}>
      <ol className="space-y-2">
        {c.levels.map((l) => (
          <li
            key={l.title}
            aria-current={l.state === "current" ? "step" : undefined}
            className="grid gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center"
          >
            <div className={`flex items-baseline justify-between gap-3 rounded-[3px] border-[1.5px] px-4 py-3 ${levelBlock[l.state]}`}>
              <span className="text-[15px] font-semibold">{l.title}</span>
              <span className="text-[13px]">{l.status}</span>
            </div>
            <div className="space-y-0.5 text-[14px] leading-snug text-ink-2">
              {l.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {l.state === "current" && <p className="font-medium text-ink underline underline-offset-4">{c.here}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
