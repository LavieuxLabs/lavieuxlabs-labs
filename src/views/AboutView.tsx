import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import CopyEmail from "@/components/CopyEmail";
import { BUTTON, Disclosure, FOCUS, FactRows, LINK, PaperSection, TEXT_ACTION } from "@/components/paper/Editorial";
import { organizationProfile } from "@/lib/site";
import { TEAM, teamCopy } from "@/lib/team";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";
import { testsLabel, trlLabel } from "@/lib/metrics";

export const metadata = defineMetadata("/about", {
  tr: {
    title: "Hakkımızda",
    description:
      "LavieuxLabs, Konya Teknik Üniversitesi öğrencilerinin kurduğu, henüz şirketleşmemiş bağımsız bir Ar-Ge girişimidir. PharmaDeux ilaç güvenliğine, Shield hastane faturalamasına odaklanır.",
  },
  en: {
    title: "About",
    description:
      "LavieuxLabs is an independent R&D venture founded by students of Konya Technical University and not yet incorporated. PharmaDeux focuses on medication safety and Shield on hospital billing.",
  },
});

/*
 * About on the paper surface (Academic Editorial): who we are, the problems we work on, how we work, the two
 * projects, the team, and who we want to work with. Technical detail that the product pages
 * already cover is linked, not repeated. No entrance motion. Section ids linked from elsewhere are kept:
 * #ekip (home page), #odaklar (command palette), #isbirligi.
 */

type Row = { label: string; value: string };
type Step = { title: string; body: string; link?: { label: string; href: string } };
type Project = { name: string; owner: string; body: string; rows: Row[]; link: string };
type Partner = { title: string; who: string; body: string };

