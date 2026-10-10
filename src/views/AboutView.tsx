import {
  BookOpen,
  FileCheck2,
  FlaskConical,
  GitCompare,
  GraduationCap,
  Hospital,
  Lock,
  LockKeyhole,
  Microscope,
  Repeat,
  ShieldAlert,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";
import SpecCard, { type SpecRow } from "@/components/SpecCard";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/about", {
  tr: {
    title: "Hakkımızda",
    description:
      "LavieuxLabs, ilaç güvenliği ve hastane faturalaması için test edilebilir karar destek yazılımı geliştiren bir Ar-Ge ekibidir.",
  },
  en: {
    title: "About",
    description:
      "LavieuxLabs is an R&D team building testable decision support software for medication safety and hospital billing.",
  },
});

const pillarIcons = [Target, FlaskConical];
const rndIcons = [BookOpen, GitCompare, Repeat, Lock];
const collaborationIcons = [Hospital, Microscope, GraduationCap, Users];
const regulatoryMeta = [
  { id: "REG-01", icon: FileCheck2, tone: "prep" as const },
  { id: "REG-02", icon: Workflow, tone: "input" as const },
  { id: "REG-03", icon: ShieldAlert, tone: "prep" as const },
  { id: "REG-04", icon: LockKeyhole, tone: "input" as const },
];

type Heading = { eyebrow: string; title: string; description: string };
type Card = { title: string; body: string; rows: SpecRow[] };

