import { ArrowRight, ArrowUpRight, Building2, Mail, Receipt, Stethoscope } from "lucide-react";
import Navbar, { LogoMark } from "@/components/Navbar";
import ParticleNetwork from "@/components/ParticleNetwork";
import InitiativeCard, { type InitiativeCardProps } from "@/components/InitiativeCard";
import StandardsGrid from "@/components/StandardsGrid";
import Reveal from "@/components/Reveal";

const CONTACT_EMAIL = "iletisim@lavieuxlabs.com";
const LOI_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("LoI / Pilot İş Birliği Talebi")}`;

const heroStats = [
  { value: "18", label: "Klinik güvenlik düzlemi" },
  { value: "2.480+", label: "Otomatik birim ve entegrasyon testi" },
  { value: "FHIR R4", label: "Birlikte çalışabilirlik standardı" },
  { value: "MDR IIa", label: "Uyumlu SaMD mimarisi" },
];

const initiatives: InitiativeCardProps[] = [
  {
    index: "01",
    name: "PharmaDeux CDSS",
    category: "Klinik Karar Destek Sistemi · SaMD",
    summary:
      "İlaç-ilaç etkileşimlerini, organ toksisitesini ve kümülatif organ yükünü 18 temel güvenlik düzleminde denetleyen deterministik klinik güvenlik motoru.",
    metrics: [
      { value: "18", label: "Temel güvenlik düzlemi" },
      { value: "2.480+", label: "Otomatik birim / entegrasyon testi" },
      { value: "FHIR R4", label: "HL7 veri standardı" },
      { value: "THS 4", label: "Teknoloji hazırlık seviyesi" },
    ],
    capabilities: [
      "İlaç-ilaç etkileşimi denetimi",
      "Organ toksisitesi değerlendirmesi",
      "Kümülatif organ yükü hesaplaması",
      "MDR Sınıf IIa ile uyumlu olarak kurgulanan mimari",
    ],
    tags: ["SaMD", "MDR Sınıf IIa", "HL7 FHIR R4", "Deterministik"],
    icon: "pill",
    accent: "teal",
  },
  {
    index: "02",
    name: "Shield",
    category: "Healthcare Revenue Integrity · Denial Risk OS",
    summary:
      "Sağlık geri ödeme ve provizyon süreçlerinde fatura red riskini işlem öncesinde yakalayan, açıklanabilir risk skoru ve insan denetimli karar platformu.",
    metrics: [
      { value: "Pre-claim", label: "İşlem öncesi red riski tespiti" },
      { value: "HITL", label: "İnsan denetimli karar akışı" },
      { value: "Append-only", label: "Değiştirilemez denetim kaydı" },
      { value: "RBAC", label: "Rol tabanlı erişim kontrolü" },
    ],
    capabilities: [
      "Provizyon ve fatura süreçlerinde red (denial) riski sinyali",
      "Bileşenlerine ayrılabilen, açıklanabilir risk skoru",
      "Uzman onayına bağlı operasyonel karar akışı",
      "Kurum verilerini izole eden multi-tenant mimari",
    ],
    tags: ["Revenue Integrity", "Explainable", "Multi-tenant", "Audit"],
    icon: "shield",
    accent: "indigo",
  },
];

const decisionChain = [
  {
    step: "01",
    title: "Yapılandırılmış veri",
    body: "Klinik ve operasyonel girdiler standart kaynak modellerine (HL7 FHIR R4) eşlenir.",
  },
  {
    step: "02",
    title: "Deterministik değerlendirme",
    body: "Sürümlenmiş kural setleri girdiyi değerlendirir; aynı girdi her zaman aynı sonucu verir.",
  },
  {
    step: "03",
    title: "İnsan onayı",
    body: "Yetkili uzman öneriyi gerekçesiyle birlikte inceler; onaylar, düzeltir ya da reddeder.",
  },
  {
    step: "04",
    title: "Denetim kaydı",
    body: "Girdi, kural sürümü, çıktı ve karar append-only kayda yazılır; geriye dönük yeniden kurulabilir.",
  },
];

const loiAudiences = [
  {
    icon: Stethoscope,
    title: "Klinik ekipler",
    body: "Hastaneler, klinik eczacılık birimleri ve ilaç güvenliği komiteleri.",
  },
  {
    icon: Receipt,
    title: "Gelir döngüsü ekipleri",
    body: "Faturalama, provizyon ve geri ödeme süreçlerini yöneten operasyon birimleri.",
  },
  {
    icon: Building2,
    title: "Kurumsal ve akademik ortaklar",
    body: "Sağlık grupları, üniversite hastaneleri ve teknokent Ar-Ge iş birlikleri.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-teal-300/80">
        <span className="h-px w-6 bg-teal-300/50" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-white/55">{description}</p>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="top" className="relative flex-1 overflow-x-clip">
        {/* Hero */}
        <section className="relative isolate flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="bg-grid mask-radial absolute inset-0" />
            <ParticleNetwork className="absolute inset-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_45%,rgba(6,8,13,0.85),transparent_75%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#06080d]" />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                Sağlık Teknolojileri Ar-Ge Kolektifi
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[64px]">
                Klinik ve operasyonel kararlar için{" "}
                <span className="bg-gradient-to-r from-teal-200 via-emerald-200 to-indigo-200 bg-clip-text text-transparent">
                  deterministik güvenlik altyapısı.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
                LavieuxLabs; ilaç güvenliği ve sağlık geri ödeme süreçlerinde, her çıktısı izlenebilir,
                test edilebilir ve insan denetimine açık karar sistemleri geliştirir.
              </p>
            </Reveal>

            <Reveal delay={0.24} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#platformlar"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#06080d] transition-colors hover:bg-teal-200"
              >
                Platformları inceleyin
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#iletisim"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:border-white/30 hover:bg-white/[0.06]"
              >
                Pilot / LoI görüşmesi
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>

            <Reveal delay={0.32} className="mt-16 sm:mt-20">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] backdrop-blur-md lg:grid-cols-4">
                {heroStats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse bg-[#06080d]/80 p-5">
                    <dt className="mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                    <dd className="font-mono text-xl font-medium tracking-tight text-white sm:text-2xl">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Platforms */}
        <section id="platformlar" className="relative scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Platformlar"
              title="İki amiral gemisi, tek mühendislik disiplini."
              description="Klinik güvenlik ve gelir bütünlüğü farklı alanlar; ancak ikisi de aynı gereksinimi paylaşır: her kararın gerekçesi gösterilebilmeli, tekrarlanabilmeli ve denetlenebilmelidir."
            />
            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {initiatives.map((item) => (
                <InitiativeCard key={item.name} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Standards */}
        <section id="standartlar" className="relative scroll-mt-20 py-24 sm:py-32">
          <div aria-hidden="true" className="bg-grid mask-fade-y absolute inset-0 -z-10 opacity-60" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Mühendislik standartları"
              title="Pazarlık konusu olmayan altı ilke."
              description="Regüle bir alanda güven, iddiayla değil mimariyle kurulur. Her iki platform da aşağıdaki standartlar üzerine inşa edilir."
            />
            <div className="mt-14">
              <StandardsGrid />
            </div>
          </div>
        </section>

        {/* Approach */}
        <section id="yaklasim" className="relative scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Yaklaşım"
              title="Girdiden denetim kaydına, kesintisiz karar zinciri."
              description="Her öneri dört adımlık aynı zincirden geçer. Zincirin hiçbir halkası atlanamaz ve her halka kayıt altındadır."
            />
            <div className="relative mt-14">
              <div
                aria-hidden="true"
                className="absolute top-[11px] right-0 left-0 hidden h-px bg-gradient-to-r from-teal-300/40 via-white/10 to-indigo-300/40 md:block"
              />
              <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
                {decisionChain.map((item, i) => (
                  <li key={item.step} className="relative">
                    <Reveal delay={i * 0.08}>
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-[23px] w-[23px] items-center justify-center rounded-full border border-white/15 bg-[#06080d]">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                        </span>
                        <span className="font-mono text-xs tracking-[0.16em] text-white/35">{item.step}</span>
                      </div>
                      <h3 className="mt-5 text-base font-medium text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{item.body}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* LoI / Contact */}
        <section id="iletisim" className="relative scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] px-6 py-12 backdrop-blur-sm sm:px-12 sm:py-16">
                <div aria-hidden="true" className="absolute inset-0 -z-10">
                  <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
                  <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
                  <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
                </div>

                <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                  <div>
                    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      Pilot programı · Niyet Mektubu (LoI)
                    </p>
                    <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      Saha doğrulamasını birlikte tasarlayalım.
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
                      Bağlayıcı olmayan bir Niyet Mektubu; pilot kapsamını, veri erişim koşullarını ve
                      başarı ölçütlerini baştan tanımlar. Kurumunuzun süreçlerine uygun bir pilot çerçevesi
                      için bizimle iletişime geçin.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={LOI_MAILTO}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#06080d] transition-colors hover:bg-teal-200"
                      >
                        LoI talebi gönderin
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-mono text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
                      >
                        <Mail className="h-4 w-4" />
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>

                  <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                    {loiAudiences.map(({ icon: Icon, title, body }) => (
                      <li key={title} className="flex gap-4 py-5">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/40" strokeWidth={1.6} />
                        <div>
                          <h3 className="text-sm font-medium text-white">{title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-white/50">{body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-6 text-teal-300" />
            <span className="text-sm font-semibold tracking-tight text-white">
              Lavieux<span className="text-white/50">Labs</span>
            </span>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-white/40 md:text-right">
            PharmaDeux CDSS ve Shield geliştirme aşamasındadır. Klinik kullanım, ilgili regülasyon ve
            uygunluk değerlendirme süreçlerinin tamamlanmasına tabidir.
            <br />© 2026 LavieuxLabs. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </>
  );
}