const copy = defineContent<{
  crumbs: { home: string; here: string; aria: string };
  title: string;
  lead: string;
  secondary: string;
  summaryTitle: string;
  summary: Row[];
  purpose: { label: string; title: string; items: { title: string; owner: string; body: string }[]; principle: string };
  approach: { label: string; title: string; intro: string; steps: Step[]; whyRules: string; whyRulesMeta: string; regulatory: string; regulatoryLink: string };
  columns: { criterion: string; probabilistic: string; deterministic: string };
  comparison: { criterion: string; probabilistic: string; deterministic: string }[];
  projects: { label: string; title: string; intro: string; pharma: Project; shield: Project };
  team: { label: string; title: string; intro: string };
  collab: { label: string; title: string; intro: string; partners: Partner[]; cta: string; email: string; noPatientData: string };
}>({
  tr: {
    crumbs: { home: "Ana sayfa", here: "Hakkımızda", aria: "Sayfa konumu" },
    title: "Klinik karar desteği üzerinde çalışan bağımsız bir öğrenci girişimi.",
    lead: `${organizationProfile.tr.positioning} Hatanın hastaya ya da kuruma pahalıya mal olduğu işler için, sonucunu yeniden üretebilen ve kararı insana bırakan yazılım geliştiriyoruz.`,
    secondary: "Ekibimizi tanıyın",
    summaryTitle: "Kısaca",
    summary: [
      { label: "Biz kimiz", value: "Konya Teknik Üniversitesi'nde okuyan öğrencilerden oluşan bir ekip." },
      { label: "Hukuki durum", value: "Henüz şirketleşmedik." },
      { label: "Üniversite", value: organizationProfile.tr.independence },
      { label: "Projeler", value: "PharmaDeux ilaç güvenliğine, Shield hastane faturalamasına odaklanır." },
      { label: "Aşama", value: "İkisi de prototip. Kurum doğrulaması ve hastane pilotu henüz yapılmadı." },
    ],
    purpose: {
      label: "Amaç",
      title: "Hangi sorunlar üzerinde çalışıyoruz.",
      items: [
        {
          title: "Reçete anında ilaç güvenliği",
          owner: "PharmaDeux · ilaç güvenliği",
          body: "Çok ilaç kullanan bir hastada etkileşim, böbrek fonksiyonuna göre doz ve QT uzaması aynı anda kontrol edilmeli. eGFR'si 90 olan hastada güvenli olan bir reçete, eGFR 30'a düştüğünde doz ayarı gerektirebilir. PharmaDeux bu kontrolleri reçete yazılırken yapmayı hedefliyor.",
        },
        {
          title: "Fatura gönderilmeden önce red riski",
          owner: "Shield · hastane faturalaması",
          body: "SUT ve SGK kurallarına takılan bir fatura kalemi çoğu zaman gönderildikten sonra fark edilir. Shield, riskli kalemi gönderimden önce, onu işaretleyen kuralla birlikte uzmanın önüne koymayı hedefliyor.",
        },
      ],
      principle:
        "İki işte de kararı hekim, eczacı ya da faturalama uzmanı verir. Yazılım bir uyarının nedenini gösterir ve aynı girdide aynı sonucu verir.",
    },
    approach: {
      label: "Çalışma yaklaşımı",
      title: "Kaynaktan koda, koddan teste, testten doğrulamaya.",
      intro: "Düzenlemeye tabi bir yazılımın gerektirdiği izlenebilirliği ve değişiklik kontrolünü ilk günden uyguluyoruz.",
      steps: [
        {
          title: "Araştırma",
          body: "Kurallar resmi ürün bilgilerinden (KÜB/KT), klinik kılavuzlardan ve hakemli literatürden çıkarılır. Her kural kaynağını gösterir.",
          link: { label: "Standartlar ve referanslar", href: "/standartlar" },
        },
        {
          title: "Geliştirme",
          body: "Karar anında kural tabanlı bir sistem kullanıyoruz. Aynı girdi ve kural sürümü her zaman aynı sonucu verir; gerekçe, tetiklenen kuralın kendisidir. Kural setleri sürümlenir.",
        },
        {
          title: "Test",
          body: `Her klinik gereksinim, onu uygulayan kurala ve onu sınayan teste bağlıdır. Hiçbir değişiklik gözden geçirilmeden ve regresyon testinden geçmeden yayına çıkmaz. PharmaDeux'ta ${testsLabel("tr")} otomatik test var; bu yazılım düzeyinde bir ölçüdür, klinik doğrulama değildir.`,
        },
        {
          title: "Doğrulama",
          body: "Klinik doğrulama henüz yapılmadı. Plan, önce geçmiş vakalarda retrospektif test, sonra gölge modda pilot. Her çalışmadan önce kurumun etik kurul onayı, verinin kurum içinde anonimleştirilmesi ve Veri İşleme Sözleşmesi (DPA) gerekir.",
          link: { label: "PharmaDeux doğrulama planı", href: "/initiatives/pharmadeux#protokol" },
        },
      ],
      whyRules: "Neden kural tabanlı",
      whyRulesMeta: "olasılıksal modelle beş ölçütte karşılaştırma",
      regulatory:
        "Düzenleyici durum: PharmaDeux için MDR kapsamında Sınıf IIa hedefleniyor; CE işareti henüz yok. IEC 62304 ve ISO 14971, yaşam döngüsü ve risk yönetimi için tasarım girdisi olarak kullanılıyor; uygunluk değerlendirmesi yapılmadı. ISO 13485 kalite yönetim sistemi yol haritasında. Bu bir sertifika beyanı değildir.",
      regulatoryLink: "Kalite, bilgi güvenliği ve MDR",
    },
    columns: { criterion: "Ölçüt", probabilistic: "Olasılıksal model", deterministic: "Kural tabanlı sistem" },
    comparison: [
      {
        criterion: "Tekrarlanabilirlik",
        probabilistic: "Aynı girdi farklı çıktılar üretebilir.",
        deterministic: "Aynı girdi ve kural sürümü her zaman aynı çıktıyı üretir.",
      },
      {
        criterion: "Açıklanabilirlik",
        probabilistic: "Gerekçe, sonradan üretilmiş bir açıklama olabilir.",
        deterministic: "Gerekçe, tetiklenen kuralın kendisidir.",
      },
      {
        criterion: "Doğrulama",
        probabilistic: "Davranış istatistiksel olarak, örneklem üzerinden tahmin edilir.",
        deterministic: "Her kural, tanımlı test senaryolarıyla doğrudan test edilir.",
      },
      {
        criterion: "Değişiklik yönetimi",
        probabilistic: "Yeniden eğitim, beklenmeyen davranış değişikliklerine yol açabilir.",
        deterministic: "Her değişiklik sürümlenir, gözden geçirilir ve regresyon testinden geçer.",
      },
      {
        criterion: "Hata modu",
        probabilistic: "Akıcı ama yanlış çıktı (halüsinasyon) ayırt edilmesi güç olabilir.",
        deterministic: "Kapsam dışı durumlar açıkça “değerlendirilemedi” olarak işaretlenir.",
      },
    ],
    projects: {
      label: "Projeler",
      title: "İki proje, iki ayrı problem alanı.",
      intro: "PharmaDeux ilaç güvenliğine, Shield hastane faturalamasına odaklanıyor.",
      pharma: {
        name: "PharmaDeux",
        owner: "İlaç güvenliği projesi",
        body: "Reçete yazılırken etkileşim, böbrek fonksiyonuna göre doz ve QT riski gibi kontrolleri tek yerde yapan bir klinik karar destek prototipi.",
        rows: [
          { label: "Aşama", value: `Prototip, ${trlLabel("tr")} (ekibin öz değerlendirmesi)` },
          { label: "Otomatik test", value: `${testsLabel("tr")} (yazılım düzeyi)` },
          { label: "Klinik kanıt", value: "Henüz yok" },
          { label: "Düzenleyici", value: "MDR Sınıf IIa hedefi; CE işareti yok" },
        ],
        link: "PharmaDeux sayfası",
      },
      shield: {
        name: "Shield",
        owner: "Hastane faturalaması projesi",
        body: "SUT ve SGK kurallarını fatura gönderilmeden önce çalışan bir kural setine dönüştüren bir prototip. Riskli kalem, tetiklenen kural ve gerekçesiyle uzmana gider.",
        rows: [
          { label: "Aşama", value: "Prototip" },
          { label: "Doğrulama", value: "Gerçek faturalarda henüz denenmedi" },
          { label: "Skor", value: "Kural skoru; ret olasılığı veya tasarruf tahmini değildir" },
        ],
        link: "Shield sayfası",
      },
    },
    team: {
      label: "Ekibimiz",
      title: "PharmaDeux'u geliştiren ekip.",
      intro:
        "Ekip, Konya Teknik Üniversitesi'nde okuyan öğrencilerden oluşuyor. Her üyenin üzerinde çalıştığı alanları aşağıya yazdık.",
    },
    collab: {
      label: "İş birliği",
      title: "Kimlerle çalışmak istiyoruz.",
      intro: "Dört ortak profili arıyoruz. İhtiyacınıza uygun yolu iletişim sayfasında seçebilirsiniz.",
      partners: [
        {
          title: "Klinik doğrulama ortağı",
          who: "Eğitim ve araştırma, üniversite hastaneleri",
          body: "PharmaDeux'u geçmiş vakalarda ve gölge modda ölçmek için klinik veri ve bağımsız bir uzman paneli.",        },
        {
          title: "Akademik araştırmacı",
          who: "Tıp ve farmakoloji akademisyenleri",
          body: "Kural setlerinin ve organ risk protokollerinin kaynağa göre gözden geçirilmesi ve ortak yayın.",        },
        {
          title: "Gelir döngüsü pilot ortağı",
          who: "Özel ve vakıf hastaneleri",
          body: "Shield'ın red yakalama ve yanlış pozitif oranlarının geçmiş faturalarda ölçülmesi.",        },
        {
          title: "HBYS entegratörü",
          who: "Sağlık bilgi sistemi firmaları",
          body: "HL7 FHIR R4 köprüsünün gerçek bir hastane bilgi sisteminde kurulması.",        },
      ],
      cta: "İletişime geçin",
      email: "ya da e-posta:",
      noPatientData: "Hasta verisi ve gerçek fatura verisi göndermeyin.",
    },
  },
  en: {
    crumbs: { home: "Home", here: "About", aria: "Breadcrumb" },
    title: "An independent student venture working on clinical decision support.",
    lead: `${organizationProfile.en.positioning} For work where a mistake is costly to a patient or an institution, we build software that can reproduce its results and leaves the decision to a person.`,
    secondary: "Meet the team",
    summaryTitle: "In brief",
    summary: [
      { label: "Who we are", value: "A team of students at Konya Technical University." },
      { label: "Legal status", value: "Not incorporated yet." },
      { label: "University", value: organizationProfile.en.independence },
      { label: "Projects", value: "PharmaDeux focuses on medication safety; Shield focuses on hospital billing." },
      { label: "Stage", value: "Both are prototypes. No institutional validation or hospital pilot has been done yet." },
    ],
    purpose: {
      label: "Purpose",
      title: "The problems we work on.",
      items: [
        {
          title: "Medication safety at the moment of prescribing",
          owner: "PharmaDeux · medication safety",
          body: "For a patient on many drugs, interactions, renal dosing and QT prolongation need to be checked together. A prescription that is safe at an eGFR of 90 may need a dose adjustment at 30. PharmaDeux aims to run these checks while the prescription is written.",
        },
        {
          title: "Claim rejection risk before submission",
          owner: "Shield · hospital billing",
          body: "A claim line that breaks SUT (the national reimbursement rules) or SGK (Social Security Institution) rules is often noticed only after submission. Shield aims to put the risky line in front of a specialist before submission, together with the rule that flagged it.",
        },
      ],
      principle:
        "In both, the physician, pharmacist or billing specialist makes the decision. The software shows the reason for an alert and gives the same result for the same input.",
    },
    approach: {
      label: "How we work",
      title: "From source to code, from code to test, from test to validation.",
      intro: "From day one, we apply the traceability and change control that regulated software needs.",
      steps: [
        {
          title: "Research",
          body: "Rules are taken from official product information (SmPC and patient leaflet), clinical guidelines and peer-reviewed literature. Every rule shows its source.",
          link: { label: "Standards and references", href: "/standartlar" },
        },
        {
          title: "Development",
          body: "We use a rule-based system at the point of decision. The same input and rule version always give the same result, and the reason is the rule that fired. Rule sets are versioned.",
        },
        {
          title: "Testing",
          body: `Each clinical requirement is linked to the rule that implements it and the test that checks it. No change is released without review and regression tests. PharmaDeux has ${testsLabel("en")} automated tests; this is a software-level measure, not clinical validation.`,
        },
        {
          title: "Validation",
          body: "Clinical validation has not been done yet. The plan is a retrospective test on past cases first, then a pilot in shadow mode. Every study needs the institution's ethics committee approval, anonymisation within the institution and a Data Processing Agreement (DPA) first.",
          link: { label: "PharmaDeux validation plan", href: "/initiatives/pharmadeux#protokol" },
        },
      ],
      whyRules: "Why rule-based",
      whyRulesMeta: "compared with a probabilistic model on five criteria",
      regulatory:
        "Regulatory status: PharmaDeux targets Class IIa under the MDR; it has no CE mark yet. IEC 62304 and ISO 14971 are used as design inputs for the life cycle and risk management; no conformity assessment has been done. An ISO 13485 quality management system is on the roadmap. This is not a certification statement.",
      regulatoryLink: "Quality, information security and MDR",
    },
    columns: { criterion: "Criterion", probabilistic: "Probabilistic model", deterministic: "Rule-based system" },
    comparison: [
      {
        criterion: "Reproducibility",
        probabilistic: "The same input can produce different outputs.",
        deterministic: "The same input and rule version always produce the same output.",
      },
      {
        criterion: "Explainability",
        probabilistic: "The reason may be an explanation generated after the fact.",
        deterministic: "The reason is the rule that fired.",
      },
      {
        criterion: "Verification",
        probabilistic: "Behaviour is estimated statistically, from a sample.",
        deterministic: "Each rule is tested directly against defined test cases.",
      },
      {
        criterion: "Change control",
        probabilistic: "Retraining can cause unexpected changes in behaviour.",
        deterministic: "Each change is versioned, reviewed and regression-tested.",
      },
      {
        criterion: "Failure mode",
        probabilistic: "Fluent but wrong output (hallucination) can be hard to spot.",
        deterministic: "Cases outside scope are marked plainly as “not assessed”.",
      },
    ],
    projects: {
      label: "Projects",
      title: "Two projects, two distinct problem areas.",
      intro: "The two projects address different problems: medication safety and hospital billing.",
      pharma: {
        name: "PharmaDeux",
        owner: "Medication-safety project",
        body: "A clinical decision support prototype that runs checks such as interactions, renal dosing and QT risk in one place while a prescription is written.",
        rows: [
          { label: "Stage", value: `Prototype, ${trlLabel("en")} (the team's own assessment)` },
          { label: "Automated tests", value: `${testsLabel("en")} (software level)` },
          { label: "Clinical evidence", value: "None yet" },
          { label: "Regulatory", value: "MDR Class IIa target; no CE mark" },
        ],
        link: "PharmaDeux page",
      },
      shield: {
        name: "Shield",
        owner: "Hospital-billing project",
        body: "A prototype that turns SUT and SGK rules into a rule set that runs before a claim is submitted. A risky line item goes to a specialist with the rule that fired and its reason.",
        rows: [
          { label: "Stage", value: "Prototype" },
          { label: "Validation", value: "Not tried on real claims yet" },
          { label: "Score", value: "Rule score; not a rejection probability or a savings estimate" },
        ],
        link: "Shield page",
      },
    },
    team: {
      label: "Team",
      title: "The team building PharmaDeux.",
      intro:
        "The team is made up of students at Konya Technical University. Below is what each member works on.",
    },
    collab: {
      label: "Collaboration",
      title: "Who we want to work with.",
      intro: "We are looking for four partner profiles. You can choose the relevant path on the contact page.",
      partners: [
        {
          title: "Clinical validation partner",
          who: "Training-and-research and university hospitals",
          body: "Clinical data and an independent expert panel to measure PharmaDeux on past cases and in shadow mode.",        },
        {
          title: "Academic researcher",
          who: "Medicine and pharmacology academics",
          body: "Source-based review of the rule sets and organ risk protocols, and joint publication.",        },
        {
          title: "Revenue cycle pilot partner",
          who: "Private and foundation hospitals",
          body: "Measuring rejection catch and false positive rates of Shield on past claims.",        },
        {
          title: "HIS integrator",
          who: "Health information system vendors",
          body: "Setting up the HL7 FHIR R4 bridge with a real hospital information system (HIS).",        },
      ],
      cta: "Contact us",
      email: "or by email:",
      noPatientData: "Do not send patient data or real claim data.",
    },
  },
});

