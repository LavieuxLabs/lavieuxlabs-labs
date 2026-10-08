import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Binary,
  ClipboardCheck,
  Database,
  FileSearch,
  GitCompare,
  History,
  Layers,
  Pill,
  Repeat,
  Scale,
  TriangleAlert,
  UserCheck,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import PharmaGlobe from "@/components/PharmaGlobe";
import InPageNav from "@/components/InPageNav";
import SectionHeader from "@/components/SectionHeader";
import FlowDiagram, { type FlowStep } from "@/components/FlowDiagram";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "PharmaDeux CDSS",
  description:
    "18 temel güvenlik düzleminde ilaç-ilaç etkileşimlerini, organ toksisitesini ve kümülatif organ yükünü denetleyen deterministik klinik karar destek sistemi.",
};

const sections = [
  { id: "problem", label: "Problem" },
  { id: "mimari", label: "Çözüm mimarisi" },
  { id: "dogrulama", label: "Doğrulama kanıtları" },
  { id: "regulasyon", label: "Regülasyon" },
  { id: "protokol", label: "Klinik protokol" },
];

const heroStats = [
  { value: "18", label: "Temel güvenlik düzlemi" },
  { value: "2.480+", label: "Otomatik birim / entegrasyon testi" },
  { value: "FHIR R4", label: "HL7 veri standardı" },
  { value: "THS 4", label: "Teknoloji hazırlık seviyesi" },
];

const problems = [
  {
    icon: Layers,
    title: "Polifarmasi",
    body: "Beş ve üzeri eşzamanlı ilaç kullanımında olası etkileşim kombinasyonları hızla çoğalır. Kombinasyonların elle, tutarlı biçimde taranması klinik iş yükü içinde gerçekçi değildir.",
  },
  {
    icon: Activity,
    title: "Değişken organ fonksiyonu",
    body: "Böbrek ve karaciğer fonksiyonundaki değişim, aynı reçetenin güvenlik profilini hasta bazında değiştirir. Doz uygunluğu, güncel laboratuvar değerleriyle birlikte değerlendirilmelidir.",
  },
  {
    icon: Scale,
    title: "Kümülatif yük",
    body: "Tek başına kabul edilebilir ilaçlar, aynı organ veya fizyolojik eksen üzerinde toplandığında klinik olarak anlamlı bir yük oluşturabilir. İkili etkileşim kontrolleri bu birikimi görmez.",
  },
  {
    icon: TriangleAlert,
    title: "Uyarı yorgunluğu",
    body: "Bağlamdan bağımsız ve düşük özgüllüklü uyarılar, klinisyenin uyarıları rutin olarak geçmesine yol açar. Kritik bir uyarının değeri, gürültünün içinde kaybolur.",
  },
];

const pairCounts = [5, 8, 10, 15].map((n) => ({ n, pairs: (n * (n - 1)) / 2 }));

const pipeline: FlowStep[] = [
  {
    icon: Database,
    title: "FHIR R4 veri alımı",
    body: "Hasta, ilaç istemi, laboratuvar, tanı ve alerji verileri standart kaynaklar üzerinden alınır.",
    detail: "Patient · MedicationRequest · Observation · Condition · AllergyIntolerance",
  },
  {
    icon: Repeat,
    title: "Normalizasyon",
    body: "Etken madde, doz, birim ve uygulama yolu ortak bir terminolojiye eşlenir; eksik veri açıkça işaretlenir.",
    detail: "Eksik veri → değerlendirme dışı değil, görünür uyarı",
  },
  {
    icon: Binary,
    title: "Deterministik kural motoru",
    body: "Her istem, 18 güvenlik düzleminde sürümlenmiş kural setleriyle değerlendirilir. Aynı girdi her zaman aynı çıktıyı üretir.",
    detail: "Sürümlenmiş kural setleri · olasılıksal çıkarım yok",
  },
  {
    icon: FileSearch,
    title: "Şiddet ve gerekçe",
    body: "Bulgular şiddet düzeyine göre sınıflandırılır; her bulgu tetikleyen kural, parametre ve eşik değeriyle sunulur.",
    detail: "Kural kimliği · tetikleyen değer · eşik",
  },
  {
    icon: UserCheck,
    title: "Klinisyen kararı",
    body: "Nihai karar klinisyendedir. Uyarıyı kabul, düzeltme veya gerekçeli geçme seçenekleri kayıt altına alınır.",
    detail: "Human-in-the-loop",
  },
  {
    icon: History,
    title: "Denetim izi",
    body: "Girdi, kural sürümü, bulgu ve klinisyen kararı yalnızca eklenebilir kayda yazılır.",
    detail: "Append-only · geriye dönük yeniden kurulabilir",
  },
];

