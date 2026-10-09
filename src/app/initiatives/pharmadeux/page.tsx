import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Binary,
  Database,
  FileSearch,
  History,
  Layers,
  Repeat,
  Scale,
  TriangleAlert,
  UserCheck,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import PharmaCapsule from "@/components/PharmaCapsule";
import InPageNav from "@/components/InPageNav";
import SectionHeader from "@/components/SectionHeader";
import FlowDiagram, { type FlowStep } from "@/components/FlowDiagram";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "PharmaDeux CDSS",
  description:
    "Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi.",
};

const LABEL = "text-[11px] font-medium tracking-wider text-white/50 uppercase";
const hasDigit = (value: string) => /\d/.test(value);

const sections = [
  { id: "problem", label: "Sorun" },
  { id: "mimari", label: "Nasıl çalışır" },
  { id: "dogrulama", label: "Doğrulama" },
  { id: "regulasyon", label: "Regülasyon" },
  { id: "protokol", label: "Klinik doğrulama planı" },
];

const heroStats = [
  { value: "18", label: "Güvenlik düzlemi" },
  { value: "2.480+", label: "Otomatik test" },
  { value: "FHIR R4", label: "Veri standardı" },
  { value: "THS 4", label: "Teknoloji hazırlık seviyesi" },
];

const problems = [
  {
    icon: Layers,
    title: "Çoklu ilaç kullanımı",
    body: "Beş veya daha fazla ilaç kullanan hastada olası etkileşim sayısı hızla artar. Bunları her reçetede elle taramak gerçekçi değil.",
  },
  {
    icon: Activity,
    title: "Değişen böbrek ve karaciğer fonksiyonu",
    body: "Aynı reçete eGFR'si 90 olan hastada güvenliyken 30 olan hastada doz ayarı gerektirebilir. Kontrol, güncel laboratuvar değerine bakmalı.",
  },
  {
    icon: Scale,
    title: "Kümülatif yük",
    body: "Tek başına kabul edilebilir ilaçlar aynı organda toplandığında risk oluşturabilir. İki ilaca bakan etkileşim kontrolü bu birikimi görmez.",
  },
  {
    icon: TriangleAlert,
    title: "Uyarı yorgunluğu",
    body: "Bağlama bakmayan uyarılar o kadar sık çıkar ki hekim hepsini geçmeye alışır. Önemli uyarı da bu kalabalıkta kaybolur.",
  },
];

const pairCounts = [5, 8, 10, 15].map((n) => ({ n, pairs: (n * (n - 1)) / 2 }));

const pipeline: FlowStep[] = [
  {
    icon: Database,
    title: "Veri alımı",
    body: "Hasta, ilaç istemi, laboratuvar, tanı ve alerji bilgisi HL7 FHIR R4 kaynakları olarak alınır.",
    detail: "Patient · MedicationRequest · Observation · Condition · AllergyIntolerance",
  },
  {
    icon: Repeat,
    title: "Eşleştirme",
    body: "Etken madde, doz, birim ve uygulama yolu ortak kodlara çevrilir. Eksik bilgi işaretlenir, atlanmaz.",
    detail: "ATC · UCUM birimleri · eksik veri bayrağı",
  },
  {
    icon: Binary,
    title: "Kural değerlendirmesi",
    body: "Reçete 18 güvenlik düzleminde sürümlü kurallarla kontrol edilir. Aynı girdi her zaman aynı sonucu verir.",
    detail: "18 düzlem · sürümlü kurallar",
  },
  {
    icon: FileSearch,
    title: "Bulgu ve gerekçe",
    body: "Bulgu şiddet düzeyiyle birlikte gösterilir: hangi kural, hangi değer, hangi eşik.",
    detail: "kural kimliği · tetikleyen değer · eşik",
  },
  {
    icon: UserCheck,
    title: "Hekim kararı",
    body: "Son karar hekimindir. Uyarıyı kabul etmek, düzeltmek ya da gerekçe yazıp geçmek kayda geçer.",
    detail: "kabul · düzeltme · gerekçeli geçme",
  },
  {
    icon: History,
    title: "Kayıt",
    body: "Girdi, kural sürümü, bulgu ve hekimin kararı yalnızca eklenebilir kayda yazılır.",
    detail: "append-only · kayıt özeti zinciri",
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
    title: "Hasta ve doz",
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
    title: "Otomatik test",
    value: "2.480+",
    body: "Kural motoru, veri dönüşümleri ve entegrasyonlar her değişiklikte otomatik testlerden geçer.",
  },
  {
    title: "Veri standardı",
    value: "HL7 FHIR R4",
    body: "Entegrasyon testleri gerçek FHIR R4 kaynak yapılarıyla çalışır.",
  },
  {
    title: "Hazırlık seviyesi",
    value: "THS 4",
    body: "Bileşenler laboratuvar ortamında doğrulandı. Sıradaki adım, anonimleştirilmiş gerçek vakalarla doğrulama.",
  },
  {
    title: "Tekrarlanabilirlik",
    value: "Aynı girdi, aynı sonuç",
    body: "Aynı girdi ve aynı kural sürümü her seferinde aynı sonucu verir. Regresyon testleri bunu her sürümde kontrol eder.",
  },
];

