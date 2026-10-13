import Link from "next/link";
import StandardDoc from "@/components/StandardDoc";
import { CITATIONS } from "@/lib/citations";
import { standardPageJsonLd } from "@/lib/structuredData";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

const PATH = "/standartlar/tisdale-score";

export const metadata = defineMetadata(PATH, {
  tr: {
    title: "Tisdale QT risk skoru",
    description:
      "Hastanede yatan hastada QT uzaması riskini öngören Tisdale skoru: on risk faktörü, 0–21 puan, düşük, orta ve yüksek risk eşikleri ve PharmaDeux'un bu eşiklerle çalışma biçimi.",
  },
  en: {
    title: "Tisdale QT risk score",
    description:
      "The Tisdale score predicts QT prolongation risk in hospitalised patients: ten risk factors, 0–21 points, low, moderate and high risk thresholds, and how PharmaDeux uses them.",
  },
});

// Factors and points as published (Tisdale et al., 2013). The same values drive the QT simulator.
const FACTORS: { tr: string; en: string; points: number }[] = [
  { tr: "Yaş ≥68", en: "Age ≥68 years", points: 1 },
  { tr: "Kadın cinsiyet", en: "Female sex", points: 1 },
  { tr: "Loop diüretik kullanımı", en: "Loop diuretic", points: 1 },
  { tr: "Serum potasyum ≤3,5 mEq/L", en: "Serum potassium ≤3.5 mEq/L", points: 2 },
  { tr: "Yatışta QTc ≥450 ms", en: "Admission QTc ≥450 ms", points: 2 },
  { tr: "Akut miyokard enfarktüsü", en: "Acute myocardial infarction", points: 2 },
  { tr: "≥2 QT uzatan ilaç", en: "≥2 QTc-prolonging drugs", points: 3 },
  { tr: "Sepsis", en: "Sepsis", points: 3 },
  { tr: "Kalp yetmezliği", en: "Heart failure", points: 3 },
  { tr: "Bir QT uzatan ilaç", en: "One QTc-prolonging drug", points: 3 },
];
const MAX = FACTORS.reduce((n, f) => n + f.points, 0);

