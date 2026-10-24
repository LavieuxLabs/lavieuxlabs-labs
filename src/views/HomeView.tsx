import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Pill, ShieldCheck, type LucideIcon } from "lucide-react";
import CopyEmail from "@/components/CopyEmail";
import JsonLd from "@/components/JsonLd";
import {
  ClaimPathFigure,
  ClaimScoreFigure,
  DecisionTraceFigure,
  EvidenceLevelsFigure,
  PairwiseFigure,
  PrescriptionCheckFigure,
} from "@/components/home/HomeFigures";
import { homeJsonLd } from "@/lib/structuredData";
import { contactHref, organizationProfile } from "@/lib/site";
import { TEAM, teamCopy } from "@/lib/team";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";
import { trlLabel } from "@/lib/metrics";

// The home page keeps the layout's default title; only description and hreflang are set here.
export const metadata = defineMetadata("/", {
  tr: {
    description:
      "LavieuxLabs, Konya Teknik Üniversitesi öğrencilerinin kurduğu bağımsız bir Ar-Ge girişimi. Ekibin ortak projesi PharmaDeux reçete anında ilaç güvenliğini kontrol eder. Sitede ayrıca Tarık Ziya Eren'in bağımsız projesi Shield tanıtılır.",
  },
  en: {
    description:
      "LavieuxLabs is an independent R&D venture founded by students of Konya Technical University. The team's joint project PharmaDeux checks medication safety at the moment of prescription. The site also presents Shield, an independent project by Tarık Ziya Eren.",
  },
});

/*
 * Home page on the paper surface (Academic Editorial). Communication order: problem → approach → the two
 * projects → potential benefit → team → collaboration, with a short call to talk after the projects.
 * Type roles: Newsreader for the page title, section titles, project and person names and step numerals;
 * IBM Plex Sans for all running text, labels and tables; IBM Plex Mono only for numbers that are data.
 * Type scale: 13 caption · 14 small · 15 secondary · 17 body · 20 sub-heading · serif 30/40 section · 36/58 page.
 * Colour: ink on paper; a product's accent (its dark step) appears only on its own name; clinical and review
 * states keep their own colours inside figures. Ownership: PharmaDeux is the LavieuxLabs team's joint
 * project; Shield is Tarık Ziya Eren's independent project, presented here.
 */

const LINK =
  "underline decoration-ink/30 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
// Standalone text links get a 44px touch target; inline links inside sentences do not need one.
const TEXT_ACTION = `inline-flex min-h-11 items-center text-[15px] font-medium text-ink ${LINK}`;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
const BUTTON = `inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-ink-2 ${FOCUS}`;
const BUTTON_OUTLINE = `inline-flex min-h-11 items-center justify-center rounded-md border border-ink/30 bg-white px-5 py-3 text-[15px] font-medium text-ink transition-colors duration-150 ease-out hover:border-ink ${FOCUS}`;

