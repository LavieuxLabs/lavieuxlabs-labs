import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Receipt, Stethoscope } from "lucide-react";
import InitiativeCard, { type InitiativeCardProps } from "@/components/InitiativeCard";
import StandardsGrid from "@/components/StandardsGrid";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import CtaPanel from "@/components/CtaPanel";

const heroStats = [
  { value: "18", label: "İlaç güvenliği kontrol başlığı" },
  { value: "2.480+", label: "Otomatik test" },
  { value: "FHIR R4", label: "Veri standardı" },
  { value: "Sınıf IIa", label: "MDR hedef sınıfı" },
];

const initiatives: InitiativeCardProps[] = [
  {
    name: "PharmaDeux CDSS",
    category: "Klinik karar destek · ilaç güvenliği",
    summary:
      "Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi. Her uyarı, onu tetikleyen kural ve eşik değeriyle birlikte gösterilir.",
    specs: [
      { value: "18", label: "Güvenlik düzlemi" },
      { value: "2.480+", label: "Otomatik test" },
      { value: "FHIR R4", label: "Veri standardı" },
      { value: "THS 4", label: "Teknoloji hazırlık seviyesi" },
    ],
    icon: "pill",
    accent: "teal",
    href: "/initiatives/pharmadeux",
  },
  {
    name: "Shield",
    category: "Gelir bütünlüğü · provizyon denetimi",
    summary:
      "Hastane fatura ve provizyon süreçlerindeki SUT/SGK red risklerini işlem öncesinde tespit eden kurumsal denetim katmanı. Riskli kalem, gerekçesiyle birlikte uzmanın kuyruğuna düşer.",
    specs: [
      { value: "0–100", label: "Risk skoru, kural katkılarının toplamı" },
      { value: "Gönderim öncesi", label: "Kontrol anı" },
      { value: "ICD-10 · SUT", label: "Eşleştirilen kod sistemleri" },
      { value: "Append-only", label: "Denetim kaydı" },
    ],
    icon: "shield",
    accent: "indigo",
    href: "/initiatives/shield",
  },
];

// Verification & decision pipeline: what each stage does and what it hands to the next.
const pipeline = [
  {
    stage: "Girdi",
    title: "Veri standart biçime çevrilir",
    body: "Reçete, laboratuvar sonucu veya fatura kalemi HL7 FHIR R4 kaynaklarına eşlenir. Eksik alan işaretlenir, sessizce atlanmaz.",
    output: "FHIR R4 kaynakları",
  },
  {
    stage: "Değerlendirme",
    title: "Kurallar çalışır",
    body: "Sürümlü kural seti girdiyi değerlendirir. Aynı girdi ve aynı kural sürümü her zaman aynı sonucu verir.",
    output: "Bulgu · kural kimliği · eşik",
  },
  {
    stage: "Onay",
    title: "Kararı uzman verir",
    body: "Hekim, eczacı ya da gelir uzmanı bulguyu gerekçesiyle görür; onaylar, düzeltir veya geri çevirir.",
    output: "Karar · gerekçe",
  },
  {
    stage: "Kayıt",
    title: "Her adım kayda geçer",
    body: "Girdi, kural sürümü, sonuç ve karar yalnızca eklenebilir kayda yazılır. Aylar sonra aynı kararı aynı haliyle yeniden üretebilirsiniz.",
    output: "Append-only kayıt",
  },
];

const loiAudiences = [
  {
    icon: Stethoscope,
    title: "Klinik ekipler",
    body: "Klinik eczacılık birimleri, ilaç güvenliği komiteleri ve servis hekimleri.",
  },
  {
    icon: Receipt,
    title: "Gelir döngüsü ekipleri",
    body: "Faturalama, provizyon ve SGK geri ödeme işlerini yürüten birimler.",
  },
  {
    icon: Building2,
    title: "Akademik ortaklar",
    body: "Üniversite hastaneleri ve ortak doğrulama çalışması yapmak isteyen araştırma grupları.",
  },
];

export default function Home() {
  return (
    <main id="top" className="relative flex-1 overflow-x-clip">
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">
              LavieuxLabs · Sağlık teknolojileri Ar-Ge
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-white sm:text-5xl lg:text-[64px]">
              İlaç güvenliği ve hastane faturalaması için <span className="text-white/50">karar destek yazılımı.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              PharmaDeux, çoklu ilaç tedavisinde riskli kombinasyonları reçete anında hekime gösterir. Shield, SUT ve
              SGK red risklerini fatura gönderilmeden önce yakalar. İkisinde de son kararı yetkili kişi verir ve her
              adım kayda geçer.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#platformlar"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
            >
              Ürünleri inceleyin
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
            >
              Pilot başvurusu (LOI)
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal delay={0.32} className="mt-16 sm:mt-20">
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
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section id="platformlar" className="relative scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Ürünler"
            title="İki ürün, aynı çalışma biçimi."
            description="Biri reçeteyle, diğeri faturayla ilgilenir. İkisinde de bir uyarının hangi kuraldan geldiği görünür, aynı girdi aynı sonucu verir ve kararı yetkili kişi verir."
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
            eyebrow="Standartlar"
            title="İki üründe de uyduğumuz sekiz kural."
            description="Hangi standardı referans aldığımızı ve her birinde nerede olduğumuzu tek tek yazdık. Henüz tamamlanmamış olanları da öyle belirttik."
          />
          <div className="mt-14">
            <StandardsGrid />
          </div>
        </div>
      </section>

      {/* Verification & decision pipeline */}
      <section id="yaklasim" className="relative scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Doğrulama ve karar"
            title="Bir öneri dört adımda karara dönüşür."
            description="Hiçbir adım atlanmaz. Her adımın çıktısı bir sonrakinin girdisi olur ve kayda geçer."
          />
          <Reveal className="mt-14">
            <ol className="grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
              {pipeline.map((step) => (
                <li key={step.stage} className="flex flex-col bg-navy-850 p-5 sm:p-6">
                  <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{step.stage}</p>
                  <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.01em] text-white">{step.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{step.body}</p>
                  <p className="mt-auto border-t border-white/[0.06] pt-3 text-[12px] text-white/45">
                    <span className="text-white/35">Çıktı · </span>
                    <span className="font-mono text-white/70">{step.output}</span>
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Pilot / LOI */}
      <div id="iletisim" className="scroll-mt-20">
        <CtaPanel
          eyebrow="Pilot program"
          title="Pilot çalışma için bize yazın."
          description="Kapsamı, hangi veriye erişileceğini ve neyi başarı sayacağımızı bağlayıcı olmayan bir Niyet Mektubu (LOI) ile birlikte yazıyoruz."
          primaryHref="/contact"
          primaryLabel="Pilot başvurusu (LOI)"
          aside={
            <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {loiAudiences.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 py-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/40" strokeWidth={1.6} aria-hidden="true" />
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
