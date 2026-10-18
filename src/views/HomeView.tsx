import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, FileSignature, Network, Pill, ShieldCheck } from "lucide-react";
import InitiativeCard, { type InitiativeCardProps } from "@/components/InitiativeCard";
import Reveal from "@/components/Reveal";
import HeroReveal from "@/components/HeroReveal";
import SectionHeader from "@/components/SectionHeader";
import DetailCell, { InternalCell } from "@/components/DetailCell";
import { JoinedGrid, type SpecRow } from "@/components/SpecCard";
import CtaPanel from "@/components/CtaPanel";
import JsonLd from "@/components/JsonLd";
import { RailMarker } from "@/components/TelemetryRails";
import { homeJsonLd } from "@/lib/structuredData";
import { contactHref } from "@/lib/site";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";
import { metrics, testsLabel, testsNote, trlLabel } from "@/lib/metrics";

// The home page keeps the layout's default title; only description and hreflang are set here.
export const metadata = defineMetadata("/", {
  tr: {
    description:
      "PharmaDeux reçete anında ilaç güvenliğini, Shield fatura gönderilmeden önce SUT/SGK red riskini kontrol eder. Son kararı her zaman yetkili kişi verir.",
  },
  en: {
    description:
      "PharmaDeux checks medication safety at the moment of prescription. Shield checks reimbursement and audit risk before a claim is submitted. A qualified person always makes the final decision.",
  },
});

type Initiative = Omit<InitiativeCardProps, "locale">;
type Step = { stage: string; title: string; body: string; output: string };

// Three contact stages, lowest commitment first; the LOI is the last step, not the first.
const contactStepIcons = [CalendarClock, Network, FileSignature];
// Who-it-is-for cells stay neutral: on the home page only the two product cards carry an accent.
const forWhomIcons = [Pill, ShieldCheck];