// Safety planes grouped by clinical domain. Keep in sync with the engine's plane registry.
const planeGroups = [
  {
    title: "Etkileşim",
    planes: ["İlaç-ilaç etkileşimi", "Terapötik duplikasyon", "İlaç-hastalık etkileşimi", "Alerji ve kontrendikasyon"],
  },
  {
    title: "Organ toksisitesi",
    planes: ["Nefrotoksisite", "Hepatotoksisite", "Kardiyotoksisite / QT uzaması", "Hematolojik toksisite"],
  },
  {
    title: "Kümülatif yük",
    planes: [
      "Antikolinerjik yük",
      "Serotonerjik yük",
      "Sedatif / MSS depresan yük",
      "Kanama riski yükü",
      "Hiperkalemi riski",
    ],
  },
  {
    title: "Hasta bağlamı ve doz",
    planes: [
      "Doz aralığı uygunluğu",
      "Renal doz ayarı",
      "Hepatik doz ayarı",
      "Geriatrik uygunluk",
      "Gebelik ve laktasyon",
    ],
  },
];

const validation = [
  {
    title: "Otomatik test kapsamı",
    value: "2.480+",
    body: "Kural motoru, veri dönüşümleri ve entegrasyon katmanları; her değişiklikte çalışan otomatik birim ve entegrasyon testleriyle doğrulanır.",
    wide: true,
  },
  {
    title: "Birlikte çalışabilirlik",
    value: "HL7 FHIR R4",
    body: "Veri modeli FHIR R4 kaynakları üzerine kurgulanır; entegrasyon testleri standart kaynak yapıları üzerinden yürütülür.",
  },
  {
    title: "Teknoloji hazırlık seviyesi",
    value: "THS 4",
    body: "Bileşenler laboratuvar ortamında doğrulanmıştır. Bir sonraki aşama, ilgili ortamda retrospektif doğrulamadır.",
  },
  {
    title: "Tekrarlanabilirlik",
    value: "Deterministik",
    body: "Aynı girdi ve aynı kural sürümüyle yapılan her değerlendirme özdeş çıktı üretir; regresyon testleri bunu her sürümde denetler.",
  },
  {
    title: "İzlenebilirlik",
    value: "Kural → Test",
    body: "Her kural, tanımlandığı klinik gereksinime ve onu doğrulayan test senaryolarına bağlanır.",
  },
];

const frameworks = [
  {
    code: "EU MDR 2017/745",
    scope: "Tıbbi cihaz yönetmeliği · Ek VIII Kural 11 kapsamında yazılım sınıflandırması",
    status: "Sınıf IIa hedefi",
  },
  {
    code: "IEC 62304",
    scope: "Tıbbi cihaz yazılımı yaşam döngüsü süreçleri",
    status: "Mimari uyum",
  },
  {
    code: "ISO 14971",
    scope: "Tıbbi cihazlar için risk yönetimi",
    status: "Mimari uyum",
  },
  {
    code: "ISO 13485",
    scope: "Tıbbi cihaz kalite yönetim sistemi",
    status: "Yol haritasında",
  },
  {
    code: "IEC 62366-1",
    scope: "Kullanılabilirlik mühendisliği",
    status: "Yol haritasında",
  },
];

