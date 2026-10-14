import Link from "next/link";
import {
  Pill,
  Activity,
  ArrowUpRight,
  Binary,
  Code2,
  Database,
  FileSearch,
  FlaskConical,
  History,
  KeyRound,
  Layers,
  Plug,
  Repeat,
  Scale,
  ScrollText,
  Server,
  Stethoscope,
  TriangleAlert,
  UserCheck,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import PharmaCapsule from "@/components/PharmaCapsule";
import InPageNav from "@/components/InPageNav";
import SectionHeader from "@/components/SectionHeader";
import FlowDiagram from "@/components/FlowDiagram";
import CtaPanel from "@/components/CtaPanel";
import Reveal from "@/components/Reveal";
import SpecCard, { JoinedGrid, keepClassCase, type SpecRow } from "@/components/SpecCard";
import JsonLd from "@/components/JsonLd";
import FhirPreview from "@/components/FhirPreview";
import { RailMarker } from "@/components/TelemetryRails";
import QtSimulator from "@/components/QtSimulator";
import { pharmaDeuxJsonLd } from "@/lib/structuredData";
import { contactHref } from "@/lib/site";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";
import { metrics, testsLabel, trlLabel } from "@/lib/metrics";

export const metadata = defineMetadata("/initiatives/pharmadeux", {
  tr: {
    title: "PharmaDeux CDSS",
    description:
      "Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi.",
  },
  en: {
    title: "PharmaDeux CDSS",
    description:
      "Clinical decision support software alerting physicians to cumulative organ burden and toxicity at the moment of prescription.",
  },
});

const LABEL = "text-[11px] font-medium tracking-wider text-white/50 uppercase";
const hasDigit = (value: string) => /\d/.test(value);
// Evidence ladder: code → synthetic rule verification → clinical. Tone drives the SpecCard track, and the
// claims table reuses the same three steps, so no number reads as stronger evidence than it is.
const evidenceMeta = [
  { id: "EVD-01", icon: Code2, tone: "live" as const },
  { id: "EVD-02", icon: FlaskConical, tone: "prep" as const },
  { id: "EVD-03", icon: Stethoscope, tone: "input" as const },
];
// Evidence level of each claim row (index into evidenceMeta).
const claimLevels = [0, 0, 0, 1, 1, 2];

const problemIcons = [Layers, Activity, Scale, TriangleAlert];
const pipelineIcons = [Database, Repeat, Binary, FileSearch, UserCheck, History];
const integrationMeta = [
  { id: "INT-01", icon: Plug },
  { id: "INT-02", icon: KeyRound },
  { id: "INT-03", icon: Server },
  { id: "INT-04", icon: ScrollText },
];
const pairCounts = [5, 8, 10, 15].map((n) => ({ n, pairs: (n * (n - 1)) / 2 }));

type Heading = { eyebrow: string; title: string; description: string };

const devCopy = defineContent({
  tr: { label: "Geliştirme durumu", step: "Geliştirme adımı", rules: "Doğrulanmış kural (sentetik)", version: "Sürüm", updated: "Güncelleme" },
  en: { label: "Development status", step: "Development step", rules: "Verified rules (synthetic)", version: "Version", updated: "Updated" },
});

const simCopy = defineContent({
  tr: {
    eyebrow: "QT risk simülatörü",
    title: "İki ilaç seçin, skoru kural motoru hesaplasın.",
    description:
      "Örnek hastanın ölçülen QTc'si ve risk faktörleri Tisdale skoruna dönüştürülür. Her puanın hangi faktörden geldiği ve tetiklenen kural yanında görünür.",
  },
  en: {
    eyebrow: "QT risk simulator",
    title: "Pick two drugs and let the rule engine score them.",
    description:
      "The example patient's measured QTc and risk factors are turned into the Tisdale score. Every point shows the factor it comes from, next to the rule that fired.",
  },
});

const copy = defineContent<{
  sections: { id: string; label: string }[];
  heroStats: { value: string; label: string }[];
  crumbs: { home: string; products: string };
  eyebrow: string;
  title: string;
  description: string;
  ctaIntro: string;
  ctaPilot: string;
  ctaHow: string;
  problem: Heading;
  problems: { title: string; body: string }[];
  pairs: { label: string; body: string; drugs: string; combos: string; source: string; sourceRef: string };
  how: Heading;
  pipeline: { title: string; body: string; detail: string }[];
  planes: { label: string; title: string; body: string };
  planeGroups: { title: string; planes: string[] }[];
  integration: Heading;
  integrationCards: { title: string; body: string; rows: SpecRow[] }[];
  integrationNote: string;
  validationHeading: Heading;
  evidence: { title: string; status: string; body: string; rows: SpecRow[] }[];
  claimColumns: { claim: string; shows: string; notShows: string; level: string };
  claims: { value: string; label: string; shows: string; notShows: string; level: string }[];
  regulation: Heading;
  intendedUse: { label: string; body: string };
  frameworkColumns: { framework: string; scope: string; status: string };
  frameworks: { code: string; scope: string; status: string }[];
  regulationNote: { before: string; link: string; after: string };
  protocolHeading: Heading;
  protocol: { phase: string; title: string; body: string; status: string }[];
  protocolNote: string;
  cta: Heading;
  pilotAudiences: string[];
}>({
  tr: {
    sections: [
      { id: "problem", label: "Sorun" },
      { id: "mimari", label: "Nasıl çalışır" },
      { id: "simulator", label: "QT simülatörü" },
      { id: "entegrasyon", label: "HBYS entegrasyonu" },
      { id: "dogrulama", label: "Kanıt matrisi" },
      { id: "regulasyon", label: "Regülasyon" },
      { id: "protokol", label: "Klinik doğrulama planı" },
    ],
    heroStats: [
      { value: String(metrics.safetyPlanes), label: "Güvenlik düzlemi" },
      { value: testsLabel("tr"), label: "Otomatik test" },
      { value: "FHIR R4", label: "Veri standardı" },
      { value: trlLabel("tr"), label: "Teknoloji hazırlık seviyesi" },
    ],
    crumbs: { home: "Ana sayfa", products: "Ürünler" },
    eyebrow: "Klinik karar destek · ilaç güvenliği",
    title: "PharmaDeux CDSS. Reçete yazılırken ilaç güvenliğini kontrol eder.",
    description:
      "Çoklu ilaç tedavilerinde toksisite ve kümülatif organ yükünü reçete anında hekime bildiren klinik karar destek sistemi. Her uyarı, onu tetikleyen kural ve eşik değeriyle birlikte gösterilir; son karar hekimindir.",
    ctaIntro: "15 dk tanışma görüşmesi",
    ctaPilot: "Pilot başvurusu (LOI)",
    ctaHow: "Nasıl çalıştığını görün",
    problem: {
      eyebrow: "Sorun",
      title: "Çoklu ilaç kullanımında riski elle izlemek zor.",
      description:
        "Risk yalnızca iki ilacın etkileşiminden doğmaz. İlaç sayısı, böbrek ve karaciğer fonksiyonu ve aynı organa binen toplam yük birlikte değerlendirilmelidir.",
    },
    problems: [
      {
        title: "Çoklu ilaç kullanımı",
        body: "Beş veya daha fazla ilaç kullanan hastada olası etkileşim sayısı hızla artar. Bunları her reçetede elle taramak gerçekçi değil.",
      },
      {
        title: "Değişen böbrek ve karaciğer fonksiyonu",
        body: "Aynı reçete eGFR'si 90 olan hastada güvenliyken 30 olan hastada doz ayarı gerektirebilir. Kontrol, güncel laboratuvar değerine bakmalı.",
      },
      {
        title: "Kümülatif yük",
        body: "Tek başına kabul edilebilir ilaçlar aynı organda toplandığında risk oluşturabilir. İki ilaca bakan etkileşim kontrolü bu birikimi görmez.",
      },
      {
        title: "Uyarı yorgunluğu",
        body: "Bağlama bakmayan uyarılar o kadar sık çıkar ki hekim hepsini geçmeye alışır. Önemli uyarı da bu kalabalıkta kaybolur.",
      },
    ],
    pairs: {
      label: "İkili kombinasyon sayısı",
      body: "n ilaç için ikili kombinasyon sayısı n(n−1)/2'dir. Üçlü ve daha karmaşık etkiler bu sayıya dahil değildir.",
      drugs: "İlaç sayısı",
      combos: "İkili kombinasyon",
      source:
        "Dünya Sağlık Örgütü, ilaç hatalarının dünya genelindeki yıllık maliyetini yaklaşık 42 milyar ABD doları olarak tahmin ediyor.",
      sourceRef: "DSÖ, Medication Without Harm (2017)",
    },
    how: {
      eyebrow: "Nasıl çalışır",
      title: "Reçeteden kayda altı adım.",
      description:
        "Veri standart kaynaklardan alınır, kurallarla değerlendirilir ve sonuç gerekçesiyle hekime gösterilir. Hiçbir adımda olasılıksal tahmin kullanılmaz.",
    },
    pipeline: [
      {
        title: "Veri alımı",
        body: "Hasta, ilaç istemi, laboratuvar, tanı ve alerji bilgisi HL7 FHIR R4 kaynakları olarak alınır.",
        detail: "Patient · MedicationRequest · Observation · Condition · AllergyIntolerance",
      },
      {
        title: "Eşleştirme",
        body: "Etken madde, doz, birim ve uygulama yolu ortak kodlara çevrilir. Eksik bilgi işaretlenir, atlanmaz.",
        detail: "ATC · UCUM birimleri · eksik veri bayrağı",
      },
      {
        title: "Kural değerlendirmesi",
        body: `Reçete ${metrics.safetyPlanes} güvenlik düzleminde sürümlü kurallarla kontrol edilir. Aynı girdi her zaman aynı sonucu verir.`,
        detail: `${metrics.safetyPlanes} düzlem · sürümlü kurallar`,
      },
      {
        title: "Bulgu ve gerekçe",
        body: "Bulgu şiddet düzeyiyle birlikte gösterilir: hangi kural, hangi değer, hangi eşik.",
        detail: "kural kimliği · tetikleyen değer · eşik",
      },
      {
        title: "Hekim kararı",
        body: "Son karar hekimindir. Uyarıyı kabul etmek, düzeltmek ya da gerekçe yazıp geçmek kayda geçer.",
        detail: "kabul · düzeltme · gerekçeli geçme",
      },
      {
        title: "Kayıt",
        body: "Girdi, kural sürümü, bulgu ve hekimin kararı yalnızca eklenebilir kayda yazılır.",
        detail: "append-only · kayıt özeti zinciri",
      },
    ],
    planes: {
      label: `${metrics.safetyPlanes} güvenlik düzlemi`,
      title: `Dört başlık altında ${metrics.safetyPlanes} kontrol`,
      body: "Her kontrolün kendi sürümü ve testi var. Eşik değerleri kurumun politikasına göre ayarlanabilir.",
    },
    // Safety planes grouped by clinical domain. Keep in sync with the engine's plane registry.
    planeGroups: [
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
    ],
    integration: {
      eyebrow: "HBYS entegrasyonu",
      title: "Bilgi işlem ekipleri için entegrasyon matrisi.",
      description:
        "Hastane bilgi işlem ve biyomedikal ekiplerinin ilk sorduğu dört soru: hangi protokolle bağlanır, kimlik nasıl doğrulanır, nerede çalışır, neyi kaydeder.",
    },
    integrationCards: [
      {
        title: "Protokoller",
        body: "Klinik veri HL7 FHIR R4 üzerinden alınır. FHIR'a geçmemiş sistemlerin HL7 v2 mesajları FHIR R4'e dönüştürülür.",
        rows: [
          { label: "FHIR R4", value: "RESTful API · Subscription (rest-hook)" },
          { label: "HL7 v2", value: "MLLP dinleyici · FHIR R4 dönüştürücü katmanı" },
          { label: "Kodlama", value: "ATC · ICD-10 · UCUM" },
        ],
      },
      {
        title: "Güvenlik ve yetkilendirme",
        body: "Her istek kimliği doğrulanmış bir istemciden gelir ve yalnızca rolünün izin verdiği veriye erişir.",
        rows: [
          { label: "Yetkilendirme", value: "OAuth 2.0 · SMART on FHIR" },
          { label: "Taşıma", value: "mTLS (karşılıklı TLS)" },
          { label: "Erişim", value: "RBAC · en az yetki ilkesi" },
        ],
      },
      {
        title: "Dağıtım modelleri",
        body: "Sistem kurumun kendi altyapısında çalışır; hasta verisi kurumdan çıkmaz.",
        rows: [
          { label: "Kurum içi", value: "Docker konteyner · izole sanal makine" },
          { label: "Ağ", value: "Air-gapped (internetsiz) ağ desteği" },
          { label: "Bulut", value: "Kuruma ayrılmış izole VPC" },
        ],
      },
      {
        title: "Kayıt ve izlenebilirlik",
        body: "Uygulama kayıtları kurumun merkezi log sistemine gönderilir; klinik kararlar ayrıca değiştirilemez kayıtta tutulur.",
        rows: [
          { label: "Sistem kaydı", value: "Syslog · RFC 5424" },
          { label: "Denetim izi", value: "Append-only · kayıt özeti zinciri" },
          { label: "Kapsam", value: "Girdi · kural sürümü · kullanıcı · zaman" },
        ],
      },
    ],
    integrationNote:
      "Matris entegrasyon mimarisini tarif eder. Hangi arayüzün kurumunuzda nasıl kurulacağı, pilot öncesi teknik keşifte bilgi işlem ekibinizle birlikte belirlenir.",
    validationHeading: {
      eyebrow: "Doğrulama",
      title: "Doğrulama ve kanıt matrisi.",
      description:
        "Sayfadaki her rakam farklı bir kanıt düzeyine ait. Hangisinin kod testi, hangisinin sentetik kural doğrulaması olduğunu ayrı yazdık. Klinik kanıt henüz yok.",
    },
    evidence: [
      {
        title: "Yazılım ve kod seviyesi",
        status: "Uygulandı ve test edildi",
        body: "Kod uygulandı ve her değişiklikte otomatik testten geçiyor. Bu düzey yazılımın tanımlandığı gibi çalıştığını gösterir, klinik doğruluğu göstermez.",
        rows: [
          { label: "Otomatik test", value: testsLabel("tr"), mono: true },
          { label: "Test türü", value: "Birim · entegrasyon" },
          { label: "Senaryolar", value: "Sentetik test senaryoları" },
          { label: "Veri modeli", value: "HL7 FHIR R4 kaynakları" },
        ],
      },
      {
        title: "Kural doğrulama seviyesi",
        status: "Sentetik doğrulama",
        body: "Kurallar kaynağından ayrıştırıldı ve sentetik hasta profilleri üzerinde algoritmik olarak doğrulandı. Gerçek hasta verisiyle henüz doğrulanmadı.",
        rows: [
          { label: "Doğrulanan kural", value: String(metrics.verifiedRules), mono: true },
          { label: "Güvenlik düzlemi", value: String(metrics.safetyPlanes), mono: true },
          { label: "Yöntem", value: "Sentetik hasta profilleri" },
          { label: "Gerçek veri", value: "Henüz yok" },
        ],
      },
      {
        title: "Klinik seviye",
        status: "Pilot bekliyor",
        body: "Klinik performans henüz ölçülmedi. Bu düzey etik kurul onaylı vaka çalışması ve hastane pilotuyla kurulacak.",
        rows: [
          { label: "Vaka testi", value: "Etik kurul onaylı · planlandı" },
          { label: "Pilot", value: "Prospektif hastane pilotu · bekliyor" },
          { label: "Teknik dosya", value: "MDR · hazırlıkta" },
          { label: "CE işareti", value: "Henüz yok" },
        ],
      },
    ],
    claimColumns: { claim: "İddia", shows: "Neyi gösterir", notShows: "Neyi göstermez", level: "Kanıt düzeyi" },
    claims: [
      {
        value: String(metrics.safetyPlanes),
        label: "Güvenlik düzlemi",
        shows: "Kural motorundaki kontrol kategorisi sayısı.",
        notShows: "Her düzlemin hastada doğru sonuç verdiği.",
        level: "Yazılım / kod",
      },
      {
        value: testsLabel("tr"),
        label: "Otomatik test",
        shows: "Kodun her değişiklikte tanımlandığı gibi çalıştığı.",
        notShows: "Klinik sonuç ya da hasta güvenliğine etkisi.",
        level: "Yazılım / kod",
      },
      {
        value: "FHIR R4",
        label: "Veri standardı",
        shows: "Veri modelleri ve entegrasyon testleri FHIR R4 kaynak yapılarını kullanıyor.",
        notShows: "Bir hastane sistemine canlı bağlantı. Pilot entegrasyonu henüz yapılmadı.",
        level: "Yazılım / kod",
      },
      {
        value: String(metrics.verifiedRules),
        label: "Doğrulanmış kural",
        shows: "Sentetik hasta profillerinde beklenen sonucu veren kural sayısı.",
        notShows: "Gerçek hastada duyarlılık, özgüllük veya PPV.",
        level: "Kural (sentetik)",
      },
      {
        value: trlLabel("tr"),
        label: "Teknoloji hazırlık seviyesi",
        shows: "Bileşenlerin laboratuvar ortamında doğrulandığı.",
        notShows: "Gerçek klinik ortamda çalıştığı.",
        level: "Kural (sentetik)",
      },
      {
        value: "Sınıf IIa",
        label: "MDR · Kural 11",
        shows: "Kural 11 kapsamında izlediğimiz hedef sınıflandırma rotası.",
        notShows: "Sertifika, CE işareti veya onaylanmış kuruluş kararı.",
        level: "Klinik · bekliyor",
      },
    ],
    regulation: {
      eyebrow: "Regülasyon",
      title: "MDR hedef sınıfı: IIa.",
      description:
        "PharmaDeux, ilaç tedavisi kararlarına bilgi sağladığı için AB Tıbbi Cihaz Yönetmeliği'nin (MDR) Ek VIII Kural 11'ine giriyor. Sınıf IIa, bu kurala göre izlediğimiz hedef sınıflandırma rotasıdır; kesinleşmiş bir sınıf ya da sertifika değildir. Sınıf, teknik dosya ve onaylanmış kuruluş değerlendirmesiyle kesinleşir. Henüz CE işareti yok.",
    },
    intendedUse: {
      label: "Kullanım amacı (taslak)",
      body: "Reçeteyle ilgili olası güvenlik risklerini gerekçeleriyle göstererek yetkili sağlık profesyonelinin kararına destek olmak. Sistem tanı koymaz, tedavi önermez ve hekimin kararının yerini almaz.",
    },
    frameworkColumns: { framework: "Çerçeve", scope: "Kapsam", status: "Durum" },
    frameworks: [
      { code: "EU MDR 2017/745", scope: "Tıbbi cihaz yönetmeliği · Ek VIII Kural 11", status: "Hedef rota · Sınıf IIa" },
      { code: "IEC 62304", scope: "Tıbbi cihaz yazılımı yaşam döngüsü", status: "Mimari uyum" },
      { code: "ISO 14971", scope: "Tıbbi cihazlarda risk yönetimi", status: "Mimari uyum" },
      { code: "ISO 13485", scope: "Kalite yönetim sistemi", status: "Yol haritasında" },
      { code: "IEC 62366-1", scope: "Kullanılabilirlik mühendisliği", status: "Yol haritasında" },
    ],
    regulationNote: {
      before: "PharmaDeux henüz piyasaya sunulmadı. Ayrıntılar için",
      link: "Kalite ve MDR",
      after: "sayfasına bakabilirsiniz.",
    },
    protocolHeading: {
      eyebrow: "Klinik doğrulama planı",
      title: "Kullanıma girmeden önce geçmiş vakalarla ölçüyoruz.",
      description:
        "PharmaDeux'nün performansı, anonimleştirilmiş gerçek vakalar üzerinde bağımsız bir uzman paneline karşı ölçülecek.",
    },
    protocol: [
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
    ],
    protocolNote:
      "Ortak kurumlar protokolün yazımına katılabilir. Veri yalnızca etik kurul onayı ve kurumla imzalanan veri işleme sözleşmesi kapsamında kullanılır.",
    cta: {
      eyebrow: "Pilot program",
      title: "PharmaDeux pilotu için bize yazın.",
      description:
        "Geçmiş vakalarla doğrulama çalışmasına katılmak ya da kendi kurumunuzda bir pilot tanımlamak için bağlayıcı olmayan bir Niyet Mektubu (LOI) ile başlayabiliriz.",
    },
    pilotAudiences: [
      "Klinik eczacılık ve ilaç güvenliği ekipleri",
      "Üniversite ve eğitim-araştırma hastaneleri",
      "Geçmiş veriyle doğrulama çalışması yapabilecek kurumlar",
    ],
  },
  en: {
    sections: [
      { id: "problem", label: "Problem" },
      { id: "mimari", label: "How it works" },
      { id: "simulator", label: "QT simulator" },
      { id: "entegrasyon", label: "Integration" },
      { id: "dogrulama", label: "Verification" },
      { id: "regulasyon", label: "Regulation" },
      { id: "protokol", label: "Clinical validation plan" },
    ],
    heroStats: [
      { value: String(metrics.safetyPlanes), label: "Safety planes" },
      { value: testsLabel("en"), label: "Automated tests" },
      { value: "FHIR R4", label: "Data standard" },
      { value: trlLabel("en"), label: "Technology readiness level" },
    ],
    crumbs: { home: "Home", products: "Products" },
    eyebrow: "Clinical decision support · medication safety",
    title: "PharmaDeux CDSS. Checks medication safety while the prescription is written.",
    description:
      "Clinical decision support software alerting physicians to cumulative organ burden and toxicity at the moment of prescription. Each alert is shown with the rule and threshold that triggered it; the physician makes the final decision.",
    ctaIntro: "15-minute intro call",
    ctaPilot: "Apply for a pilot (LOI)",
    ctaHow: "See how it works",
    problem: {
      eyebrow: "Problem",
      title: "Tracking risk by hand in polypharmacy is hard.",
      description:
        "Risk does not come only from two drugs interacting. The number of drugs, kidney and liver function, and the total burden on a single organ have to be assessed together.",
    },
    problems: [
      {
        title: "Polypharmacy",
        body: "In a patient on five or more drugs, the number of possible interactions grows quickly. Screening them by hand on every prescription is not realistic.",
      },
      {
        title: "Changing kidney and liver function",
        body: "A prescription that is safe at an eGFR of 90 may need a dose adjustment at 30. The check has to look at the current lab value.",
      },
      {
        title: "Cumulative burden",
        body: "Drugs that are acceptable on their own can add up to a risk in the same organ. An interaction check that looks at two drugs at a time does not see this.",
      },
      {
        title: "Alert fatigue",
        body: "Alerts that ignore context fire so often that physicians learn to override them all. The alert that matters gets lost in the noise.",
      },
    ],
    pairs: {
      label: "Pairwise combinations",
      body: "For n drugs, the number of pairwise combinations is n(n−1)/2. Three-way and more complex effects are not included.",
      drugs: "Drugs",
      combos: "Pairs",
      source:
        "The World Health Organization estimates the global annual cost of medication errors at about USD 42 billion.",
      sourceRef: "WHO, Medication Without Harm (2017)",
    },
    how: {
      eyebrow: "How it works",
      title: "Six steps from prescription to record.",
      description:
        "Data comes in from standard resources, is assessed by rules, and the result is shown to the physician with its reason. No step uses probabilistic prediction.",
    },
    pipeline: [
      {
        title: "Data intake",
        body: "Patient, medication order, laboratory, diagnosis and allergy data arrive as HL7 FHIR R4 resources.",
        detail: "Patient · MedicationRequest · Observation · Condition · AllergyIntolerance",
      },
      {
        title: "Mapping",
        body: "Active substance, dose, unit and route are mapped to shared codes. Missing information is flagged, not skipped.",
        detail: "ATC · UCUM units · missing-data flag",
      },
      {
        title: "Rule assessment",
        body: `The prescription is checked against versioned rules across ${metrics.safetyPlanes} safety planes. The same input always gives the same result.`,
        detail: `${metrics.safetyPlanes} planes · versioned rules`,
      },
      {
        title: "Finding and reason",
        body: "A finding is shown with its severity: which rule, which value, which threshold.",
        detail: "rule ID · triggering value · threshold",
      },
      {
        title: "Physician decision",
        body: "The physician decides. Accepting the alert, changing the order or overriding it with a reason is recorded.",
        detail: "accept · change · override with reason",
      },
      {
        title: "Record",
        body: "Input, rule version, finding and the physician's decision are written to an append-only log.",
        detail: "append-only · digest chain",
      },
    ],
    planes: {
      label: `${metrics.safetyPlanes} safety planes`,
      title: `${metrics.safetyPlanes} checks under four headings`,
      body: "Each check has its own version and tests. Thresholds can be set to match the institution's policy.",
    },
    planeGroups: [
      {
        title: "Interactions",
        planes: ["Drug–drug interaction", "Therapeutic duplication", "Drug–disease interaction", "Allergy and contraindication"],
      },
      {
        title: "Organ toxicity",
        planes: ["Nephrotoxicity", "Hepatotoxicity", "Cardiotoxicity / QT prolongation", "Haematological toxicity"],
      },
      {
        title: "Cumulative burden",
        planes: [
          "Anticholinergic burden",
          "Serotonergic burden",
          "Sedative / CNS depressant burden",
          "Bleeding risk burden",
          "Hyperkalaemia risk",
        ],
      },
      {
        title: "Patient and dose",
        planes: [
          "Dose range check",
          "Renal dose adjustment",
          "Hepatic dose adjustment",
          "Geriatric appropriateness",
          "Pregnancy and lactation",
        ],
      },
    ],
    integration: {
      eyebrow: "Hospital system integration",
      title: "Integration matrix for IT teams.",
      description:
        "The four questions hospital IT and biomedical engineering teams ask first: how it connects, how clients are authenticated, where it runs and what it logs.",
    },
    integrationCards: [
      {
        title: "Protocols",
        body: "Clinical data arrives over HL7 FHIR R4. HL7 v2 messages from systems that have not moved to FHIR are converted to FHIR R4.",
        rows: [
          { label: "FHIR R4", value: "RESTful API · Subscription (rest-hook)" },
          { label: "HL7 v2", value: "MLLP listener · FHIR R4 conversion layer" },
          { label: "Coding", value: "ATC · ICD-10 · UCUM" },
        ],
      },
      {
        title: "Security and authorisation",
        body: "Every request comes from an authenticated client and can reach only the data its role allows.",
        rows: [
          { label: "Authorisation", value: "OAuth 2.0 · SMART on FHIR" },
          { label: "Transport", value: "mTLS (mutual TLS)" },
          { label: "Access", value: "RBAC · least privilege" },
        ],
      },
      {
        title: "Deployment models",
        body: "The system runs on the institution's own infrastructure; patient data does not leave the institution.",
        rows: [
          { label: "On-premises", value: "Docker container · isolated virtual machine" },
          { label: "Network", value: "Air-gapped network support" },
          { label: "Cloud", value: "Isolated VPC dedicated to the institution" },
        ],
      },
      {
        title: "Logging and traceability",
        body: "Application logs go to the institution's central log system; clinical decisions are also kept in a log that cannot be changed.",
        rows: [
          { label: "System log", value: "Syslog · RFC 5424" },
          { label: "Audit trail", value: "Append-only · digest chain" },
          { label: "Scope", value: "Input · rule version · user · time" },
        ],
      },
    ],
    integrationNote:
      "The matrix describes the integration architecture. Which interface is set up at your institution, and how, is agreed with your IT team during technical discovery before the pilot.",
    validationHeading: {
      eyebrow: "Verification",
      title: "Verification and evidence matrix.",
      description:
        "Each number on this page belongs to a different level of evidence. We list which ones are code tests and which are synthetic rule verification. There is no clinical evidence yet.",
    },
    evidence: [
      {
        title: "Software and code level",
        status: "Implemented and tested",
        body: "The code is implemented and runs through automated tests on every change. This level shows the software works as specified, not that it is clinically correct.",
        rows: [
          { label: "Automated tests", value: testsLabel("en"), mono: true },
          { label: "Test types", value: "Unit · integration" },
          { label: "Scenarios", value: "Synthetic test scenarios" },
          { label: "Data model", value: "HL7 FHIR R4 resources" },
        ],
      },
      {
        title: "Rule verification level",
        status: "Synthetic verification",
        body: "Rules were parsed from their sources and verified algorithmically on synthetic patient profiles. They have not been verified on real patient data yet.",
        rows: [
          { label: "Verified rules", value: String(metrics.verifiedRules), mono: true },
          { label: "Safety planes", value: String(metrics.safetyPlanes), mono: true },
          { label: "Method", value: "Synthetic patient profiles" },
          { label: "Real data", value: "Not yet" },
        ],
      },
      {
        title: "Clinical level",
        status: "Awaiting pilot",
        body: "Clinical performance has not been measured yet. This level will come from an ethics-approved case study and a hospital pilot.",
        rows: [
          { label: "Case testing", value: "Ethics-approved · planned" },
          { label: "Pilot", value: "Prospective hospital pilot · pending" },
          { label: "Technical file", value: "MDR · in preparation" },
          { label: "CE mark", value: "Not yet" },
        ],
      },
    ],
    claimColumns: { claim: "Claim", shows: "What it shows", notShows: "What it does not show", level: "Evidence level" },
    claims: [
      {
        value: String(metrics.safetyPlanes),
        label: "Safety planes",
        shows: "The number of check categories in the rule engine.",
        notShows: "That each plane gives the right result for a patient.",
        level: "Software / code",
      },
      {
        value: testsLabel("en"),
        label: "Automated tests",
        shows: "That the code works as specified on every change.",
        notShows: "Clinical outcomes or effect on patient safety.",
        level: "Software / code",
      },
      {
        value: "FHIR R4",
        label: "Data standard",
        shows: "Data models and integration tests use FHIR R4 resource structures.",
        notShows: "A live connection to a hospital system. No pilot integration has been done yet.",
        level: "Software / code",
      },
      {
        value: String(metrics.verifiedRules),
        label: "Verified rules",
        shows: "The number of rules that give the expected result on synthetic patient profiles.",
        notShows: "Sensitivity, specificity or PPV on real patients.",
        level: "Rules (synthetic)",
      },
      {
        value: trlLabel("en"),
        label: "Technology readiness level",
        shows: "That components have been validated in a laboratory environment.",
        notShows: "That it works in a real clinical setting.",
        level: "Rules (synthetic)",
      },
      {
        value: "Class IIa",
        label: "MDR · Rule 11",
        shows: "The target classification route we follow under Rule 11.",
        notShows: "A certificate, a CE mark or a notified body decision.",
        level: "Clinical · pending",
      },
    ],
    regulation: {
      eyebrow: "Regulation",
      title: "MDR target class: IIa.",
      description:
        "PharmaDeux provides information used in drug therapy decisions, so it falls under Annex VIII Rule 11 of the EU Medical Device Regulation (MDR). Class IIa is the target classification route we follow under this rule; it is not a confirmed class or a certificate. The class is confirmed through the technical file and a notified body assessment. It does not have a CE mark yet.",
    },
    intendedUse: {
      label: "Intended use (draft)",
      body: "To support the decision of a qualified healthcare professional by showing possible safety risks of a prescription, with their reasons. The system does not diagnose, does not recommend treatment and does not replace the physician's decision.",
    },
    frameworkColumns: { framework: "Framework", scope: "Scope", status: "Status" },
    frameworks: [
      { code: "EU MDR 2017/745", scope: "Medical Device Regulation · Annex VIII Rule 11", status: "Target route · Class IIa" },
      { code: "IEC 62304", scope: "Medical device software life cycle", status: "Architecture aligned" },
      { code: "ISO 14971", scope: "Risk management for medical devices", status: "Architecture aligned" },
      { code: "ISO 13485", scope: "Quality management system", status: "On the roadmap" },
      { code: "IEC 62366-1", scope: "Usability engineering", status: "On the roadmap" },
    ],
    regulationNote: {
      before: "PharmaDeux is not on the market yet. For details, see",
      link: "Quality and MDR",
      after: ".",
    },
    protocolHeading: {
      eyebrow: "Clinical validation plan",
      title: "We measure it on past cases before anyone uses it.",
      description:
        "PharmaDeux's performance will be measured on anonymised real cases against an independent panel of experts.",
    },
    protocol: [
      {
        phase: "Phase 0",
        title: "Protocol and ethics committee",
        body: "Primary and secondary endpoints and the data management plan are written, and the ethics application is submitted.",
        status: "In preparation",
      },
      {
        phase: "Phase 1",
        title: "Historical data",
        body: "Anonymised past prescription and laboratory data are obtained from the partner institution in line with KVKK.",
        status: "Planned",
      },
      {
        phase: "Phase 2",
        title: "Reference standard",
        body: "An independent panel of a clinical pharmacist and physicians, blind to the system, assesses the same cases.",
        status: "Planned",
      },
      {
        phase: "Phase 3",
        title: "Blinded comparison",
        body: "The system's findings are compared with the panel's decisions. Sensitivity, specificity, positive predictive value and alert count are reported.",
        status: "Planned",
      },
      {
        phase: "Phase 4",
        title: "Clinical evaluation report",
        body: "Results feed into the MDR clinical evaluation file and the design of a prospective pilot.",
        status: "Planned",
      },
    ],
    protocolNote:
      "Partner institutions can take part in writing the protocol. Data is used only under ethics committee approval and a data processing agreement signed with the institution.",
    cta: {
      eyebrow: "Pilot programme",
      title: "Write to us about a PharmaDeux pilot.",
      description:
        "To join a validation study on past cases, or to set up a pilot at your own institution, we can start with a non-binding Letter of Intent (LOI).",
    },
    pilotAudiences: [
      "Clinical pharmacy and medication safety teams",
      "University and training-and-research hospitals",
      "Institutions able to run a validation study on historical data",
    ],
  },
});

// The "N checks under four headings" grid is drawn from planeGroups; its total must equal the JSON count,
// otherwise the sentences (templated from metrics.safetyPlanes) and the grid would disagree.
for (const lang of ["tr", "en"] as const) {
  const drawn = copy[lang].planeGroups.reduce((n, g) => n + g.planes.length, 0);
  if (drawn !== metrics.safetyPlanes) {
    throw new Error(`PharmaDeuxView (${lang}): planeGroups lists ${drawn} planes, projectMetrics.json says ${metrics.safetyPlanes}`);
  }
}


export default function PharmaDeuxView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);

  return (
    <main className="relative flex-1 overflow-x-clip">
      <JsonLd data={pharmaDeuxJsonLd(locale)} />
      <PageHero
        locale={locale}
        ambient="pharma"
        eyebrowIcon={{ icon: Pill, className: "text-pharma" }}
        visual={<PharmaCapsule locale={locale} />}
        visualClassName="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]"
        below={
          <>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline lg:grid-cols-4">
            {c.heroStats.map((s) => (
              <div key={s.label} className="relative flex flex-col-reverse bg-navy-900 p-5">
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-pharma/30" />
                <dt className="mt-1.5 text-xs leading-snug text-white/50">{s.label}</dt>
                <dd className="font-mono text-xl font-medium tracking-[-0.01em] text-white tabular-nums sm:text-2xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
          {/* Development status from src/data/projectMetrics.json; the internal engine status is never shown. */}
          <dl
            aria-label={devCopy[locale].label}
            className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1.5 px-1 text-[12px] text-white/55"
          >
            <div className="flex items-baseline gap-1.5">
              <dt>{devCopy[locale].step}</dt>
              <dd className="font-mono text-white/80 tabular-nums">
                {metrics.currentPhase}/{metrics.totalPhases}
              </dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>{devCopy[locale].rules}</dt>
              <dd className="font-mono text-white/80 tabular-nums">{metrics.verifiedRules}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>{devCopy[locale].version}</dt>
              <dd className="font-mono text-white/80 tabular-nums">{metrics.version}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>{devCopy[locale].updated}</dt>
              <dd className="tabular-nums text-white/80">{formatDate(locale, metrics.lastUpdated)}</dd>
            </div>
          </dl>
          </>
        }
        breadcrumbs={[
          { href: "/", label: c.crumbs.home },
          { href: "/#platformlar", label: c.crumbs.products },
          { label: "PharmaDeux CDSS" },
        ]}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={href(contactHref("intro", "pharmadeux"))}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
          >
            {c.ctaIntro}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#mimari"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
          >
            {c.ctaHow}
          </a>
        </div>
      </PageHero>

      <InPageNav locale={locale} items={c.sections} />

      {/* Problem */}
      <section id="problem" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="pharma" {...c.problem} />

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
              {c.problems.map(({ title, body }, i) => {
                const Icon = problemIcons[i];
                return (
                  <div
                    key={title}
                    className="group relative bg-navy-850 p-6 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-7"
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-transparent transition-colors duration-150 ease-out group-hover:bg-pharma/50" />
                    <Icon
                      className="h-5 w-5 text-white/55 transition-colors duration-150 ease-out group-hover:text-pharma"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 text-base font-semibold tracking-[-0.01em] text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                  </div>
                );
              })}
            </div>

            <Reveal className="flex flex-col rounded-2xl border border-hairline bg-navy-850 p-6 sm:p-7">
              <p className={LABEL}>{c.pairs.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{c.pairs.body}</p>
              <div className="-mx-6 mt-6 sm:-mx-7">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-y border-hairline text-[11px] text-white/55">
                    <th className="py-2 pl-6 font-medium sm:pl-7">{c.pairs.drugs}</th>
                    <th className="py-2 pr-6 text-right font-medium sm:pr-7">{c.pairs.combos}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline border-b border-hairline">
                  {pairCounts.map(({ n, pairs }) => (
                    <tr key={n}>
                      <td className="py-2.5 pl-6 font-mono text-white/70 tabular-nums sm:pl-7">{n}</td>
                      <td className="py-2.5 pr-6 text-right sm:pr-7">
                        <span className="inline-flex items-center gap-3">
                          <span
                            className="h-1 rounded-sm bg-titanium/60"
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
              </div>
              <p className="mt-auto pt-6 text-xs leading-relaxed text-white/55">
                {c.pairs.source} <span className="text-white/55">{c.pairs.sourceRef}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="mimari" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="pharma" {...c.how} />
          <div className="mt-14">
            <FlowDiagram locale={locale} steps={c.pipeline.map((step, i) => ({ ...step, icon: pipelineIcons[i] }))} />
          </div>

          <div className="mt-20">
            <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className={LABEL}>{c.planes.label}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{c.planes.title}</h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/50">{c.planes.body}</p>
            </Reveal>
            <Reveal className="mt-8">
              <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-2 xl:grid-cols-4">
                {c.planeGroups.map((group, gi) => {
                  const offset = c.planeGroups.slice(0, gi).reduce((sum, g) => sum + g.planes.length, 0);
                  return (
                    <div key={group.title} className="bg-navy-850 p-5">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-sm font-semibold text-white">{group.title}</h4>
                        <span className="font-mono text-[11px] text-white/55 tabular-nums">{group.planes.length}</span>
                      </div>
                      <ul className="-mx-5 mt-3 divide-y divide-hairline border-t border-hairline">
                        {group.planes.map((plane, pi) => (
                          <li key={plane} className="flex items-baseline gap-3 px-5 py-2">
                            <span className="font-mono text-[11px] text-white/55 tabular-nums">
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

      {/* Interactive simulator */}
      <section id="simulator" className="relative scroll-mt-32 py-24 sm:py-32">
        <RailMarker className="top-24 sm:top-32" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
          <SectionHeader accent="pharma" {...simCopy[locale]} />
          <Reveal className="min-w-0">
            <QtSimulator locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* Hospital system integration */}
      <section id="entegrasyon" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="pharma" {...c.integration} />
          <JoinedGrid className="mt-14" columns="sm:grid-cols-2 xl:grid-cols-4">
            {c.integrationCards.map((card, i) => (
              <SpecCard
                key={integrationMeta[i].id}
                variant="cell"
                align={{ rows: Math.max(...c.integrationCards.map((x) => x.rows.length)) }}
                accent="pharma"
                id={integrationMeta[i].id}
                icon={integrationMeta[i].icon}
                title={card.title}
                body={card.body}
                rows={card.rows}
              />
            ))}
          </JoinedGrid>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/55">{c.integrationNote}</p>
          <Reveal className="mt-8">
            <FhirPreview locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* Validation */}
      <section id="dogrulama" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="pharma" {...c.validationHeading} />
          <JoinedGrid className="mt-14" columns="lg:grid-cols-3">
            {c.evidence.map((level, i) => (
              <SpecCard
                key={evidenceMeta[i].id}
                variant="cell"
                align={{ rows: Math.max(...c.evidence.map((x) => x.rows.length)) }}
                accent="pharma"
                id={evidenceMeta[i].id}
                icon={evidenceMeta[i].icon}
                title={level.title}
                body={level.body}
                rows={level.rows}
                status={{ label: level.status, tone: evidenceMeta[i].tone }}
              />
            ))}
          </JoinedGrid>

          {/* Claims map: every headline number on the page, with what it does and does not show. Data layer: neutral. */}
          <Reveal className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-navy-850">
            <div className="hidden grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)] border-b border-hairline text-[11px] font-medium tracking-wider text-white/55 uppercase lg:grid">
              <div className="px-6 py-4">{c.claimColumns.claim}</div>
              <div className="px-6 py-4">{c.claimColumns.shows}</div>
              <div className="px-6 py-4">{c.claimColumns.notShows}</div>
              <div className="px-6 py-4 text-right">{c.claimColumns.level}</div>
            </div>
            <dl className="divide-y divide-hairline">
              {c.claims.map((claim, i) => {
                const reached = 2 - claimLevels[i];
                return (
                  <div
                    key={claim.label}
                    className="grid gap-3 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)] lg:gap-0 lg:px-0 lg:py-0"
                  >
                    <dt className="lg:px-6 lg:py-5">
                      <span className={`block text-[15px] text-white ${hasDigit(claim.value) ? "font-mono tabular-nums" : "font-medium"}`}>
                        {claim.value}
                      </span>
                      <span className="mt-1 block text-[12.5px] text-white/55">{claim.label}</span>
                    </dt>
                    <dd className="text-sm leading-relaxed text-white/75 lg:px-6 lg:py-5">
                      <span className="mr-2 text-[10px] font-medium tracking-wide text-white/55 uppercase lg:hidden">
                        {c.claimColumns.shows}
                      </span>
                      {claim.shows}
                    </dd>
                    <dd className="text-sm leading-relaxed text-white/55 lg:px-6 lg:py-5">
                      <span className="mr-2 text-[10px] font-medium tracking-wide text-white/55 uppercase lg:hidden">
                        {c.claimColumns.notShows}
                      </span>
                      {claim.notShows}
                    </dd>
                    <dd className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-1.5 lg:px-6 lg:py-5">
                      <span className={`${LABEL} lg:text-right`}>{claim.level}</span>
                      <span className="flex gap-0.5" aria-hidden="true">
                        {[0, 1, 2].map((step) => (
                          <span
                            key={step}
                            className={`h-[3px] w-4 rounded-full ${step <= reached ? "bg-white/70" : "bg-white/[0.12]"}`}
                          />
                        ))}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Regulation */}
      <section id="regulasyon" className="relative scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div>
            <SectionHeader accent="pharma" {...c.regulation} />
            <Reveal className="mt-8 rounded-2xl border border-hairline bg-navy-850 p-6">
              <p className={LABEL}>{c.intendedUse.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{c.intendedUse.body}</p>
            </Reveal>
          </div>

          <Reveal className="min-w-0 overflow-hidden rounded-2xl border border-hairline bg-navy-850">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline text-[11px] text-white/55">
                <tr>
                  <th className="px-5 py-3 font-medium">{c.frameworkColumns.framework}</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">{c.frameworkColumns.scope}</th>
                  <th className="px-5 py-3 text-right font-medium">{c.frameworkColumns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {c.frameworks.map((f) => (
                  <tr key={f.code}>
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-mono text-[13px] text-white tabular-nums">{f.code}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/55 sm:hidden">{f.scope}</p>
                    </td>
                    <td className="hidden px-5 py-3.5 align-top text-[13px] leading-relaxed text-white/55 sm:table-cell">
                      {f.scope}
                    </td>
                    <td className="px-5 py-3.5 text-right align-top">
                      <span className={`whitespace-nowrap ${LABEL}`}>{keepClassCase(f.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-hairline px-5 py-4 text-xs leading-relaxed text-white/55">
              {c.regulationNote.before}{" "}
              <Link
                href={href("/legal/quality")}
                className="text-white/70 underline-offset-2 hover:text-white hover:underline"
              >
                {c.regulationNote.link}
              </Link>
              {locale === "tr" ? " " : ""}
              {c.regulationNote.after}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Clinical validation plan */}
      <section id="protokol" className="scroll-mt-32 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader accent="pharma" {...c.protocolHeading} />
          <Reveal className="mt-14">
            <ol className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-navy-850">
              {c.protocol.map((p, i) => (
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
                      i === 0 ? "text-white/80" : "text-white/55"
                    }`}
                  >
                    {p.status}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">{c.protocolNote}</p>
        </div>
      </section>

      <CtaPanel
        locale={locale}
        {...c.cta}
        primaryHref={href(contactHref("pilot", "pharmadeux"))}
        primaryLabel={c.ctaPilot}
        aside={
          <ul className="divide-y divide-hairline self-center border-y border-hairline">
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
