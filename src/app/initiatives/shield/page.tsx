import type { Metadata } from "next";
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
import FlowDiagram, { type FlowStep } from "@/components/FlowDiagram";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";
import ShieldConsole from "@/components/ShieldConsole";

export const metadata: Metadata = {
  title: "Shield",
  description:
    "Hastane fatura ve provizyon süreçlerindeki SUT/SGK red risklerini işlem öncesinde tespit eden kurumsal denetim katmanı.",
};

const LABEL = "text-[11px] font-medium tracking-wider text-white/50 uppercase";

const sections = [
  { id: "problem", label: "Sorun" },
  { id: "mimari", label: "Nasıl çalışır" },
  { id: "konsol", label: "Risk skoru ve kuyruk" },
  { id: "denetim", label: "Denetim kaydı" },
  { id: "izolasyon", label: "Erişim ve izolasyon" },
];

const heroStats = [
  { value: "Gönderim öncesi", label: "Kontrol anı" },
  { value: "0–100", label: "Risk skoru" },
  { value: "Uzman onayı", label: "Karar" },
  { value: "Append-only", label: "Denetim kaydı" },
];

const problems = [
  {
    icon: Hourglass,
    title: "Red geç öğreniliyor",
    body: "Red kararı çoğu zaman fatura gönderildikten sonra gelir. İtiraz, düzeltme ve yeniden gönderim hem ödemeyi geciktirir hem ekibin vaktini alır.",
  },
  {
    icon: ListChecks,
    title: "Kurallar sık değişiyor",
    body: "SUT, paket tanımları ve kurum sözleşmeleri sık güncellenir. Kuralları kişisel deneyimle takip etmek, aynı kalemin farklı kişilerce farklı işlenmesine yol açar.",
  },
  {
    icon: Eye,
    title: "Gerekçesiz skor işe yaramaz",
    body: "Neden riskli olduğu söylenmeyen bir skor, ekibe ne yapması gerektiğini söylemez ve denetimde savunulamaz.",
  },
];

const pipeline: FlowStep[] = [
  {
    icon: Receipt,
    title: "Fatura ve provizyon verisi",
    body: "Hizmet kalemleri, tanı ve işlem kodları, provizyon ve belge durumu gönderimden önce toplanır.",
    detail: "talep kalemleri · ICD-10 · SUT eki · provizyon durumu",
  },
  {
    icon: ShieldAlert,
    title: "Ön kontrol",
    body: "Sürümlü kurallar kod uyumunu, eksik belgeyi, limitleri ve mükerrer kalemleri kontrol eder.",
    detail: "sürümlü kural seti · tekrarlanabilir sonuç",
  },
  {
    icon: Gauge,
    title: "Risk skoru",
    body: "Skor, tetiklenen kuralların katkılarının toplamıdır. Her katkı kural kimliğiyle birlikte görünür.",
    detail: "Σ kural katkısı · 0–100",
  },
  {
    icon: Inbox,
    title: "İnceleme kuyruğu",
    body: "Eşiği aşan kalemler uzmanın kuyruğuna düşer. Shield kendi başına gönderim kararı vermez.",
    detail: "eşik ≥ 40 · HITL",
  },
  {
    icon: Send,
    title: "Karar",
    body: "Uzman onaylar, düzeltmeye gönderir ya da gönderimi durdurur. Karar ve gerekçe kalemle birlikte saklanır.",
    detail: "onay · düzeltme · durdurma",
  },
  {
    icon: FileClock,
    title: "Kayıt",
    body: "Skor, kural sürümü, kararı veren kişi ve zaman yalnızca eklenebilir kayda yazılır.",
    detail: "append-only · kayıt özeti zinciri",
  },
];

const auditProps = [
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
];

const isolation = [
  { label: "İzolasyon", value: "Her kurumun verisi, kuyruğu ve kaydı ayrı tutulur" },
  { label: "Sorgu kapsamı", value: "Kurum kimliği her sorguda zorunlu" },
  { label: "Erişim", value: "Rol bazında, en az yetki ilkesiyle" },
];

const roles = [
  { role: "Kurum yöneticisi", scope: "Kullanıcıları, rolleri ve eşikleri ayarlar", access: "Yönetim" },
  { role: "Gelir analisti", scope: "Kuyruğu, raporları ve eğilimleri görür", access: "Okuma" },
  { role: "İnceleme uzmanı", scope: "Kuyruktaki kalemler için karar verir", access: "Karar" },
  { role: "Denetçi", scope: "Kayıtları ve karar geçmişini inceler", access: "Salt okunur" },
];

const pilotAudiences = [
  "Hastane faturalama ve gelir döngüsü birimleri",
  "Provizyon ve SGK geri ödeme ekipleri",
  "Birden çok hastanesi olan sağlık grupları",
];

