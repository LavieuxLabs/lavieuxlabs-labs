import Link from "next/link";
import {
  ArrowUpRight,
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
import { shieldJsonLd } from "@/lib/structuredData";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/initiatives/shield", {
  tr: {
    title: "Shield",
    description:
      "Hastane fatura ve provizyon süreçlerindeki SUT/SGK red risklerini işlem öncesinde tespit eden kurumsal denetim katmanı.",
  },
  en: {
    title: "Shield",
    description: "Pre-claim revenue integrity platform identifying reimbursement and audit risks before submission.",
  },
});

const LABEL = "text-[11px] font-medium tracking-wider text-white/50 uppercase";

const problemIcons = [Hourglass, ListChecks, Eye];
const pipelineIcons = [Receipt, ShieldAlert, Gauge, Inbox, Send, FileClock];

type Heading = { eyebrow: string; title: string; description: string };

const copy = defineContent<{
  sections: { id: string; label: string }[];
  heroStats: { value: string; label: string }[];
  crumbs: { home: string; products: string };
  eyebrow: string;
  titleMuted: string;
  description: string;
  ctaPilot: string;
  ctaTry: string;
  problem: Heading;
  problems: { title: string; body: string }[];
  how: Heading;
  pipeline: { title: string; body: string; detail: string }[];
  console: Heading;
  consoleSteps: string[];
  audit: Heading;
  auditProps: { title: string; body: string }[];
  isolationHeading: Heading;
  isolation: { label: string; value: string }[];
  rolesLabel: string;
  roles: { role: string; scope: string; access: string }[];
  rolesNote: string;
  cta: Heading;
  pilotAudiences: string[];
}>({
  tr: {
    sections: [
      { id: "problem", label: "Sorun" },
      { id: "mimari", label: "Nasıl çalışır" },
      { id: "konsol", label: "Risk skoru ve kuyruk" },
      { id: "denetim", label: "Denetim kaydı" },
      { id: "izolasyon", label: "Erişim ve izolasyon" },
    ],
    heroStats: [
      { value: "Gönderim öncesi", label: "Kontrol anı" },
      { value: "0–100", label: "Risk skoru" },
      { value: "Uzman onayı", label: "Karar" },
      { value: "Append-only", label: "Denetim kaydı" },
    ],
    crumbs: { home: "Ana sayfa", products: "Ürünler" },
    eyebrow: "Gelir bütünlüğü · provizyon denetimi",
    titleMuted: "Red riskini fatura gönderilmeden önce görün.",
    description:
      "Hastane fatura ve provizyon süreçlerindeki SUT/SGK red risklerini işlem öncesinde tespit eden kurumsal denetim katmanı. Riskli kalem, nedeniyle birlikte uzmanın kuyruğuna düşer; gönderip göndermemeye uzman karar verir.",
    ctaPilot: "Demo veya pilot başvurusu",
    ctaTry: "Örneği deneyin",
    problem: {
      eyebrow: "Sorun",
      title: "Red, gönderimden sonra öğrenildiğinde iş iki katına çıkar.",
      description:
        "Reddedilen faturaların önemli bir kısmı önlenebilir hatalardan doğar: eksik belge, kod uyumsuzluğu, limit aşımı. Bunlar gönderimden önce, kuralla ve gerekçesiyle yakalanabilir.",
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
        body: "Eşiği aşan kalemler uzmanın kuyruğuna düşer. Shield kendi başına gönderim kararı vermez.",
        detail: "eşik ≥ 40 · HITL",
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
      title: "Kurumun verisi kurumda kalır.",
      description:
        "Her kurum kendi alanında çalışır. Sorgular, kuyruklar ve kayıtlar başka bir kurumun verisine erişemez; kimin neyi görebileceği role göre belirlenir.",
    },
    isolation: [
      { label: "İzolasyon", value: "Her kurumun verisi, kuyruğu ve kaydı ayrı tutulur" },
      { label: "Sorgu kapsamı", value: "Kurum kimliği her sorguda zorunlu" },
      { label: "Erişim", value: "Rol bazında, en az yetki ilkesiyle" },
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
    cta: {
      eyebrow: "Demo ve pilot",
      title: "Shield'ı kendi faturalarınızla görün.",
      description:
        "Kurumunuzda en sık görülen red nedenleri üzerinde bir demo yapabiliriz. Pilot için kapsamı bağlayıcı olmayan bir Niyet Mektubu (LOI) ile birlikte yazıyoruz.",
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
      { id: "konsol", label: "Risk score and queue" },
      { id: "denetim", label: "Audit log" },
      { id: "izolasyon", label: "Access and isolation" },
    ],
    heroStats: [
      { value: "Pre-claim", label: "When the check runs" },
      { value: "0–100", label: "Risk score" },
      { value: "Specialist", label: "Who decides" },
      { value: "Append-only", label: "Audit log" },
    ],
    crumbs: { home: "Home", products: "Products" },
    eyebrow: "Revenue integrity · claim pre-check",
    titleMuted: "See rejection risk before the claim is submitted.",
    description:
      "Pre-claim revenue integrity platform identifying reimbursement and audit risks before submission. A risky line item goes to the specialist's queue with its reason; the specialist decides whether it is submitted.",
    ctaPilot: "Request a demo or pilot",
    ctaTry: "Try the example",
    problem: {
      eyebrow: "Problem",
      title: "A rejection found after submission doubles the work.",
      description:
        "A large share of rejected claims come from preventable errors: missing documents, code mismatches, exceeded limits. These can be caught before submission, by a rule, with a reason.",
    },
    problems: [
      {
        title: "Rejections arrive late",
        body: "A rejection usually comes after the claim has been sent. Appeal, correction and resubmission delay payment and take up the team's time.",
      },
      {
        title: "The rules change often",
        body: "SUT (Turkey's Health Implementation Communiqué), package definitions and payer contracts are updated often. Tracking them from personal experience means the same item is handled differently by different people.",
      },
      {
        title: "A score without a reason is not useful",
        body: "A score that does not say why an item is risky does not tell the team what to do, and cannot be defended in an audit.",
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
        body: "Items above the threshold go to the specialist's queue. Shield never decides on submission by itself.",
        detail: "threshold ≥ 40 · HITL",
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
    console: {
      eyebrow: "Risk score and review queue",
      title: "A readable reason behind every score.",
      description:
        "The risk score is the sum of the contributions of the rules that fired. The specialist sees how much each rule moved the score and decides on that basis.",
    },
    consoleSteps: [
      "Select a claim in the queue; the rules behind its score are listed.",
      "Approve it, send it for correction or hold the submission.",
      "Your decision is added to the audit log as a new row and cannot be undone.",
    ],
    audit: {
      eyebrow: "Audit log",
      title: "Who decided what, under which rule.",
      description:
        "To defend a decision, you have to show in full which data, which rule version and which person it was made with.",
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
        body: "A past decision can be reproduced exactly, with that day's rule version and data, and shown in an audit.",
      },
      {
        title: "Exportable",
        body: "Entries can be exported in a structured format for internal and external audit.",
      },
    ],
    isolationHeading: {
      eyebrow: "Access and isolation",
      title: "The institution's data stays with the institution.",
      description:
        "Each institution works in its own space. Queries, queues and logs cannot reach another institution's data, and roles decide who can see what.",
    },
    isolation: [
      { label: "Isolation", value: "Each institution's data, queue and log are kept separate" },
      { label: "Query scope", value: "Institution ID required on every query" },
      { label: "Access", value: "Role-based, least privilege" },
    ],
    rolesLabel: "Example roles",
    roles: [
      { role: "Institution admin", scope: "Sets up users, roles and thresholds", access: "Admin" },
      { role: "Revenue analyst", scope: "Sees the queue, reports and trends", access: "Read" },
      { role: "Review specialist", scope: "Decides on items in the queue", access: "Decide" },
      { role: "Auditor", scope: "Reviews logs and decision history", access: "Read-only" },
    ],
    rolesNote:
      "Roles are configured to fit the institution. Shield does not diagnose or make treatment decisions; it works only in billing and pre-authorisation.",
    cta: {
      eyebrow: "Demo and pilot",
      title: "See Shield on your own claims.",
      description:
        "We can run a demo on the rejection reasons you see most often. For a pilot, we write the scope together in a non-binding Letter of Intent (LOI).",
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
        visual={<ShieldMatrix locale={locale} />}
        visualClassName="relative mx-auto w-full max-w-[340px] sm:max-w-[560px]"
        below={
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
        }
        breadcrumbs={[
          { href: "/", label: c.crumbs.home },
          { href: "/#platformlar", label: c.crumbs.products },
          { label: "Shield", lang: "en" },
        ]}
        eyebrow={c.eyebrow}
        title={
          <>
            Shield. <span className="text-white/50">{c.titleMuted}</span>
          </>
        }
        description={c.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={href("/contact?solution=shield")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
          >
            {c.ctaPilot}
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
          <SectionHeader {...c.problem} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-3">
            {c.problems.map(({ title, body }, i) => {
              const Icon = problemIcons[i];
              return (
                <div key={title} className="bg-navy-850 p-6 sm:p-8">
                  <Icon className="h-5 w-5 text-white/55" strokeWidth={1.6} aria-hidden="true" />
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
          <SectionHeader {...c.how} />
          <div className="mt-14">
            <FlowDiagram
              locale={locale}
              steps={c.pipeline.map((step, i) => ({ ...step, icon: pipelineIcons[i] }))}
              accent="indigo"
            />
          </div>
        </div>
      </section>

      {/* Console */}
      <section id="konsol" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <div className="lg:sticky lg:top-40">
              <SectionHeader {...c.console} />
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

      {/* Audit */}
      <section id="denetim" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.audit} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {c.auditProps.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.04} className="bg-navy-850 p-6 sm:p-7">
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
            <SectionHeader {...c.isolationHeading} />
            <Reveal className="mt-10">
              <dl className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {c.isolation.map((row) => (
                  <div key={row.label} className="grid grid-cols-[120px_1fr] gap-4 py-3">
                    <dt className="text-[12px] text-white/55">{row.label}</dt>
                    <dd className="text-[13.5px] text-white/80">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal className="self-start overflow-hidden rounded-2xl border border-white/[0.06] bg-navy-850">
            <p className={`border-b border-white/[0.06] px-5 py-3 ${LABEL}`}>{c.rolesLabel}</p>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-white/[0.06]">
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
            <p className="border-t border-white/[0.06] px-5 py-4 text-xs leading-relaxed text-white/55">{c.rolesNote}</p>
          </Reveal>
        </div>
      </section>

      <CtaPanel
        locale={locale}
        accent="indigo"
        {...c.cta}
        primaryHref={href("/contact?solution=shield")}
        primaryLabel={c.ctaPilot}
        aside={
          <ul className="divide-y divide-white/[0.06] self-center border-y border-white/[0.06]">
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
