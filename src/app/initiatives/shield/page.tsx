import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Building,
  Eye,
  FileClock,
  Gauge,
  Hourglass,
  Inbox,
  KeyRound,
  ListChecks,
  Lock,
  Receipt,
  Send,
  ShieldAlert,
  Users,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import ShieldOrb from "@/components/ShieldOrb";
import InPageNav from "@/components/InPageNav";
import SectionHeader from "@/components/SectionHeader";
import FlowDiagram, { type FlowStep } from "@/components/FlowDiagram";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";
import ShieldConsole from "@/components/ShieldConsole";

export const metadata: Metadata = {
  title: "Shield",
  description:
    "Sağlık geri ödeme ve provizyon süreçlerinde fatura red riskini işlem öncesinde yakalayan açıklanabilir risk skoru ve insan denetimli karar platformu.",
};

const sections = [
  { id: "problem", label: "Problem" },
  { id: "mimari", label: "Operasyonel mimari" },
  { id: "konsol", label: "Risk skoru ve kuyruk" },
  { id: "denetim", label: "Denetim izi" },
  { id: "izolasyon", label: "İzolasyon ve erişim" },
];

const heroStats = [
  { value: "Pre-claim", label: "İşlem öncesi red riski tespiti" },
  { value: "HITL", label: "İnsan denetimli inceleme kuyruğu" },
  { value: "Append-only", label: "Değiştirilemez denetim kaydı" },
  { value: "RBAC", label: "Rol tabanlı erişim · multi-tenant" },
];

const problems = [
  {
    icon: Hourglass,
    title: "Reaktif düzeltme döngüsü",
    body: "Red kararı çoğu zaman fatura gönderildikten sonra öğrenilir. İtiraz, düzeltme ve yeniden gönderim; nakit akışını geciktirir ve operasyon ekiplerine tekrarlayan iş yükü bindirir.",
  },
  {
    icon: ListChecks,
    title: "Sık değişen kurallar",
    body: "Geri ödeme mevzuatı, paket tanımları ve kurum sözleşmeleri sık güncellenir. Kuralların bireysel deneyime dayalı takibi, tutarsız uygulamaya yol açar.",
  },
  {
    icon: Eye,
    title: "Gerekçesiz skorlar",
    body: "Neden yüksek riskli olduğu açıklanamayan bir skor, operasyon ekibine aksiyon alınabilir bilgi sunmaz ve denetimde savunulamaz.",
  },
];

const pipeline: FlowStep[] = [
  {
    icon: Receipt,
    title: "İşlem ve provizyon verisi",
    body: "Hizmet kalemleri, tanı ve işlem kodları, provizyon ve belge durumu gönderim öncesinde toplanır.",
    detail: "Faturalama sistemine dokunmadan, gönderim öncesi katman",
  },
  {
    icon: ShieldAlert,
    title: "Pre-claim kural değerlendirmesi",
    body: "Sürümlenmiş kural setleri; kod uyumu, belge eksikliği, limit ve mükerrerlik kontrollerini işlem öncesinde uygular.",
    detail: "Sürümlenmiş kural setleri · tekrarlanabilir sonuç",
  },
  {
    icon: Gauge,
    title: "Açıklanabilir risk skoru",
    body: "Skor, kural bazlı bileşenlerin toplamıdır. Her bileşen kural kimliği ve katkı ağırlığıyla birlikte gösterilir.",
    detail: "Skor = Σ kural katkısı",
  },
  {
    icon: Inbox,
    title: "İnceleme kuyruğu",
    body: "Eşik üzerindeki işlemler, öncelik sırasıyla yetkili uzmanın kuyruğuna düşer. Sistem kendi başına gönderim kararı vermez.",
    detail: "Human-in-the-loop",
  },
  {
    icon: Send,
    title: "Karar ve gönderim",
    body: "Uzman; onaylar, düzeltmeye gönderir veya gönderimi durdurur. Karar ve gerekçe işlemle birlikte saklanır.",
    detail: "Onay · düzeltme · durdurma",
  },
  {
    icon: FileClock,
    title: "Denetim izi",
    body: "Skor hesaplaması, kural sürümü, kullanıcı kararı ve zaman damgası yalnızca eklenebilir kayda yazılır.",
    detail: "Append-only audit log",
  },
];