const protocol = [
  {
    phase: "Faz 0",
    title: "Protokol ve etik kurul",
    body: "Çalışma protokolü, birincil ve ikincil sonlanım noktaları ve veri yönetim planı hazırlanır; etik kurul başvurusu yapılır.",
    status: "Hazırlık",
  },
  {
    phase: "Faz 1",
    title: "Retrospektif veri seti",
    body: "İş birliği yapılan kurumdan, anonimleştirilmiş geçmiş reçete ve laboratuvar verileri KVKK'ya uygun olarak temin edilir.",
    status: "Planlanan",
  },
  {
    phase: "Faz 2",
    title: "Referans standart",
    body: "Bağımsız klinik eczacı ve hekim paneli, aynı vakaları sistemi görmeden değerlendirerek referans standardı oluşturur.",
    status: "Planlanan",
  },
  {
    phase: "Faz 3",
    title: "Kör karşılaştırma",
    body: "Sistem çıktıları referans standartla karşılaştırılır; duyarlılık, özgüllük, pozitif prediktif değer ve uyarı yükü raporlanır.",
    status: "Planlanan",
  },
  {
    phase: "Faz 4",
    title: "Klinik değerlendirme raporu",
    body: "Bulgular, MDR kapsamındaki klinik değerlendirme dokümantasyonuna ve prospektif pilot tasarımına girdi olarak aktarılır.",
    status: "Planlanan",
  },
];

