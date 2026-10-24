import Link from "next/link";
import StandardDoc, { ToolPanel } from "@/components/StandardDoc";
import SutRiskCalculator from "@/components/SutRiskCalculator";
import { standardPageJsonLd } from "@/lib/structuredData";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

const PATH = "/standartlar/sut-fatura-denetimi";
// Same threshold as the Shield console and claim simulator.
const THRESHOLD = 40;

export const metadata = defineMetadata(PATH, {
  tr: {
    title: "SUT fatura denetimi",
    description:
      "Shield'ın gönderim öncesi SUT kural motoru: dört denetim düzlemi, kural katkılarından hesaplanan 0–100 kural skoru, inceleme eşiği ve yalnızca eklenebilir denetim izi.",
  },
  en: {
    title: "SUT billing audit",
    description:
      "Shield's pre-submission SUT rule engine: four audit planes, a 0–100 rule score built from rule contributions, the review threshold and an append-only audit trail.",
  },
});

// Only verifiable sources: no issue numbers or dates written from memory.
const REFS = [
  "Sosyal Güvenlik Kurumu. Sağlık Uygulama Tebliği (SUT) ve ekleri. https://www.sgk.gov.tr/",
  "World Health Organization. International Statistical Classification of Diseases and Related Health Problems, 10th Revision (ICD-10). https://icd.who.int/browse10/",
  "IETF. RFC 5424: The Syslog Protocol. https://www.rfc-editor.org/rfc/rfc5424",
];

