import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FileCheck2,
  FlaskConical,
  GitCompare,
  GraduationCap,
  Hospital,
  Lock,
  LockKeyhole,
  Microscope,
  Network,
  ReceiptText,
  Repeat,
  Route,
  ShieldAlert,
  Stethoscope,
  Target,
  UserRound,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import CopyEmail from "@/components/CopyEmail";
import { TEAM_LEAD, contactHref, organizationProfile } from "@/lib/site";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { RailMarker } from "@/components/TelemetryRails";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";
import SpecCard, { JoinedGrid, type SpecRow } from "@/components/SpecCard";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";
import { testsLabel } from "@/lib/metrics";

export const metadata = defineMetadata("/about", {
  tr: {
    title: "Hakkımızda",
    description:
      "LavieuxLabs, Konya Teknik Üniversitesi öğrencileri tarafından geliştirilen, ilaç güvenliği ve hastane faturalaması için karar destek yazılımı üreten bağımsız bir Ar-Ge girişimidir.",
  },
  en: {
    title: "About",
    description:
      "LavieuxLabs is an independent R&D venture built by students of Konya Technical University, developing decision support software for medication safety and hospital billing.",
  },
});

const pillarIcons = [Target, FlaskConical];
const focusIcons = [Route, Network, ReceiptText];
// Decision path → PharmaDeux (physicians), data layer → both products (neutral), revenue → Shield.
const focusAccents = ["pharma", undefined, "shield"] as const;
const rndIcons = [BookOpen, GitCompare, Repeat, Lock];
const collaborationIcons = [Hospital, Microscope, GraduationCap, Users];
// Tone drives the card's implementation track (input → prep → live); it must match the status text:
// Class IIa target and architecture alignment are in preparation, roadmap and control-set target are inputs.
// Accent follows ownership: MDR, IEC 62304 / ISO 14971 and ISO 13485 concern the PharmaDeux medical-device
// software; KVKK / ISO 27001 cover both products, so that card stays neutral.
const regulatoryMeta = [
  { id: "REG-01", icon: FileCheck2, tone: "prep" as const, accent: "pharma" as const },
  { id: "REG-02", icon: Workflow, tone: "prep" as const, accent: "pharma" as const },
  { id: "REG-03", icon: ShieldAlert, tone: "input" as const, accent: "pharma" as const },
  { id: "REG-04", icon: LockKeyhole, tone: "input" as const, accent: undefined },
];

type Heading = { eyebrow: string; title: string; description: string };
type Card = { title: string; body: string; rows: SpecRow[] };
type FocusCard = Card & { outcome: { label: string; body: string } };

