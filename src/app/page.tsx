import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Receipt, Stethoscope } from "lucide-react";
import InitiativeCard, { type InitiativeCardProps } from "@/components/InitiativeCard";
import StandardsGrid from "@/components/StandardsGrid";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import CtaPanel from "@/components/CtaPanel";

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
    href: "/initiatives/pharmadeux",
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
    href: "/initiatives/shield",
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

export default function Home() {
  return (
    <main id="top" className="relative flex-1 overflow-x-clip">
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/60 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
              Sağlık Teknolojileri Ar-Ge Kolektifi
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[64px]">
              Klinik ve operasyonel kararlar için{" "}
              <span className="text-white/50">deterministik güvenlik altyapısı.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              LavieuxLabs; ilaç güvenliği ve sağlık geri ödeme süreçlerinde, her çıktısı izlenebilir, test edilebilir ve
              insan denetimine açık karar sistemleri geliştirir.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#platformlar"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors hover:bg-teal-200"
            >
              Platformları inceleyin
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:border-white/30 hover:bg-white/[0.06]"
            >
              Pilot Başvurusu (LOI)
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.32} className="mt-16 sm:mt-20">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] backdrop-blur-md lg:grid-cols-4">
              {heroStats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse bg-navy-900/80 p-5">
                  <dt className="mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                  <dd className="font-mono text-xl font-medium tracking-tight text-white sm:text-2xl">{s.value}</dd>
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
                      <span className="relative flex h-[23px] w-[23px] items-center justify-center rounded-full border border-white/15 bg-navy-900">
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

      {/* LOI / Contact */}
      <div id="iletisim" className="scroll-mt-20">
        <CtaPanel
          eyebrow="Pilot programı · Niyet Mektubu (LOI)"
          title="Saha doğrulamasını birlikte tasarlayalım."
          description="Bağlayıcı olmayan bir Niyet Mektubu; pilot kapsamını, veri erişim koşullarını ve başarı ölçütlerini baştan tanımlar. Kurumunuzun süreçlerine uygun bir pilot çerçevesi için bizimle iletişime geçin."
          primaryHref="/contact"
          primaryLabel="Niyet Mektubu (LOI) oluşturun"
          aside={
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
          }
        />
      </div>
    </main>
  );
}