const copy = defineContent({
  tr: {
    crumb: "SUT fatura denetimi",
    eyebrow: "İdari standart: geri ödeme denetimi",
    title: "SUT fatura denetimi",
    description:
      "Hastane faturası SGK'ya gitmeden önce Sağlık Uygulama Tebliği (SUT) koşullarına göre nasıl denetlenir: Shield'ın kural motoru, denetim düzlemleri ve kural skoru.",
    status: "Durum",
    statusBody:
      "Shield, Tarık Ziya Eren'in bağımsız projesidir. Geliştirme aşamasındadır. Bu sayfa kural motorunun tasarımını belgeler. Aşağıdaki R- kodlu kurallar örnek kural setindendir; SUT madde numarası veya resmi işlem kodu değildir.",
    engine: "Kural motoru: gönderim öncesi",
    engineBody:
      "SUT, SGK'nın hangi sağlık hizmetini hangi koşulla ödediğini belirleyen tebliğdir. Koşulu sağlamayan kalem kesinti veya ret ile döner. Shield faturayı gönderimden önce sürümlü kurallardan geçirir. Aynı fatura ve aynı kural sürümü her zaman aynı sonucu verir.",
    flow: [
      ["Girdi", "Fatura ve provizyon verisi, tanı kodları, hekim ve branş bilgisi"],
      ["Ön kontrol", "Sürümlü kurallar kod uyumunu, eksik belgeyi, limitleri ve mükerrer kalemleri kontrol eder"],
      ["Kural skoru", "Tetiklenen kuralların katkıları toplanır"],
      ["İnceleme", `Skoru ${THRESHOLD} ve üzeri olan fatura uzman kuyruğuna düşer`],
      ["Karar", "Uzman onaylar, düzeltmeye gönderir veya durdurur"],
      ["Kayıt", "Her adım yalnızca eklenebilir kayda yazılır"],
    ],
    planes: "Dört denetim düzlemi",
    planesBody:
      "SUT ödeme kategorilerine göre çalışır: EK-2B hizmet başı işlemler, EK-2C tanıya dayalı paket işlemler. Kurallar bu kategorilere bağlanır.",
    plane: "Düzlem",
    checks: "Ne kontrol edilir",
    example: "Örnek kural",
    planeRows: [
      [
        "1. Branş ve hekim yetkisi",
        "Bazı işlem ve ilaçları SUT yalnızca belirli uzmanlık dallarına veya uzman hekim raporuna bağlar. Faturadaki hekimin branşı bu koşulla eşleşmelidir.",
        "R-002: Hekim branş kodu eksik",
      ],
      [
        "2. Mükerrer işlem ve paket aşımı",
        "Aynı gün tekrar eden tetkik, paket fiyata dahil kalemin ayrıca faturalanması ve yatış süresinin paket limitini aşması.",
        "R-156: Aynı gün mükerrer tetkik\nR-310: Paket dışı malzeme kalemi\nR-088: Yatış süresi paket limitini aşıyor",
      ],
      [
        "3. Tanı–işlem tutarlılığı",
        "İşlem, faturadaki ICD-10 tanısıyla gerekçelenmelidir. Örnek: I20.9 (angina pektoris) koroner anjiyografiyi gerekçelendirir; M54.5 (bel ağrısı) gerekçelendirmez.",
        "R-112: Tanı–işlem uyumsuzluğu",
      ],
      [
        "4. Tıbbi malzeme ve ilaç koşulları",
        "Rapor şartı, ön onay belgesi, kullanım sınırı ve tekrar aralığı. Belgesi eksik kalem gönderimden önce yakalanır.",
        "R-047: Ön onay belgesi eksik\nR-203: 30 gün içinde tekrar eden işlem",
      ],
    ],
    score: "Kural skoru (0–100)",
    scoreBody:
      "Skor bir tahmin modeli değildir. Her kuralın sabit bir katkısı vardır; skor tetiklenen kuralların katkılarının toplamıdır ve 100'de sınırlanır. Her puan kural kimliğiyle gösterilir, böylece uzman skorun nereden geldiğini görür.",
    scoreExample: "Örnek fatura, kurgusal veri",
    rule: "Kural",
    contribution: "Katkı",
    scoreRows: [
      ["R-112: Tanı–işlem uyumsuzluğu", "+34"],
      ["R-047: Ön onay belgesi eksik", "+26"],
      ["R-203: 30 gün içinde tekrar eden işlem", "+18"],
    ],
    total: "Toplam skor",
    tiers: "Eşikler",
    tier: "Aralık",
    meaning: "Sonuç",
    tierRows: [
      ["≥70", "Yüksek skor, uzman incelemesi", "text-rose-700"],
      [`${THRESHOLD}–69`, "Dikkat, uzman incelemesi", "text-amber-700"],
      [`<${THRESHOLD}`, "Düşük skor, kuyruğa düşmez", "text-emerald-700"],
    ],
    tiersNote: "Kural skoru, tetiklenen kuralların ağırlıklarının toplamıdır; SGK ret olasılığı değildir. Shield kendi başına gönderim kararı vermez. Eşik kurumun politikasına göre ayarlanır; son karar inceleme uzmanınındır.",
    security: "Veri güvenliği ve denetim izi",
    securityBody:
      "Fatura verisi kişisel sağlık verisidir ve KVKK (Kişisel Verilerin Korunması Kanunu) kapsamındadır. Aşağıdaki kurulum ve kayıt seçenekleri platform mimarisinin tasarım hedefidir; Shield için henüz sahada doğrulanmadı.",
    securityRows: [
      ["Kurulum", "Kurum içi (on-prem) veya kuruma ayrılmış izole VPC"],
      ["İzolasyon", "Her kurumun verisi, kuyruğu ve kaydı ayrı tutulur; kurum kimliği her sorguda zorunludur"],
      ["Erişim", "Rol bazında, en az yetki ilkesiyle (kurum yöneticisi, gelir analisti, inceleme uzmanı, denetçi)"],
      ["Kayıt", "Yalnızca eklenebilir (append-only) denetim izi; Syslog (RFC 5424) ile kurumun log sistemine aktarım"],
      ["Yeniden üretim", "Kayıt, kararın verildiği kural sürümünü taşır; aynı girdiyle aynı sonuç yeniden üretilir"],
    ],
    try: "Kuralları örnek bir faturada denemek için",
    trySim: "fatura simülatörü",
    tryConsole: "inceleme konsolu",
    related: [
      { href: "/initiatives/shield#simulator", label: "Fatura simülatörü" },
      { href: "/initiatives/shield#konsol", label: "İnceleme konsolu" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 entegrasyonu" },
    ],
  },
  en: {
    crumb: "SUT billing audit",
    eyebrow: "Administrative standard: reimbursement audit",
    title: "SUT billing audit",
    description:
      "How a hospital claim is checked against the Health Implementation Communiqué (SUT) before it goes to SGK, Turkey's Social Security Institution: Shield's rule engine, audit planes and rule score.",
    status: "Status",
    statusBody:
      "Shield is an independent project by Tarık Ziya Eren. It is in development. This page documents the rule engine design. The R- rules below come from the example rule set. They are not SUT article numbers or official procedure codes.",
    engine: "Rule engine: pre-submission",
    engineBody:
      "The SUT is the communiqué that sets which health services SGK pays for, and under which conditions. An item that misses a condition comes back as a deduction or a rejection. Shield runs the claim through versioned rules before submission. The same claim and the same rule version always give the same result.",
    flow: [
      ["Input", "Claim and provision data, diagnosis codes, physician and specialty"],
      ["Pre-check", "Versioned rules check code consistency, missing documents, limits and duplicate items"],
      ["Rule score", "Contributions of the triggered rules are added up"],
      ["Review", `Claims scoring ${THRESHOLD} or more go to the specialist queue`],
      ["Decision", "The specialist approves, returns for correction or holds"],
      ["Record", "Every step is written to an append-only record"],
    ],
    planes: "Four audit planes",
    planesBody:
      "The SUT works by payment category: EK-2B fee-for-service procedures and EK-2C diagnosis-based package procedures. Rules are bound to these categories.",
    plane: "Plane",
    checks: "What is checked",
    example: "Example rule",
    planeRows: [
      [
        "1. Specialty and physician authority",
        "The SUT ties some procedures and drugs to specific specialties or to a specialist report. The billing physician's specialty must match that condition.",
        "R-002: Physician specialty code missing",
      ],
      [
        "2. Duplicate procedures and package overrun",
        "A test repeated on the same day, an item included in the package price billed separately, and a length of stay beyond the package limit.",
        "R-156: Duplicate test on the same day\nR-310: Out-of-package supply item\nR-088: Length of stay exceeds package limit",
      ],
      [
        "3. Diagnosis–procedure consistency",
        "The procedure must be justified by the ICD-10 diagnosis on the claim. Example: I20.9 (angina pectoris) justifies coronary angiography, but M54.5 (low back pain) does not.",
        "R-112: Diagnosis–procedure mismatch",
      ],
      [
        "4. Medical supply and drug conditions",
        "Report requirement, prior authorisation, usage limit and repeat interval. An item missing its document is caught before submission.",
        "R-047: Prior authorisation missing\nR-203: Procedure repeated within 30 days",
      ],
    ],
    score: "Rule score (0–100)",
    scoreBody:
      "The score is not a predictive model. Each rule has a fixed contribution, and the score is the sum of the triggered rules' contributions, capped at 100. Every point is shown with its rule ID, so the specialist sees where the score comes from.",
    scoreExample: "Example claim, fictional data",
    rule: "Rule",
    contribution: "Contribution",
    scoreRows: [
      ["R-112: Diagnosis–procedure mismatch", "+34"],
      ["R-047: Prior authorisation missing", "+26"],
      ["R-203: Procedure repeated within 30 days", "+18"],
    ],
    total: "Total score",
    tiers: "Thresholds",
    tier: "Range",
    meaning: "Outcome",
    tierRows: [
      ["≥70", "High score, specialist review", "text-rose-700"],
      [`${THRESHOLD}–69`, "Caution, specialist review", "text-amber-700"],
      [`<${THRESHOLD}`, "Low score, not queued", "text-emerald-700"],
    ],
    tiersNote: "The rule score is the sum of the weights of the rules that fired; it is not a probability of SGK rejection. Shield does not make the submission decision on its own. The threshold follows the institution's policy, and the review specialist makes the final decision.",
    security: "Data security and audit trail",
    securityBody:
      "Claim data is personal health data and falls under KVKK, Turkey's personal data protection law. The deployment and logging options below are design targets of the platform architecture. They have not yet been validated in the field for Shield.",
    securityRows: [
      ["Deployment", "On-premises or an isolated VPC dedicated to the institution"],
      ["Isolation", "Each institution's data, queue and record are kept separate; the institution ID is required on every query"],
      ["Access", "Role-based, least privilege (institution admin, revenue analyst, review specialist, auditor)"],
      ["Record", "Append-only audit trail; forwarding to the institution's log system over Syslog (RFC 5424)"],
      ["Reproduction", "The record carries the rule version behind each decision; the same input reproduces the same result"],
    ],
    try: "To try the rules on an example claim, open the",
    trySim: "claim simulator",
    tryConsole: "review console",
    related: [
      { href: "/initiatives/shield#simulator", label: "Claim simulator" },
      { href: "/initiatives/shield#konsol", label: "Review console" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 integration" },
    ],
  },
});

export default function SutAuditView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const total = Math.min(100, c.scoreRows.reduce((n, [, w]) => n + Number(w), 0));
  return (
    <StandardDoc
      locale={locale}
      path={PATH}
      crumb={c.crumb}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      toc={[
        { id: "durum", label: c.status },
        { id: "kural-motoru", label: c.engine },
        { id: "duzlemler", label: c.planes },
        { id: "kural-skoru", label: c.score },
        { id: "guvenlik", label: c.security },
      ]}
      references={REFS}
      related={c.related}
      jsonLd={standardPageJsonLd({
        locale,
        path: PATH,
        name: c.title,
        description: metadata[locale].description as string,
        kind: "technical",
        about: { "@type": "Legislation", name: "Sağlık Uygulama Tebliği (SUT)", legislationJurisdiction: "TR" },
        citations: REFS,
      })}
    >
      <h2 id="durum">{c.status}</h2>
      <p>{c.statusBody}</p>

      <h2 id="kural-motoru" className="mt-12">{c.engine}</h2>
      <p>{c.engineBody}</p>
      <table>
        <tbody>
          {c.flow.map(([step, text]) => (
            <tr key={step}>
              <td className="w-32 font-medium text-ink">{step}</td>
              <td>{text}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="duzlemler" className="mt-12">{c.planes}</h2>
      <p>{c.planesBody}</p>
      <table>
        <thead>
          <tr>
            <th>{c.plane}</th>
            <th>{c.checks}</th>
            <th>{c.example}</th>
          </tr>
        </thead>
        <tbody>
          {c.planeRows.map(([plane, checks, rules]) => (
            <tr key={plane}>
              <td className="font-medium text-ink">{plane}</td>
              <td>{checks}</td>
              <td className="text-[14px] whitespace-pre-line">{rules}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="kural-skoru" className="mt-12">{c.score}</h2>
      <p>{c.scoreBody}</p>
      <table>
        <caption>{c.scoreExample}</caption>
        <thead>
          <tr>
            <th>{c.rule}</th>
            <th className="text-right">{c.contribution}</th>
          </tr>
        </thead>
        <tbody>
          {c.scoreRows.map(([rule, w]) => (
            <tr key={rule}>
              <td>{rule}</td>
              <td className="text-right font-mono tabular-nums">{w}</td>
            </tr>
          ))}
          <tr>
            <td className="font-medium text-ink">{c.total}</td>
            <td className="text-right font-mono text-rose-700 tabular-nums">{total}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-8">{c.tiers}</h3>
      <table>
        <thead>
          <tr>
            <th>{c.tier}</th>
            <th>{c.meaning}</th>
          </tr>
        </thead>
        <tbody>
          {c.tierRows.map(([range, text, tone]) => (
            <tr key={range}>
              <td className="w-24 font-mono tabular-nums">{range}</td>
              <td className={tone}>{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{c.tiersNote}</p>

      <ToolPanel>
        <SutRiskCalculator locale={locale} />
      </ToolPanel>
      <p>
        {c.try} <Link href={localizedPath(locale, "/initiatives/shield#simulator")}>{c.trySim}</Link>
        {locale === "tr" ? "nü veya " : " or the "}
        <Link href={localizedPath(locale, "/initiatives/shield#konsol")}>{c.tryConsole}</Link>
        {locale === "tr" ? "nu açın." : "."}
      </p>

      <h2 id="guvenlik" className="mt-12">{c.security}</h2>
      <p>{c.securityBody}</p>
      <table>
        <tbody>
          {c.securityRows.map(([k, v]) => (
            <tr key={k}>
              <td className="w-32 font-medium text-ink">{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StandardDoc>
  );
}