const copy = defineContent<{
  /** Clinical stamp above the hero title: verifiable regulatory facts only, typed as shown (no CSS uppercase, keeps "IIa"). */
  stamp: string;
  title: string;
  /** Phrase inside the title rendered in the signature face. */
  titleSignature: string;
  lead: string;
  ctaProducts: string;
  ctaIntro: string;
  ctaIntroPlan: string;
  stepLabel: string;
  heroStats: { value: string; label: string; note?: string }[];
  forWhom: { eyebrow: string; title: string; description: string };
  forWhomCells: { label: string; title: string; body: string; rows: SpecRow[]; links: { href: string; label: string }[] }[];
  products: { eyebrow: string; title: string; description: string };
  initiatives: Initiative[];
  standardsLink: { label: string; text: string };
  pipeline: { eyebrow: string; title: string; description: string; output: string; steps: Step[] };
  pilot: { eyebrow: string; title: string; description: string };
  ctaSecondary: string;
  contactSteps: { title: string; body: string }[];
}>({
  tr: {
    stamp: `CDSS · MDR SINIF IIa HEDEFİ · ${trlLabel("tr")}`,
    title: "İlaç güvenliği ve hastane faturalaması için karar destek yazılımı.",
    titleSignature: "karar destek",
    lead: "PharmaDeux, çoklu ilaç kullanan hastada riskli kombinasyonları reçete anında hekime gösterir. Shield, SUT ve SGK red riskini fatura gönderilmeden önce yakalar. Son kararı yetkili kişi verir; her adım kayda geçer.",
    ctaProducts: "Ürünleri inceleyin",
    ctaIntro: "15 dk tanışma görüşmesi",
    ctaIntroPlan: "15 dk tanışma görüşmesi planlayın",
    stepLabel: "Adım",
    heroStats: [
      { value: String(metrics.safetyPlanes), label: "İlaç güvenliği kontrol başlığı" },
      { value: testsLabel("tr"), label: "Otomatik test", note: testsNote("tr") },
      { value: "FHIR R4", label: "Veri standardı" },
      { value: "Sınıf IIa", label: "MDR hedef sınıfı" },
    ],
    forWhom: {
      eyebrow: "Kimin için",
      title: "Kimin için, hangi sorunu çözüyoruz.",
      description:
        "İki ürün iki ayrı ekibe hizmet eder. Aşağıdaki hedefler tasarım hedefidir; klinik ve finansal etkisi henüz bir kurumda ölçülmedi.",
    },
    forWhomCells: [
      {
        label: "Klinik ekipler ve hekimler",
        title: "Çoklu ilaç kullanan hastada reçete anındaki risk.",
        body: "Beş ya da daha fazla ilaç kullanan, böbrek veya karaciğer fonksiyonu değişen hastada risk tek bir etkileşimden gelmez. PharmaDeux reçete yazılırken kümülatif organ yükünü ve etkileşimi, tetikleyen kural ve eşikle gösterir.",
        rows: [
          { label: "Kim için", value: "Klinik eczacı · servis hekimi · ilaç güvenliği komitesi" },
          { label: "Ne zaman", value: "Reçete yazılırken" },
          { label: "Ne gösterir", value: "Kümülatif organ yükü · etkileşim · renal ve hepatik doz" },
          { label: "Hedef", value: "Bağlama bakan uyarı; uyarı yorgunluğunu azaltmak" },
        ],
        links: [
          { href: "/initiatives/pharmadeux", label: "PharmaDeux'yü inceleyin" },
          { href: "/initiatives/pharmadeux#simulator", label: "QT simülatörünü deneyin" },
          { href: "/standartlar/kumulatif-organ-yuku", label: "Organ yükü standardı" },
        ],
      },
      {
        label: "Gelir döngüsü ve fatura ekipleri",
        title: "Fatura MEDULA'ya gitmeden red riski.",
        body: "Red kararı çoğu zaman fatura gönderildikten sonra gelir. Shield faturayı MEDULA'ya (SGK'nın provizyon ve fatura sistemi) gönderilmeden önce kontrol eder ve riskli kalemi gerekçesiyle uzmana gösterir.",
        rows: [
          { label: "Kim için", value: "Gelir döngüsü · fatura ve provizyon birimleri" },
          { label: "Ne zaman", value: "Fatura gönderilmeden önce" },
          { label: "Ne yakalar", value: "Tanı–işlem uyumsuzluğu · mükerrer işlem · paket aşımı" },
          { label: "Hedef", value: "Red ve kesintiyi gönderimden önce düzeltmek" },
        ],
        links: [
          { href: "/initiatives/shield", label: "Shield'ı inceleyin" },
          { href: "/initiatives/shield#simulator", label: "Fatura simülatörünü deneyin" },
          { href: "/standartlar/sut-fatura-denetimi", label: "SUT denetim standardı" },
        ],
      },
    ],
    products: {
      eyebrow: "Ürünler",
      title: "İki ürün, aynı çalışma biçimi.",
      description:
        "Biri reçeteyle, diğeri faturayla ilgilenir. İkisinde de bir uyarının hangi kuraldan geldiği görünür, aynı girdi aynı sonucu verir ve kararı yetkili kişi verir.",
    },
    initiatives: [
      {
        name: "PharmaDeux CDSS",
        category: "Klinik karar destek (CDS)",
        summary:
          "Reçete anında ilaç-ilaç etkileşimini, kümülatif organ yükünü ve QTc · Tisdale risk skorunu hekime gösterir. Her uyarı onu tetikleyen kural ve eşikle gelir. Hekim uyarıyı gerekçe yazarak geçerse bu karar denetim izine yazılır.",
        specs: [
          { value: String(metrics.safetyPlanes), label: "Güvenlik düzlemi" },
          { value: testsLabel("tr"), label: "Otomatik test" },
          { value: "FHIR R4", label: "Veri standardı" },
          { value: trlLabel("tr"), label: "Teknoloji hazırlık seviyesi" },
        ],
        icon: "pill",
        accent: "teal",
        href: "/initiatives/pharmadeux",
      },
      {
        name: "Shield",
        category: "İdari uyum ve gelir güvencesi",
        summary:
          "Fatura ve provizyon kalemlerini gönderimden önce SUT ve SGK provizyon kurallarına göre denetler. Riskli kalem, gerekçesiyle birlikte uzmanın kuyruğuna düşer.",
        specs: [
          { value: "0–100", label: "Risk skoru, kural katkılarının toplamı" },
          { value: "Gönderim öncesi", label: "Kontrol anı" },
          { value: "ICD-10 · SUT", label: "Eşleştirilen kod sistemleri" },
          { value: "Append-only", label: "Denetim kaydı" },
        ],
        icon: "shield",
        accent: "indigo",
        href: "/initiatives/shield",
      },
    ],
    standardsLink: { label: "Standartlar", text: "Tisdale, CKD-EPI 2021 ve kümülatif organ yükü dahil klinik, teknik ve regülasyon standartları" },
    pipeline: {
      eyebrow: "Doğrulama ve karar",
      title: "Bir bulgu dört adımda karara dönüşür.",
      description: "Hiçbir adım atlanmaz. Her adımın çıktısı bir sonrakinin girdisi olur ve kayda geçer.",
      output: "Çıktı",
      steps: [
        {
          stage: "Girdi",
          title: "Veri standart biçime çevrilir",
          body: "Reçete, laboratuvar sonucu veya fatura kalemi HL7 FHIR R4 kaynaklarına eşlenir. Eksik alan işaretlenir, sessizce atlanmaz.",
          output: "FHIR R4 kaynakları",
        },
        {
          stage: "Değerlendirme",
          title: "Kurallar çalışır",
          body: "Sürümlü kural seti girdiyi değerlendirir. Aynı girdi ve aynı kural sürümü her zaman aynı sonucu verir.",
          output: "Bulgu · kural kimliği · eşik",
        },
        {
          stage: "Onay",
          title: "Kararı uzman verir",
          body: "Hekim, eczacı ya da gelir uzmanı bulguyu gerekçesiyle görür; onaylar, düzeltir veya geri çevirir.",
          output: "Karar · gerekçe",
        },
        {
          stage: "Kayıt",
          title: "Her adım kayda geçer",
          body: "Girdi, kural sürümü, sonuç ve karar yalnızca eklenebilir kayda yazılır. Aylar sonra aynı kararı aynı haliyle yeniden üretebilirsiniz.",
          output: "Append-only kayıt",
        },
      ],
    },
    pilot: {
      eyebrow: "İletişim",
      title: "Tanışma, teknik değerlendirme, pilot.",
      description:
        "İlk adım 15 dakikalık bir görüşmedir ve taahhüt gerektirmez. Pilot protokolü, teknik değerlendirmeden sonra kurumla birlikte yazılır.",
    },
    ctaSecondary: "Pilot protokolünü inceleyin",
    contactSteps: [
      {
        title: "15 dk tanışma görüşmesi",
        body: "İhtiyacınızı dinliyor, ürünün kurumunuza uyup uymadığını konuşuyoruz.",
      },
      {
        title: "Teknik değerlendirme ve mimari inceleme",
        body: "HBYS veya faturalama altyapısı, veri akışı ve kurulum modeli bilgi işlem ekibinizle incelenir.",
      },
      {
        title: "Pilot protokolü (LOI)",
        body: "Kapsam, veri koşulları ve başarı ölçütleri bağlayıcı olmayan bir LOI taslağında birlikte yazılır.",
      },
    ],
  },
  en: {
    stamp: `CDSS · MDR CLASS IIa TARGET · ${trlLabel("en")}`,
    title: "Decision support software for medication safety and hospital billing.",
    titleSignature: "Decision support",
    lead: "PharmaDeux shows the physician risky drug combinations in polypharmacy at the moment of prescription. Shield catches reimbursement risk before a claim is submitted. A qualified person makes the final decision, and every step is recorded.",
    ctaProducts: "See the products",
    ctaIntro: "15-minute intro call",
    ctaIntroPlan: "Book a 15-minute intro call",
    stepLabel: "Step",
    heroStats: [
      { value: String(metrics.safetyPlanes), label: "Medication safety checks" },
      { value: testsLabel("en"), label: "Automated tests", note: testsNote("en") },
      { value: "FHIR R4", label: "Data standard" },
      { value: "Class IIa", label: "MDR target class" },
    ],
    forWhom: {
      eyebrow: "Who it is for",
      title: "Who it is for, and which problem it solves.",
      description:
        "The two products serve two different teams. The goals below are design goals. Their clinical and financial impact has not yet been measured at any institution.",
    },
    forWhomCells: [
      {
        label: "Clinical teams and physicians",
        title: "Risk at the moment of prescribing, for patients on many drugs.",
        body: "For a patient on five or more drugs, or with changing kidney or liver function, risk does not come from one interaction. PharmaDeux shows cumulative organ burden and interactions while the prescription is written, with the rule and threshold that triggered them.",
        rows: [
          { label: "For", value: "Clinical pharmacist · ward physician · medication safety committee" },
          { label: "When", value: "While the prescription is written" },
          { label: "Shows", value: "Cumulative organ burden · interactions · renal and hepatic dosing" },
          { label: "Goal", value: "Alerts that look at context; less alert fatigue" },
        ],
        links: [
          { href: "/initiatives/pharmadeux", label: "See PharmaDeux" },
          { href: "/initiatives/pharmadeux#simulator", label: "Try the QT simulator" },
          { href: "/standartlar/kumulatif-organ-yuku", label: "Organ burden standard" },
        ],
      },
      {
        label: "Revenue cycle and billing teams",
        title: "Rejection risk before the claim reaches MEDULA.",
        body: "A rejection usually arrives after the claim is submitted. Shield checks the claim before it goes to MEDULA (SGK's pre-authorisation and billing system) and shows the risky item, with its reason, to a specialist.",
        rows: [
          { label: "For", value: "Revenue cycle · billing and pre-authorisation units" },
          { label: "When", value: "Before the claim is submitted" },
          { label: "Catches", value: "Diagnosis–procedure mismatch · duplicate procedure · package overrun" },
          { label: "Goal", value: "Fix rejections and deductions before submission" },
        ],
        links: [
          { href: "/initiatives/shield", label: "See Shield" },
          { href: "/initiatives/shield#simulator", label: "Try the claim simulator" },
          { href: "/standartlar/sut-fatura-denetimi", label: "SUT audit standard" },
        ],
      },
    ],
    products: {
      eyebrow: "Products",
      title: "Two products, one way of working.",
      description:
        "One works on prescriptions, the other on claims. Both show which rule raised an alert, give the same result for the same input and leave the decision to a qualified person.",
    },
    initiatives: [
      {
        name: "PharmaDeux CDSS",
        category: "Clinical decision support (CDS)",
        summary:
          "Shows the physician drug–drug interactions, cumulative organ burden and the QTc · Tisdale risk score at the moment of prescription. Each alert comes with the rule and threshold that triggered it. When the physician overrides an alert with a reason, the decision is written to the audit trail.",
        specs: [
          { value: String(metrics.safetyPlanes), label: "Safety planes" },
          { value: testsLabel("en"), label: "Automated tests" },
          { value: "FHIR R4", label: "Data standard" },
          { value: trlLabel("en"), label: "Technology readiness level" },
        ],
        icon: "pill",
        accent: "teal",
        href: "/initiatives/pharmadeux",
      },
      {
        name: "Shield",
        category: "Administrative compliance and revenue assurance",
        summary:
          "Checks billing and provision line items before submission against SUT (Turkey's reimbursement rulebook) and SGK (Social Security Institution) provision rules. A risky line item goes to the specialist's queue together with the reason.",
        specs: [
          { value: "0–100", label: "Risk score, sum of rule contributions" },
          { value: "Pre-claim", label: "When the check runs" },
          { value: "ICD-10 · SUT", label: "Code systems matched" },
          { value: "Append-only", label: "Audit log" },
        ],
        icon: "shield",
        accent: "indigo",
        href: "/initiatives/shield",
      },
    ],
    standardsLink: { label: "Standards", text: "Clinical, technical and regulatory standards, including Tisdale, CKD-EPI 2021 and cumulative organ burden" },
    pipeline: {
      eyebrow: "Verification and decision",
      title: "A finding becomes a decision in four steps.",
      description: "No step is skipped. Each step's output is the next step's input, and each is recorded.",
      output: "Output",
      steps: [
        {
          stage: "Input",
          title: "Data is converted to a standard format",
          body: "A prescription, lab result or claim line is mapped to HL7 FHIR R4 resources. Missing fields are flagged, not silently skipped.",
          output: "FHIR R4 resources",
        },
        {
          stage: "Assessment",
          title: "The rules run",
          body: "A versioned rule set assesses the input. The same input and rule version always give the same result.",
          output: "Finding · rule ID · threshold",
        },
        {
          stage: "Approval",
          title: "A specialist decides",
          body: "The physician, pharmacist or revenue specialist sees the finding with its reason, then approves, corrects or rejects it.",
          output: "Decision · reason",
        },
        {
          stage: "Record",
          title: "Every step is recorded",
          body: "Input, rule version, result and decision are written to an append-only log. Months later, you can reproduce the same decision exactly.",
          output: "Append-only log",
        },
      ],
    },
    pilot: {
      eyebrow: "Contact",
      title: "Intro call, technical review, pilot.",
      description:
        "The first step is a 15-minute call with no commitment. The pilot protocol is written with the institution after the technical review.",
    },
    ctaSecondary: "See the pilot protocol",
    contactSteps: [
      {
        title: "15-minute intro call",
        body: "We listen to what you need and talk about whether the product fits your institution.",
      },
      {
        title: "Technical review and architecture",
        body: "Your HIS or billing infrastructure, data flow and deployment model are reviewed with your IT team.",
      },
      {
        title: "Pilot protocol (LOI)",
        body: "Scope, data conditions and success criteria are written together in a non-binding draft LOI.",
      },
    ],
  },
});