type Row = { label: string; value: string };
type Project = {
  name: string;
  owner: string;
  purpose: string;
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
    primary: string;
    secondary: string;
    academic: string;
    workflowsLabel: string;
    workflows: [Workflow, Workflow];
    summaryTitle: string;
    summary: Row[];
  };
  problem: { label: string; title: string; pharma: { title: string; body: string[] }; shield: { title: string; body: string[] } };
  approach: { label: string; title: string; intro: string; steps: { title: string; body: string }[] };
  projects: { label: string; title: string; intro: string; pharma: Project; shield: Project };
  bridge: { title: string; body: string; primary: string; secondary: string };
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
      lead: "LavieuxLabs ekibi ilaç güvenliği için PharmaDeux'yü geliştiriyor. Bu sitede ayrıca Tarık Ziya Eren'in hastane faturalaması için geliştirdiği bağımsız proje Shield tanıtılıyor. İkisi de prototip ve klinik veya kurumsal ortamda henüz doğrulanmadı.",
      primary: "15 dk tanışma görüşmesi",
      secondary: "Projeleri inceleyin",
      academic: "Araştırma iş birliği önerin",
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
        { label: "Projeler", value: "PharmaDeux: ekibin ortak projesi. Shield: Tarık Ziya Eren'in bağımsız projesi, burada tanıtılıyor." },
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
        "Karar anında olasılıksal ya da üretken bir model kullanmıyoruz. Kontrolleri kaynağı belli ve sürümlenmiş kurallarla yapıyoruz. Kurallar aynı girdiye her zaman aynı sonucu verecek biçimde tasarlandı, böylece bir uyarının nedeni gösterilebilir.",
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
        name: "PharmaDeux",
        owner: "LavieuxLabs ekibinin ortak projesi",
        purpose: "İlaç güvenliği ve klinik karar desteği",
        body: "Hekim reçeteyi yazarken, reçetedeki ilaçları hastanın böbrek ve karaciğer değerleriyle birlikte kontrol eder: etkileşim, aynı organa binen toplam yük ve doz uygunluğu. Tedavi kararı vermez; riski ve nedenini hekime gösterir.",
        rows: [
          { label: "Kimin için", value: "Klinik eczacı, servis hekimi, ilaç güvenliği ekipleri" },
          { label: "Bugün", value: "Kurallar sentetik hasta profilleriyle test ediliyor" },
          { label: "Sıradaki adım", value: "Geçmiş vakalarla retrospektif doğrulama" },
          { label: "Düzenleyici durum", value: "MDR Sınıf IIa hedefi, CE işareti yok" },
        ],
        link: "PharmaDeux'yü ayrıntılı inceleyin",
      },
      shield: {
        name: "Shield",
        owner: "Tarık Ziya Eren'in bağımsız projesi; burada tanıtılıyor",
        purpose: "Hastane faturalaması, SUT uygunluğu ve gelir bütünlüğü",
        body: "Fatura MEDULA'ya gönderilmeden önce kalemleri SUT ve SGK provizyon kurallarına göre kontrol eder. Riskli kalemi nedeniyle birlikte fatura uzmanının kuyruğuna koyar. İdari bir araçtır; tanı koymaz, tedavi kararı vermez.",
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
      body: "İlk adım 15 dakikalık bir görüşme ve taahhüt gerektirmiyor. Bir araştırma fikriniz varsa onu da konuşabiliriz.",
      primary: "15 dk tanışma görüşmesi",
      secondary: "Araştırma iş birliği önerin",
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
      lead: "The LavieuxLabs team is building PharmaDeux for medication safety. This site also presents Shield, an independent project by Tarık Ziya Eren for hospital billing. Both are prototypes and neither has been validated in a clinical or institutional setting yet.",
      primary: "15-minute intro call",
      secondary: "See the projects",
      academic: "Propose a research collaboration",
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
        { label: "Projects", value: "PharmaDeux: the team's joint project. Shield: an independent project by Tarık Ziya Eren, presented here." },
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
        "We do not use a probabilistic or generative model at the point of decision. The checks are rules with a known source and a version number. The rules are designed to give the same result for the same input every time, so the reason for an alert can be shown.",
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
        name: "PharmaDeux",
        owner: "A joint project of the LavieuxLabs team",
        purpose: "Medication safety and clinical decision support",
        body: "While the physician writes a prescription, it checks the drugs together with the patient's kidney and liver values: interactions, the total burden on one organ and dose suitability. It does not make treatment decisions; it shows the physician the risk and its reason.",
        rows: [
          { label: "For", value: "Clinical pharmacists, ward physicians, medication safety teams" },
          { label: "Today", value: "Rules are tested on synthetic patient profiles" },
          { label: "Next step", value: "Retrospective validation on past cases" },
          { label: "Regulatory status", value: "MDR Class IIa target, no CE mark" },
        ],
        link: "Read more about PharmaDeux",
      },
      shield: {
        name: "Shield",
        owner: "An independent project by Tarık Ziya Eren, presented here",
        purpose: "Hospital billing, SUT compliance and revenue integrity",
        body: "Before a claim is sent to MEDULA, it checks claim lines against SUT (Turkey's reimbursement rules) and SGK pre-authorisation rules. A risky line goes to the billing specialist's queue with its reason. It is an administrative tool; it does not diagnose or make treatment decisions.",
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
      body: "The first step is a 15-minute call with no commitment. If you have a research idea, we can talk about that too.",
      primary: "15-minute intro call",
      secondary: "Propose a research collaboration",
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
 * The two products' workflows, right under the hero's calls to action: where each product sits and who
 * decides. Three steps each; the last step is a person, set in full ink.
 */
function Workflows({ label, workflows, locale }: { label: string; workflows: [Workflow, Workflow]; locale: Locale }) {
  const meta = [
    { href: "/initiatives/pharmadeux", nameClass: "text-teal-700", icon: Pill },
    { href: "/initiatives/shield", nameClass: "text-indigo-700", icon: ShieldCheck },
  ];
  return (
    <div aria-label={label} role="group" className="grid gap-x-10 gap-y-5 border-t border-rule pt-5 lg:grid-cols-2">
      {workflows.map((w, i) => {
        const Icon = meta[i].icon;
        return (
          <div key={w.name} className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-x-3">
              <Link
                href={localizedPath(locale, meta[i].href)}
                lang="en"
                className={`inline-flex min-h-11 items-center gap-2 font-serif text-[22px] font-medium ${meta[i].nameClass} ${LINK}`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0 text-ink" strokeWidth={1.6} aria-hidden="true" />
                {w.name}
              </Link>
              <span className="text-[14px] text-ink-3">{w.area}</span>
            </p>
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] leading-snug">
              {w.steps.map((step, s) => (
                <li key={step} className="flex items-center gap-1.5">
                  <span className={s === 2 ? "font-medium text-ink" : "text-ink-2"}>{step}</span>
                  {s < 2 && <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.8} aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
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
        <p className="mt-1 text-[14px] text-ink-3">{project.owner}</p>
        <p className="mt-4 text-[17px] leading-[1.65] text-ink-2">{project.body}</p>
        <div className="mt-6">
          <RecordRows rows={project.rows} />
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
  const org = organizationProfile[locale];
  const href = (path: string) => localizedPath(locale, path);
  const members = teamCopy[locale];

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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href={href(contactHref("intro"))} className={BUTTON}>
                {c.hero.primary}
              </Link>
              <a href="#platformlar" className={BUTTON_OUTLINE}>
                {c.hero.secondary}
              </a>
            </div>
            <Link href={href(contactHref("academic"))} className={`mt-2 ${TEXT_ACTION}`}>
              {c.hero.academic}
            </Link>
          </div>

          {/* Second in reading order on phones (right after the calls to action), full width under both columns on wide screens. */}
          <div className="lg:order-last lg:col-span-12">
            <Workflows label={c.hero.workflowsLabel} workflows={c.hero.workflows} locale={locale} />
          </div>

          <aside aria-labelledby="hero-summary" className="self-end border-t-2 border-ink pt-4 lg:col-span-4">
            <h2 id="hero-summary" className="font-serif text-[20px] font-semibold text-ink">
              {c.hero.summaryTitle}
            </h2>
            <dl className="mt-3 divide-y divide-rule border-t border-rule">
              {c.hero.summary.map((r) => (
                <div key={r.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                  <dt className="text-[13px] text-ink-3">{r.label}</dt>
                  <dd className="text-[14px] leading-snug text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Problem: text for both problems first, then both figures on one row, so the figures align at the top. */}
      <Section id="sorun" label={c.problem.label} title={c.problem.title}>
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
          {[
            { block: c.problem.pharma, figure: <PairwiseFigure locale={locale} />, order: ["lg:order-1", "lg:order-3"] },
            { block: c.problem.shield, figure: <ClaimPathFigure locale={locale} />, order: ["lg:order-2", "lg:order-4"] },
          ].map(({ block, figure, order }) => [
            <div key={`${block.title}-text`} className={`min-w-0 ${order[0]}`}>
              <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">{block.title}</h3>
              <div className="mt-3 space-y-3 text-[17px] leading-[1.65] text-ink-2">
                {block.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>,
            <div key={`${block.title}-figure`} className={`min-w-0 ${order[1]}`}>
              {figure}
            </div>,
          ])}
        </div>
      </Section>

      {/* Approach: the four steps in plain language next to one alert traced end to end (the main figure). */}
      <Section id="yaklasim" label={c.approach.label} title={c.approach.title} intro={c.approach.intro} band>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <ol className="space-y-6 lg:col-span-5">
            {c.approach.steps.map((step, i) => (
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
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href={href(contactHref("intro"))} className={BUTTON}>
              {c.bridge.primary}
            </Link>
            <Link href={href(contactHref("academic"))} className={BUTTON_OUTLINE}>
              {c.bridge.secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Potential benefit: what is measured (software level, once) kept apart from what is targeted (not measured). */}
      <Section id="fayda" label={c.benefit.label} title={c.benefit.title} intro={c.benefit.intro} band>
        <EvidenceLevelsFigure locale={locale} />
        <h3 className="mt-12 text-[20px] font-semibold text-ink">{c.benefit.targetTitle}</h3>
        {/* Wide screens: a table. Small screens: one block per hypothesis, so the status is never off-screen. */}
        <table className="mt-4 hidden w-full border-collapse text-left text-[15px] sm:table">
          <thead>
            <tr className="border-b border-ink text-[13px] text-ink-3">
              <th scope="col" className="py-2.5 pr-4 font-medium">{c.benefit.columns.hypothesis}</th>
              <th scope="col" className="py-2.5 pr-4 font-medium">{c.benefit.columns.measure}</th>
              <th scope="col" className="py-2.5 font-medium">{c.benefit.columns.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule border-b border-rule">
            {c.benefit.targets.map((t) => (
              <tr key={t.hypothesis} className="align-top">
                <td className="py-3.5 pr-4 leading-snug text-ink">{t.hypothesis}</td>
                <td className="py-3.5 pr-4 leading-snug text-ink-2">{t.measure}</td>
                <td className="py-3.5 font-medium whitespace-nowrap text-ink">{c.benefit.notMeasured}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="mt-4 divide-y divide-rule border-y border-rule sm:hidden">
          {c.benefit.targets.map((t) => (
            <li key={t.hypothesis} className="py-4">
              <p className="text-[13px] text-ink-3">
                {c.benefit.columns.status}: <span className="font-medium text-ink">{c.benefit.notMeasured}</span>
              </p>
              <p className="mt-1 text-[15px] leading-snug text-ink">{t.hypothesis}</p>
              <p className="mt-2 text-[13px] text-ink-3">{c.benefit.columns.measure}</p>
              <p className="text-[14px] leading-snug text-ink-2">{t.measure}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Team: the venture as it is and all five members, name and role only, from the central team source
          (src/lib/team.ts). Descriptions and profile links are on /about#ekip. No advisors or boards are listed. */}
      <Section id="ekip" label={c.team.label} title={c.team.title}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="max-w-[62ch] space-y-4 text-[17px] leading-[1.65] text-ink-2 lg:col-span-6 lg:col-start-4">
            <p>{org.positioning}</p>
            <p>
              {org.stage} {org.independence}
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-x-12 lg:grid-cols-12">
          <div className="border-t border-ink pt-5 lg:col-span-9 lg:col-start-4">
            <ul aria-label={c.team.listLabel} className="divide-y divide-rule border-b border-rule">
              {TEAM.map((m) => (
                <li key={m.id} className="grid gap-x-10 gap-y-0.5 py-3.5 first:pt-0 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-baseline">
                  <p className="font-serif text-[22px] leading-tight font-medium text-ink">{m.name}</p>
                  <p className="text-[15px] leading-snug text-ink-2">{members[m.id].role}</p>
                </li>
              ))}
            </ul>
            <Link href={href("/about#ekip")} className={`mt-4 ${TEXT_ACTION}`}>
              {c.team.more}
            </Link>
          </div>
        </div>
      </Section>

      {/* Collaboration: three ways in, what a study gives and needs, the legal status, and one clear first step. */}
      <Section id="iletisim" label={c.collab.label} title={c.collab.title} intro={c.collab.intro} band>
        <div className="grid gap-8 md:grid-cols-3 md:gap-8">
          {c.collab.modes.map((mode, i) => (
            <div key={mode.title} className="flex flex-col border-t-2 border-ink pt-5">
              <h3 className="font-serif text-[24px] leading-tight font-medium text-ink">{mode.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">{mode.body}</p>
              <p className="mt-3 text-[14px] text-ink-3">{mode.meta}</p>
              <Link
                href={href(contactHref((["intro", "academic", "pilot"] as const)[i]))}
                className={`mt-3 self-start md:mt-auto md:pt-3 ${TEXT_ACTION}`}
              >
                {mode.link}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-rule pt-8 md:mt-14 md:grid-cols-2 md:gap-12 md:pt-10">
          {[
            { title: c.collab.giveTitle, items: c.collab.give },
            { title: c.collab.askTitle, items: c.collab.ask },
          ].map((list) => (
            <div key={list.title}>
              <h3 className="text-[17px] font-semibold text-ink">{list.title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.55] text-ink-2 marker:text-ink-3">
                {list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[70ch] text-[15px] leading-[1.6] text-ink-2">{c.collab.legal}</p>

        <div className="mt-10 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <Link href={href(contactHref("intro"))} className={BUTTON}>
            {c.collab.cta}
          </Link>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-2">
            {c.collab.email}
            <CopyEmail locale={locale} tone="paper" className="min-h-11 text-ink" />
          </p>
        </div>
        <p className="mt-5 text-[14px] text-ink-3">{c.collab.noPatientData}</p>
      </Section>
    </main>
  );
}
