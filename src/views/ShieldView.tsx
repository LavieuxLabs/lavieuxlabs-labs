import Link from "next/link";
import {
  ShieldCheck,
  ArrowUpRight,
  Copy,
  FileWarning,
  Stethoscope,
  UserCog,
  Eye,
  FileClock,
  Gauge,
  Hourglass,
  Inbox,
  ListChecks,
  Receipt,
  Send,
  ShieldAlert,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import ShieldMatrix from "@/components/ShieldMatrix";
import InPageNav from "@/components/InPageNav";
import SectionHeader from "@/components/SectionHeader";
import FlowDiagram from "@/components/FlowDiagram";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";
import ShieldConsole from "@/components/ShieldConsole";
import JsonLd from "@/components/JsonLd";
import { RailMarker } from "@/components/TelemetryRails";
import ClaimSimulator from "@/components/ClaimSimulator";
import SpecCard, { JoinedGrid, type SpecRow } from "@/components/SpecCard";
import { shieldJsonLd } from "@/lib/structuredData";
import { contactHref } from "@/lib/site";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/initiatives/shield", {
  tr: {
    title: "Shield",
    description:
      "Hastane fatura ve provizyon kalemlerini gönderimden önce SUT ve SGK provizyon kurallarına göre denetler. Riskli kalem, gerekçesiyle birlikte uzmanın kuyruğuna düşer.",
  },
  en: {
    title: "Shield",
    description:
      "Checks hospital billing and provision line items before submission against SUT (Turkey's reimbursement rulebook) and SGK (Social Security Institution) provision rules. A risky line item goes to the specialist's queue together with the reason.",
  },
});

const LABEL = "text-[11px] font-medium tracking-wider text-white/50 uppercase";

const problemIcons = [Hourglass, ListChecks, Eye];
const pipelineIcons = [Receipt, ShieldAlert, Gauge, Inbox, Send, FileClock];
// Audit planes as documented on /standartlar/sut-fatura-denetimi. Tone is the implementation track and must
// match the status text: three planes are implemented and covered by automated tests, the fourth is not built yet.
const planeMeta = [
  { id: "SUT-01", icon: UserCog, tone: "live" as const },
  { id: "SUT-02", icon: Copy, tone: "live" as const },
  { id: "SUT-03", icon: Stethoscope, tone: "live" as const },
  { id: "SUT-04", icon: FileWarning, tone: "input" as const },
];

type Heading = { eyebrow: string; title: string; description: string };

const simCopy = defineContent({
  tr: {
    eyebrow: "Fatura uygunluk simülatörü",
    title: "Bir kalem seçin, red riskini gönderimden önce görün.",
    description:
      "Branş, fatura kalemi ve tanı kodu değiştikçe kural motoru skoru yeniden hesaplar. Skoru 40 ve üzerinde olan kalem uzmanın kuyruğuna düşer.",
  },
  en: {
    eyebrow: "Claim check simulator",
    title: "Pick a line item and see its rejection risk before submission.",
    description:
      "As the department, line item and diagnosis code change, the rule engine recalculates the score. Items scoring 40 or more go to the specialist's queue.",
  },
});