const copy = defineContent({
  tr: {
    crumb: "Tisdale skoru",
    eyebrow: "Klinik standart · QT riski",
    title: "Tisdale QT risk skoru",
    description:
      "Hastanede yatan hastada QTc uzaması riskini yatak başında var olan bilgilerle öngören, on faktörlü bir puanlama sistemi.",
    what: "Ne ölçer",
    whatBody:
      "Skor bir ölçüm değildir; bir olasılık sınıflamasıdır. Ölçülen QTc (Fridericia düzeltmeli, ms) skorun girdilerinden biridir. Bu yüzden ikisi ayrı yazılır: \"QTc 485 ms · Tisdale 11: yüksek risk\".",
    factors: "Risk faktörleri ve puanları",
    factor: "Faktör",
    points: "Puan",
    total: "En yüksek toplam",
    note: "\"İki QT uzatan ilaç\" satırı \"bir QT uzatan ilaç\" puanının üzerine eklenir: iki ilaçta toplam 6 puan.",
    tiers: "Risk sınıfları",
    tier: "Sınıf",
    range: "Puan aralığı",
    low: "Düşük risk",
    moderate: "Orta risk",
    high: "Yüksek risk",
    engine: "PharmaDeux bu eşiklerle ne yapar",
    engineBody:
      "Kural motoru skoru her reçetede yeniden hesaplar ve her puanın hangi faktörden geldiğini gösterir. Aşağıdaki öneriler örnek kural davranışıdır; kurumun klinik politikasına göre ayarlanır ve son karar hekimindir.",
    engineRows: [
      ["≥11", "EKG izlemi ve QT uzatmayan bir alternatifin değerlendirilmesi önerilir."],
      ["7–10", "EKG izlemi ve elektrolit kontrolü önerilir."],
      ["≤6", "Ek QT önlemi gerekmez; rutin izlem sürer."],
    ],
    limits: "Sınırlar",
    limitsBody:
      "Skor hastanede yatan erişkinlerde geliştirilmiş ve doğrulanmıştır; ayaktan hastalarda ve çocuklarda aynı eşiklerin geçerliliği gösterilmemiştir. \"QT uzatan ilaç\" ürün bilgisinde QT uzaması yer alan ilaçtır.",
    try: "Skoru örnek bir hastada denemek için",
    trySim: "QT risk simülatörü",
    related: [
      { href: "/initiatives/pharmadeux#simulator", label: "QT risk simülatörü" },
      { href: "/standartlar/ckd-epi-2021", label: "CKD-EPI 2021" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 entegrasyonu" },
    ],
  },
  en: {
    crumb: "Tisdale score",
    eyebrow: "Clinical standard · QT risk",
    title: "Tisdale QT risk score",
    description:
      "A ten-factor scoring system that predicts QTc prolongation risk in hospitalised patients from information available at the bedside.",
    what: "What it measures",
    whatBody:
      "The score is not a measurement; it is a risk classification. The measured QTc (Fridericia-corrected, ms) is one of its inputs. The two are therefore written separately: \"QTc 485 ms · Tisdale 11: high risk\".",
    factors: "Risk factors and points",
    factor: "Factor",
    points: "Points",
    total: "Maximum total",
    note: "The \"≥2 QTc-prolonging drugs\" row is added on top of the \"one QTc-prolonging drug\" points: 6 points in total for two drugs.",
    tiers: "Risk categories",
    tier: "Category",
    range: "Score range",
    low: "Low risk",
    moderate: "Moderate risk",
    high: "High risk",
    engine: "What PharmaDeux does with these thresholds",
    engineBody:
      "The rule engine recalculates the score on every order and shows which factor each point comes from. The suggestions below are example rule behaviour; they are set to the institution's clinical policy, and the physician makes the final decision.",
    engineRows: [
      ["≥11", "ECG monitoring and a non-QT-prolonging alternative should be considered."],
      ["7–10", "ECG monitoring and an electrolyte check are advised."],
      ["≤6", "No extra QT measure needed; routine monitoring continues."],
    ],
    limits: "Limits",
    limitsBody:
      "The score was developed and validated in hospitalised adults; the same thresholds have not been shown to hold for outpatients or children. A \"QTc-prolonging drug\" is one whose product information lists QT prolongation.",
    try: "To try the score on an example patient, open the",
    trySim: "QT risk simulator",
    related: [
      { href: "/initiatives/pharmadeux#simulator", label: "QT risk simulator" },
      { href: "/standartlar/ckd-epi-2021", label: "CKD-EPI 2021" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 integration" },
    ],
  },
});

export default function TisdaleView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const refs = [...CITATIONS.tisdale.refs, ...CITATIONS.fridericia.refs];
  return (
    <StandardDoc
      locale={locale}
      crumb={c.crumb}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      references={refs}
      related={c.related}
      jsonLd={standardPageJsonLd({
        locale,
        path: PATH,
        name: c.title,
        description: metadata[locale].description as string,
        kind: "medical",
        about: {
          "@type": "MedicalRiskScore",
          name: "Tisdale QT prolongation risk score",
          algorithm: FACTORS.map((f) => `${f.en}: ${f.points}`).join("; "),
          estimatesRiskOf: { "@type": "MedicalCondition", name: "QT interval prolongation" },
        },
        citations: refs,
      })}
    >
      <h2>{c.what}</h2>
      <p>{c.whatBody}</p>

      <h2 className="mt-12">{c.factors}</h2>
      <table>
        <thead>
          <tr>
            <th>{c.factor}</th>
            <th className="text-right">{c.points}</th>
          </tr>
        </thead>
        <tbody>
          {FACTORS.map((f) => (
            <tr key={f.en}>
              <td>{f[locale]}</td>
              <td className="text-right font-mono tabular-nums">+{f.points}</td>
            </tr>
          ))}
          <tr>
            <td className="font-medium text-white">{c.total}</td>
            <td className="text-right font-mono text-white tabular-nums">{MAX}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-[13px]">{c.note}</p>

      <h2 className="mt-12">{c.tiers}</h2>
      <table>
        <thead>
          <tr>
            <th>{c.tier}</th>
            <th className="text-right">{c.range}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-emerald-300">{c.low}</td>
            <td className="text-right font-mono tabular-nums">0–6</td>
          </tr>
          <tr>
            <td className="text-amber-300">{c.moderate}</td>
            <td className="text-right font-mono tabular-nums">7–10</td>
          </tr>
          <tr>
            <td className="text-rose-300">{c.high}</td>
            <td className="text-right font-mono tabular-nums">≥11</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-12">{c.engine}</h2>
      <p>{c.engineBody}</p>
      <table>
        <tbody>
          {c.engineRows.map(([range, text]) => (
            <tr key={range}>
              <td className="w-20 font-mono tabular-nums">{range}</td>
              <td>{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        {c.try} <Link href={localizedPath(locale, "/initiatives/pharmadeux#simulator")}>{c.trySim}</Link>
        {locale === "tr" ? "nü açın." : "."}
      </p>

      <h2 className="mt-12">{c.limits}</h2>
      <p>{c.limitsBody}</p>
    </StandardDoc>
  );
}