export default function PharmaDeuxPage() {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <PageHero
        visual={<PharmaGlobe />}
        below={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] backdrop-blur-md lg:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-[#06080d]/80 p-5">
                <dt className="mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                <dd className="font-mono text-xl font-medium tracking-tight text-teal-100 sm:text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        }
        breadcrumbs={[
          { href: "/", label: "Ana sayfa" },
          { href: "/#platformlar", label: "Platformlar" },
          { label: "PharmaDeux CDSS" },
        ]}
        eyebrow="Klinik Karar Destek Sistemi · SaMD"
        title={
          <>
            PharmaDeux CDSS:{" "}
            <span className="bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
              reçete anında deterministik ilaç güvenliği.
            </span>
          </>
        }
        description="İlaç-ilaç etkileşimlerini, organ toksisitesini ve kümülatif organ yükünü 18 temel güvenlik düzleminde denetleyen; her bulgusunu gerekçesiyle sunan ve nihai kararı klinisyene bırakan klinik güvenlik motoru."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact?solution=pharmadeux"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#06080d] transition-colors hover:bg-teal-200"
          >
            Pilot Başvurusu (LOI)
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href="#mimari"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:border-white/30"
          >
            Mimariyi inceleyin
          </a>
        </div>
      </PageHero>

      <InPageNav items={sections} />

      {/* Problem */}
      <section id="problem" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Problem tanımı"
            title="Polifarmasi ve önlenebilir ilaç hataları."
            description="İlaç güvenliği, tek bir etkileşim kontrolünden ibaret değildir. Risk; ilaç sayısı, organ fonksiyonu ve birikimli etkilerin kesişiminde ortaya çıkar."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
              {problems.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-[#070a10] p-6 sm:p-7">
                  <Icon className="h-5 w-5 text-teal-300/80" strokeWidth={1.6} />
                  <h3 className="mt-5 text-base font-medium text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              ))}
            </div>

            <Reveal className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Kombinatoryal büyüme</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                n eşzamanlı ilaç için yalnızca ikili kombinasyon sayısı n(n−1)/2 olarak büyür. Üçlü ve daha üst düzey
                birikimli etkiler bu sayının dışındadır.
              </p>
              <table className="mt-6 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
                    <th className="py-2 font-normal">İlaç sayısı</th>
                    <th className="py-2 text-right font-normal">İkili kombinasyon</th>
                  </tr>
                </thead>
                <tbody>
                  {pairCounts.map(({ n, pairs }) => (
                    <tr key={n} className="border-b border-white/[0.05]">
                      <td className="py-2.5 font-mono text-white/70">{n}</td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center gap-3">
                          <span
                            className="h-1.5 rounded-full bg-gradient-to-r from-teal-400/30 to-teal-300"
                            style={{ width: `${(pairs / 105) * 120}px` }}
                          />
                          <span className="w-10 font-mono text-teal-100">{pairs}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-auto pt-6 text-xs leading-relaxed text-white/40">
                Dünya Sağlık Örgütü, ilaç hatalarının küresel yıllık maliyetini yaklaşık 42 milyar ABD doları olarak
                tahmin etmektedir. <span className="text-white/30">— DSÖ, Medication Without Harm (2017)</span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="mimari" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Çözüm mimarisi"
            title="Veriden karara, her adımı izlenebilir bir hat."
            description="PharmaDeux, klinik veriyi standart kaynaklardan alır, deterministik olarak değerlendirir ve kararı gerekçesiyle klinisyene sunar. Hattın hiçbir adımında olasılıksal çıkarım yoktur."
          />
          <div className="mt-14">
            <FlowDiagram steps={pipeline} />
          </div>

          <div className="mt-20">
            <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-teal-300/80">
                  18 güvenlik düzlemi
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Dört klinik alanda yapılandırılmış denetim
                </h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/50">
                Her düzlem bağımsız olarak sürümlenir, test edilir ve gerektiğinde kurum politikasına göre eşik
                değerleri yapılandırılır.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {planeGroups.map((group, gi) => {
                const offset = planeGroups.slice(0, gi).reduce((sum, g) => sum + g.planes.length, 0);
                return (
                  <Reveal
                    key={group.title}
                    delay={gi * 0.06}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">{group.title}</h4>
                      <span className="font-mono text-[10.5px] text-white/30">{group.planes.length} düzlem</span>
                    </div>
                    <ul className="mt-4 space-y-1.5">
                      {group.planes.map((plane, pi) => (
                        <li
                          key={plane}
                          className="group flex items-center gap-3 rounded-lg border border-white/[0.05] bg-[#070a10] px-3 py-2.5 transition-colors hover:border-teal-400/30"
                        >
                          <span className="font-mono text-[10.5px] text-teal-300/60">
                            P{String(offset + pi + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[13px] text-white/70 group-hover:text-white">{plane}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Validation */}
      <section id="dogrulama" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Doğrulama kanıtları"
            title="Güven, iddiayla değil test edilebilirlikle kurulur."
            description="Her kural, klinik gereksinimden test senaryosuna kadar izlenebilir. Yazılım değişiklikleri, otomatik test hattından geçmeden yayına alınmaz."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {validation.map((v, i) => (
              <Reveal
                key={v.title}
                delay={(i % 4) * 0.05}
                className={`rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 ${
                  v.wide ? "md:col-span-2 lg:row-span-2 lg:flex lg:flex-col lg:justify-between" : ""
                }`}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">{v.title}</p>
                  <p
                    className={`mt-3 font-semibold tracking-tight text-teal-100 ${
                      v.wide ? "text-5xl sm:text-6xl" : "text-2xl"
                    }`}
                  >
                    {v.value}
                  </p>
                </div>
                <p className={`text-sm leading-relaxed text-white/55 ${v.wide ? "mt-6 max-w-md" : "mt-3"}`}>{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regulation */}
      <section id="regulasyon" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Regülasyon"
              title="MDR Sınıf IIa SaMD için kurgulanan mimari."
              description="PharmaDeux, ilaç tedavisine ilişkin kararları bilgilendiren bir yazılım olarak, AB Tıbbi Cihaz Yönetmeliği (MDR) Kural 11 kapsamında Sınıf IIa hedefiyle tasarlanmaktadır."
            />
            <Reveal className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/[0.04] p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-teal-300/80">
                <ClipboardCheck className="h-4 w-4" />
                Taslak kullanım amacı
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Yetkili sağlık profesyonellerine, ilaç istemlerine ilişkin potansiyel güvenlik risklerini gerekçeleriyle
                sunarak karar sürecini desteklemek. Sistem tanı koymaz, tedavi önermez ve klinisyen kararının yerini
                almaz.
              </p>
            </Reveal>
          </div>

          <Reveal className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
                <tr>
                  <th className="px-5 py-3.5 font-normal">Çerçeve</th>
                  <th className="hidden px-5 py-3.5 font-normal sm:table-cell">Kapsam</th>
                  <th className="px-5 py-3.5 text-right font-normal">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {frameworks.map((f) => (
                  <tr key={f.code} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4 align-top">
                      <p className="font-mono text-[13px] text-white">{f.code}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45 sm:hidden">{f.scope}</p>
                    </td>
                    <td className="hidden px-5 py-4 align-top text-[13px] leading-relaxed text-white/55 sm:table-cell">
                      {f.scope}
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <span className="inline-block whitespace-nowrap rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-teal-200/80">
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-white/40">
              PharmaDeux henüz CE işareti taşımamaktadır ve piyasaya arz edilmemiştir. Ayrıntılar için{" "}
              <Link href="/legal/quality" className="text-teal-300 hover:underline">
                Kalite ve MDR çerçevesi
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* Clinical protocol */}
      <section id="protokol" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Retrospektif klinik protokol"
            title="Laboratuvardan kliniğe, ölçülebilir bir doğrulama yolu."
            description="Prospektif kullanım öncesinde PharmaDeux'nün performansı, gerçek ancak anonimleştirilmiş geçmiş vakalar üzerinde bağımsız bir referans standarda karşı ölçülür."
          />
          <ol className="relative mt-14 space-y-4 border-l border-white/[0.08] pl-6 sm:pl-8">
            {protocol.map((p, i) => (
              <li key={p.phase} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute top-6 -left-[29px] h-2.5 w-2.5 rounded-full border sm:-left-[37px] ${
                    i === 0 ? "border-teal-300 bg-teal-300" : "border-white/30 bg-[#06080d]"
                  }`}
                />
                <Reveal delay={i * 0.05}>
                  <div className="grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.14] sm:grid-cols-[110px_1fr_auto] sm:items-start sm:gap-6 sm:p-6">
                    <span className="font-mono text-xs tracking-[0.14em] text-teal-300/80 uppercase">{p.phase}</span>
                    <div>
                      <h3 className="text-base font-medium text-white">{p.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/55">{p.body}</p>
                    </div>
                    <span
                      className={`justify-self-start rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] sm:justify-self-end ${
                        i === 0
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                          : "border-white/10 text-white/45"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="mt-8 flex items-start gap-3 text-sm text-white/50">
            <GitCompare className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
            İş birliği yapan kurumlar protokol tasarımına katkı verebilir; veri yalnızca etik kurul onayı ve kurumla
            imzalanan veri işleme sözleşmesi kapsamında işlenir.
          </Reveal>
        </div>
      </section>

      <CtaPanel
        eyebrow="Pilot programı"
        title="PharmaDeux için Pilot Başvurusu (LOI)"
        description="Retrospektif doğrulama çalışmasına katılmak veya kurumunuzda bir pilot kapsamı tanımlamak için bağlayıcı olmayan bir Niyet Mektubu ile başlayın."
        primaryHref="/contact?solution=pharmadeux"
        primaryLabel="PharmaDeux için Pilot Başvurusu (LOI)"
        aside={
          <ul className="space-y-3 self-center">
            {[
              "Klinik eczacılık ve ilaç güvenliği ekipleri",
              "Üniversite ve eğitim-araştırma hastaneleri",
              "Retrospektif veri iş birliği yapabilecek kurumlar",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#070a10]/70 px-4 py-3.5 text-sm text-white/70"
              >
                <Pill className="h-4 w-4 shrink-0 text-teal-300" strokeWidth={1.6} />
                {item}
              </li>
            ))}
          </ul>
        }
      />
    </main>
  );
}
