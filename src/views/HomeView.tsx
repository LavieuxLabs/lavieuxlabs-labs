import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/structuredData";
import { defineContent, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

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
 * Home page on the paper surface (Academic Editorial). Communication order: hero → what we do.
 * The two project sections were removed from the home page at the user's request.
 * Type roles: Newsreader for the page title, section titles, project and person names and step numerals;
 * IBM Plex Sans for all running text, labels and tables; IBM Plex Mono only for numbers that are data.
 * Type scale: 13 caption · 14 small · 15 secondary · 17 body · 20 sub-heading · serif 30/40 section · 36/58 page.
 * Colour: ink on paper; a product's accent (its dark step) appears only on its own name; clinical and review
 * states keep their own colours inside figures.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
const BUTTON = `inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors duration-150 ease-out hover:bg-ink-2 ${FOCUS}`;

type Activity = { owner: "pharma" | "shield" | "both"; title: string; body: string };

const copy = defineContent<{
  hero: {
    kicker: string;
    title: string;
    lead: string;
    secondary: string;
  };
  problem: { label: string; title: string; pharma: { title: string; body: string[] }; shield: { title: string; body: string[] } };
  activities: {
    label: string;
    title: string;
    intro: string;
    both: string;
    items: Activity[];
  };
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
    activities: {
      label: "Neler yapıyoruz",
      both: "İki proje",
      title: "Prototiplerin bugün yaptığı işler.",
      intro: "Her iki işte de kararı hekim, eczacı ya da faturalama uzmanı verir. Yazılım bir uyarının nedenini gösterir ve aynı girdide aynı sonucu verir. Hepsi sentetik veriyle test ediliyor; hiçbiri gerçek hasta ya da fatura verisiyle doğrulanmadı.",
      items: [
        { owner: "pharma", title: "İlaç etkileşimi", body: "Çok ilaç kullanan hastada etkileşimleri elle taramak gerçekçi değil. Reçetedeki ilaç-ilaç etkileşimini ve aynı gruptan tekrarlanan ilacı (terapötik duplikasyon) reçete yazılırken kontrol eder." },
        { owner: "pharma", title: "Organ yükü", body: "Risk çoğu zaman tek bir ilaç çiftinden gelmez. Böbrek ve karaciğere binen toksik yükü, antikolinerjik ve serotonerjik kümülatif yükü birlikte değerlendirir." },
        { owner: "pharma", title: "Doz ve böbrek fonksiyonu", body: "eGFR'si 90 olan hastada güvenli olan reçete, 30'da doz ayarı gerektirebilir. Doz aralığına bakar ve renal doz ayarı gerekip gerekmediğini gösterir." },
        { owner: "shield", title: "Fatura kalemi denetimi", body: "SUT ve SGK kurallarına takılan kalem çoğu zaman gönderildikten sonra fark edilir. Shield kalemleri gönderimden önce kontrol eder; riskli kalemi nedeniyle birlikte uzmana iletir." },
        { owner: "both", title: "Referans standartlar", body: "Kuralların dayandığı ürün bilgisini, risk skorlarını ve kılavuzları kaynaklarıyla Standartlar sayfasında yayımlar." },
        { owner: "both", title: "Sentetik veriyle test", body: "Kurallar sentetik hasta profilleri ve sentetik faturalarla otomatik olarak test edilir." },
      ],
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
    activities: {
      label: "What we do",
      both: "Both projects",
      title: "What the prototypes do today.",
      intro: "In both, the physician, pharmacist or billing specialist makes the decision. The software shows the reason for an alert and gives the same result for the same input. All of it is tested on synthetic data; none of it has been validated with real patient or billing data.",
      items: [
        { owner: "pharma", title: "Drug interactions", body: "Scanning a patient on many drugs for interactions by hand is not realistic. PharmaDeux checks a prescription for drug-drug interactions and for duplicate therapy within the same drug class while the prescription is written." },
        { owner: "pharma", title: "Organ burden", body: "Risk rarely comes from a single drug pair. PharmaDeux looks at toxic load on the kidneys and liver, and at cumulative anticholinergic and serotonergic load, together." },
        { owner: "pharma", title: "Dose and kidney function", body: "A prescription that is safe at an eGFR of 90 may need a dose adjustment at 30. PharmaDeux checks the dose range and shows whether a renal dose adjustment is needed." },
        { owner: "shield", title: "Claim item review", body: "A claim line that breaks SUT (Turkey's reimbursement tariff) or SGK (social security) rules is often noticed only after submission. Shield checks lines before submission and passes risky ones to a specialist with the reason." },
        { owner: "both", title: "Reference standards", body: "Publishes the product information, risk scores and guidelines the rules rely on, with sources, on the Standards pages." },
        { owner: "both", title: "Testing on synthetic data", body: "The rules are tested automatically on synthetic patient profiles and synthetic claims." },
      ],
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

export default function HomeView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      <JsonLd data={homeJsonLd(locale)} />

      {/* Hero: what we build and the way into the two projects. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-6 pb-12 text-center sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pb-20">
          <p className="font-serif text-[17px] text-ink-3">{c.hero.kicker}</p>
          <h1
            id="hero-title"
            className="mx-auto mt-3 max-w-[26ch] text-balance font-serif text-[36px] leading-[1.06] font-medium tracking-[-0.022em] text-ink sm:mt-4 sm:text-[48px] lg:text-[58px]"
          >
            {c.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[58ch] text-pretty text-[17px] leading-[1.6] text-ink-2">{c.hero.lead}</p>
          <div className="mt-8 flex justify-center">
            <a href="#platformlar" className={BUTTON}>
              {c.hero.secondary}
            </a>
          </div>
        </div>
      </section>

      {/* What the two prototypes do today: a ruled grid, no boxes. Product names carry their accent colour. */}
      <Section id="platformlar" label={c.activities.label} title={c.activities.title} intro={c.activities.intro}>
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {c.activities.items.map((item) => (
            <li key={item.title} className="border-t border-rule pt-5 pb-8">
              <p className="text-[14px] text-ink-3">
                {item.owner === "pharma" && (
                  <span className="text-teal-700" lang="en">
                    PharmaDeux
                  </span>
                )}
                {item.owner === "shield" && (
                  <span className="text-indigo-700" lang="en">
                    Shield
                  </span>
                )}
                {item.owner === "both" && c.activities.both}
              </p>
              <h3 className="mt-2 text-[17px] leading-snug font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

    </main>
  );
}