export default function ShieldPage() {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <PageHero
        visual={<ShieldMatrix />}
        visualClassName="relative mx-auto w-full max-w-[340px] sm:max-w-[560px]"
        below={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] lg:grid-cols-4">
            {heroStats.map((s) => (
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
          { href: "/", label: "Ana sayfa" },
          { href: "/#platformlar", label: "Ürünler" },
          { label: "Shield" },
        ]}
        eyebrow="Gelir bütünlüğü · provizyon denetimi"
        title={
          <>
            Shield. <span className="text-white/50">Red riskini fatura gönderilmeden önce görün.</span>
          </>
        }
        description="Hastane fatura ve provizyon süreçlerindeki SUT/SGK red risklerini işlem öncesinde tespit eden kurumsal denetim katmanı. Riskli kalem, nedeniyle birlikte uzmanın kuyruğuna düşer; gönderip göndermemeye uzman karar verir."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact?solution=shield"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
          >
            Demo veya pilot başvurusu
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#konsol"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
          >
            Örneği deneyin
          </a>
        </div>
      </PageHero>

      <InPageNav items={sections} accent="indigo" />

      {/* Problem */}
      <section id="problem" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Sorun"
            title="Red, gönderimden sonra öğrenildiğinde iş iki katına çıkar."
            description="Reddedilen faturaların önemli bir kısmı önlenebilir hatalardan doğar: eksik belge, kod uyumsuzluğu, limit aşımı. Bunlar gönderimden önce, kuralla ve gerekçesiyle yakalanabilir."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-3">
            {problems.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-navy-850 p-6 sm:p-8">
                <Icon className="h-5 w-5 text-white/45" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-5 text-base font-semibold tracking-[-0.01em] text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="mimari" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Nasıl çalışır"
            title="Faturalama sisteminizin önünde bir kontrol katmanı."
            description="Shield mevcut faturalama sisteminin yerini almaz. Gönderimden hemen önce çalışır, kalemleri kurallarla kontrol eder ve şüpheli olanları uzmana gösterir."
          />
          <div className="mt-14">
            <FlowDiagram steps={pipeline} accent="indigo" />
          </div>
        </div>
      </section>

      {/* Console */}
      <section id="konsol" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <div className="lg:sticky lg:top-40">
              <SectionHeader
                eyebrow="Risk skoru ve inceleme kuyruğu"
                title="Her skorun arkasında okunabilir bir gerekçe."
                description="Risk skoru, tetiklenen kuralların katkılarının toplamıdır. Uzman hangi kuralın skoru ne kadar etkilediğini görür ve kararını buna göre verir."
              />
              <Reveal className="mt-8 space-y-3 text-sm text-white/55">
                <p>Kuyruktan bir talep seçin; skoru oluşturan kurallar listelenir.</p>
                <p>Onaylayın, düzeltmeye gönderin ya da gönderimi durdurun.</p>
                <p>Kararınız denetim kaydına yeni bir satır olarak eklenir ve geri alınamaz.</p>
              </Reveal>
            </div>
            <Reveal className="min-w-0">
              <ShieldConsole />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Audit */}
      <section id="denetim" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Denetim kaydı"
            title="Kim, neyi, hangi kurala göre karar verdi."
            description="Bir kararı savunabilmek için hangi veriyle, hangi kural sürümüyle ve kimin tarafından verildiğini eksiksiz gösterebilmek gerekir."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {auditProps.map((p, i) => (
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
            <SectionHeader
              eyebrow="Erişim ve izolasyon"
              title="Kurumun verisi kurumda kalır."
              description="Her kurum kendi alanında çalışır. Sorgular, kuyruklar ve kayıtlar başka bir kurumun verisine erişemez; kimin neyi görebileceği role göre belirlenir."
            />
            <Reveal className="mt-10">
              <dl className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {isolation.map((row) => (
                  <div key={row.label} className="grid grid-cols-[120px_1fr] gap-4 py-3">
                    <dt className="text-[12px] text-white/45">{row.label}</dt>
                    <dd className="text-[13.5px] text-white/80">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal className="self-start overflow-hidden rounded-2xl border border-white/[0.06] bg-navy-850">
            <p className={`border-b border-white/[0.06] px-5 py-3 ${LABEL}`}>Örnek rol tanımları</p>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-white/[0.06]">
                {roles.map((r) => (
                  <tr key={r.role}>
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-medium text-white">{r.role}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/45">{r.scope}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right align-top">
                      <span className={`whitespace-nowrap ${LABEL}`}>{r.access}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] px-5 py-4 text-xs leading-relaxed text-white/40">
              Roller kurumun ihtiyacına göre ayarlanır. Shield tanı koymaz ve tedavi kararı vermez; yalnızca faturalama
              ve provizyon süreçlerinde çalışır.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaPanel
        accent="indigo"
        eyebrow="Demo ve pilot"
        title="Shield'ı kendi faturalarınızla görün."
        description="Kurumunuzda en sık görülen red nedenleri üzerinde bir demo yapabiliriz. Pilot için kapsamı bağlayıcı olmayan bir Niyet Mektubu (LOI) ile birlikte yazıyoruz."
        primaryHref="/contact?solution=shield"
        primaryLabel="Demo veya pilot başvurusu"
        aside={
          <ul className="divide-y divide-white/[0.06] self-center border-y border-white/[0.06]">
            {pilotAudiences.map((item) => (
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