const copy = defineContent<{
  crumbs: { home: string; here: string };
  eyebrow: string;
  title: string;
  titleMuted: string;
  description: string;
  pillars: { label: string; title: string; body: string }[];
  rules: Heading;
  columns: { criterion: string; probabilistic: string; deterministic: string };
  shortColumns: { probabilistic: string; deterministic: string };
  comparison: { criterion: string; probabilistic: string; deterministic: string }[];
  rndHeading: Heading;
  rnd: Card[];
  regulatoryHeading: Heading;
  regulatory: (Card & { status: string })[];
  collaborationHeading: Heading;
  collaboration: Card[];
  cta: Heading & { label: string };
}>({
  tr: {
    crumbs: { home: "Ana sayfa", here: "Hakkımızda" },
    eyebrow: "Hakkımızda",
    title: "İlaç güvenliği ve faturalama için",
    titleMuted: "test edilebilir yazılım yapıyoruz.",
    description:
      "LavieuxLabs, klinik farmakoloji, sağlık operasyonları ve yazılım mühendisliğini bir araya getiren bir Ar-Ge ekibi. Hatanın hastaya ya da kuruma pahalıya mal olduğu işler için, her sonucu yeniden üretilebilen ve kararı insana bırakan sistemler geliştiriyoruz.",
    pillars: [
      {
        label: "Vizyon",
        title: "Her klinik ve idari kararın nedeni gösterilebilmeli.",
        body: "Bir karar destek sisteminin değeri ne kadar akıllı göründüğüyle değil, sonucunu tekrar üretip nedenini gösterebilmesiyle ölçülür.",
      },
      {
        label: "Misyon",
        title: "Hata maliyeti yüksek alanlar için test edilebilir yazılım.",
        body: "İlaç güvenliği ve faturalama gibi alanlarda hekimin ve uzmanın yerine geçen değil, işini kolaylaştıran araçlar yapıyoruz.",
      },
    ],
    rules: {
      eyebrow: "Neden kural tabanlı",
      title: "Karar anında tahmin değil, kural.",
      description:
        "Olasılıksal ve üretken modeller araştırma ve analiz için faydalı. Ama bir reçeteyi durdurabilecek bir uyarının her seferinde aynı sonucu vermesi ve hangi kaynaktan geldiğinin gösterilebilmesi gerekir. Bu yüzden karar anında kural tabanlı sistem kullanıyoruz.",
    },
    columns: { criterion: "Ölçüt", probabilistic: "Olasılıksal model", deterministic: "Kural tabanlı sistem" },
    shortColumns: { probabilistic: "Olasılıksal", deterministic: "Kural tabanlı" },
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
        deterministic: "Her kural, tanımlı test senaryolarıyla doğrudan doğrulanır.",
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
    rndHeading: {
      eyebrow: "Çalışma biçimi",
      title: "Kaynaktan koda, koddan teste.",
      description:
        "Düzenlemeye tabi bir ürünün gerektirdiği izlenebilirliği ve değişiklik kontrolünü ilk günden uyguluyoruz.",
    },
    rnd: [
      {
        title: "Kaynağı belli kurallar",
        body: "Kurallar resmi ürün bilgilerinden (KÜB/KT), klinik kılavuzlardan ve hakemli literatürden çıkarılır. Her kural kaynağını gösterir.",
        rows: [
          { label: "Kaynaklar", value: "KÜB / KT · kılavuzlar · hakemli literatür" },
          { label: "İzlenebilirlik", value: "Kural → kaynak" },
        ],
      },
      {
        title: "Gereksinimden teste iz",
        body: "Her klinik gereksinim, onu uygulayan kurala ve onu sınayan teste bağlıdır.",
        rows: [
          { label: "Zincir", value: "Gereksinim → kural → test" },
          { label: "Otomatik test", value: "2.480+", mono: true },
        ],
      },
      {
        title: "Kontrollü değişiklik",
        body: "Kural setleri sürümlenir. Hiçbir değişiklik gözden geçirilmeden ve testten geçmeden yayına çıkmaz.",
        rows: [
          { label: "Sürümleme", value: "Kural seti · bilgi tabanı" },
          { label: "Kapı", value: "Gözden geçirme + regresyon testi" },
        ],
      },
      {
        title: "Baştan güvenlik ve gizlilik",
        body: "Az veri toplamak, rol bazlı erişim ve değiştirilemeyen kayıt sonradan eklenmedi; sistem bunlarla başladı.",
        rows: [
          { label: "Kontroller", value: "Veri minimizasyonu · RBAC" },
          { label: "Kayıt", value: "Append-only denetim izi" },
        ],
      },
    ],
    regulatoryHeading: {
      eyebrow: "Kalite ve regülasyon",
      title: "Hangi standarda göre, hangi aşamadayız.",
      description:
        "Referans aldığımız standartları ve her birinde nerede olduğumuzu yazdık. Bu bir sertifika beyanı değildir.",
    },
    regulatory: [
      {
        title: "AB Tıbbi Cihaz Yönetmeliği",
        body: "PharmaDeux, ilaç tedavisi kararlarına bilgi sağlayan bir yazılım olduğu için MDR kapsamına giriyor.",
        rows: [
          { label: "Mevzuat", value: "MDR 2017/745 · Ek VIII Kural 11" },
          { label: "Hedef", value: "SaMD · Sınıf IIa" },
          { label: "CE işareti", value: "Henüz yok" },
        ],
        status: "Sınıf IIa hedefi",
      },
      {
        title: "Yazılım yaşam döngüsü ve risk",
        body: "Geliştirme ve risk yönetimi süreçleri bu standartlara göre kuruluyor.",
        rows: [
          { label: "Yaşam döngüsü", value: "IEC 62304" },
          { label: "Risk", value: "ISO 14971" },
        ],
        status: "Mimari uyum",
      },
      {
        title: "Kalite yönetim sistemi",
        body: "Kalite yönetim sistemi ve kullanılabilirlik çalışması yol haritasında.",
        rows: [
          { label: "KYS", value: "ISO 13485" },
          { label: "Kullanılabilirlik", value: "IEC 62366-1" },
        ],
        status: "Yol haritasında",
      },
      {
        title: "Bilgi güvenliği ve kişisel veri",
        body: "Kişisel veriler KVKK'ya göre işlenir; güvenlik kontrolleri ISO/IEC 27001'e göre kuruluyor.",
        rows: [
          { label: "Mevzuat", value: "6698 sayılı KVKK · md. 12" },
          { label: "Kontroller", value: "ISO/IEC 27001" },
        ],
        status: "Kontrol setine uyum hedefi",
      },
    ],
    collaborationHeading: {
      eyebrow: "Klinik iş birliği",
      title: "Sahadaki ekiplerle birlikte geliştiriyoruz.",
      description: "Bir karar destek sistemi, onu kullanacak ekibin iş akışına uymuyorsa güvenli olamaz.",
    },
    collaboration: [
      {
        title: "Klinik danışma",
        body: "Kural setleri ve ekranlar, klinisyenler ve klinik eczacılarla birlikte yazılır ve gözden geçirilir.",
        rows: [
          { label: "Paydaşlar", value: "Klinisyen · klinik eczacı" },
          { label: "Çıktı", value: "Gözden geçirilmiş kural setleri" },
        ],
      },
      {
        title: "Etik kurul ve veri",
        body: "Gerçek veriyle yapılan her çalışma etik kurul onayı, anonimleştirme ve kurumla imzalanan veri işleme sözleşmesi gerektirir.",
        rows: [
          { label: "Önkoşul", value: "Etik kurul onayı · DPA" },
          { label: "Veri", value: "Anonimleştirilmiş, KVKK uyumlu" },
        ],
      },
      {
        title: "Yayın",
        body: "Doğrulama çalışmalarını ortak kurumlarla birlikte hakemli dergilerde yayımlamayı hedefliyoruz.",
        rows: [
          { label: "Hedef", value: "Hakemli yayın" },
          { label: "Raporlama", value: "Duyarlılık · özgüllük · PPV" },
        ],
      },
      {
        title: "Sahadan geri bildirim",
        body: "Pilot kullanıcıların geri bildirimi düzenli toplanır ve hangi gereksinime dönüştüğü takip edilir.",
        rows: [
          { label: "Toplama", value: "Yapılandırılmış form" },
          { label: "İzlenebilirlik", value: "Geri bildirim → gereksinim" },
        ],
      },
    ],
    cta: {
      eyebrow: "İletişim",
      title: "Pilot, doğrulama ya da akademik iş birliği için yazın.",
      description: "Klinik, kurumsal ya da akademik bir çalışma fikriniz varsa kısa bir mesaj yeterli.",
      label: "Bize yazın",
    },
  },
  en: {
    crumbs: { home: "Home", here: "About" },
    eyebrow: "About",
    title: "We build testable software for",
    titleMuted: "medication safety and billing.",
    description:
      "LavieuxLabs is an R&D team bringing together clinical pharmacology, healthcare operations and software engineering. For work where a mistake is costly to a patient or an institution, we build systems whose every result can be reproduced and that leave the decision to a person.",
    pillars: [
      {
        label: "Vision",
        title: "The reason behind every clinical and administrative decision should be visible.",
        body: "A decision support system is worth what it can reproduce and explain, not how clever it looks.",
      },
      {
        label: "Mission",
        title: "Testable software where errors are expensive.",
        body: "In medication safety and billing, we build tools that make the physician's and specialist's work easier, not tools that replace them.",
      },
    ],
    rules: {
      eyebrow: "Why rule-based",
      title: "At the point of decision, rules rather than predictions.",
      description:
        "Probabilistic and generative models are useful for research and analysis. But an alert that can stop a prescription has to give the same result every time and show where it comes from. That is why we use a rule-based system at the point of decision.",
    },
    columns: { criterion: "Criterion", probabilistic: "Probabilistic model", deterministic: "Rule-based system" },
    shortColumns: { probabilistic: "Probabilistic", deterministic: "Rule-based" },
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
        deterministic: "Each rule is verified directly against defined test cases.",
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
    rndHeading: {
      eyebrow: "How we work",
      title: "From source to code, from code to test.",
      description:
        "We apply the traceability and change control a regulated product needs from the first day.",
    },
    rnd: [
      {
        title: "Rules with a known source",
        body: "Rules are taken from official product information (SmPC and patient leaflet), clinical guidelines and peer-reviewed literature. Every rule shows its source.",
        rows: [
          { label: "Sources", value: "SmPC / PIL · guidelines · peer-reviewed literature" },
          { label: "Traceability", value: "Rule → source" },
        ],
      },
      {
        title: "Traced from requirement to test",
        body: "Each clinical requirement is linked to the rule that implements it and the test that checks it.",
        rows: [
          { label: "Chain", value: "Requirement → rule → test" },
          { label: "Automated tests", value: "2,480+", mono: true },
        ],
      },
      {
        title: "Controlled change",
        body: "Rule sets are versioned. No change is released without review and passing tests.",
        rows: [
          { label: "Versioning", value: "Rule set · knowledge base" },
          { label: "Gate", value: "Review + regression tests" },
        ],
      },
      {
        title: "Security and privacy from the start",
        body: "Collecting little data, role-based access and an unchangeable log were not added later; the system started with them.",
        rows: [
          { label: "Controls", value: "Data minimisation · RBAC" },
          { label: "Log", value: "Append-only audit trail" },
        ],
      },
    ],
    regulatoryHeading: {
      eyebrow: "Quality and regulation",
      title: "Which standards, and where we stand.",
      description:
        "We list the standards we work against and where we stand on each. This is not a certification statement.",
    },
    regulatory: [
      {
        title: "EU Medical Device Regulation",
        body: "PharmaDeux provides information used in drug therapy decisions, so it falls under the MDR.",
        rows: [
          { label: "Regulation", value: "MDR 2017/745 · Annex VIII Rule 11" },
          { label: "Target", value: "SaMD · Class IIa" },
          { label: "CE mark", value: "Not yet" },
        ],
        status: "Class IIa target",
      },
      {
        title: "Software life cycle and risk",
        body: "Development and risk management processes are being set up to these standards.",
        rows: [
          { label: "Life cycle", value: "IEC 62304" },
          { label: "Risk", value: "ISO 14971" },
        ],
        status: "Architecture aligned",
      },
      {
        title: "Quality management system",
        body: "The quality management system and usability work are on the roadmap.",
        rows: [
          { label: "QMS", value: "ISO 13485" },
          { label: "Usability", value: "IEC 62366-1" },
        ],
        status: "On the roadmap",
      },
      {
        title: "Information security and personal data",
        body: "Personal data is processed under KVKK (Turkey's data protection law); security controls are being set up to ISO/IEC 27001.",
        rows: [
          { label: "Law", value: "KVKK No. 6698 · Art. 12" },
          { label: "Controls", value: "ISO/IEC 27001" },
        ],
        status: "Control set target",
      },
    ],
    collaborationHeading: {
      eyebrow: "Clinical collaboration",
      title: "We build it with the teams who will use it.",
      description: "A decision support system cannot be safe if it does not fit the workflow of the team using it.",
    },
    collaboration: [
      {
        title: "Clinical advice",
        body: "Rule sets and screens are written and reviewed with clinicians and clinical pharmacists.",
        rows: [
          { label: "Stakeholders", value: "Clinician · clinical pharmacist" },
          { label: "Output", value: "Reviewed rule sets" },
        ],
      },
      {
        title: "Ethics committee and data",
        body: "Every study on real data needs ethics committee approval, anonymisation and a data processing agreement with the institution.",
        rows: [
          { label: "Prerequisite", value: "Ethics approval · DPA" },
          { label: "Data", value: "Anonymised, KVKK-compliant" },
        ],
      },
      {
        title: "Publication",
        body: "We aim to publish validation studies in peer-reviewed journals together with partner institutions.",
        rows: [
          { label: "Goal", value: "Peer-reviewed publication" },
          { label: "Reporting", value: "Sensitivity · specificity · PPV" },
        ],
      },
      {
        title: "Feedback from the field",
        body: "Feedback from pilot users is collected regularly, and we track which requirement it turns into.",
        rows: [
          { label: "Collection", value: "Structured form" },
          { label: "Traceability", value: "Feedback → requirement" },
        ],
      },
    ],
    cta: {
      eyebrow: "Contact",
      title: "Write to us about a pilot, a validation study or academic work.",
      description: "If you have an idea for a clinical, institutional or academic study, a short message is enough.",
      label: "Write to us",
    },
  },
});

