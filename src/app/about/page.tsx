import type { Metadata } from "next";
import {
  BookOpen,
  FlaskConical,
  GitCompare,
  GraduationCap,
  Hospital,
  Lock,
  Microscope,
  Repeat,
  Target,
  Users,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "LavieuxLabs; klinik güvenliği bir mühendislik disiplini olarak ele alan, deterministik ve denetlenebilir sağlık teknolojileri geliştiren bir Ar-Ge kolektifidir.",
};

const pillars = [
  {
    icon: Target,
    label: "Vizyon",
    title: "Her klinik ve operasyonel kararın gerekçesinin gösterilebildiği bir sağlık sistemi.",
    body: "Karar destek sistemlerinin güvenilirliği, ne kadar “akıllı” göründükleriyle değil; çıktılarının ne kadar tekrarlanabilir, açıklanabilir ve denetlenebilir olduğuyla ölçülmelidir.",
  },
  {
    icon: FlaskConical,
    label: "Misyon",
    title: "Regüle alanlar için kanıta dayalı, test edilebilir yazılım üretmek.",
    body: "İlaç güvenliği ve gelir bütünlüğü gibi hata maliyetinin yüksek olduğu alanlarda, klinisyen ve operasyon uzmanlarının yerine değil, yanında çalışan sistemler geliştiriyoruz.",
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
    title: "Kanıt hiyerarşisi",
    body: "Kurallar; resmi ürün bilgileri, klinik kılavuzlar ve hakemli literatürden türetilir. Her kural kaynağına bağlanır.",
  },
  {
    icon: GitCompare,
    title: "Gereksinimden teste izlenebilirlik",
    body: "Her klinik gereksinim, onu uygulayan kurala ve doğrulayan test senaryosuna bağlanır.",
  },
  {
    icon: Repeat,
    title: "Kontrollü değişiklik",
    body: "Bilgi tabanı ve kural setleri sürümlenir; hiçbir değişiklik gözden geçirme ve otomatik testten geçmeden yayına alınmaz.",
  },
  {
    icon: Lock,
    title: "Tasarımda güvenlik ve gizlilik",
    body: "Veri minimizasyonu, rol tabanlı erişim ve değiştirilemez denetim izi; sonradan eklenen özellikler değil, mimarinin başlangıç koşullarıdır.",
  },
];

const collaboration = [
  {
    icon: Hospital,
    title: "Klinik danışma",
    body: "Kural setleri ve kullanıcı akışları, alanında deneyimli klinisyen ve klinik eczacılarla birlikte tasarlanır ve gözden geçirilir.",
  },
  {
    icon: Microscope,
    title: "Etik ve veri yönetişimi",
    body: "Gerçek veriyle yürütülen her çalışma etik kurul onayına, anonimleştirmeye ve kurumla imzalanan veri işleme sözleşmesine tabidir.",
  },
  {
    icon: GraduationCap,
    title: "Akademik çıktı",
    body: "Doğrulama çalışmalarını, iş birliği yapan kurumlarla birlikte bilimsel yayın standartlarında raporlamayı hedefleriz.",
  },
  {
    icon: Users,
    title: "Sahadan geri bildirim",
    body: "Pilot kullanıcılarının geri bildirimleri yapılandırılmış biçimde toplanır ve ürün gereksinimlerine izlenebilir şekilde aktarılır.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative isolate flex-1 overflow-x-clip">
      <PageHero
        breadcrumbs={[{ href: "/", label: "Ana sayfa" }, { label: "Hakkımızda" }]}
        eyebrow="LavieuxLabs Ar-Ge Kolektifi"
        title={
          <>
            Klinik güvenliği bir <span className="text-white/50">mühendislik disiplini</span> olarak ele alıyoruz.
          </>
        }
        description="LavieuxLabs; klinik farmakoloji, sağlık operasyonları ve yazılım mühendisliğini bir araya getiren bir sağlık teknolojileri Ar-Ge kolektifidir. Hata maliyetinin yüksek olduğu alanlarda deterministik, test edilebilir ve insan denetimine açık sistemler geliştiriyoruz."
      />

      {/* Vision & mission */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {pillars.map(({ icon: Icon, label, title, body }, i) => (
            <Reveal
              key={label}
              delay={i * 0.08}
              className="rounded-2xl border border-white/[0.08] bg-navy-850/70 p-7 backdrop-blur-sm sm:p-9"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-teal-300" strokeWidth={1.6} />
                <p className="text-xs font-medium uppercase tracking-wide text-white/45">{label}</p>
              </div>
              <h2 className="mt-6 text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">{title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deterministic medicine */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Deterministik tıp felsefesi"
            title="Klinik karar yolunda olasılık değil, kanıt."
            description="Olasılıksal ve üretken modeller araştırma ve analiz için değerli araçlardır. Ancak bir ilaç istemini durdurabilecek ya da bir hastanın tedavisini etkileyebilecek bir uyarı, tekrarlanabilir ve kaynağına kadar izlenebilir olmalıdır. Bu nedenle klinik ve operasyonel karar yolunda kural tabanlı determinizmi esas alıyoruz."
          />

          <Reveal className="mt-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-navy-850/80 backdrop-blur-sm">
            <div className="hidden grid-cols-[180px_1fr_1fr] border-b border-white/[0.08] bg-white/[0.03] text-xs font-medium uppercase tracking-wide md:grid">
              <div className="px-6 py-4 text-white/40">Ölçüt</div>
              <div className="px-6 py-4 text-white/40">Olasılıksal model</div>
              <div className="px-6 py-4 text-teal-300/80">Kural tabanlı determinizm</div>
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
                  <dd className="text-sm leading-relaxed text-white/80 md:border-l md:border-white/[0.06] md:bg-teal-400/[0.03] md:px-6 md:py-5">
                    <span className="mr-2 text-[10px] font-medium uppercase tracking-wide text-white/60 md:hidden">
                      Deterministik
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
            eyebrow="Ar-Ge disiplini"
            title="Kanıttan koda, koddan teste."
            description="Teknokent ölçeğinde bir Ar-Ge ekibi olarak, regüle bir ürünün gerektirdiği izlenebilirlik ve değişiklik kontrolünü ilk satır koddan itibaren uyguluyoruz."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {rnd.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.05} className="bg-navy-850/90 p-6 sm:p-7">
                <Icon className="h-5 w-5 text-white/45" strokeWidth={1.6} />
                <h3 className="mt-5 text-base font-medium text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
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
            title="Sahayla birlikte, sahaya rağmen değil."
            description="Bir klinik karar destek sistemi, ancak onu kullanacak ekiplerin iş akışına ve klinik muhakemesine saygı gösterdiğinde güvenli olabilir."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {collaboration.map(({ icon: Icon, title, body }, i) => (
              <li key={title}>
                <Reveal
                  delay={i * 0.05}
                  className="h-full rounded-2xl border border-white/[0.08] bg-navy-850/70 p-6 backdrop-blur-sm transition-colors hover:border-white/[0.16]"
                >
                  <Icon className="h-5 w-5 text-teal-300/80" strokeWidth={1.6} />
                  <h3 className="mt-4 text-base font-medium text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaPanel
        eyebrow="Birlikte çalışalım"
        title="Klinik, kurumsal ve akademik iş birliklerine açığız."
        description="Pilot çalışmalar, retrospektif doğrulama projeleri veya akademik iş birlikleri için bizimle iletişime geçin."
        primaryHref="/contact?solution=academic"
        primaryLabel="İletişime geçin"
      />
    </main>
  );
}