const copy = defineContent<{
  sections: { id: string; label: string }[];
  heroStats: { value: string; label: string }[];
  crumbs: { home: string; products: string };
  eyebrow: string;
  title: string;
  description: string;
  ctaIntro: string;
  ctaPilot: string;
  ctaTry: string;
  problem: Heading;
  problems: { title: string; body: string }[];
  how: Heading;
  pipeline: { title: string; body: string; detail: string }[];
  scope: Heading;
  rulebookLabel: string;
  rulebook: SpecRow[];
  planes: { title: string; body: string; rows: SpecRow[]; status: string }[];
  scopeNote: { before: string; link: string; after: string };
  console: Heading;
  consoleSteps: string[];
  audit: Heading;
  auditProps: { title: string; body: string }[];
  isolationHeading: Heading;
  isolation: { label: string; value: string }[];
  rolesLabel: string;
  roles: { role: string; scope: string; access: string }[];
  rolesNote: string;
  retro: Heading;
  retroSteps: { title: string; body: string }[];
  retroMetricsLabel: string;
  retroMetrics: { name: string; definition: string }[];
  retroNote: string;
  cta: Heading;
  pilotAudiences: string[];
}>({
  tr: {
    sections: [
      { id: "problem", label: "Sorun" },
      { id: "mimari", label: "Nasıl çalışır" },
      { id: "kapsam", label: "Kural kapsamı" },
      { id: "konsol", label: "Risk skoru ve kuyruk" },
      { id: "simulator", label: "Fatura simülatörü" },
      { id: "denetim", label: "Denetim kaydı" },
      { id: "izolasyon", label: "Erişim ve izolasyon" },
      { id: "retrospektif", label: "Retrospektif pilot" },
    ],
    heroStats: [
      { value: "Gönderim öncesi", label: "Kontrol anı" },
      { value: "0–100", label: "Risk skoru" },
      { value: "Uzman onayı", label: "Karar" },
      { value: "Append-only", label: "Denetim kaydı" },
    ],
    crumbs: { home: "Ana sayfa", products: "Ürünler" },
    eyebrow: "İdari uyum ve gelir güvencesi",
    title: "Shield. Red riskini fatura gönderilmeden önce görün.",
    description:
      "Fatura ve provizyon kalemlerini gönderimden önce SUT ve SGK provizyon kurallarına göre denetler. Riskli kalem, gerekçesiyle birlikte uzmanın kuyruğuna düşer; gönderip göndermemeye uzman karar verir.",
    ctaIntro: "15 dk tanışma ve demo",
    ctaPilot: "Retrospektif pilot başvurusu (LOI)",
    ctaTry: "Örneği deneyin",
    problem: {
      eyebrow: "Sorun",
      title: "Gönderimden sonra öğrenilen red, itiraz ve yeniden gönderim gerektirir.",
      description:
        "Red nedenlerinin bir kısmı önlenebilir hatalardır: eksik belge, kod uyumsuzluğu, limit aşımı. Bunlar gönderimden önce, kuralla ve gerekçesiyle yakalanabilir.",
    },
    problems: [
      {
        title: "Red geç öğreniliyor",
        body: "Red kararı çoğu zaman fatura gönderildikten sonra gelir. İtiraz, düzeltme ve yeniden gönderim hem ödemeyi geciktirir hem ekibin vaktini alır.",
      },
      {
        title: "Kurallar sık değişiyor",
        body: "SUT, paket tanımları ve kurum sözleşmeleri sık güncellenir. Kuralları kişisel deneyimle takip etmek, aynı kalemin farklı kişilerce farklı işlenmesine yol açar.",
      },
      {
        title: "Gerekçesiz skor işe yaramaz",
        body: "Neden riskli olduğu söylenmeyen bir skor, ekibe ne yapması gerektiğini söylemez ve denetimde savunulamaz.",
      },
    ],
    how: {
      eyebrow: "Nasıl çalışır",
      title: "Faturalama sisteminizin önünde bir kontrol katmanı.",
      description:
        "Shield mevcut faturalama sisteminin yerini almaz. Gönderimden hemen önce çalışır, kalemleri kurallarla kontrol eder ve şüpheli olanları uzmana gösterir.",
    },
    pipeline: [
      {
        title: "Fatura ve provizyon verisi",
        body: "Hizmet kalemleri, tanı ve işlem kodları, provizyon ve belge durumu gönderimden önce toplanır.",
        detail: "talep kalemleri · ICD-10 · SUT eki · provizyon durumu",
      },
      {
        title: "Ön kontrol",
        body: "Sürümlü kurallar kod uyumunu, eksik belgeyi, limitleri ve mükerrer kalemleri kontrol eder.",
        detail: "sürümlü kural seti · tekrarlanabilir sonuç",
      },
      {
        title: "Risk skoru",
        body: "Skor, tetiklenen kuralların katkılarının toplamıdır. Her katkı kural kimliğiyle birlikte görünür.",
        detail: "Σ kural katkısı · 0–100",
      },
      {
        title: "İnceleme kuyruğu",
        body: "Skoru 40 ve üzerinde olan kalemler uzmanın kuyruğuna düşer. Shield kendi başına gönderim kararı vermez.",
        detail: "eşik ≥ 40 · uzman onayı",
      },
      {
        title: "Karar",
        body: "Uzman onaylar, düzeltmeye gönderir ya da gönderimi durdurur. Karar ve gerekçe kalemle birlikte saklanır.",
        detail: "onay · düzeltme · durdurma",
      },
      {
        title: "Kayıt",
        body: "Skor, kural sürümü, kararı veren kişi ve zaman yalnızca eklenebilir kayda yazılır.",
        detail: "append-only · kayıt özeti zinciri",
      },
    ],
    scope: {
      eyebrow: "Mevzuat ve kural kapsamı",
      title: "Hangi kurallar uygulandı, hangisi henüz yok.",
      description:
        "Dört denetim düzleminden üçü kural motorunda uygulandı ve otomatik testlerden geçiyor. Hiçbiri henüz gerçek bir kurumun faturalarında doğrulanmadı.",
    },
    rulebookLabel: "Mevzuat sürümü",
    rulebook: [
      { label: "Esas metin", value: "Sağlık Uygulama Tebliği (SUT)" },
      { label: "Değişiklik sürümü", value: "Henüz sabitlenmedi · pilot öncesi kurumla birlikte sabitlenir" },
      { label: "Kaynaklar", value: "SUT ekleri (EK-2B, EK-2C) · paket tanımları · kurum sözleşmesi" },
      { label: "Güncelleme", value: "Her SUT değişikliği yeni bir kural seti sürümüdür; geçmiş karar kendi sürümüyle yeniden üretilir" },
    ],
    planes: [
      {
        title: "Branş ve hekim yetkisi",
        body: "Belirli bir uzmanlık dalına bağlı işlem ve ilaçlarda faturadaki hekimin branşı kontrol edilir.",
        rows: [
          { label: "Kontrol", value: "Hekim branş kodu · uzmanlık koşulu" },
          { label: "Test", value: "Otomatik testler · sentetik faturalar" },
          { label: "Gerçek fatura", value: "Henüz doğrulanmadı" },
        ],
        status: "Uygulandı · test edildi",
      },
      {
        title: "Mükerrer işlem ve paket aşımı",
        body: "Aynı gün tekrar eden tetkik, pakete dahil kalemin ayrıca faturalanması ve yatış süresinin paket limitini aşması.",
        rows: [
          { label: "Kontrol", value: "Mükerrer kalem · paket dışı kalem · yatış süresi" },
          { label: "Test", value: "Otomatik testler · sentetik faturalar" },
          { label: "Gerçek fatura", value: "Henüz doğrulanmadı" },
        ],
        status: "Uygulandı · test edildi",
      },
      {
        title: "Tanı–işlem tutarlılığı",
        body: "İşlem ya da tetkik, faturadaki ICD-10 tanısıyla gerekçelenmelidir.",
        rows: [
          { label: "Kontrol", value: "ICD-10 tanısı ↔ işlem" },
          { label: "Test", value: "Otomatik testler · sentetik faturalar" },
          { label: "Gerçek fatura", value: "Henüz doğrulanmadı" },
        ],
        status: "Uygulandı · test edildi",
      },
      {
        title: "Tıbbi malzeme ve ilaç koşulları",
        body: "Rapor şartı, ön onay belgesi, kullanım sınırı ve tekrar aralığı. Bu düzlem henüz kural motorunda yok.",
        rows: [
          { label: "Kontrol", value: "Rapor · ön onay · kullanım sınırı" },
          { label: "Test", value: "Henüz yok" },
          { label: "Gerçek fatura", value: "Henüz doğrulanmadı" },
        ],
        status: "Henüz uygulanmadı",
      },
    ],
    scopeNote: {
      before: "Düzlemlerin ayrıntısı ve risk skorunun nasıl toplandığı",
      link: "SUT fatura denetimi",
      after: "sayfasında.",
    },
    console: {
      eyebrow: "Risk skoru ve inceleme kuyruğu",
      title: "Her skorun arkasında okunabilir bir gerekçe.",
      description:
        "Risk skoru, tetiklenen kuralların katkılarının toplamıdır. Uzman hangi kuralın skoru ne kadar etkilediğini görür ve kararını buna göre verir.",
    },
    consoleSteps: [
      "Kuyruktan bir talep seçin; skoru oluşturan kurallar listelenir.",
      "Onaylayın, düzeltmeye gönderin ya da gönderimi durdurun.",
      "Kararınız denetim kaydına yeni bir satır olarak eklenir ve geri alınamaz.",
    ],
    audit: {
      eyebrow: "Denetim kaydı",
      title: "Kim, neyi, hangi kurala göre karar verdi.",
      description:
        "Bir kararı savunabilmek için hangi veriyle, hangi kural sürümüyle ve kimin tarafından verildiğini eksiksiz gösterebilmek gerekir.",
    },
    auditProps: [
      {
        title: "Yalnızca ekleme",
        body: "Kayıt yazıldıktan sonra değiştirilemez ve silinemez. Düzeltme bile yeni bir kayıt olarak eklenir.",
      },
      {
        title: "Tam bağlam",
        body: "Her kayıtta kural seti sürümü, girdinin özeti, skorun bileşenleri, kararı veren kişi ve zaman bulunur.",
      },
      {
        title: "Yeniden üretilebilir",
        body: "Geçmiş bir karar, o günkü kural sürümü ve veriyle aynen yeniden üretilip denetimde gösterilebilir.",
      },
      {
        title: "Dışa aktarılabilir",
        body: "Kayıtlar iç ve dış denetim için yapılandırılmış biçimde dışa aktarılabilir.",
      },
    ],
    isolationHeading: {
      eyebrow: "Erişim ve izolasyon",
      title: "Tasarım gereği her kurumun verisi ayrı tutulur.",
      description:
        "Bu bölüm mimari şartnamedir; çok kurumlu canlı bir servis henüz çalışmıyor. Pilot kurulumunda her kurum kendi alanında çalışır ve sorgular, kuyruklar ve kayıtlar başka bir kurumun verisine erişemez. Kimin neyi görebileceği role göre belirlenir.",
    },
    isolation: [
      { label: "İzolasyon", value: "Tasarım gereği her kurumun verisi, kuyruğu ve kaydı ayrı tutulur" },
      { label: "Sorgu kapsamı", value: "Tasarım gereği kurum kimliği her sorguda zorunludur" },
      { label: "Erişim", value: "Pilot kurulumunda rol bazında, en az yetki ilkesiyle" },
    ],
    rolesLabel: "Örnek rol tanımları",
    roles: [
      { role: "Kurum yöneticisi", scope: "Kullanıcıları, rolleri ve eşikleri ayarlar", access: "Yönetim" },
      { role: "Gelir analisti", scope: "Kuyruğu, raporları ve eğilimleri görür", access: "Okuma" },
      { role: "İnceleme uzmanı", scope: "Kuyruktaki kalemler için karar verir", access: "Karar" },
      { role: "Denetçi", scope: "Kayıtları ve karar geçmişini inceler", access: "Salt okunur" },
    ],
    rolesNote:
      "Roller kurumun ihtiyacına göre ayarlanır. Shield tanı koymaz ve tedavi kararı vermez; yalnızca faturalama ve provizyon süreçlerinde çalışır.",
    retro: {
      eyebrow: "Retrospektif fatura pilotu",
      title: "Geçmiş faturalarınızda red yakalamayı birlikte ölçelim.",
      description:
        "Kurumunuzun anonimleştirilmiş geçmiş faturaları üzerinde retrospektif red yakalama ve yanlış pozitif oranlarını birlikte ölçelim.",
    },
    retroSteps: [
      {
        title: "Veri kurum altyapısında işlenir",
        body: "Anonimleştirilmiş geçmiş faturalar ve SGK sonuçları kurumun altyapısında işlenir; pilot süreçlerde kurum altyapısından çıkarılmaz. Kapsam bir veri işleme sözleşmesiyle yazılır.",
      },
      {
        title: "Kör çalıştırma",
        body: "Shield faturaları gönderim öncesindeki hâliyle kontrol eder. SGK'nın verdiği ret ve kesinti kararlarını görmez.",
      },
      {
        title: "Karşılaştırma",
        body: "Shield'ın işaretlediği kalemler SGK'nın gerçek kararlarıyla kalem kalem karşılaştırılır.",
      },
      {
        title: "Ortak rapor",
        body: "Oranlar, kaçırılan red nedenleri ve kural seti sürümü kurumla birlikte raporlanır.",
      },
    ],
    retroMetricsLabel: "Ölçülecek oranlar",
    retroMetrics: [
      { name: "Red yakalama oranı", definition: "SGK'nın reddettiği veya kestiği kalemlerden Shield'ın gönderim öncesi işaretlediklerinin oranı." },
      { name: "Yanlış pozitif oranı", definition: "Sorunsuz ödenen kalemlerden Shield'ın yine de işaretlediklerinin oranı." },
      { name: "Pozitif prediktif değer", definition: "İşaretlenen kalemlerden gerçekten reddedilen veya kesilenlerin oranı." },
      { name: "İnceleme yükü", definition: "Uzman kuyruğuna düşen kalemlerin toplam kalemlere oranı." },
    ],
    retroNote: "Bu oranlar için henüz ölçülmüş bir değer yok. İlk değerler bir kurumun geçmiş faturalarında ölçüldüğünde, kurumun onayıyla yayımlanır.",
    cta: {
      eyebrow: "Demo ve pilot",
      title: "Shield'ı kendi faturalarınızla görün.",
      description:
        "Retrospektif pilotun kapsamını ve veri koşullarını bağlayıcı olmayan bir Niyet Mektubu (LOI) ile birlikte yazıyoruz.",
    },
    pilotAudiences: [
      "Hastane faturalama ve gelir döngüsü birimleri",
      "Provizyon ve SGK geri ödeme ekipleri",
      "Birden çok hastanesi olan sağlık grupları",
    ],
  },
  en: {
    sections: [
      { id: "problem", label: "Problem" },
      { id: "mimari", label: "How it works" },
      { id: "kapsam", label: "Rule coverage" },
      { id: "konsol", label: "Risk score and queue" },
      { id: "simulator", label: "Claim simulator" },
      { id: "denetim", label: "Audit log" },
      { id: "izolasyon", label: "Access and isolation" },
      { id: "retrospektif", label: "Retrospective pilot" },
    ],
    heroStats: [
      { value: "Before submission", label: "When the check runs" },
      { value: "0–100", label: "Risk score" },
      { value: "Specialist", label: "Who decides" },
      { value: "Append-only", label: "Audit log" },
    ],
    crumbs: { home: "Home", products: "Products" },
    eyebrow: "Administrative compliance and revenue assurance",
    title: "Shield. See rejection risk before the claim is submitted.",
    description:
      "Checks billing and provision line items before submission against SUT (Turkey's reimbursement rulebook) and SGK (Social Security Institution) provision rules. A risky line item goes to the specialist's queue with its reason, and the specialist decides whether to submit it.",
    ctaIntro: "15-minute intro and demo",
    ctaPilot: "Apply for a retrospective pilot (LOI)",
    ctaTry: "Try the example",
    problem: {
      eyebrow: "Problem",
      title: "A rejection found after submission means an appeal and a resubmission.",
      description:
        "Some rejections come from preventable errors: missing documents, code mismatches and exceeded limits. A rule can catch them before submission and state the reason.",
    },
    problems: [
      {
        title: "Rejections arrive late",
        body: "A rejection usually comes after the claim has been sent. Appeal, correction and resubmission delay payment and take up the team's time.",
      },
      {
        title: "The rules change often",
        body: "SUT (Turkey's Health Implementation Communiqué), package definitions and payer contracts are updated often. Tracking them from memory leads different people to handle the same item differently.",
      },
      {
        title: "A score without a reason is not useful",
        body: "A score that does not say why an item is risky does not tell the team what to do and cannot be defended in an audit.",
      },
    ],
    how: {
      eyebrow: "How it works",
      title: "A check layer in front of your billing system.",
      description:
        "Shield does not replace your billing system. It runs just before submission, checks each line item against rules and shows the questionable ones to a specialist.",
    },
    pipeline: [
      {
        title: "Claim and authorisation data",
        body: "Service lines, diagnosis and procedure codes, pre-authorisation and document status are collected before submission.",
        detail: "claim lines · ICD-10 · SUT annex · authorisation status",
      },
      {
        title: "Pre-check",
        body: "Versioned rules check code consistency, missing documents, limits and duplicate lines.",
        detail: "versioned rule set · reproducible result",
      },
      {
        title: "Risk score",
        body: "The score is the sum of the contributions of the rules that fired. Each contribution is shown with its rule ID.",
        detail: "Σ rule contributions · 0–100",
      },
      {
        title: "Review queue",
        body: "Items scoring 40 or more go to the specialist's queue. Shield never decides on submission by itself.",
        detail: "threshold ≥ 40 · specialist approval",
      },
      {
        title: "Decision",
        body: "The specialist approves, sends for correction or holds the submission. The decision and reason are stored with the item.",
        detail: "approve · correct · hold",
      },
      {
        title: "Record",
        body: "Score, rule version, who decided and when are written to an append-only log.",
        detail: "append-only · digest chain",
      },
    ],
    scope: {
      eyebrow: "Regulation and rule coverage",
      title: "Which rules are built, and which are not yet.",
      description:
        "Three of the four audit planes are implemented in the rule engine and covered by automated tests. None has been validated on a real institution's claims yet.",
    },
    rulebookLabel: "Regulation version",
    rulebook: [
      { label: "Base text", value: "Health Implementation Communiqué (SUT)" },
      { label: "Amendment", value: "Not pinned yet · pinned with the institution before a pilot" },
      { label: "Sources", value: "SUT annexes (EK-2B, EK-2C) · package definitions · institution contract" },
      { label: "Updates", value: "Each SUT amendment becomes a new rule set version · past decisions are reproduced with their own version" },
    ],
    planes: [
      {
        title: "Department and physician authority",
        body: "For procedures and drugs tied to a specialty, the physician's department on the claim is checked.",
        rows: [
          { label: "Check", value: "Physician department code · specialty condition" },
          { label: "Tests", value: "Automated tests · synthetic claims" },
          { label: "Real claims", value: "Not validated yet" },
        ],
        status: "Implemented · tested",
      },
      {
        title: "Duplicate procedures and package limits",
        body: "The same test repeated on the same day, an item already in a package billed separately, and a stay longer than the package limit.",
        rows: [
          { label: "Check", value: "Duplicate item · item outside package · length of stay" },
          { label: "Tests", value: "Automated tests · synthetic claims" },
          { label: "Real claims", value: "Not validated yet" },
        ],
        status: "Implemented · tested",
      },
      {
        title: "Diagnosis–procedure consistency",
        body: "A procedure or test must be justified by the ICD-10 diagnosis on the claim.",
        rows: [
          { label: "Check", value: "ICD-10 diagnosis ↔ procedure" },
          { label: "Tests", value: "Automated tests · synthetic claims" },
          { label: "Real claims", value: "Not validated yet" },
        ],
        status: "Implemented · tested",
      },
      {
        title: "Medical supply and drug conditions",
        body: "Report requirement, prior approval, usage limit and repeat interval. This plane is not in the rule engine yet.",
        rows: [
          { label: "Check", value: "Report · prior approval · usage limit" },
          { label: "Tests", value: "Not yet" },
          { label: "Real claims", value: "Not validated yet" },
        ],
        status: "Not implemented yet",
      },
    ],
    scopeNote: {
      before: "The planes and how the risk score adds up are described on the",
      link: "SUT billing audit",
      after: "page.",
    },
    console: {
      eyebrow: "Risk score and review queue",
      title: "A readable reason behind every score.",
      description:
        "The risk score is the sum of the contributions of the rules that fired. The specialist sees how much each rule moved the score and decides on that basis.",
    },
    consoleSteps: [
      "Select a claim in the queue to list the rules behind its score.",
      "Approve it, send it for correction or hold the submission.",
      "Your decision is added to the audit log as a new row and cannot be undone.",
    ],
    audit: {
      eyebrow: "Audit log",
      title: "Who decided what, under which rule.",
      description:
        "To defend a decision, you need to show exactly what data it used, which rule version applied and who made it.",
    },
    auditProps: [
      {
        title: "Append-only",
        body: "Once written, an entry cannot be changed or deleted. Even a correction is added as a new entry.",
      },
      {
        title: "Full context",
        body: "Each entry holds the rule set version, a digest of the input, the score components, who decided and when.",
      },
      {
        title: "Reproducible",
        body: "A past decision can be reproduced exactly with that day's rule version and data and then shown in an audit.",
      },
      {
        title: "Exportable",
        body: "Entries can be exported in a structured format for internal and external audit.",
      },
    ],
    isolationHeading: {
      eyebrow: "Access and isolation",
      title: "By design, each institution's data is kept separate.",
      description:
        "This section is an architecture specification; no live multi-institution service is running yet. In a pilot installation each institution works in its own space, and queries, queues and logs cannot reach another institution's data. Roles decide who can see what.",
    },
    isolation: [
      { label: "Isolation", value: "By design, each institution's data, queue and log are kept separate" },
      { label: "Query scope", value: "By design, an institution ID is required on every query" },
      { label: "Access", value: "In a pilot installation, role-based with least privilege" },
    ],
    rolesLabel: "Example roles",
    roles: [
      { role: "Institution admin", scope: "Sets up users, roles and thresholds", access: "Admin" },
      { role: "Revenue analyst", scope: "Sees the queue, reports and trends", access: "Read" },
      { role: "Review specialist", scope: "Decides on items in the queue", access: "Decide" },
      { role: "Auditor", scope: "Reviews logs and decision history", access: "Read-only" },
    ],
    rolesNote:
      "Roles are configured to fit the institution. Shield does not diagnose or make treatment decisions. It works only in billing and pre-authorisation.",
    retro: {
      eyebrow: "Retrospective claims pilot",
      title: "Measure rejection catch on your past claims together.",
      description:
        "Let us measure retrospective rejection catch and false positive rates together on your institution's anonymised historical claims.",
    },
    retroSteps: [
      {
        title: "Data is processed on site",
        body: "Anonymised historical claims and SGK outcomes are processed in the institution's infrastructure and are not taken out of it during the pilot. The scope is set out in a data processing agreement.",
      },
      {
        title: "Blind run",
        body: "Shield checks the claims as they were before submission. It does not see SGK's rejection and deduction decisions.",
      },
      {
        title: "Comparison",
        body: "Each item Shield flagged is compared line by line with SGK's actual decisions.",
      },
      {
        title: "Joint report",
        body: "We report the rates, the missed rejection reasons and the rule set version jointly with the institution.",
      },
    ],
    retroMetricsLabel: "Rates we measure",
    retroMetrics: [
      { name: "Rejection catch rate", definition: "Of the items SGK rejected or cut, the share Shield flagged before submission." },
      { name: "False positive rate", definition: "Of the items paid without issue, the share Shield still flagged." },
      { name: "Positive predictive value", definition: "Of the flagged items, the share that was actually rejected or cut." },
      { name: "Review load", definition: "Items sent to the specialist queue as a share of all items." },
    ],
    retroNote: "There are no measured values for these rates yet. The first values will be published with the institution's consent once they have been measured on its historical claims.",
    cta: {
      eyebrow: "Demo and pilot",
      title: "See Shield on your own claims.",
      description:
        "We write the scope and data conditions of the retrospective pilot together in a non-binding Letter of Intent (LOI).",
    },
    pilotAudiences: [
      "Hospital billing and revenue cycle units",
      "Pre-authorisation and SGK reimbursement teams",
      "Healthcare groups with several hospitals",
    ],
  },
});