export default function AboutView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <main className="relative isolate flex-1 overflow-x-clip">
      <PageHero
        locale={locale}
        breadcrumbs={[{ href: "/", label: c.crumbs.home }, { label: c.crumbs.here }]}
        eyebrow={c.eyebrow}
        title={
          <>
            {c.title} <span className="text-white/50">{c.titleMuted}</span>
          </>
        }
        description={c.description}
      />

      {/* Vision & mission */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {c.pillars.map(({ label, title, body }, i) => {
            const Icon = pillarIcons[i];
            return (
              <Reveal
                key={label}
                delay={i * 0.08}
                className="rounded-2xl border border-white/[0.06] bg-navy-850 p-7 sm:p-9"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-white/55" strokeWidth={1.6} aria-hidden="true" />
                  <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{label}</p>
                </div>
                <h2 className="mt-6 text-xl leading-snug font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                  {title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/55">{body}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Rule-based decisions */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.rules} />

          <Reveal className="mt-14 overflow-hidden rounded-2xl border border-white/[0.06] bg-navy-850">
            <div className="hidden grid-cols-[180px_1fr_1fr] border-b border-white/[0.06] text-[11px] font-medium tracking-wider uppercase md:grid">
              <div className="px-6 py-4 text-white/55">{c.columns.criterion}</div>
              <div className="px-6 py-4 text-white/55">{c.columns.probabilistic}</div>
              <div className="px-6 py-4 text-white/70">{c.columns.deterministic}</div>
            </div>
            <dl className="divide-y divide-white/[0.06]">
              {c.comparison.map((row) => (
                <div
                  key={row.criterion}
                  className="grid gap-2 px-6 py-5 md:grid-cols-[180px_1fr_1fr] md:gap-0 md:px-0 md:py-0"
                >
                  <dt className="text-sm font-medium text-white md:px-6 md:py-5">{row.criterion}</dt>
                  <dd className="text-sm leading-relaxed text-white/55 md:px-6 md:py-5">
                    <span className="mr-2 text-[10px] font-medium uppercase tracking-wide text-white/55 md:hidden">
                      {c.shortColumns.probabilistic}
                    </span>
                    {row.probabilistic}
                  </dd>
                  <dd className="text-sm leading-relaxed text-white/80 md:border-l md:border-white/[0.06] md:bg-white/[0.02] md:px-6 md:py-5">
                    <span className="mr-2 text-[10px] font-medium uppercase tracking-wide text-white/60 md:hidden">
                      {c.shortColumns.deterministic}
                    </span>
                    {row.deterministic}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* R&D discipline */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.rndHeading} />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.rnd.map(({ title, body, rows }, i) => (
              <Reveal key={title} delay={i * 0.04} className="h-full">
                <SpecCard icon={rndIcons[i]} title={title} body={body} rows={rows} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory and quality framework */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.regulatoryHeading} />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {c.regulatory.map((r, i) => {
              const meta = regulatoryMeta[i];
              return (
                <Reveal key={meta.id} delay={i * 0.04} className="h-full">
                  <SpecCard
                    id={meta.id}
                    icon={meta.icon}
                    title={r.title}
                    body={r.body}
                    rows={r.rows}
                    status={{ label: r.status, tone: meta.tone }}
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical collaboration */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <SectionHeader {...c.collaborationHeading} />
          <ul className="grid gap-4 sm:grid-cols-2">
            {c.collaboration.map(({ title, body, rows }, i) => (
              <li key={title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <SpecCard icon={collaborationIcons[i]} title={title} body={body} rows={rows} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaPanel
        locale={locale}
        eyebrow={c.cta.eyebrow}
        title={c.cta.title}
        description={c.cta.description}
        primaryHref={localizedPath(locale, "/contact?solution=academic")}
        primaryLabel={c.cta.label}
      />
    </main>
  );
}