// Wraps the signature phrase (if present in the title) in the signature face.
function withSignature(text: string, signature: string) {
  const i = text.indexOf(signature);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-signature text-white">{signature}</span>
      {text.slice(i + signature.length)}
    </>
  );
}

export default function HomeView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);

  return (
    <main id="top" className="relative flex-1 overflow-x-clip">
      <JsonLd data={homeJsonLd(locale)} />
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <RailMarker scope="container" className="top-2" />
          <HeroReveal>
            <p className="inline-flex rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] tracking-wide text-white/55">
              {c.stamp}
            </p>
          </HeroReveal>

          <HeroReveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] font-serif font-medium tracking-[-0.02em] text-white sm:text-5xl lg:text-[64px]">
              {withSignature(c.title, c.titleSignature)}
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">{c.lead}</p>
          </HeroReveal>

          <HeroReveal delay={0.24} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#platformlar"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
            >
              {c.ctaProducts}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href={href(contactHref("intro"))}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
            >
              {c.ctaIntro}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </HeroReveal>

          <HeroReveal delay={0.32} className="mt-16 sm:mt-20">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline lg:grid-cols-4">
              {c.heroStats.map((s) => (
                <div key={s.label} className="flex flex-col bg-navy-900 p-5">
                  <dt className="order-2 mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                  <dd
                    className={`order-1 text-xl font-medium tracking-[-0.01em] text-white sm:text-2xl ${
                      /\d/.test(s.value) ? "font-mono tabular-nums" : ""
                    }`}
                  >
                    {s.value}
                  </dd>
                  {s.note && <dd className="order-3 mt-1 text-[11px] leading-snug text-white/50">{s.note}</dd>}
                </div>
              ))}
            </dl>
          </HeroReveal>
        </div>
      </section>

      {/* Who it is for: the two teams and their problem, before the technical numbers */}
      <section id="kimin-icin" className="relative scroll-mt-20 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.forWhom} />
          <JoinedGrid className="mt-14" columns="lg:grid-cols-2">
            {c.forWhomCells.map((cell, i) => (
              <DetailCell key={cell.label} icon={forWhomIcons[i]} label={cell.label} title={cell.title} body={cell.body} rows={cell.rows}>
                {cell.links.map((l) => (
                  <InternalCell key={l.href} href={href(l.href)} label={l.label} />
                ))}
              </DetailCell>
            ))}
          </JoinedGrid>
        </div>
      </section>

      {/* Products */}
      <section id="platformlar" className="relative scroll-mt-20 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.products} />
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {c.initiatives.map((item) => (
              <InitiativeCard key={item.name} locale={locale} {...item} />
            ))}
          </div>
          {/* One-line bridge: the eight rules and reference pages live on the standards hub. */}
          <Reveal className="mt-5">
            <Link
              href={href("/standartlar")}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-navy-850 px-5 py-4 transition-colors duration-150 ease-out hover:border-white/15 hover:bg-navy-800 sm:px-8 sm:py-5"
            >
              <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.standardsLink.label}</span>
                <span className="text-[15px] font-medium text-white/85 transition-colors duration-150 ease-out group-hover:text-white">
                  {c.standardsLink.text}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-white/55 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Verification & decision pipeline */}
      <section id="yaklasim" className="relative scroll-mt-20 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={c.pipeline.eyebrow}
            title={c.pipeline.title}
            description={c.pipeline.description}
          />
          <Reveal className="mt-14">
            <ol className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
              {c.pipeline.steps.map((step) => (
                <li key={step.stage} className="flex flex-col bg-navy-850 p-5 sm:p-6">
                  <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{step.stage}</p>
                  <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.01em] text-white">{step.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{step.body}</p>
                  <p className="mt-auto border-t border-hairline pt-3 text-[12px] text-white/55">
                    <span className="text-white/55">{c.pipeline.output} · </span>
                    <span className="font-mono text-white/70">{step.output}</span>
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Contact: three stages, the intro call first */}
      <div id="iletisim" className="relative scroll-mt-20">
        <RailMarker className="top-24 sm:top-32" />
        <CtaPanel
          locale={locale}
          {...c.pilot}
          primaryHref={href(contactHref("intro"))}
          primaryLabel={c.ctaIntroPlan}
          secondaryHref={href(`${contactHref("pilot")}#pilot-protokolu`)}
          secondaryLabel={c.ctaSecondary}
          aside={
            <ol className="divide-y divide-hairline self-center border-y border-hairline">
              {c.contactSteps.map(({ title, body }, i) => {
                const Icon = contactStepIcons[i];
                return (
                  <li key={title} className="grid grid-cols-[20px_1fr] gap-4 py-5">
                    <Icon className="mt-0.5 h-5 w-5 text-white/55" strokeWidth={1.6} aria-hidden="true" />
                    <div>
                      <p className="text-[11px] text-white/50">
                        {c.stepLabel} <span className="font-mono tabular-nums">{i + 1}</span>
                      </p>
                      <h3 className="mt-0.5 text-sm font-medium text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          }
        />
      </div>
    </main>
  );
}
