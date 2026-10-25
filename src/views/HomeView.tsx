import Link from "next/link";
import type { ReactNode } from "react";
import { Pill, ShieldCheck, type LucideIcon } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import {
  ClaimScoreFigure,
  DecisionTraceFigure,
  PrescriptionCheckFigure,
} from "@/components/home/HomeFigures";
import { homeJsonLd } from "@/lib/structuredData";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";
import { trlLabel } from "@/lib/metrics";

// The home page keeps the layout's default title; only description and hreflang are set here.
export const metadata = defineMetadata("/", {
  tr: {
    description:
      "LavieuxLabs, ilaç güvenliği ve hastane faturalaması için iki prototip geliştiren bağımsız bir öğrenci Ar-Ge girişimidir.",
  },
  en: {
    description:
      "LavieuxLabs is an independent student R&D venture developing two prototypes for medication safety and hospital billing.",
  },
});

/*
 * Home page on the paper surface (Academic Editorial). Communication order: problem → approach → the two
 * projects, with one clear contact action after the projects.
 * Type roles: Newsreader for the page title, section titles, project and person names and step numerals;
 * IBM Plex Sans for all running text, labels and tables; IBM Plex Mono only for numbers that are data.
 * Type scale: 13 caption · 14 small · 15 secondary · 17 body · 20 sub-heading · serif 30/40 section · 36/58 page.
 * Colour: ink on paper; a product's accent (its dark step) appears only on its own name; clinical and review
 * states keep their own colours inside figures.
 */

const LINK =
  "underline decoration-ink/30 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
// Standalone text links get a 44px touch target; inline links inside sentences do not need one.
const TEXT_ACTION = `inline-flex min-h-11 items-center text-[15px] font-medium text-ink ${LINK}`;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
const BUTTON = `inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-ink-2 ${FOCUS}`;

type Row = { label: string; value: string };
type Project = {
  name: string;  purpose: string;
  body: string;
  rows: Row[];
  link: string;
};
/** One product's workflow in three steps; the last step is the person who decides. */
type Workflow = { name: string; area: string; steps: [string, string, string] };