const frameworks = [
  { code: "EU MDR 2017/745", scope: "Tıbbi cihaz yönetmeliği · Ek VIII Kural 11", status: "Sınıf IIa hedefi" },
  { code: "IEC 62304", scope: "Tıbbi cihaz yazılımı yaşam döngüsü", status: "Mimari uyum" },
  { code: "ISO 14971", scope: "Tıbbi cihazlarda risk yönetimi", status: "Mimari uyum" },
  { code: "ISO 13485", scope: "Kalite yönetim sistemi", status: "Yol haritasında" },
  { code: "IEC 62366-1", scope: "Kullanılabilirlik mühendisliği", status: "Yol haritasında" },
];

const protocol = [
  {
    phase: "Faz 0",
    title: "Protokol ve etik kurul",
    body: "Birincil ve ikincil sonlanım noktaları ile veri yönetim planı yazılır, etik kurula başvurulur.",
    status: "Hazırlıkta",
  },
  {
    phase: "Faz 1",
    title: "Geçmiş veri",
    body: "Ortak kurumdan anonimleştirilmiş eski reçete ve laboratuvar verileri KVKK'ya uygun şekilde alınır.",
    status: "Planlandı",
  },
  {
    phase: "Faz 2",
    title: "Referans standart",
    body: "Sistemi görmeyen bağımsız bir klinik eczacı ve hekim paneli aynı vakaları değerlendirir.",
    status: "Planlandı",
  },
  {
    phase: "Faz 3",
    title: "Kör karşılaştırma",
    body: "Sistemin bulguları panelin kararlarıyla karşılaştırılır. Duyarlılık, özgüllük, pozitif prediktif değer ve uyarı sayısı raporlanır.",
    status: "Planlandı",
  },
  {
    phase: "Faz 4",
    title: "Klinik değerlendirme raporu",
    body: "Sonuçlar MDR klinik değerlendirme dosyasına ve ileriye dönük pilot tasarımına aktarılır.",
    status: "Planlandı",
  },
];

const pilotAudiences = [
  "Klinik eczacılık ve ilaç güvenliği ekipleri",
  "Üniversite ve eğitim-araştırma hastaneleri",
  "Geçmiş veriyle doğrulama çalışması yapabilecek kurumlar",
];