// Brand marks for the profile links (Simple Icons paths, CC0), drawn in ink at text size.
const PROFILE_ICONS: Record<"github" | "linkedin", string> = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};
const PROFILE_LABELS = { github: "GitHub", linkedin: "LinkedIn" } as const;

/** Icon links to a member's profiles; each has a 44px target and a name such as "Semih Çoban — GitHub". */
function ProfileLinks({ name, links }: { name: string; links: { kind: "linkedin" | "github"; url: string | null }[] }) {
  const shown = links.filter((l): l is { kind: "linkedin" | "github"; url: string } => !!l.url);
  if (!shown.length) return null;
  return (
    <ul className="-ml-3 flex items-center print:hidden">
      {shown.map(({ kind, url }) => (
        <li key={kind}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} — ${PROFILE_LABELS[kind]}`}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-3 transition-colors duration-150 ease-out hover:text-ink ${FOCUS}`}
          >
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor" aria-hidden="true" focusable="false">
              <path d={PROFILE_ICONS[kind]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Section content in the nine content columns, under PaperSection's heading. */
function Content({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-x-10 lg:grid-cols-12">
      <div className="lg:col-span-9 lg:col-start-4">{children}</div>
    </div>
  );
}

export default function AboutView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);
  const members = teamCopy[locale];

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      {/* Hero: who we are and where the work stands; the summary sits beside it on wide screens. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-10 px-4 pt-6 pb-12 sm:px-6 sm:pt-12 sm:pb-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <nav aria-label={c.crumbs.aria}>
              <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
                <li>
                  <Link href={href("/")} className={`-my-3 inline-block py-3 ${LINK}`}>
                    {c.crumbs.home}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </li>
                <li aria-current="page" className="text-ink-2">
                  {c.crumbs.here}
                </li>
              </ol>
            </nav>
            <h1
              id="hero-title"
              className="mt-6 max-w-[22ch] font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:mt-8 sm:text-[46px] lg:text-[52px]"
            >
              {c.title}
            </h1>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-2">{c.lead}</p>
            <div className="mt-8">
              <a href="#ekip" className={BUTTON}>
                {c.secondary}
              </a>
            </div>
          </div>

          <aside aria-labelledby="about-summary" className="self-end border-t-2 border-ink pt-4 lg:col-span-4">
            <h2 id="about-summary" className="font-serif text-[20px] font-semibold text-ink">
              {c.summaryTitle}
            </h2>
            <dl className="mt-3 divide-y divide-rule border-t border-rule">
              {c.summary.map((r) => (
                <div key={r.label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                  <dt className="text-[13px] text-ink-3">{r.label}</dt>
                  <dd className="text-[14px] leading-snug text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Purpose: the two problems and the project that works on each one. */}
      <PaperSection id="amac" label={c.purpose.label} title={c.purpose.title}>
        <Content>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {c.purpose.items.map((item) => (
              <div key={item.title} className="border-t-2 border-ink pt-5">
                <h3 className="text-[20px] leading-snug font-semibold tracking-[-0.01em] text-ink">{item.title}</h3>
                <p className="mt-1 text-[14px] text-ink-3">{item.owner}</p>
                <p className="mt-4 text-[16px] leading-[1.65] text-ink-2">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[64ch] border-t border-rule pt-6 text-[17px] leading-[1.6] text-ink">{c.purpose.principle}</p>
        </Content>
      </PaperSection>

      {/* Approach: four steps in order. The rule-based comparison and the regulatory detail open on demand or link out. */}
      <PaperSection id="yaklasim" label={c.approach.label} title={c.approach.title} intro={<p>{c.approach.intro}</p>} band>
        <Content>
          <ol className="divide-y divide-rule border-y border-rule">
            {c.approach.steps.map((step, i) => (
              <li key={step.title} className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[48px_minmax(0,180px)_minmax(0,1fr)]">
                <span className="font-serif text-[28px] leading-none text-ink-3" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">{step.title}</h3>
                <div className="max-w-[62ch] text-[15px] leading-[1.65] text-ink-2">
                  <p>{step.body}</p>
                  {step.link && (
                    <Link href={href(step.link.href)} className={`mt-1 ${TEXT_ACTION}`}>
                      {step.link.label}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Disclosure summary={c.approach.whyRules} meta={c.approach.whyRulesMeta}>
              <div className="overflow-hidden border border-rule bg-white">
                <div className="hidden grid-cols-[170px_1fr_1fr] border-b border-rule text-[13px] text-ink-3 md:grid">
                  <div className="px-5 py-3">{c.columns.criterion}</div>
                  <div className="px-5 py-3">{c.columns.probabilistic}</div>
                  <div className="border-l border-rule px-5 py-3 text-ink">{c.columns.deterministic}</div>
                </div>
                <dl className="divide-y divide-rule">
                  {c.comparison.map((row) => (
                    <div key={row.criterion} className="grid gap-1.5 px-5 py-4 md:grid-cols-[170px_1fr_1fr] md:gap-0 md:p-0">
                      <dt className="text-[15px] font-medium text-ink md:px-5 md:py-4">{row.criterion}</dt>
                      <dd className="text-[14px] leading-[1.55] text-ink-2 md:px-5 md:py-4">
                        <span className="text-ink-3 md:hidden">{c.columns.probabilistic}: </span>
                        {row.probabilistic}
                      </dd>
                      <dd className="text-[14px] leading-[1.55] text-ink md:border-l md:border-rule md:px-5 md:py-4">
                        <span className="text-ink-3 md:hidden">{c.columns.deterministic}: </span>
                        {row.deterministic}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Disclosure>
          </div>

          <p className="mt-8 max-w-[70ch] text-[15px] leading-[1.6] text-ink-2">
            {c.approach.regulatory}{" "}
            <Link href={href("/legal/quality")} className={LINK}>
              {c.approach.regulatoryLink}
            </Link>
          </p>
        </Content>
      </PaperSection>

      {/* Projects: what each one is and where it stands. Detail lives on the product pages. */}
      <PaperSection id="odaklar" label={c.projects.label} title={c.projects.title} intro={<p>{c.projects.intro}</p>}>
        <Content>
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
            {[
              { p: c.projects.pharma, path: "/initiatives/pharmadeux", tone: "text-teal-700" },
              { p: c.projects.shield, path: "/initiatives/shield", tone: "text-indigo-700" },
            ].map(({ p, path, tone }) => (
              <article key={p.name} className="flex flex-col border-t-2 border-ink pt-5">
                <h3 className={`font-serif text-[30px] leading-tight font-medium ${tone}`}>{p.name}</h3>
                <p className="mt-1 text-[14px] leading-snug text-ink-3">{p.owner}</p>
                <p className="mt-4 text-[16px] leading-[1.65] text-ink-2">{p.body}</p>
                <div className="mt-5">
                  <FactRows rows={p.rows} labelWidth="sm:grid-cols-[130px_minmax(0,1fr)]" />
                </div>
                <Link href={href(path)} className={`mt-3 self-start md:mt-auto md:pt-3 ${TEXT_ACTION}`}>
                  {p.link}
                </Link>
              </article>
            ))}
          </div>
        </Content>
      </PaperSection>

      {/* Team: every member with equal weight, from the central team source. No photos, titles or advisors. */}
      <PaperSection id="ekip" label={c.team.label} title={c.team.title} intro={<p>{c.team.intro}</p>} band>
        <Content>
          <ul className="border-t border-ink">
            {TEAM.map((m) => {
              const t = members[m.id];
              return (
                <li
                  key={m.id}
                  className="grid gap-x-10 gap-y-2 border-b border-rule py-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:py-7"
                >
                  <div className="sm:col-start-1 sm:row-start-1">
                    <h3 className="font-serif text-[24px] leading-tight font-medium text-ink">{m.name}</h3>
                    <p className="mt-1 text-[14px] leading-snug text-ink-3">{t.role}</p>
                  </div>
                  <p className="max-w-[62ch] text-[15px] leading-[1.65] text-ink-2 sm:col-start-2 sm:row-span-2 sm:row-start-1">
                    {t.summary}
                  </p>
                  <div className="sm:col-start-1 sm:row-start-2">
                    <ProfileLinks
                      name={m.name}
                      links={[
                        { kind: "linkedin", url: m.linkedin },
                        { kind: "github", url: m.github },
                      ]}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Content>
      </PaperSection>

      {/* Collaboration profiles, followed by one clear contact action. */}
      <PaperSection id="isbirligi" label={c.collab.label} title={c.collab.title} intro={<p>{c.collab.intro}</p>}>
        <Content>
          <ul className="divide-y divide-rule border-y border-rule">
            {c.collab.partners.map((p) => (
              <li key={p.title} className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:items-baseline">
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{p.title}</h3>
                  <p className="mt-0.5 text-[14px] leading-snug text-ink-3">{p.who}</p>
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-2">{p.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
            <Link href={href("/contact")} className={`self-start ${BUTTON}`}>
              {c.collab.cta}
            </Link>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-2">
              {c.collab.email}
              <CopyEmail locale={locale} tone="paper" className="min-h-11 text-ink" />
            </p>
          </div>
          <p className="mt-5 text-[14px] text-ink-3">{c.collab.noPatientData}</p>
        </Content>
      </PaperSection>
    </main>
  );
}