const copy = defineContent<{
  hero: {
    kicker: string;
    title: string;
    lead: string;
    secondary: string;
    workflowsLabel: string;
    workflows: [Workflow, Workflow];
    summaryTitle: string;
    summary: Row[];
  };
  problem: { label: string; title: string; pharma: { title: string; body: string[] }; shield: { title: string; body: string[] } };
  approach: { label: string; title: string; intro: string; steps: { title: string; body: string }[] };
  projects: { label: string; title: string; intro: string; pharma: Project; shield: Project };
  bridge: { title: string; body: string; primary: string };
  benefit: {
    label: string;
    title: string;
    intro: string;
    targetTitle: string;
    columns: { hypothesis: string; measure: string; status: string };
    targets: { hypothesis: string; measure: string }[];
    notMeasured: string;
  };
  team: { label: string; title: string; listLabel: string; more: string };
  collab: {
    label: string;
    title: string;
    intro: string;
    modes: { title: string; body: string; meta: string; link: string }[];
    giveTitle: string;
    give: string[];
    askTitle: string;
    ask: string[];
    legal: string;
    cta: string;
    email: string;
    noPatientData: string;
  };
}>({
  tr: {
    hero: {
      kicker: "Bağımsız öğrenci Ar-Ge girişimi, Konya",
      title: "İlaç güvenliği ve hastane faturalaması için iki yazılım projesi.",
      lead: "PharmaDeux ilaç güvenliğine, Shield hastane faturalamasına odaklanır. İkisi de prototiptir ve henüz gerçek ortamda doğrulanmamıştır.",
      secondary: "Projeleri inceleyin",
      workflowsLabel: "İki iş akışı",
      workflows: [
        { name: "PharmaDeux", area: "İlaç güvenliği", steps: ["Reçete", "Risk kontrolü", "Hekim veya eczacı değerlendirir"] },
        { name: "Shield", area: "Hastane faturalaması", steps: ["Fatura kalemi", "Uygunluk kontrolü (SUT, SGK)", "Fatura uzmanı inceler"] },
      ],
      summaryTitle: "Kısaca",
      summary: [
        {
          label: "Kim",
          value: "Konya Teknik Üniversitesi öğrencilerinin kurduğu bağımsız bir girişim. Üniversitenin birimi değil; henüz şirketleşmedi.",
        },
        { label: "Projeler", value: "PharmaDeux ilaç güvenliğine, Shield hastane faturalamasına odaklanır." },
        {
          label: "Aşama",
          value: `PharmaDeux: ${trlLabel("tr")} (teknoloji hazırlık seviyesi, 1–9 ölçeği), ekibin kendi değerlendirmesi; bağımsız bir değerlendirme yapılmadı. Shield: prototip.`,
        },
        { label: "Klinik ve kurumsal doğrulama", value: "Henüz yapılmadı" },
        { label: "Düzenleyici durum", value: "PharmaDeux için MDR Sınıf IIa hedefi, CE işareti yok" },
        { label: "Aradığımız", value: "Araştırma ve geçmiş verilerle doğrulama ortakları" },
      ],
    },
    problem: {
      label: "Sorun",
      title: "Hastanede iki yerde önlenebilir hata geç fark ediliyor.",
      pharma: {
        title: "Reçetede: çoklu ilaç kullanımı",
        body: [
          "Beş ya da daha fazla ilaç kullanan hastada olası etkileşim sayısı hızla artar. Bunları her reçetede elle taramak gerçekçi değil.",
          "Risk çoğu zaman tek bir ilaç çiftinden gelmez; aynı organa binen toplam yük ve değişen böbrek fonksiyonu birlikte değerlendirilmelidir. eGFR'si 90 olan hastada güvenli olan reçete, 30'da doz ayarı gerektirebilir.",
        ],
      },
      shield: {
        title: "Faturada: gönderimden sonra gelen red",
        body: [
          "Red ve kesinti kararı çoğu zaman fatura gönderildikten sonra gelir. İtiraz, düzeltme ve yeniden gönderim ödemeyi geciktirir ve ekibin zamanını alır.",
          "Red nedenlerinin bir kısmı eksik belge, kod uyumsuzluğu ya da limit aşımı gibi önlenebilir hatalardır.",
        ],
      },
    },
    approach: {
      label: "Çözüm yaklaşımı",
      title: "Her uyarı, onu tetikleyen kuralla birlikte gelir.",
      intro:
        "Kaynağı belli kurallar aynı girdiye aynı sonucu verir. Uyarının nedeni görünür, son karar uzmanda kalır.",
      steps: [
        {
          title: "Veriyi ortak bir biçime çeviriyoruz",
          body: "Reçete, laboratuvar sonucu ya da fatura kalemi sağlık sistemleri arasında kullanılan uluslararası bir standarda (HL7 FHIR R4) çevrilir. Eksik bilgi atlanmaz, işaretlenir.",
        },
        {
          title: "Kurallar kontrol ediyor",
          body: "Her kural bir kılavuza, ürün bilgisine ya da mevzuata dayanır ve bir sürüm numarası taşır.",
        },
        {
          title: "Kararı uzman veriyor",
          body: "Hekim, eczacı ya da fatura uzmanı bulguyu nedeniyle görür; kabul eder, düzeltir ya da gerekçe yazarak geçer.",
        },
        {
          title: "Her adım kayda geçiyor",
          body: "Girdi, kural sürümü ve karar yalnızca eklenebilen bir kayda yazılır; bir karar sonradan aynı hâliyle gösterilebilir.",
        },
      ],
    },
    projects: {
      label: "Shield ve PharmaDeux",
      title: "İki proje, iki farklı kullanıcı için.",
      intro: "Biri reçeteyi yazan hekime, diğeri faturayı hazırlayan birime yöneliktir. İkisi de geliştirme aşamasında ve henüz piyasaya sunulmadı.",
      pharma: {
        name: "PharmaDeux",        purpose: "İlaç güvenliği ve klinik karar desteği",
        body: "Reçetedeki etkileşim, organ yükü ve doz risklerini kontrol eder. Tedavi kararı vermez; nedeni hekime gösterir.",
        rows: [
          { label: "Kimin için", value: "Klinik eczacı, servis hekimi, ilaç güvenliği ekipleri" },
          { label: "Bugün", value: "Kurallar sentetik hasta profilleriyle test ediliyor" },
          { label: "Sıradaki adım", value: "Geçmiş vakalarla retrospektif doğrulama" },
          { label: "Düzenleyici durum", value: "MDR Sınıf IIa hedefi, CE işareti yok" },
        ],
        link: "PharmaDeux'u ayrıntılı inceleyin",
      },
      shield: {
        name: "Shield",        purpose: "Hastane faturalaması, SUT uygunluğu ve gelir bütünlüğü",
        body: "Fatura kalemlerini gönderimden önce SUT ve SGK kurallarıyla kontrol eder. Riskli kalemi nedeni ile birlikte uzmana iletir.",
        rows: [
          { label: "Kimin için", value: "Faturalama, provizyon ve gelir döngüsü ekipleri" },
          { label: "Bugün", value: "Dört denetim düzleminden üçü uygulandı ve sentetik faturalarla test ediliyor" },
          { label: "Sıradaki adım", value: "Geçmiş faturalarda red yakalama ve yanlış pozitif oranının ölçülmesi" },
          { label: "Gerçek fatura", value: "Henüz doğrulanmadı" },
        ],
        link: "Shield'ı ayrıntılı inceleyin",
      },
    },
    bridge: {
      title: "Kurumunuzda benzer bir sorun varsa konuşalım.",
      body: "İlk görüşmede kurumunuzun ihtiyacını ve projelerin bugünkü durumunu netleştiririz.",
      primary: "İletişime geçin",
    },
    benefit: {
      label: "Potansiyel fayda",
      title: "Ne ölçüldü, ne henüz ölçülmedi.",
      intro:
        "İki projede de bugüne kadar yalnızca yazılımın kendisi test edildi. Hastaya, hekime ya da kuruma etkisi henüz hiçbir kurumda ölçülmedi. Aşağıdaki hipotezler, her projenin bir ortak kurumla test etmek istediği hedeflerdir.",
      targetTitle: "Test edilmek istenen hipotezler",
      columns: { hypothesis: "Hipotez", measure: "Nasıl ölçülecek", status: "Durum" },
      targets: [
        {
          hypothesis: "Bağlamı hesaba katan uyarılar, gereksiz uyarı sayısını azaltabilir.",
          measure: "Reçete başına uyarı sayısı, pozitif prediktif değer, bağımsız uzman paneliyle uyum",
        },
        {
          hypothesis: "Önlenebilir red nedenlerinin bir kısmı gönderimden önce yakalanabilir.",
          measure: "Red yakalama oranı, yanlış pozitif oranı, uzmana düşen inceleme yükü",
        },
      ],
      notMeasured: "Ölçülmedi",
    },
    team: {
      label: "Ekibimiz",
      title: "Bağımsız bir öğrenci Ar-Ge girişimi.",
      listLabel: "Ekip üyeleri",
      more: "Ekip ve çalışma biçimimiz",
    },
    collab: {
      label: "İş birliği",
      title: "Kurumunuzla nasıl çalışabiliriz.",
      intro:
        "Hastaneler, üniversiteler ve araştırma kuruluşlarıyla çalışmak istiyoruz. İlk adım 15 dakikalık bir görüşmedir ve taahhüt gerektirmez. Bir doğrulama çalışmasının protokolü, teknik değerlendirmeden sonra kurumla birlikte yazılır.",
      modes: [
        {
          title: "Tanışma görüşmesi",
          body: "İhtiyacınızı dinliyor, prototipi örnek bir vaka ya da fatura üzerinde gösteriyoruz.",
          meta: "15 dakika, taahhüt yok",
          link: "15 dk tanışma görüşmesi",
        },
        {
          title: "Akademik araştırma",
          body: "Kural setlerinin kaynağa göre gözden geçirilmesi, ortak doğrulama protokolü ve hakemli yayın.",
          meta: "Etik kurul onayı ve veri protokolüyle",
          link: "İş birliği önerin",
        },
        {
          title: "Retrospektif doğrulama",
          body: "Anonimleştirilmiş geçmiş reçete ya da faturalar üzerinde, kurumun kendi altyapısında ölçüm.",
          meta: "Bağlayıcı olmayan bir niyet mektubuyla (LOI) başlar",
          link: "Pilot başvurusu yapın",
        },
      ],
      giveTitle: "Bir doğrulama çalışmasında kurumunuzun alacağı",
      give: [
        "Kendi geçmiş verinizde ölçülen, kurumla birlikte yazılan bir rapor",
        "Protokolün yazımına katılım ve ortak yayın",
        "Verinin kurum altyapısında kalması hedeflenerek tasarlanan bir pilot",
      ],
      askTitle: "Bir doğrulama çalışması için gerekenler",
      ask: [
        "Kurumunuzun etik kurul onayı",
        "Anonimleştirilmiş geçmiş veri ve veri işleme sözleşmesi",
        "Bilgi işlem ekibinizle bir teknik değerlendirme",
      ],
      legal:
        "LavieuxLabs henüz şirketleşmedi. Niyet Mektubu (LOI) bağlayıcı değildir ve bir sözleşme yerine geçmez. Bir doğrulama çalışmasında sözleşmeyi hangi tarafın imzalayacağı ve veri işleme koşulları, gerekli taraflar ve yetkili hukuk danışmanlarıyla netleştirilir.",
      cta: "15 dk tanışma görüşmesi",
      email: "ya da doğrudan yazın:",
      noPatientData: "Lütfen iletişim kanallarımızdan hasta verisi göndermeyin.",
    },
  },
  en: {
    hero: {
      kicker: "Independent student R&D venture, Konya",
      title: "Two software projects for medication safety and hospital billing.",
      lead: "PharmaDeux focuses on medication safety; Shield focuses on hospital billing. Both are prototypes and have not yet been validated in real settings.",
      secondary: "See the projects",
      workflowsLabel: "Two workflows",
      workflows: [
        { name: "PharmaDeux", area: "Medication safety", steps: ["Prescription", "Risk check", "Physician or pharmacist reviews"] },
        { name: "Shield", area: "Hospital billing", steps: ["Claim line", "Compliance check (SUT, SGK)", "Billing specialist reviews"] },
      ],
      summaryTitle: "In brief",
      summary: [
        {
          label: "Who",
          value: "An independent venture founded by students of Konya Technical University. Not a university unit; not incorporated yet.",
        },
        { label: "Projects", value: "PharmaDeux focuses on medication safety; Shield focuses on hospital billing." },
        {
          label: "Stage",
          value: `PharmaDeux: ${trlLabel("en")} (technology readiness level, 1–9 scale), the team's own assessment; no independent assessment has been made. Shield: prototype.`,
        },
        { label: "Clinical and institutional validation", value: "Not done yet" },
        { label: "Regulatory status", value: "MDR Class IIa target for PharmaDeux, no CE mark" },
        { label: "Looking for", value: "Research partners and institutions to validate on historical data" },
      ],
    },
    problem: {
      label: "Problem",
      title: "In two places in a hospital, preventable errors are found late.",
      pharma: {
        title: "In prescribing: patients on many drugs",
        body: [
          "For a patient on five or more drugs, the number of possible interactions grows quickly. Screening them by hand on every prescription is not realistic.",
          "Risk rarely comes from a single pair of drugs; the total burden on one organ and changing kidney function have to be assessed together. A prescription that is safe at an eGFR of 90 may need a dose adjustment at 30.",
        ],
      },
      shield: {
        title: "In billing: rejections after submission",
        body: [
          "A rejection or deduction usually arrives after the claim has been sent. Appeal, correction and resubmission delay payment and take up the team's time.",
          "Some rejections come from preventable errors such as a missing document, a code mismatch or an exceeded limit.",
        ],
      },
    },
    approach: {
      label: "Approach",
      title: "Every alert comes with the rule that raised it.",
      intro:
        "Sourced rules give the same result for the same input. The reason stays visible and the final decision stays with the specialist.",
      steps: [
        {
          title: "We put the data into a shared format",
          body: "A prescription, lab result or claim line is converted to an international standard used between health systems (HL7 FHIR R4). Missing information is flagged, not skipped.",
        },
        {
          title: "Rules check it",
          body: "Each rule rests on a guideline, product information or regulation, and carries a version number.",
        },
        {
          title: "A specialist decides",
          body: "The physician, pharmacist or billing specialist sees the finding with its reason, then accepts it, corrects the order or overrides it with a reason.",
        },
        {
          title: "Every step is recorded",
          body: "The input, rule version and decision are written to an append-only log, so a decision can be shown later exactly as it was made.",
        },
      ],
    },
    projects: {
      label: "Shield and PharmaDeux",
      title: "Two projects, for two different users.",
      intro: "One is for the physician who writes the prescription, the other for the unit that prepares the claim. Both are in development and not yet on the market.",
      pharma: {
        name: "PharmaDeux",        purpose: "Medication safety and clinical decision support",
        body: "Checks prescriptions for interaction, organ burden and dose risks. It does not make treatment decisions; it shows the reason to the physician.",
        rows: [
          { label: "For", value: "Clinical pharmacists, ward physicians, medication safety teams" },
          { label: "Today", value: "Rules are tested on synthetic patient profiles" },
          { label: "Next step", value: "Retrospective validation on past cases" },
          { label: "Regulatory status", value: "MDR Class IIa target, no CE mark" },
        ],
        link: "Read more about PharmaDeux",
      },
      shield: {
        name: "Shield",        purpose: "Hospital billing, SUT compliance and revenue integrity",
        body: "Checks claim items against SUT and SGK rules before submission, then sends risky items to a specialist with the reason.",
        rows: [
          { label: "For", value: "Billing, pre-authorisation and revenue cycle teams" },
          { label: "Today", value: "Three of four audit planes implemented and tested on synthetic claims" },
          { label: "Next step", value: "Measuring rejection catch and false positive rates on past claims" },
          { label: "Real claims", value: "Not validated yet" },
        ],
        link: "Read more about Shield",
      },
    },
    bridge: {
      title: "If your institution has a similar problem, let us talk.",
      body: "In the first conversation, we clarify your institution's need and the projects' current status.",
      primary: "Contact us",
    },
    benefit: {
      label: "Potential benefit",
      title: "What has been measured, and what has not.",
      intro:
        "In both projects, only the software itself has been tested so far. Its effect on patients, physicians or institutions has not been measured anywhere yet. The hypotheses below are what each project wants to test with a partner institution.",
      targetTitle: "Hypotheses to be tested",
      columns: { hypothesis: "Hypothesis", measure: "How it will be measured", status: "Status" },
      targets: [
        {
          hypothesis: "Alerts that take context into account can reduce the number of unnecessary alerts.",
          measure: "Alerts per prescription, positive predictive value, agreement with an independent expert panel",
        },
        {
          hypothesis: "Some preventable rejection causes can be caught before submission.",
          measure: "Rejection catch rate, false positive rate, review workload for specialists",
        },
      ],
      notMeasured: "Not measured",
    },
    team: {
      label: "Team",
      title: "An independent student R&D venture.",
      listLabel: "Team members",
      more: "Our team and how we work",
    },
    collab: {
      label: "Collaboration",
      title: "How we can work with your institution.",
      intro:
        "We want to work with hospitals, universities and research institutions. The first step is a 15-minute call with no commitment. The protocol of a validation study is written with the institution after a technical review.",
      modes: [
        {
          title: "Intro call",
          body: "We listen to what you need and show the prototype on an example case or claim.",
          meta: "15 minutes, no commitment",
          link: "15-minute intro call",
        },
        {
          title: "Academic research",
          body: "Source-based review of the rule sets, a joint validation protocol and peer-reviewed publication.",
          meta: "With ethics approval and a data protocol",
          link: "Propose a collaboration",
        },
        {
          title: "Retrospective validation",
          body: "Measurement on anonymised past prescriptions or claims, inside the institution's own infrastructure.",
          meta: "Starts with a non-binding letter of intent (LOI)",
          link: "Apply for a pilot",
        },
      ],
      giveTitle: "What your institution gets from a validation study",
      give: [
        "A report measured on your own historical data and written together with you",
        "A part in writing the protocol, and joint publication",
        "A pilot designed so that the data stays inside your infrastructure",
      ],
      askTitle: "What a validation study needs",
      ask: [
        "Approval from your institution's ethics committee",
        "Anonymised historical data and a data processing agreement",
        "A technical review with your IT team",
      ],
      legal:
        "LavieuxLabs is not incorporated yet. A Letter of Intent (LOI) is non-binding and does not replace an agreement. For a validation study, which party signs the agreement and the data processing terms are settled with the parties involved and their authorised legal advisers.",
      cta: "15-minute intro call",
      email: "or write to us directly:",
      noPatientData: "Please do not send patient data through our contact channels.",
    },
  },
});