export default function ShieldView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);

  return (
    <main className="relative flex-1 overflow-x-clip">
      <JsonLd data={shieldJsonLd(locale)} />
      <PageHero
        locale={locale}
        ambient="shield"
        eyebrowIcon={{ icon: ShieldCheck, className: "text-shield" }}
        visual={<ShieldMatrix locale={locale} />}
        visualClassName="relative mx-auto w-full max-w-[340px] sm:max-w-[560px]"
        below={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline lg:grid-cols-4">
            {c.heroStats.map((s) => (
              <div key={s.label} className="relative flex flex-col-reverse bg-navy-900 p-5">
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-shield/30" />
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
        }
        breadcrumbs={[
          { href: "/", label: c.crumbs.home },
          { href: "/#platformlar", label: c.crumbs.products },
          { label: "Shield", lang: "en" },
        ]}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={href(contactHref("intro", "shield"))}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
          >
            {c.ctaIntro}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#konsol"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
          >
            {c.ctaTry}
          </a>
        </div>
      </PageHero>

      <InPageNav locale={locale} items={c.sections} accent="indigo" />

      {/* Problem */}
      <section id="problem" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="shield" {...c.problem} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
            {c.problems.map(({ title, body }, i) => {
              const Icon = problemIcons[i];
              return (
                <div
                  key={title}
                  className="group relative bg-navy-850 p-6 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-8"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-transparent transition-colors duration-150 ease-out group-hover:bg-shield/50" />
                  <Icon
                    className="h-5 w-5 text-white/55 transition-colors duration-150 ease-out group-hover:text-shield"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-base font-semibold tracking-[-0.01em] text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="mimari" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="shield" {...c.how} />
          <div className="mt-14">
            <FlowDiagram
              locale={locale}
              steps={c.pipeline.map((step, i) => ({ ...step, icon: pipelineIcons[i] }))}
            />
          </div>
        </div>
      </section>

      {/* Regulation version and rule coverage */}
      <section id="kapsam" className="relative scroll-mt-32 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="shield" {...c.scope} />
          <Reveal className="mt-14 overflow-hidden rounded-2xl border border-hairline bg-navy-850">
            <p className={`border-b border-hairline px-5 py-3 sm:px-6 ${LABEL}`}>{c.rulebookLabel}</p>
            <dl className="divide-y divide-hairline">
              {c.rulebook.map((row) => (
                <div key={row.label} className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4 sm:px-6">
                  <dt className="text-[12px] text-white/55">{row.label}</dt>
                  <dd className="text-[13.5px] leading-relaxed text-white/80">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <JoinedGrid className="mt-5" columns="sm:grid-cols-2 xl:grid-cols-4">
            {c.planes.map((plane, i) => (
              <SpecCard
                key={planeMeta[i].id}
                variant="cell"
                align={{ rows: Math.max(...c.planes.map((x) => x.rows.length)) }}
                accent="shield"
                id={planeMeta[i].id}
                icon={planeMeta[i].icon}
                title={plane.title}
                body={plane.body}
                rows={plane.rows}
                status={{ label: plane.status, tone: planeMeta[i].tone }}
              />
            ))}
          </JoinedGrid>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/55">
            {c.scopeNote.before}{" "}
            <Link
              href={href("/standartlar/sut-fatura-denetimi")}
              className="text-white/80 underline decoration-white/30 underline-offset-2 transition-colors duration-150 ease-out hover:text-white hover:decoration-white/70"
            >
              {c.scopeNote.link}
            </Link>{" "}
            {c.scopeNote.after}
          </p>
        </div>
      </section>

      {/* Console */}
      <section id="konsol" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <div className="lg:sticky lg:top-40">
              <SectionHeader accent="shield" {...c.console} />
              <Reveal className="mt-8 space-y-3 text-sm text-white/55">
                {c.consoleSteps.map((step) => (
                  <p key={step}>{step}</p>
                ))}
              </Reveal>
            </div>
            <Reveal className="min-w-0">
              <ShieldConsole locale={locale} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Interactive simulator */}
      <section id="simulator" className="relative scroll-mt-32 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
          <SectionHeader accent="shield" {...simCopy[locale]} />
          <Reveal className="min-w-0">
            <ClaimSimulator locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* Audit */}
      <section id="denetim" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="shield" {...c.audit} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {c.auditProps.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.04}
                className="group relative bg-navy-850 p-6 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-7"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-transparent transition-colors duration-150 ease-out group-hover:bg-shield/50" />
                <h3 className="text-base font-semibold tracking-[-0.01em] text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Isolation & roles */}
      <section id="izolasyon" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeader accent="shield" {...c.isolationHeading} />
            <Reveal className="mt-10">
              <dl className="divide-y divide-hairline border-y border-hairline">
                {c.isolation.map((row) => (
                  <div key={row.label} className="grid grid-cols-[120px_1fr] gap-4 py-3">
                    <dt className="text-[12px] text-white/55">{row.label}</dt>
                    <dd className="text-[13.5px] text-white/80">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal className="self-start overflow-hidden rounded-2xl border border-hairline bg-navy-850">
            <p className={`border-b border-hairline px-5 py-3 ${LABEL}`}>{c.rolesLabel}</p>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-hairline">
                {c.roles.map((r) => (
                  <tr key={r.role}>
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-medium text-white">{r.role}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/55">{r.scope}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right align-top">
                      <span className={`whitespace-nowrap ${LABEL}`}>{r.access}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-hairline px-5 py-4 text-xs leading-relaxed text-white/55">{c.rolesNote}</p>
          </Reveal>
        </div>
      </section>

      {/* Retrospective claims pilot: what will be measured, with no promised result */}
      <section id="retrospektif" className="relative scroll-mt-32 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <SectionHeader accent="shield" {...c.retro} />
            <Reveal className="mt-10">
              <ol className="divide-y divide-hairline border-y border-hairline">
                {c.retroSteps.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[32px_1fr] gap-3 py-4">
                    <span className="font-mono text-[12px] text-white/50 tabular-nums">{i + 1}</span>
                    <div>
                      <h3 className="text-[14.5px] font-semibold tracking-[-0.01em] text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal className="self-start overflow-hidden rounded-2xl border border-hairline bg-navy-850">
            <p className={`border-b border-hairline px-5 py-3 sm:px-6 ${LABEL}`}>{c.retroMetricsLabel}</p>
            <dl className="divide-y divide-hairline">
              {c.retroMetrics.map((m) => (
                <div key={m.name} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-4 sm:px-6">
                  <dt className="text-[13.5px] font-medium text-white">{m.name}</dt>
                  <dd className="text-[13.5px] leading-relaxed text-white/60">{m.definition}</dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-hairline px-5 py-4 text-xs leading-relaxed text-white/55 sm:px-6">{c.retroNote}</p>
          </Reveal>
        </div>
      </section>

      <CtaPanel
        locale={locale}
        accent="indigo"
        {...c.cta}
        primaryHref={href(contactHref("pilot", "shield"))}
        primaryLabel={c.ctaPilot}
        aside={
          <ul className="divide-y divide-hairline self-center border-y border-hairline">
            {c.pilotAudiences.map((item) => (
              <li key={item} className="py-4 text-sm text-white/70">
                {item}
              </li>
            ))}
          </ul>
        }
      />
    </main>
  );
}
