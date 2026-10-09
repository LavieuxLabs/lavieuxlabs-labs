import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "LavieuxLabs, ilaç güvenliği ve hastane faturalaması için test edilebilir karar destek yazılımı geliştiren bir Ar-Ge ekibidir.",
};

const pillars = [
  {
    icon: Target,
    label: "Vizyon",
    title: "Her klinik ve idari kararın nedeni gösterilebilmeli.",
    body: "Bir karar destek sisteminin değeri ne kadar akıllı göründüğüyle değil, sonucunu tekrar üretip nedenini gösterebilmesiyle ölçülür.",
  },
  {
    icon: FlaskConical,
    label: "Misyon",
    title: "Hata maliyeti yüksek alanlar için test edilebilir yazılım.",
    body: "İlaç güvenliği ve faturalama gibi alanlarda hekimin ve uzmanın yerine geçen değil, işini kolaylaştıran araçlar yapıyoruz.",
  },
];

const comparison = [
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
];

const rnd = [
  {
    icon: BookOpen,
    title: "Kaynağı belli kurallar",
    body: "Kurallar resmi ürün bilgilerinden (KÜB/KT), klinik kılavuzlardan ve hakemli literatürden çıkarılır. Her kural kaynağını gösterir.",
    rows: [
      { label: "Kaynaklar", value: "KÜB / KT · kılavuzlar · hakemli literatür" },
      { label: "İzlenebilirlik", value: "Kural → kaynak" },
    ] as SpecRow[],
  },
  {
    icon: GitCompare,
    title: "Gereksinimden teste iz",
    body: "Her klinik gereksinim, onu uygulayan kurala ve onu sınayan teste bağlıdır.",
    rows: [
      { label: "Zincir", value: "Gereksinim → kural → test" },
      { label: "Otomatik test", value: "2.480+", mono: true },
    ] as SpecRow[],
  },
  {
    icon: Repeat,
    title: "Kontrollü değişiklik",
    body: "Kural setleri sürümlenir. Hiçbir değişiklik gözden geçirilmeden ve testten geçmeden yayına çıkmaz.",
    rows: [
      { label: "Sürümleme", value: "Kural seti · bilgi tabanı" },
      { label: "Kapı", value: "Gözden geçirme + regresyon testi" },
    ] as SpecRow[],
  },
  {
    icon: Lock,
    title: "Baştan güvenlik ve gizlilik",
    body: "Az veri toplamak, rol bazlı erişim ve değiştirilemeyen kayıt sonradan eklenmedi; sistem bunlarla başladı.",
    rows: [
      { label: "Kontroller", value: "Veri minimizasyonu · RBAC" },
      { label: "Kayıt", value: "Append-only denetim izi" },
    ] as SpecRow[],
  },
];

const regulatory = [
  {
    id: "REG-01",
    icon: FileCheck2,
    title: "AB Tıbbi Cihaz Yönetmeliği",
    body: "PharmaDeux, ilaç tedavisi kararlarına bilgi sağlayan bir yazılım olduğu için MDR kapsamına giriyor.",
    rows: [
      { label: "Mevzuat", value: "MDR 2017/745 · Ek VIII Kural 11" },
      { label: "Hedef", value: "SaMD · Sınıf IIa" },
      { label: "CE işareti", value: "Henüz yok" },
    ] as SpecRow[],
    status: { label: "Sınıf IIa hedefi", tone: "prep" as const },
  },
  {
    id: "REG-02",
    icon: Workflow,
    title: "Yazılım yaşam döngüsü ve risk",
    body: "Geliştirme ve risk yönetimi süreçleri bu standartlara göre kuruluyor.",
    rows: [
      { label: "Yaşam döngüsü", value: "IEC 62304" },
      { label: "Risk", value: "ISO 14971" },
    ] as SpecRow[],
    status: { label: "Mimari uyum", tone: "input" as const },
  },
  {
    id: "REG-03",
    icon: ShieldAlert,
    title: "Kalite yönetim sistemi",
    body: "Kalite yönetim sistemi ve kullanılabilirlik çalışması yol haritasında.",
    rows: [
      { label: "KYS", value: "ISO 13485" },
      { label: "Kullanılabilirlik", value: "IEC 62366-1" },
    ] as SpecRow[],
    status: { label: "Yol haritasında", tone: "prep" as const },
  },
  {
    id: "REG-04",
    icon: LockKeyhole,
    title: "Bilgi güvenliği ve kişisel veri",
    body: "Kişisel veriler KVKK'ya göre işlenir; güvenlik kontrolleri ISO/IEC 27001'e göre kuruluyor.",
    rows: [
      { label: "Mevzuat", value: "6698 sayılı KVKK · md. 12" },
      { label: "Kontroller", value: "ISO/IEC 27001" },
    ] as SpecRow[],
    status: { label: "Kontrol setine uyum hedefi", tone: "input" as const },
  },
];

const collaboration = [
  {
    icon: Hospital,
    title: "Klinik danışma",
    body: "Kural setleri ve ekranlar, klinisyenler ve klinik eczacılarla birlikte yazılır ve gözden geçirilir.",
    rows: [
      { label: "Paydaşlar", value: "Klinisyen · klinik eczacı" },
      { label: "Çıktı", value: "Gözden geçirilmiş kural setleri" },
    ] as SpecRow[],
  },
  {
    icon: Microscope,
    title: "Etik kurul ve veri",
    body: "Gerçek veriyle yapılan her çalışma etik kurul onayı, anonimleştirme ve kurumla imzalanan veri işleme sözleşmesi gerektirir.",
    rows: [
      { label: "Önkoşul", value: "Etik kurul onayı · DPA" },
      { label: "Veri", value: "Anonimleştirilmiş, KVKK uyumlu" },
    ] as SpecRow[],
  },
  {
    icon: GraduationCap,
    title: "Yayın",
    body: "Doğrulama çalışmalarını ortak kurumlarla birlikte hakemli dergilerde yayımlamayı hedefliyoruz.",
    rows: [
      { label: "Hedef", value: "Hakemli yayın" },
      { label: "Raporlama", value: "Duyarlılık · özgüllük · PPV" },
    ] as SpecRow[],
  },
  {
    icon: Users,
    title: "Sahadan geri bildirim",
    body: "Pilot kullanıcıların geri bildirimi düzenli toplanır ve hangi gereksinime dönüştüğü takip edilir.",
    rows: [
      { label: "Toplama", value: "Yapılandırılmış form" },
      { label: "İzlenebilirlik", value: "Geri bildirim → gereksinim" },
    ] as SpecRow[],
  },
];