export default function PharmaDeuxPage() {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <PageHero
        visual={<PharmaCapsule />}
        visualClassName="relative mx-auto aspect-[4/5] w-full max-w-[360px] sm:aspect-square sm:max-w-[420px] lg:max-w-[520px]"
        below={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] lg:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-navy-900 p-5">
                <dt className="mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                <dd className="font-mono text-xl font-medium tracking-[-0.01em] text-white tabular-nums sm:text-2xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        }
        breadcrumbs={[
          { href: "/", label: "Ana sayfa" },
          { href: "/#platformlar", label: "Ürünler" },
          { label: "PharmaDeux CDSS" },
        ]}
        eyebrow="Klinik karar destek · ilaç güvenliği"
        title={
          <>
            PharmaDeux CDSS. <span className="text-white/50">Reçete yazılırken ilaç güvenliğini kontrol eder.</span>
          </>
        }
        description="Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi. Her uyarı, onu tetikleyen kural ve eşik değeriyle birlikte gösterilir; son karar hekimindir."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact?solution=pharmadeux"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
          >
            Pilot başvurusu (LOI)
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#mimari"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
          >
            Nasıl çalıştığını görün
          </a>
        </div>
      </PageHero>

      <InPageNav items={sections} />

      {/* Problem */}
      <section id="problem" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Sorun"
            title="Çoklu ilaç kullanımında riski elle izlemek zor."
            description="Risk yalnızca iki ilacın etkileşiminden doğmaz. İlaç sayısı, böbrek ve karaciğer fonksiyonu ve aynı organa binen toplam yük birlikte değerlendirilmelidir."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2">
              {problems.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-navy-850 p-6 sm:p-7">
                  <Icon className="h-5 w-5 text-white/45" strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="mt-5 text-base font-semibold tracking-[-0.01em] text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              ))}
            </div>

            <Reveal className="flex flex-col rounded-2xl border border-white/[0.06] bg-navy-850 p-6 sm:p-7">
              <p className={LABEL}>İkili kombinasyon sayısı</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                n ilaç için ikili kombinasyon sayısı n(n−1)/2&apos;dir. Üçlü ve daha karmaşık etkiler bu sayıya dahil
                değildir.
              </p>
              <table className="mt-6 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] text-white/45">
                    <th className="py-2 font-medium">İlaç sayısı</th>
                    <th className="py-2 text-right font-medium">İkili kombinasyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {pairCounts.map(({ n, pairs }) => (
                    <tr key={n}>
                      <td className="py-2.5 font-mono text-white/70 tabular-nums">{n}</td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center gap-3">
                          <span
                            className="h-1 rounded-sm bg-pharma/60"
                            style={{ width: `${(pairs / 105) * 120}px` }}
                            aria-hidden="true"
                          />
                          <span className="w-10 font-mono text-white tabular-nums">{pairs}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-auto pt-6 text-xs leading-relaxed text-white/40">
                Dünya Sağlık Örgütü, ilaç hatalarının dünya genelindeki yıllık maliyetini yaklaşık 42 milyar ABD doları
                olarak tahmin ediyor. <span className="text-white/30">DSÖ, Medication Without Harm (2017)</span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="mimari" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Nasıl çalışır"
            title="Reçeteden kayda altı adım."
            description="Veri standart kaynaklardan alınır, kurallarla değerlendirilir ve sonuç gerekçesiyle hekime gösterilir. Hiçbir adımda olasılıksal tahmin kullanılmaz."
          />
          <div className="mt-14">
            <FlowDiagram steps={pipeline} />
          </div>

          <div className="mt-20">
            <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className={LABEL}>18 güvenlik düzlemi</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                  Dört başlık altında 18 kontrol
                </h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/50">
                Her kontrolün kendi sürümü ve testi var. Eşik değerleri kurumun politikasına göre ayarlanabilir.
              </p>
            </Reveal>
            <Reveal className="mt-8">
              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-2 xl:grid-cols-4">
                {planeGroups.map((group, gi) => {
                  const offset = planeGroups.slice(0, gi).reduce((sum, g) => sum + g.planes.length, 0);
                  return (
                    <div key={group.title} className="bg-navy-850 p-5">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-sm font-semibold text-white">{group.title}</h4>
                        <span className="font-mono text-[11px] text-white/40 tabular-nums">{group.planes.length}</span>
                      </div>
                      <ul className="mt-3 divide-y divide-white/[0.06]">
                        {group.planes.map((plane, pi) => (
                          <li key={plane} className="flex items-baseline gap-3 py-2">
                            <span className="font-mono text-[11px] text-white/35 tabular-nums">
                              P{String(offset + pi + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[13px] text-white/70">{plane}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Validation */}
      <section id="dogrulama" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Doğrulama"
            title="Neyi, nasıl test ediyoruz."
            description="Her kural bir klinik gereksinime ve onu doğrulayan testlere bağlı. Testten geçmeyen değişiklik yayına çıkmaz."
          />
          <Reveal className="mt-14">
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
              {validation.map((v) => (
                <div key={v.title} className="flex flex-col bg-navy-850 p-6">
                  <dt className={LABEL}>{v.title}</dt>
                  <dd
                    className={`mt-3 text-2xl font-semibold tracking-[-0.03em] text-white ${
                      hasDigit(v.value) ? "font-mono tabular-nums" : ""
                    }`}
                  >
                    {v.value}
                  </dd>
                  <dd className="mt-3 text-sm leading-relaxed text-white/55">{v.body}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Regulation */}
      <section id="regulasyon" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Regülasyon"
              title="MDR kapsamında Sınıf IIa hedefliyoruz."
              description="PharmaDeux, ilaç tedavisi kararlarına bilgi sağlayan bir yazılım olduğu için AB Tıbbi Cihaz Yönetmeliği'nin (MDR) 11. kuralına giriyor. Henüz CE işareti yok."
            />
            <Reveal className="mt-8 rounded-2xl border border-white/[0.06] bg-navy-850 p-6">
              <p className={LABEL}>Kullanım amacı (taslak)</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Reçeteyle ilgili olası güvenlik risklerini gerekçeleriyle göstererek yetkili sağlık profesyonelinin
                kararına destek olmak. Sistem tanı koymaz, tedavi önermez ve hekimin kararının yerini almaz.
              </p>
            </Reveal>
          </div>

          <Reveal className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-navy-850">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.06] text-[11px] text-white/45">
                <tr>
                  <th className="px-5 py-3 font-medium">Çerçeve</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Kapsam</th>
                  <th className="px-5 py-3 text-right font-medium">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {frameworks.map((f) => (
                  <tr key={f.code}>
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-mono text-[13px] text-white tabular-nums">{f.code}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45 sm:hidden">{f.scope}</p>
                    </td>
                    <td className="hidden px-5 py-3.5 align-top text-[13px] leading-relaxed text-white/55 sm:table-cell">
                      {f.scope}
                    </td>
                    <td className="px-5 py-3.5 text-right align-top">
                      <span className={`whitespace-nowrap ${LABEL}`}>{f.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] px-5 py-4 text-xs leading-relaxed text-white/40">
              PharmaDeux henüz piyasaya sunulmadı. Ayrıntılar için{" "}
              <Link href="/legal/quality" className="text-white/70 underline-offset-2 hover:text-white hover:underline">
                Kalite ve MDR
              </Link>{" "}
              sayfasına bakabilirsiniz.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Clinical validation plan */}
      <section id="protokol" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Klinik doğrulama planı"
            title="Kullanıma girmeden önce geçmiş vakalarla ölçüyoruz."
            description="PharmaDeux'nün performansı, anonimleştirilmiş gerçek vakalar üzerinde bağımsız bir uzman paneline karşı ölçülecek."
          />
          <Reveal className="mt-14">
            <ol className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-navy-850">
              {protocol.map((p, i) => (
                <li
                  key={p.phase}
                  className="grid gap-2 p-5 sm:grid-cols-[96px_1fr_120px] sm:items-baseline sm:gap-6 sm:p-6"
                >
                  <span className="font-mono text-[12px] text-white/50 tabular-nums">{p.phase}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-white">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">{p.body}</p>
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wider uppercase sm:text-right ${
                      i === 0 ? "text-white/80" : "text-white/40"
                    }`}
                  >
                    {p.status}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
            Ortak kurumlar protokolün yazımına katılabilir. Veri yalnızca etik kurul onayı ve kurumla imzalanan veri
            işleme sözleşmesi kapsamında kullanılır.
          </p>
        </div>
      </section>

      <CtaPanel
        eyebrow="Pilot program"
        title="PharmaDeux pilotu için bize yazın."
        description="Geçmiş vakalarla doğrulama çalışmasına katılmak ya da kendi kurumunuzda bir pilot tanımlamak için bağlayıcı olmayan bir Niyet Mektubu (LOI) ile başlayabiliriz."
        primaryHref="/contact?solution=pharmadeux"
        primaryLabel="Pilot başvurusu (LOI)"
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