const auditProps = [
  {
    title: "Yalnızca ekleme",
    body: "Kayıtlar oluşturulduktan sonra güncellenemez veya silinemez; düzeltmeler bile yeni bir kayıt olarak eklenir.",
  },
  {
    title: "Tam bağlam",
    body: "Her kayıt; kural seti sürümünü, girdi özetini, skor bileşenlerini, aktörü ve zaman damgasını içerir.",
  },
  {
    title: "Yeniden kurulabilirlik",
    body: "Geçmiş bir karar, o anki kural sürümü ve veriyle yeniden üretilerek denetim sırasında doğrulanabilir.",
  },
  {
    title: "Dışa aktarılabilirlik",
    body: "Denetim kayıtları, iç denetim ve dış denetim süreçleri için yapılandırılmış biçimde dışa aktarılabilir.",
  },
];

const roles = [
  { role: "Kurum yöneticisi", scope: "Kullanıcı, rol ve eşik yapılandırması", access: "Yönetim" },
  { role: "Gelir analisti", scope: "Kuyruk, raporlar ve trend analizleri", access: "Okuma" },
  { role: "İnceleme uzmanı", scope: "Kuyruktaki işlemlere karar verme", access: "Karar" },
  { role: "Denetçi", scope: "Denetim izi ve karar geçmişi", access: "Salt okunur" },
];