export default function AboutPage() {
  return (
    <main className="relative isolate flex-1 overflow-x-clip">
      <PageHero
        breadcrumbs={[{ href: "/", label: "Ana sayfa" }, { label: "Hakkımızda" }]}
        eyebrow="Hakkımızda"
        title={
          <>
            İlaç güvenliği ve faturalama için <span className="text-white/50">test edilebilir yazılım yapıyoruz.</span>
          </>
        }
        description="LavieuxLabs, klinik farmakoloji, sağlık operasyonları ve yazılım mühendisliğini bir araya getiren bir Ar-Ge ekibi. Hatanın hastaya ya da kuruma pahalıya mal olduğu işler için, her sonucu yeniden üretilebilen ve kararı insana bırakan sistemler geliştiriyoruz."
      />

      {/* Vision & mission */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {pillars.map(({ icon: Icon, label, title, body }, i) => (
            <Reveal
              key={label}
              delay={i * 0.08}
              className="rounded-2xl border border-white/[0.06] bg-navy-850 p-7 sm:p-9"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-white/45" strokeWidth={1.6} aria-hidden="true" />
                <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{label}</p>
              </div>
              <h2 className="mt-6 text-xl leading-snug font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                {title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deterministic medicine */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Neden kural tabanlı"
            title="Karar anında tahmin değil, kural."
            description="Olasılıksal ve üretken modeller araştırma ve analiz için faydalı. Ama bir reçeteyi durdurabilecek bir uyarının her seferinde aynı sonucu vermesi ve hangi kaynaktan geldiğinin gösterilebilmesi gerekir. Bu yüzden karar anında kural tabanlı sistem kullanıyoruz."
          />

          <Reveal className="mt-14 overflow-hidden rounded-2xl border border-white/[0.06] bg-navy-850">
            <div className="hidden grid-cols-[180px_1fr_1fr] border-b border-white/[0.06] text-[11px] font-medium tracking-wider uppercase md:grid">
              <div className="px-6 py-4 text-white/45">Ölçüt</div>
              <div className="px-6 py-4 text-white/45">Olasılıksal model</div>
              <div className="px-6 py-4 text-white/70">Kural tabanlı sistem</div>
            </div>
            <dl className="divide-y divide-white/[0.06]">
              {comparison.map((row) => (
                <div
                  key={row.criterion}
                  className="grid gap-2 px-6 py-5 md:grid-cols-[180px_1fr_1fr] md:gap-0 md:px-0 md:py-0"
                >
                  <dt className="text-sm font-medium text-white md:px-6 md:py-5">{row.criterion}</dt>
                  <dd className="text-sm leading-relaxed text-white/45 md:px-6 md:py-5">
                    <span className="mr-2 text-[10px] font-medium uppercase tracking-wide text-white/30 md:hidden">
                      Olasılıksal
                    </span>
                    {row.probabilistic}
                  </dd>
                  <dd className="text-sm leading-relaxed text-white/80 md:border-l md:border-white/[0.06] md:bg-white/[0.02] md:px-6 md:py-5">
                    <span className="mr-2 text-[10px] font-medium uppercase tracking-wide text-white/60 md:hidden">
                      Kural tabanlı
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
          <SectionHeader
            eyebrow="Çalışma biçimi"
            title="Kaynaktan koda, koddan teste."
            description="Düzenlemeye tabi bir ürünün gerektirdiği izlenebilirliği ve değişiklik kontrolünü ilk günden uyguluyoruz."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rnd.map(({ icon, title, body, rows }, i) => (
              <Reveal key={title} delay={i * 0.04} className="h-full">
                <SpecCard icon={icon} title={title} body={body} rows={rows} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory and quality framework */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Kalite ve regülasyon"
            title="Hangi standarda göre, hangi aşamadayız."
            description="Referans aldığımız standartları ve her birinde nerede olduğumuzu yazdık. Bu bir sertifika beyanı değildir."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {regulatory.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.04} className="h-full">
                <SpecCard id={r.id} icon={r.icon} title={r.title} body={r.body} rows={r.rows} status={r.status} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical collaboration */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <SectionHeader
            eyebrow="Klinik iş birliği"
            title="Sahadaki ekiplerle birlikte geliştiriyoruz."
            description="Bir karar destek sistemi, onu kullanacak ekibin iş akışına uymuyorsa güvenli olamaz."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {collaboration.map(({ icon, title, body, rows }, i) => (
              <li key={title}>
                <Reveal delay={i * 0.04} className="h-full">
                  <SpecCard icon={icon} title={title} body={body} rows={rows} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaPanel
        eyebrow="İletişim"
        title="Pilot, doğrulama ya da akademik iş birliği için yazın."
        description="Klinik, kurumsal ya da akademik bir çalışma fikriniz varsa kısa bir mesaj yeterli."
        primaryHref="/contact?solution=academic"
        primaryLabel="Bize yazın"
      />
    </main>
  );
}
