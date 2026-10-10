import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Receipt, Stethoscope } from "lucide-react";
import InitiativeCard, { type InitiativeCardProps } from "@/components/InitiativeCard";
import StandardsGrid from "@/components/StandardsGrid";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import CtaPanel from "@/components/CtaPanel";
import JsonLd from "@/components/JsonLd";
import { RailMarker } from "@/components/TelemetryRails";
import { homeJsonLd } from "@/lib/structuredData";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

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

const audienceIcons = [Stethoscope, Receipt, Building2];

const copy = defineContent<{
  eyebrow: string;
  title: string;
  titleMuted: string;
  lead: string;
  ctaProducts: string;
  ctaPilot: string;
  heroStats: { value: string; label: string }[];
  products: { eyebrow: string; title: string; description: string };
  initiatives: Initiative[];
  standards: { eyebrow: string; title: string; description: string };
  pipeline: { eyebrow: string; title: string; description: string; output: string; steps: Step[] };
  pilot: { eyebrow: string; title: string; description: string };
  audiences: { title: string; body: string }[];
}>({
  tr: {
    eyebrow: "LavieuxLabs · Sağlık teknolojileri Ar-Ge",
    title: "İlaç güvenliği ve hastane faturalaması için",
    titleMuted: "karar destek yazılımı.",
    lead: "PharmaDeux, çoklu ilaç tedavisinde riskli kombinasyonları reçete anında hekime gösterir. Shield, SUT ve SGK red risklerini fatura gönderilmeden önce yakalar. İkisinde de son kararı yetkili kişi verir ve her adım kayda geçer.",
    ctaProducts: "Ürünleri inceleyin",
    ctaPilot: "Pilot başvurusu (LOI)",
    heroStats: [
      { value: "18", label: "İlaç güvenliği kontrol başlığı" },
      { value: "2.480+", label: "Otomatik test" },
      { value: "FHIR R4", label: "Veri standardı" },
      { value: "Sınıf IIa", label: "MDR hedef sınıfı" },
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
        category: "Klinik karar destek · ilaç güvenliği",
        summary:
          "Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi. Her uyarı, onu tetikleyen kural ve eşik değeriyle birlikte gösterilir.",
        specs: [
          { value: "18", label: "Güvenlik düzlemi" },
          { value: "2.480+", label: "Otomatik test" },
          { value: "FHIR R4", label: "Veri standardı" },
          { value: "THS 4", label: "Teknoloji hazırlık seviyesi" },
        ],
        icon: "pill",
        accent: "teal",
        href: "/initiatives/pharmadeux",
      },
      {
        name: "Shield",
        category: "Gelir bütünlüğü · provizyon denetimi",
        summary:
          "Hastane fatura ve provizyon süreçlerindeki SUT/SGK red risklerini işlem öncesinde tespit eden kurumsal denetim katmanı. Riskli kalem, gerekçesiyle birlikte uzmanın kuyruğuna düşer.",
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
    standards: {
      eyebrow: "Standartlar",
      title: "İki üründe de uyduğumuz sekiz kural.",
      description:
        "Hangi standardı referans aldığımızı ve her birinde nerede olduğumuzu tek tek yazdık. Henüz tamamlanmamış olanları da öyle belirttik.",
    },
    pipeline: {
      eyebrow: "Doğrulama ve karar",
      title: "Bir öneri dört adımda karara dönüşür.",
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
      eyebrow: "Pilot program",
      title: "Pilot çalışma için bize yazın.",
      description:
        "Kapsamı, hangi veriye erişileceğini ve neyi başarı sayacağımızı bağlayıcı olmayan bir Niyet Mektubu (LOI) ile birlikte yazıyoruz.",
    },
    audiences: [
      {
        title: "Klinik ekipler",
        body: "Klinik eczacılık birimleri, ilaç güvenliği komiteleri ve servis hekimleri.",
      },
      {
        title: "Gelir döngüsü ekipleri",
        body: "Faturalama, provizyon ve SGK geri ödeme işlerini yürüten birimler.",
      },
      {
        title: "Akademik ortaklar",
        body: "Üniversite hastaneleri ve ortak doğrulama çalışması yapmak isteyen araştırma grupları.",
      },
    ],
  },
  en: {
    eyebrow: "LavieuxLabs · Health technology R&D",
    title: "Decision support software for",
    titleMuted: "medication safety and hospital billing.",
    lead: "PharmaDeux shows the physician risky drug combinations in polypharmacy at the moment of prescription. Shield catches reimbursement and audit risks before a claim is submitted. In both, a qualified person makes the final decision and every step is recorded.",
    ctaProducts: "See the products",
    ctaPilot: "Apply for a pilot (LOI)",
    heroStats: [
      { value: "18", label: "Medication safety checks" },
      { value: "2,480+", label: "Automated tests" },
      { value: "FHIR R4", label: "Data standard" },
      { value: "Class IIa", label: "MDR target class" },
    ],
    products: {
      eyebrow: "Products",
      title: "Two products, one way of working.",
      description:
        "One works on prescriptions, the other on claims. In both, you can see which rule raised an alert, the same input gives the same result, and a qualified person decides.",
    },
    initiatives: [
      {
        name: "PharmaDeux CDSS",
        category: "Clinical decision support · medication safety",
        summary:
          "Clinical decision support software alerting physicians to cumulative organ burden and toxicity at the moment of prescription. Each alert is shown with the rule and threshold that triggered it.",
        specs: [
          { value: "18", label: "Safety planes" },
          { value: "2,480+", label: "Automated tests" },
          { value: "FHIR R4", label: "Data standard" },
          { value: "TRL 4", label: "Technology readiness level" },
        ],
        icon: "pill",
        accent: "teal",
        href: "/initiatives/pharmadeux",
      },
      {
        name: "Shield",
        category: "Revenue integrity · claim pre-check",
        summary:
          "Pre-claim revenue integrity platform identifying reimbursement and audit risks before submission. A risky line item goes to the specialist's queue together with the reason.",
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
    standards: {
      eyebrow: "Standards",
      title: "Eight rules both products follow.",
      description:
        "We list each standard we work against and where we stand on it. Where something is not finished yet, we say so.",
    },
    pipeline: {
      eyebrow: "Verification and decision",
      title: "A suggestion becomes a decision in four steps.",
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
      eyebrow: "Pilot programme",
      title: "Write to us about a pilot.",
      description:
        "Together we write down the scope, which data is accessed and what counts as success, in a non-binding Letter of Intent (LOI).",
    },
    audiences: [
      {
        title: "Clinical teams",
        body: "Clinical pharmacy units, medication safety committees and ward physicians.",
      },
      {
        title: "Revenue cycle teams",
        body: "Units handling billing, pre-authorisation and SGK reimbursement.",
      },
      {
        title: "Academic partners",
        body: "University hospitals and research groups that want to run a joint validation study.",
      },
    ],
  },
});

export default function HomeView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);

  return (
    <main id="top" className="relative flex-1 overflow-x-clip">
      <JsonLd data={homeJsonLd(locale)} />
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <RailMarker scope="container" className="-top-1" />
          <Reveal>
            <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-white sm:text-5xl lg:text-[64px]">
              {c.title} <span className="text-white/50">{c.titleMuted}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">{c.lead}</p>
          </Reveal>

          <Reveal delay={0.24} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#platformlar"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
            >
              {c.ctaProducts}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href={href("/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
            >
              {c.ctaPilot}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal delay={0.32} className="mt-16 sm:mt-20">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] lg:grid-cols-4">
              {c.heroStats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse bg-navy-900 p-5">
                  <dt className="mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                  <dd
                    className={`text-xl font-medium tracking-[-0.01em] text-white sm:text-2xl ${
                      /\d/.test(s.value) ? "font-mono tabular-nums" : ""
                    }`}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
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
        </div>
      </section>

      {/* Standards */}
      <section id="standartlar" className="relative scroll-mt-20 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.standards} />
          <div className="mt-14">
            <StandardsGrid locale={locale} />
          </div>
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
            <ol className="grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
              {c.pipeline.steps.map((step) => (
                <li key={step.stage} className="flex flex-col bg-navy-850 p-5 sm:p-6">
                  <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{step.stage}</p>
                  <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.01em] text-white">{step.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{step.body}</p>
                  <p className="mt-auto border-t border-white/[0.06] pt-3 text-[12px] text-white/55">
                    <span className="text-white/55">{c.pipeline.output} · </span>
                    <span className="font-mono text-white/70">{step.output}</span>
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Pilot / LOI */}
      <div id="iletisim" className="relative scroll-mt-20">
        <RailMarker className="top-24 sm:top-32" />
        <CtaPanel
          locale={locale}
          {...c.pilot}
          primaryHref={href("/contact")}
          primaryLabel={c.ctaPilot}
          aside={
            <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {c.audiences.map(({ title, body }, i) => {
                const Icon = audienceIcons[i];
                return (
                  <li key={title} className="flex gap-4 py-5">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/55" strokeWidth={1.6} aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-medium text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/50">{body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          }
        />
      </div>
    </main>
  );
}