const copy = defineContent<{
  crumbs: { home: string; here: string };
  eyebrow: string;
  title: string;
  description: string;
  pillars: { label: string; title: string; body: string }[];
  rules: Heading;
  columns: { criterion: string; probabilistic: string; deterministic: string };
  shortColumns: { probabilistic: string; deterministic: string };
  comparison: { criterion: string; probabilistic: string; deterministic: string }[];
  focusHeading: Heading;
  focus: FocusCard[];
  rndHeading: Heading;
  rnd: Card[];
  regulatoryHeading: Heading;
  regulatory: (Card & { status: string })[];
  collaborationHeading: Heading;
  collaboration: Card[];
  teamHeading: Heading;
  lead: { label: string; role: string; body: string; rows: SpecRow[]; email: string };
  advisory: { label: string; title: string; body: string; rows: SpecRow[]; link: string };
  cta: Heading & { label: string };
}>({
  tr: {
    crumbs: { home: "Ana sayfa", here: "Hakkımızda" },
    eyebrow: "Hakkımızda",
    title: "İlaç güvenliği ve faturalama için test edilebilir yazılım yapıyoruz.",
    description: `${organizationProfile.tr.positioning} ${organizationProfile.tr.stage} Hatanın hastaya ya da kuruma pahalıya mal olduğu işler için, her sonucu yeniden üretilebilen ve kararı insana bırakan sistemler geliştiriyoruz.`,
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
    focusHeading: {
      eyebrow: "Ar-Ge odakları",
      title: "Üç Ar-Ge odağı ve kuruma etkisi.",
      description:
        "Her odağın teknik kapsamını ve hastanede kimin işini kolaylaştırdığını yazdık. Henüz tamamlanmamış olanı açıkça belirttik.",
    },
    focus: [
      {
        title: "Deterministik karar yolu",
        body: "Öneri üretken bir modelden değil, sürümlenmiş bir kural motorundan gelir. Aynı girdi ve kural sürümü her zaman aynı sonucu verir. Yaşam döngüsü IEC 62304'e göre kurgulanır.",
        rows: [
          { label: "Motor", value: "Sürümlenmiş kural seti" },
          { label: "Yaşam döngüsü", value: "IEC 62304", mono: true, cite: "iec62304" },
          { label: "Durum", value: "Mimari uyum · sertifika henüz yok" },
        ],
        outcome: {
          label: "Hekim için",
          body: "Uydurma çıktı üretebilecek bir bileşen yok. Her uyarı, onu tetikleyen kural ve eşik değeriyle gelir; aynı hasta için sonuç tekrar üretilebilir.",
        },
      },
      {
        title: "Sağlık veri katmanı ve birlikte çalışabilirlik",
        body: "Klinik veri HL7 FHIR R4 kaynakları olarak alınır. FHIR'a geçmemiş HBYS'lerin HL7 v2 mesajları FHIR R4'e dönüştürülür. İlaç, tanı ve birimler ATC, ICD-10 ve UCUM ile eşleştirilir.",
        rows: [
          { label: "Standart", value: "HL7 FHIR R4", mono: true },
          { label: "Köprü", value: "HL7 v2 · MLLP → FHIR R4" },
          { label: "Kodlama", value: "ATC · ICD-10 · UCUM", mono: true },
          { label: "Kurulum", value: "Kurum içi (Docker) · izole VPC" },
        ],
        outcome: {
          label: "Bilgi işlem için",
          body: "Veri kurumun altyapısından çıkmaz. Sistem mevcut HBYS akışını değiştirmeden, yanına eklenen bir katman olarak çalışır.",
        },
      },
      {
        title: "Gelir bütünlüğü ve regülasyon modellemesi",
        body: "SUT ve SGK geri ödeme kuralları, fatura gönderilmeden önce çalışan bir kural setine dönüştürülür. Riskli kalem, tetiklenen kural ve gerekçesiyle uzmanın kuyruğuna düşer. PharmaDeux'nün MDR teknik dosyası aynı izlenebilirlikle hazırlanır.",
        rows: [
          { label: "Kurallar", value: "SUT · SGK geri ödeme" },
          { label: "Kategori", value: "EK-2B hizmet başı · EK-2C paket" },
          { label: "Teknik dosya", value: "MDR Sınıf IIa hedefi · CE henüz yok" },
        ],
        outcome: {
          label: "Hastane yönetimi için",
          body: "Red riski fatura gönderilmeden önce, gerekçesiyle görülür. Düzeltme, red kararı gelmeden yapılabilir.",
        },
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
          { label: "Otomatik test", value: testsLabel("tr"), mono: true },
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
          { label: "Mevzuat", value: "MDR 2017/745 · Ek VIII Kural 11", cite: "mdrRule11" },
          { label: "Hedef", value: "SaMD · Sınıf IIa" },
          { label: "CE işareti", value: "Henüz yok" },
        ],
        status: "Sınıf IIa hedefi",
      },
      {
        title: "Yazılım yaşam döngüsü ve risk",
        body: "Geliştirme ve risk yönetimi süreçleri bu standartlara göre kuruluyor.",
        rows: [
          { label: "Yaşam döngüsü", value: "IEC 62304", cite: "iec62304" },
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
        body: "Kural setleri ve arayüzler, bağımsız klinisyenler ve klinik eczacıların doğrudan geri bildirimiyle pilot süreçler boyunca sürekli revize edilir.",
        rows: [
          { label: "Paydaşlar", value: "Klinisyen · klinik eczacı" },
          { label: "Çıktı", value: "Gözden geçirilmiş kural setleri" },
        ],
      },
      {
        title: "Etik kurul ve veri protokolü",
        body: "Pilot çalışmalar öncesinde kurumun yetkili etik kurulundan onay alınması, verilerin kurum içi altyapıda anonimleştirilmesi ve taraflar arasında Veri İşleme Sözleşmesi (DPA) imzalanması zorunlu önkoşuldur.",
        rows: [
          { label: "Önkoşul", value: "Kurum etik kurul onayı · DPA" },
          { label: "Kapsam", value: "Yerinde anonimleştirme · KVKK uyumlu" },
        ],
      },
      {
        title: "Yayın",
        body: "Pilot doğrulama sonuçlarının, ortak kurumların klinisyenleri ve araştırmacılarıyla birlikte hakemli tıp dergilerinde bağımsız duyarlılık raporu olarak yayımlanması hedeflenir.",
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
    teamHeading: {
      eyebrow: "Ekip",
      title: "Çekirdek kadro ve girişim.",
      description: `${organizationProfile.tr.stage} ${organizationProfile.tr.independence}`,
    },
    lead: {
      label: "Çekirdek kadro",
      role: "Proje lideri ve sistem mimarı",
      body: "Karar motorunun mimarisini ve PharmaDeux'nün farmakolojik kural motorlarını tasarlıyor. FHIR R4 entegrasyonundan kuruluma kadar sistem tasarımını yürütüyor.",
      rows: [
        { label: "Odak", value: "Karar motoru mimarisi · farmakolojik kural motorları" },
        { label: "Entegrasyon", value: "HL7 FHIR R4 · sistem tasarımı" },
        { label: "Eğitim", value: "Konya Teknik Üniversitesi · Bilgisayar Mühendisliği" },
      ],
      email: "E-posta",
    },
    advisory: {
      label: "Danışma",
      title: "Klinik ve Akademik Danışma Kurulu",
      body: "Kurul kurulum aşamasında; henüz resmi olarak oluşmuş bir kurul yok. Klinik doğrulama, organ risk protokolleri ve farmakoloji kuralları tıp fakültesi akademisyenleri ve klinik danışmanlarla birlikte yürütülecek. Yeni akademik ortaklıklara açığız.",
      rows: [
        { label: "Kapsam", value: "Klinik doğrulama · organ risk protokolleri · farmakoloji kuralları" },
        { label: "Danışmanlar", value: "Tıp fakültesi akademisyenleri · klinik danışmanlar" },
        { label: "Durum", value: "Kurulum aşamasında · üyeler onaylarıyla yayımlanacak" },
      ],
      link: "Akademik iş birliği için yazın",
    },
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
    title: "We build testable software for medication safety and billing.",
    description: `${organizationProfile.en.positioning} ${organizationProfile.en.stage} For work where a mistake is costly to a patient or an institution, we build systems whose every result can be reproduced and that leave the decision to a person.`,
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
    focusHeading: {
      eyebrow: "R&D focus areas",
      title: "Three R&D focus areas and what they change for the hospital.",
      description:
        "For each area we list the technical scope and whose work it makes easier. Where something is not finished yet, we say so.",
    },
    focus: [
      {
        title: "Deterministic decision path",
        body: "Recommendations come from a versioned rule engine, not from a generative model. The same input and rule version always give the same result. The life cycle is set up according to IEC 62304.",
        rows: [
          { label: "Engine", value: "Versioned rule set" },
          { label: "Life cycle", value: "IEC 62304", mono: true, cite: "iec62304" },
          { label: "Status", value: "Architecture aligned · not certified yet" },
        ],
        outcome: {
          label: "For physicians",
          body: "No component can make up an answer. Every alert comes with the rule and threshold that triggered it, and the result can be reproduced for the same patient.",
        },
      },
      {
        title: "Health data layer and interoperability",
        body: "Clinical data arrives as HL7 FHIR R4 resources. HL7 v2 messages from hospital information systems (HIS) that have not moved to FHIR are converted to FHIR R4. Drugs, diagnoses and units are mapped to ATC, ICD-10 and UCUM.",
        rows: [
          { label: "Standard", value: "HL7 FHIR R4", mono: true },
          { label: "Bridge", value: "HL7 v2 · MLLP → FHIR R4" },
          { label: "Coding", value: "ATC · ICD-10 · UCUM", mono: true },
          { label: "Deployment", value: "On-premises (Docker) · isolated VPC" },
        ],
        outcome: {
          label: "For hospital IT",
          body: "Data does not leave the institution's infrastructure. The system runs as a layer next to the existing HIS workflow, without changing it.",
        },
      },
      {
        title: "Revenue integrity and regulatory modelling",
        body: "SUT (the national reimbursement rules) and SGK (Social Security Institution) rules become a rule set that runs before a claim is submitted. A risky line item goes to the specialist's queue with the rule and reason that flagged it. PharmaDeux's MDR technical file is kept with the same traceability.",
        rows: [
          { label: "Rules", value: "SUT · SGK reimbursement" },
          { label: "Category", value: "EK-2B fee-for-service · EK-2C package" },
          { label: "Technical file", value: "MDR Class IIa target · no CE mark yet" },
        ],
        outcome: {
          label: "For hospital management",
          body: "Rejection risk is visible, with its reason, before the claim is submitted. Corrections can be made before a rejection arrives.",
        },
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
          { label: "Automated tests", value: testsLabel("en"), mono: true },
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
          { label: "Regulation", value: "MDR 2017/745 · Annex VIII Rule 11", cite: "mdrRule11" },
          { label: "Target", value: "SaMD · Class IIa" },
          { label: "CE mark", value: "Not yet" },
        ],
        status: "Class IIa target",
      },
      {
        title: "Software life cycle and risk",
        body: "Development and risk management processes are being set up to these standards.",
        rows: [
          { label: "Life cycle", value: "IEC 62304", cite: "iec62304" },
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
        body: "Rule sets and interfaces are revised continuously throughout the pilots, based on direct feedback from independent clinicians and clinical pharmacists.",
        rows: [
          { label: "Stakeholders", value: "Clinician · clinical pharmacist" },
          { label: "Output", value: "Reviewed rule sets" },
        ],
      },
      {
        title: "Ethics committee and data protocol",
        body: "Prior to pilot studies, obtaining institutional ethics committee approval, anonymising data within hospital infrastructure, and executing a Data Processing Agreement (DPA) are mandatory prerequisites.",
        rows: [
          { label: "Prerequisite", value: "Institutional IRB/ethics approval · DPA" },
          { label: "Scope", value: "On-prem anonymisation · data protection compliant" },
        ],
      },
      {
        title: "Publication",
        body: "Pilot validation findings are targeted for joint publication with partner clinicians and researchers in peer-reviewed journals as independent sensitivity reports.",
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
    teamHeading: {
      eyebrow: "Team",
      title: "Core team and venture.",
      description: `${organizationProfile.en.stage} ${organizationProfile.en.independence}`,
    },
    lead: {
      label: "Core team",
      role: "Project lead and system architect",
      body: "Designs the decision engine architecture and the PharmaDeux pharmacological rule engines. Leads system design, from FHIR R4 integration to deployment.",
      rows: [
        { label: "Focus", value: "Decision engine architecture · pharmacological rule engines" },
        { label: "Integration", value: "HL7 FHIR R4 · system design" },
        { label: "Education", value: "Konya Technical University · Computer Engineering" },
      ],
      email: "Email",
    },
    advisory: {
      label: "Advisory",
      title: "Clinical and Academic Advisory Board",
      body: "The board is being set up; no formal board exists yet. Clinical validation, organ risk protocols and pharmacology rules will be worked out with medical faculty academics and clinical advisors. We are open to new academic partnerships.",
      rows: [
        { label: "Scope", value: "Clinical validation · organ risk protocols · pharmacology rules" },
        { label: "Advisors", value: "Medical faculty academics · clinical advisors" },
        { label: "Status", value: "Being set up · members published with their consent" },
      ],
      link: "Write to us about academic work",
    },
    cta: {
      eyebrow: "Contact",
      title: "Write to us about a pilot, a validation study or academic work.",
      description: "If you have an idea for a clinical, institutional or academic study, a short message is enough.",
      label: "Write to us",
    },
  },
});

const linkCellClass =
  "flex items-center justify-between gap-3 px-5 py-3.5 text-[13px] font-medium text-white/80 transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-white sm:px-6";

function ExternalCell({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCellClass}>
      <span lang="en">{label}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/55" aria-hidden="true" />
    </a>
  );
}

/**
 * One cell of the team grid, in the SpecCard idiom: label, title, two sentences, spec rows on hairlines,
 * then a link strip that bleeds to the cell edges and sits flush on the bottom hairline.
 */
function TeamCell({
  icon: Icon,
  label,
  title,
  subtitle,
  body,
  rows,
  children,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: string;
  body: string;
  rows: SpecRow[];
  children: ReactNode;
}) {
  return (
    // From lg the cell is a subgrid of five tracks (label · name · body · rows · links), so the rule lines
    // of the two cells sit at the same height.
    <article className="flex h-full flex-col bg-navy-850 p-5 pb-0 sm:p-6 sm:pb-0 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0">
      <header className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-white/55" strokeWidth={1.6} aria-hidden="true" />
        <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{label}</p>
      </header>
      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-white/60">{subtitle}</p>}
      </div>
      <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-white/55">{body}</p>
      <div className="mt-auto pt-8">
        <dl className="-mx-5 divide-y divide-hairline border-t border-hairline sm:-mx-6">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[92px_1fr] gap-3 px-5 py-2 sm:px-6">
              <dt className="text-[11.5px] text-white/55">{row.label}</dt>
              <dd className="text-[12.5px] leading-snug text-white/75">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="-mx-5 grid divide-y divide-hairline border-t border-hairline sm:-mx-6 sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0">
        {children}
      </div>
    </article>
  );
}

export default function AboutView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <main className="relative isolate flex-1 overflow-x-clip">
      <PageHero
        locale={locale}
        breadcrumbs={[{ href: "/", label: c.crumbs.home }, { label: c.crumbs.here }]}
        eyebrow={c.eyebrow}
        title={c.title}
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
                className="rounded-2xl border border-hairline bg-navy-850 p-7 sm:p-9"
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

      {/* Core team and advisory board */}
      <section id="ekip" className="relative scroll-mt-24 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.teamHeading} />
          <JoinedGrid className="mt-14" columns="lg:grid-cols-2">
            <TeamCell icon={UserRound} label={c.lead.label} title={TEAM_LEAD.name} subtitle={c.lead.role} body={c.lead.body} rows={c.lead.rows}>
              {TEAM_LEAD.github && <ExternalCell href={TEAM_LEAD.github} label="GitHub" />}
              {TEAM_LEAD.linkedin && <ExternalCell href={TEAM_LEAD.linkedin} label="LinkedIn" />}
              <div className="flex items-center gap-3 px-5 py-3.5 text-[13px] text-white/70 sm:px-6">
                <span className="whitespace-nowrap text-white/55">{c.lead.email}</span>
                <CopyEmail locale={locale} />
              </div>
            </TeamCell>
            <TeamCell icon={Stethoscope} label={c.advisory.label} title={c.advisory.title} body={c.advisory.body} rows={c.advisory.rows}>
              <Link
                href={localizedPath(locale, contactHref("academic"))}
                className={linkCellClass}
              >
                {c.advisory.link}
                <ArrowRight className="h-4 w-4 shrink-0 text-white/55" aria-hidden="true" />
              </Link>
            </TeamCell>
          </JoinedGrid>
        </div>
      </section>

      {/* Rule-based decisions */}
      <section className="relative py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.rules} />

          <Reveal className="mt-14 overflow-hidden rounded-2xl border border-hairline bg-navy-850">
            <div className="hidden grid-cols-[180px_1fr_1fr] border-b border-hairline text-[11px] font-medium tracking-wider uppercase md:grid">
              <div className="px-6 py-4 text-white/55">{c.columns.criterion}</div>
              <div className="px-6 py-4 text-white/55">{c.columns.probabilistic}</div>
              <div className="px-6 py-4 text-white/70">{c.columns.deterministic}</div>
            </div>
            <dl className="divide-y divide-hairline">
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
                  <dd className="text-sm leading-relaxed text-white/80 md:border-l md:border-hairline md:bg-white/[0.02] md:px-6 md:py-5">
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

      {/* R&D focus areas and what they change for the institution */}
      <section id="odaklar" className="relative scroll-mt-24 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.focusHeading} />
          <JoinedGrid className="mt-14" columns="lg:grid-cols-3">
            {c.focus.map(({ title, body, rows, outcome }, i) => (
              <SpecCard
                key={title}
                variant="cell"
                align={{ rows: Math.max(...c.focus.map((x) => x.rows.length)), outcome: true }}
                icon={focusIcons[i]}
                accent={focusAccents[i]}
                prominent
                title={title}
                body={body}
                rows={rows}
                outcome={outcome}
              />
            ))}
          </JoinedGrid>
        </div>
      </section>

      {/* R&D discipline */}
      <section className="relative py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.rndHeading} />
          <JoinedGrid className="mt-14" columns="sm:grid-cols-2 lg:grid-cols-4">
            {c.rnd.map(({ title, body, rows }, i) => (
              <SpecCard
                key={title}
                variant="cell"
                align={{ rows: Math.max(...c.rnd.map((x) => x.rows.length)) }}
                icon={rndIcons[i]}
                title={title}
                body={body}
                rows={rows}
              />
            ))}
          </JoinedGrid>
        </div>
      </section>

      {/* Regulatory and quality framework */}
      <section className="relative py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.regulatoryHeading} />
          <JoinedGrid className="mt-14" columns="sm:grid-cols-2 xl:grid-cols-4">
            {c.regulatory.map((r, i) => {
              const meta = regulatoryMeta[i];
              return (
                <SpecCard
                  key={meta.id}
                  variant="cell"
                  align={{ rows: Math.max(...c.regulatory.map((x) => x.rows.length)) }}
                  id={meta.id}
                  accent={meta.accent}
                  icon={meta.icon}
                  title={r.title}
                  body={r.body}
                  rows={r.rows}
                  status={{ label: r.status, tone: meta.tone }}
                />
              );
            })}
          </JoinedGrid>
        </div>
      </section>

      {/* Clinical collaboration */}
      <section className="relative py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <SectionHeader {...c.collaborationHeading} />
          <JoinedGrid as="ul" columns="sm:grid-cols-2">
            {c.collaboration.map(({ title, body, rows }, i) => (
              <li key={title}>
                <SpecCard variant="cell" icon={collaborationIcons[i]} title={title} body={body} rows={rows} />
              </li>
            ))}
          </JoinedGrid>
        </div>
      </section>

      <CtaPanel
        locale={locale}
        eyebrow={c.cta.eyebrow}
        title={c.cta.title}
        description={c.cta.description}
        primaryHref={localizedPath(locale, contactHref("academic"))}
        primaryLabel={c.cta.label}
      />
    </main>
  );
}