/** Editorial section: the label sits in a narrow left column on wide screens and above the title on small ones. */
function Section({
  id,
  label,
  title,
  intro,
  band = false,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  band?: boolean;
  children: ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-16 border-t border-rule ${band ? "bg-paper-band" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-x-10 gap-y-3 lg:grid-cols-12">
          <p className="font-serif text-[17px] text-ink-3 lg:col-span-3 lg:pt-2">{label}</p>
          <div className="lg:col-span-9">
            <h2 id={headingId} className="max-w-[24ch] font-serif text-[30px] leading-[1.1] font-medium tracking-[-0.015em] text-ink sm:text-[40px]">
              {title}
            </h2>
            {intro && <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.65] text-ink-2">{intro}</p>}
          </div>
        </div>
        <div className="mt-8 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}

function RecordRows({ rows }: { rows: Row[] }) {
  return (
    <dl className="divide-y divide-rule border-y border-rule">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-1 py-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
          <dt className="text-[14px] text-ink-3">{r.label}</dt>
          <dd className="text-[15px] leading-snug text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * One project. The two projects mirror each other on wide screens (text left / right) and each opens with
 * its owner, so they differ in more than the colour of their names; each has its own figure.
 */
function ProjectRecord({
  project,
  icon: Icon,
  nameClass,
  href,
  figure,
  mirrored = false,
}: {
  project: Project;
  icon: LucideIcon;
  nameClass: string;
  href: string;
  figure: ReactNode;
  mirrored?: boolean;
}) {
  return (
    <article className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className={`lg:col-span-5 ${mirrored ? "lg:order-2" : ""}`}>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 shrink-0 text-ink" strokeWidth={1.6} aria-hidden="true" />
          <h3 className={`font-serif text-[36px] leading-none font-medium tracking-[-0.02em] sm:text-[44px] ${nameClass}`} lang="en">
            {project.name}
          </h3>
        </div>
        <p className="mt-3 text-[15px] font-medium text-ink">{project.purpose}</p>
        <p className="mt-4 text-[17px] leading-[1.65] text-ink-2">{project.body}</p>
        <div className="mt-6">
          <RecordRows rows={project.rows.slice(0, 3)} />
        </div>
        <Link href={href} className={`mt-4 ${TEXT_ACTION}`}>
          {project.link}
        </Link>
      </div>
      <div className={`min-w-0 lg:col-span-7 ${mirrored ? "lg:order-1" : ""}`}>{figure}</div>
    </article>
  );
}

export default function HomeView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      <JsonLd data={homeJsonLd(locale)} />

      {/* Hero: what we build, the two projects, where the work stands and how to start a conversation. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-8 px-4 pt-6 pb-12 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-12 lg:gap-y-12 lg:px-8 lg:pb-20">
          <div className="lg:col-span-8">
            <p className="font-serif text-[17px] text-ink-3">{c.hero.kicker}</p>
            <h1
              id="hero-title"
              className="mt-3 max-w-[20ch] font-serif text-[36px] leading-[1.06] font-medium tracking-[-0.022em] text-ink sm:mt-4 sm:text-[48px] lg:text-[58px]"
            >
              {c.hero.title}
            </h1>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-2">{c.hero.lead}</p>
            <div className="mt-8">
              <a href="#platformlar" className={BUTTON}>
                {c.hero.secondary}
              </a>
            </div>
          </div>
          <aside aria-labelledby="hero-summary" className="self-end border-t-2 border-ink pt-4 lg:col-span-4">
            <h2 id="hero-summary" className="font-serif text-[20px] font-semibold text-ink">
              {c.hero.summaryTitle}
            </h2>
            <dl className="mt-3 divide-y divide-rule border-t border-rule">
              {c.hero.summary.slice(0, 4).map((r) => (
                <div key={r.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                  <dt className="text-[13px] text-ink-3">{r.label}</dt>
                  <dd className="text-[14px] leading-snug text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Approach: three steps in plain language next to one alert traced end to end (the main figure). */}
      <Section id="yaklasim" label={c.approach.label} title={c.approach.title} intro={c.approach.intro} band>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <ol className="space-y-6 lg:col-span-5">
            {c.approach.steps.slice(0, 3).map((step, i) => (
              <li key={step.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-4">
                <span aria-hidden="true" className="font-serif text-[30px] leading-none text-ink-3 tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-[15px] leading-[1.6] text-ink-2">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="min-w-0 lg:col-span-7">
            <DecisionTraceFigure locale={locale} />
          </div>
        </div>
      </Section>

      {/* The two projects, mirrored. Id kept: footer, navigation and breadcrumbs link to /#platformlar. */}
      <Section id="platformlar" label={c.projects.label} title={c.projects.title} intro={c.projects.intro}>
        <div className="space-y-12 sm:space-y-20">
          <ProjectRecord
            project={c.projects.pharma}
            icon={Pill}
            nameClass="text-teal-700"
            href={href("/initiatives/pharmadeux")}
            figure={<PrescriptionCheckFigure locale={locale} />}
          />
          <div className="border-t border-rule pt-12 sm:pt-20">
            <ProjectRecord
              project={c.projects.shield}
              icon={ShieldCheck}
              nameClass="text-indigo-700"
              href={href("/initiatives/shield")}
              figure={<ClaimScoreFigure locale={locale} />}
              mirrored
            />
          </div>
        </div>
      </Section>

      {/* A short, quiet call to talk after the projects; no label column, no figure. */}
      <section aria-labelledby="bridge-title" className="border-t border-rule bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-[60ch]">
            <h2 id="bridge-title" className="font-serif text-[26px] leading-tight font-medium tracking-[-0.01em] text-ink sm:text-[30px]">
              {c.bridge.title}
            </h2>
            <p className="mt-2 text-[17px] leading-[1.6] text-ink-2">{c.bridge.body}</p>
          </div>
          <Link href={href("/contact")} className={BUTTON}>
            {c.bridge.primary}
          </Link>
        </div>
      </section>
    </main>
  );
}