export default function ShieldPage() {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <PageHero
        visual={<ShieldOrb />}
        below={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] backdrop-blur-md lg:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-[#06080d]/80 p-5">
                <dt className="mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                <dd className="font-mono text-xl font-medium tracking-tight text-indigo-100 sm:text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        }
        breadcrumbs={[
          { href: "/", label: "Ana sayfa" },
          { href: "/#platformlar", label: "Platformlar" },
          { label: "Shield" },
        ]}
        eyebrow="Healthcare Revenue Integrity · Denial Risk OS"
        title={
          <>
            Shield:{" "}
            <span className="bg-gradient-to-r from-indigo-200 to-sky-200 bg-clip-text text-transparent">
              red riskini fatura gönderilmeden önce görün.
            </span>
          </>
        }
        description="Sağlık geri ödeme ve provizyon süreçlerinde red (denial) risklerini işlem öncesinde yakalayan; her skoru gerekçesiyle açıklayan ve kararı yetkili uzmana bırakan operasyonel karar platformu."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact?solution=shield"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#06080d] transition-colors hover:bg-indigo-200"
          >
            Demo / Niyet Mektubu (LOI)
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href="#konsol"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:border-white/30"
          >
            Etkileşimli örneği deneyin
          </a>
        </div>
      </PageHero>

      <InPageNav items={sections} accent="indigo" />

      {/* Problem */}
      <section id="problem" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Problem tanımı"
            title="Red kararı, gönderimden sonra öğrenildiğinde zaten geç kalınmıştır."
            description="Gelir bütünlüğü kayıplarının önemli bir kısmı önlenebilir hatalardan doğar: eksik belge, kod uyumsuzluğu, limit aşımı. Bu hatalar işlem öncesinde, kural bazlı ve açıklanabilir biçimde yakalanabilir."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            {problems.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[#070a10] p-6 sm:p-8">
                <Icon className="h-5 w-5 text-indigo-300/80" strokeWidth={1.6} />
                <h3 className="mt-5 text-base font-medium text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="mimari" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Operasyonel mimari"
            title="Gönderim öncesinde konumlanan bir karar katmanı."
            description="Shield, mevcut faturalama sistemlerinin yerini almaz; gönderim öncesinde çalışan, kural bazlı ve denetlenebilir bir kontrol katmanı olarak konumlanır."
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
                eyebrow="Açıklanabilir skor · inceleme kuyruğu"
                title="Her skorun arkasında okunabilir bir gerekçe."
                description="Risk skoru, tetiklenen kuralların katkılarının toplamıdır. Uzman, hangi kuralın skoru ne kadar etkilediğini görür ve kararını bu gerekçeye dayandırır."
              />
              <Reveal className="mt-8 space-y-3 text-sm text-white/55">
                <p className="flex gap-3">
                  <span className="font-mono text-indigo-300/80">01</span>
                  Kuyruktan bir işlem seçin; skor bileşenleri kural kimlikleriyle görünür.
                </p>
                <p className="flex gap-3">
                  <span className="font-mono text-indigo-300/80">02</span>
                  Onaylayın, düzeltmeye gönderin veya gönderimi durdurun.
                </p>
                <p className="flex gap-3">
                  <span className="font-mono text-indigo-300/80">03</span>
                  Kararınız denetim izine yeni bir kayıt olarak eklenir; geri alınamaz.
                </p>
              </Reveal>
            </div>
            <Reveal>
              <ShieldConsole />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Audit */}
      <section id="denetim" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Append-only audit log"
            title="Değiştirilemez denetim altyapısı."
            description="Bir kararın savunulabilir olması, o kararın hangi veri, hangi kural sürümü ve hangi kullanıcıyla verildiğinin eksiksiz gösterilebilmesine bağlıdır."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {auditProps.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05} className="bg-[#070a10] p-6 sm:p-7">
                <Lock className="h-4 w-4 text-indigo-300/70" />
                <h3 className="mt-5 text-base font-medium text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Isolation & RBAC */}
      <section id="izolasyon" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Multi-tenant · RBAC"
              title="Kurum verisi kurumda kalır."
              description="Her kurum, mantıksal olarak izole edilmiş bir kiracı (tenant) alanında çalışır. Sorgular, kuyruklar ve denetim kayıtları kiracı sınırını aşamaz; erişim, rol bazında en az yetki ilkesiyle tanımlanır."
            />
            <Reveal className="mt-10 grid grid-cols-3 gap-3">
              {["Kurum A", "Kurum B", "Kurum C"].map((t) => (
                <div key={t} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <Building className="h-4 w-4 text-indigo-300/70" />
                  <p className="mt-3 text-[13px] text-white/80">{t}</p>
                  <div className="mt-3 space-y-1.5">
                    {["Veri", "Kuyruk", "Audit"].map((layer) => (
                      <div
                        key={layer}
                        className="rounded-md border border-white/[0.06] bg-[#070a10] px-2 py-1 font-mono text-[10px] text-white/40"
                      >
                        {layer}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Reveal>
            <p className="mt-4 flex items-center gap-2 font-mono text-[11px] text-white/35">
              <KeyRound className="h-3.5 w-3.5" /> Kiracı kimliği her sorguda zorunlu kapsamdır
            </p>
          </div>

          <Reveal className="self-start overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-5 py-3.5">
              <Users className="h-4 w-4 text-white/40" />
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">Örnek rol matrisi</p>
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-white/[0.06]">
                {roles.map((r) => (
                  <tr key={r.role} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4 align-top">
                      <p className="text-white">{r.role}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45">{r.scope}</p>
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <span className="inline-block whitespace-nowrap rounded-full border border-indigo-400/20 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-indigo-200/80">
                        {r.access}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-white/40">
              Roller ve yetki kapsamları kurum ihtiyacına göre yapılandırılır. Shield klinik tanı veya tedavi kararı
              üretmez; operasyonel ve finansal süreçleri destekler.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaPanel
        accent="indigo"
        eyebrow="Demo ve pilot"
        title="Shield Demo / Niyet Mektubu (LOI)"
        description="Kurumunuzun red örüntüleri üzerinde Shield'ın nasıl çalışacağını görmek için bir demo planlayın veya bağlayıcı olmayan bir Niyet Mektubu ile pilot kapsamını birlikte tanımlayalım."
        primaryHref="/contact?solution=shield"
        primaryLabel="Shield Demo / Niyet Mektubu (LOI)"
        aside={
          <ul className="space-y-3 self-center">
            {[
              "Hastane gelir döngüsü ve faturalama birimleri",
              "Provizyon ve geri ödeme operasyon ekipleri",
              "Çok lokasyonlu sağlık grupları",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#070a10]/70 px-4 py-3.5 text-sm text-white/70"
              >
                <Receipt className="h-4 w-4 shrink-0 text-indigo-300" strokeWidth={1.6} />
                {item}
              </li>
            ))}
          </ul>
        }
      />
    </main>
  );
}
