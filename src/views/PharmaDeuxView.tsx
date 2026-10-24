import Link from "next/link";
import { ChevronRight, Pill } from "lucide-react";
import PharmaCapsule from "@/components/PharmaCapsule";
import JsonLd from "@/components/JsonLd";
import FhirPreview from "@/components/FhirPreview";
import QtSimulator from "@/components/QtSimulator";
import CopyEmail from "@/components/CopyEmail";
import { PairwiseFigure } from "@/components/home/HomeFigures";
import { BUTTON, BUTTON_OUTLINE, Disclosure, FactRows, LINK, PaperSection, TEXT_ACTION } from "@/components/paper/Editorial";
import { pharmaDeuxJsonLd } from "@/lib/structuredData";
import { contactHref } from "@/lib/site";
import { safetyPlaneGroups } from "@/lib/safetyPlanes";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";
import { metrics, testsLabel, testsNote, trlLabel } from "@/lib/metrics";

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

/*
 * PharmaDeux on the paper surface (Academic Editorial), like the home page. The page reads as a case review:
 * what the product is and who builds it, the clinical problem, one example case in a dark workspace, the
 * decision logic, the QT/Tisdale tool, the evidence as it stands, integration details for IT teams, and the
 * validation plan with an invitation to work together. Interactive tools sit on dark panels; everything
 * else is ink on paper. No entrance motion. Section ids are linked from elsewhere and kept: #problem,
 * #vakalar (case workspace), #mimari, #simulator (QT), #dogrulama, #regulasyon, #entegrasyon, #protokol.
 */

/** Integration capability status. "code": in the PharmaDeux repository and under tests, not run in a hospital. */
type Status = "code" | "design" | "planned";
type Capability = { name: string; detail: string; status: Status };
type Level = { title: string; status: string; body: string; rows: { label: string; value: string }[] };

const statusTone: Record<Status, string> = {
  code: "font-medium text-ink",
  design: "text-ink-2",
  planned: "text-ink-3",
};

const copy = defineContent<{
  crumbs: { home: string; products: string; here: string; aria: string };
  hero: {
    name: string;
    title: string;
    lead: string;
    primary: string;
    secondary: string;
    academic: string;
    summaryTitle: string;
    summary: { label: string; value: string }[];
    onPage: string;
  };
  sections: { id: string; label: string }[];
  problem: { label: string; title: string; intro: string; items: { title: string; body: string }[]; source: string };
  cases: { label: string; title: string; intro: string[] };
  logic: {
    label: string;
    title: string;
    intro: string;
    steps: { title: string; body: string }[];
    planesTitle: string;
    planesBody: string;
    show: (n: number) => string;
  };
  qt: { label: string; title: string; intro: string; compareTitle: string; compare: { tool: string; body: string }[] };
  evidence: {
    label: string;
    title: string;
    intro: string;
    levels: Level[];
    claimsTitle: string;
    claimsMeta: string;
    claimColumns: { claim: string; shows: string; notShows: string };
    claims: { value: string; label: string; shows: string; notShows: string }[];
  };
  regulation: {
    title: string;
    body: string;
    intendedUseLabel: string;
    intendedUse: string;
    frameworksLabel: string;
    frameworksMeta: string;
    frameworks: { code: string; scope: string; status: string }[];
    note: { before: string; link: string; after: string };
  };
  integration: {
    label: string;
    title: string;
    intro: string;
    statusLabels: Record<Status, string>;
    statusMeaning: Record<Status, string>;
    gap: string;
    columns: { capability: string; detail: string; status: string };
    groups: { title: string; items: Capability[] }[];
    note: string;
    standardLink: string;
    fhirTitle: string;
    fhirBody: string;
  };
  protocol: { label: string; title: string; intro: string; phases: { phase: string; title: string; body: string; status: string }[]; note: string };
  collab: {
    label: string;
    title: string;
    intro: string;
    modes: { title: string; body: string; link: string }[];
    audiencesTitle: string;
    audiences: string[];
    legal: string;
    email: string;
    noPatientData: string;
  };
}>({
  tr: {
    crumbs: { home: "Ana sayfa", products: "Projeler", here: "PharmaDeux CDSS", aria: "Sayfa konumu" },
    hero: {
      name: "PharmaDeux CDSS",
      title: "Reçete yazılırken ilaç güvenliğini kontrol eden klinik karar destek yazılımı.",
      lead: "PharmaDeux reçeteyi hastanın böbrek ve karaciğer değerleri, QTc ölçümü ve kullandığı diğer ilaçlarla birlikte kontrol eder. Her uyarı onu tetikleyen kural ve eşikle gelir. Son karar hekimindir: uyarıyı gerekçe yazarak geçebilir ve bu karar kayda yazılır.",
      primary: "15 dk tanışma görüşmesi",
      secondary: "Örnek vakayı inceleyin",
      academic: "Klinik araştırma ortaklığı için yazın",
      summaryTitle: "Kısaca",
      summary: [
        { label: "Sahiplik", value: "LavieuxLabs ekibinin ortak projesi" },
        { label: "Aşama", value: `Prototip. ${trlLabel("tr")}, ekibin öz değerlendirmesi; bağımsız değerlendirme yapılmadı.` },
        { label: "Yazılım", value: `${testsLabel("tr")} otomatik test; ${metrics.verifiedRules} kural sentetik hasta profillerinde doğrulandı.` },
        { label: "Klinik kanıt", value: "Henüz yok. Geçmiş vakalarla doğrulama planlandı, başlamadı." },
        { label: "Düzenleyici durum", value: "MDR Sınıf IIa hedefi. CE işareti yok." },
        {
          label: "Geliştirme",
          value: `Adım ${metrics.currentPhase}/${metrics.totalPhases}, sürüm ${metrics.version}, ${formatDate("tr", metrics.lastUpdated)} güncellemesi`,
        },
      ],
      onPage: "Bu sayfada",
    },
    sections: [
      { id: "problem", label: "Sorun" },
      { id: "vakalar", label: "Örnek vaka" },
      { id: "mimari", label: "Karar mantığı" },
      { id: "simulator", label: "QT simülatörü" },
      { id: "dogrulama", label: "Kanıt" },
      { id: "entegrasyon", label: "Entegrasyon" },
      { id: "protokol", label: "Klinik doğrulama" },
      { id: "is-birligi", label: "İş birliği" },
    ],
    problem: {
      label: "Sorun",
      title: "Çoklu ilaç kullanımında riski elle izlemek zor.",
      intro:
        "Risk yalnızca iki ilacın etkileşiminden doğmaz. İlaç sayısı, böbrek ve karaciğer fonksiyonu ve aynı organa binen toplam yük birlikte değerlendirilmelidir.",
      items: [
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
      source:
        "Dünya Sağlık Örgütü, ilaç hatalarının dünya genelindeki yıllık maliyetini yaklaşık 42 milyar ABD doları olarak tahmin ediyor (DSÖ, Medication Without Harm, 2017).",
    },
    cases: {
      label: "Örnek vaka",
      title: "Bir vakada PharmaDeux'nün gösterdikleri.",
      intro: [
        "Üç kurgusal hastadan birini seçin ya da eGFR'yi ve antibiyotiği kendiniz değiştirin. Panel bütün reçeteye bakar: böbrek, karaciğer ve QTc değeri, motorun bulgusu ve dayandığı standart.",
      ],
    },
    logic: {
      label: "Karar mantığı",
      title: "Reçeteden kayda altı adım.",
      intro:
        "Veri standart kaynaklardan alınır, sürümlü kurallarla değerlendirilir ve sonuç gerekçesiyle hekime gösterilir. Hiçbir adımda olasılıksal tahmin kullanılmaz.",
      steps: [
        {
          title: "Veri alımı",
          body: "Hasta, ilaç istemi, laboratuvar, tanı ve alerji bilgisi HL7 FHIR R4 kaynakları olarak alınır.",
        },
        {
          title: "Eşleştirme",
          body: "Etken madde, doz, birim ve uygulama yolu ortak kodlara çevrilir. Eksik bilgi işaretlenir, atlanmaz.",
        },
        {
          title: "Kural değerlendirmesi",
          body: `Reçete ${metrics.safetyPlanes} güvenlik düzleminde sürümlü kurallarla kontrol edilir. Tasarım hedefi: aynı girdi ve aynı kural sürümü her zaman aynı sonucu verir.`,
        },
        {
          title: "Bulgu ve gerekçe",
          body: "Bulgu şiddet düzeyiyle birlikte gösterilir: hangi kural, hangi değer, hangi eşik.",
        },
        {
          title: "Hekim kararı",
          body: "Son karar hekimindir. Uyarıyı kabul etmek, düzeltmek ya da gerekçe yazıp geçmek kayda geçer.",
        },
        {
          title: "Kayıt",
          body: "Hekimin kararı kullanıcı, rol ve zamanla sıra numaralı denetim kaydına yazılır.",
        },
      ],
      planesTitle: `Dört başlık altında ${metrics.safetyPlanes} kontrol`,
      planesBody:
        "Her kontrolün kendi sürümü ve testi var. Eşik değerleri kurumun politikasına göre ayarlanabilir. Bağlantılı kontrollerin formülü ve kaynağı standart sayfasındadır.",
      show: (n) => `${n} kontrolü göster`,
    },
    qt: {
      label: "QT simülatörü",
      title: "İki ilaç seçin, skoru kural motoru hesaplasın.",
      intro:
        "Ölçülen QTc ve hastanın risk faktörleri Tisdale skoruna (0–21 puan) dönüştürülür; her puanın hangi faktörden geldiği yanında görünür. Araç, ilaç çiftinin QTc'yi kaç milisaniye uzatacağını tahmin etmez.",
      compareTitle: "İki araç neyi gösterir",
      compare: [
        { tool: "Örnek vaka", body: "Bütün reçete: üç organ değeri, motorun bulgusu ve dayandığı standart." },
        { tool: "QT simülatörü", body: "Tek kontrol: seçilen iki ilaç ve risk faktörleriyle Tisdale puan dökümü ve FHIR R4 çıktısı." },
      ],
    },
    evidence: {
      label: "Kanıt",
      title: "Kanıt düzeyi ve bugünkü durum.",
      intro:
        "Sayfadaki her sayı farklı bir kanıt düzeyine ait. Kod testi ve sentetik kural doğrulaması var. Klinik kanıt henüz yok ve sentetik doğrulama onun yerine geçmez.",
      levels: [
        {
          title: "Yazılım ve kod",
          status: "Var",
          body: `${testsNote("tr")} Bu düzey yazılımın tanımlandığı gibi çalıştığını gösterir, klinik doğruluğu göstermez.`,
          rows: [
            { label: "Otomatik test", value: testsLabel("tr") },
            { label: "Veri modeli", value: "HL7 FHIR R4 kaynakları" },
          ],
        },
        {
          title: "Sentetik kural doğrulaması",
          status: "Devam ediyor",
          body: "Kurallar kaynağından ayrıştırıldı ve sentetik hasta profillerinde beklenen sonucu verip vermediği denendi. Gerçek hasta verisiyle denenmedi.",
          rows: [
            { label: "Doğrulanan kural", value: String(metrics.verifiedRules) },
            { label: "Gerçek veri", value: "Henüz yok" },
          ],
        },
        {
          title: "Klinik kanıt",
          status: "Henüz yok",
          body: "Klinik performans ölçülmedi. Duyarlılık, özgüllük ve pozitif prediktif değer, etik kurul onaylı bir geçmiş vaka çalışmasıyla ölçülecek.",
          rows: [
            { label: "Vaka çalışması", value: "Planlandı" },
            { label: "Hastane pilotu", value: "Bekliyor" },
          ],
        },
      ],
      claimsTitle: "Sayfadaki sayılar ne anlama geliyor",
      claimsMeta: "altı sayının neyi gösterdiği, neyi göstermediği",
      claimColumns: { claim: "Sayı", shows: "Neyi gösterir", notShows: "Neyi göstermez" },
      claims: [
        {
          value: String(metrics.safetyPlanes),
          label: "Güvenlik düzlemi",
          shows: "Kural motorundaki kontrol kategorisi sayısı.",
          notShows: "Her düzlemin hastada doğru sonuç verdiği.",
        },
        {
          value: testsLabel("tr"),
          label: "Otomatik test",
          shows: "Depoda bu kadar otomatik test tanımı olduğu.",
          notShows: "Testlerin bu sürümde geçtiği ya da klinik sonuç.",
        },
        {
          value: "FHIR R4",
          label: "Veri standardı",
          shows: "Veri modeli ve testlerin FHIR R4 kaynak yapılarını kullandığı.",
          notShows: "Bir hastane sistemine bağlantı. Pilot entegrasyonu yapılmadı.",
        },
        {
          value: String(metrics.verifiedRules),
          label: "Doğrulanmış kural",
          shows: "Sentetik hasta profillerinde beklenen sonucu veren kural sayısı.",
          notShows: "Gerçek hastada duyarlılık, özgüllük veya PPV.",
        },
        {
          value: trlLabel("tr"),
          label: "Teknoloji hazırlık seviyesi",
          shows: "Ekibin öz değerlendirmesine göre bileşenlerin laboratuvar ortamında denendiği.",
          notShows: "Bağımsız bir değerlendirme ya da klinik ortamda çalıştığı.",
        },
        {
          value: "Sınıf IIa",
          label: "MDR Kural 11",
          shows: "İzlediğimiz hedef sınıflandırma rotası.",
          notShows: "Sertifika, CE işareti veya onaylanmış kuruluş kararı.",
        },
      ],
    },
    regulation: {
      title: "Düzenleyici durum: MDR Sınıf IIa hedefi, CE işareti yok.",
      body: "PharmaDeux, ilaç tedavisi kararlarına bilgi sağladığı için AB Tıbbi Cihaz Yönetmeliği'nin (MDR) Ek VIII Kural 11'ine giriyor. Sınıf IIa bu kurala göre izlediğimiz hedef rotadır; kesinleşmiş bir sınıf ya da sertifika değildir. Sınıf, teknik dosya ve onaylanmış kuruluş değerlendirmesiyle kesinleşir. PharmaDeux piyasaya sunulmadı.",
      intendedUseLabel: "Kullanım amacı (taslak)",
      intendedUse:
        "PharmaDeux tedavi kararı vermez veya reçeteye müdahale etmez; farmakolojik risk göstergelerini ve kılavuz parametrelerini hekimin klinik değerlendirmesine sunar. Tanı koymaz ve hekimin kararının yerini almaz.",
      frameworksLabel: "Çerçeveler",
      frameworksMeta: "MDR, IEC 62304, ISO 14971, ISO 13485, IEC 62366-1",
      frameworks: [
        { code: "EU MDR 2017/745", scope: "Tıbbi cihaz yönetmeliği, Ek VIII Kural 11", status: "Hedef rota: Sınıf IIa" },
        { code: "IEC 62304", scope: "Tıbbi cihaz yazılımı yaşam döngüsü", status: "Tasarım girdisi" },
        { code: "ISO 14971", scope: "Tıbbi cihazlarda risk yönetimi", status: "Tasarım girdisi" },
        { code: "ISO 13485", scope: "Kalite yönetim sistemi", status: "Yol haritasında" },
        { code: "IEC 62366-1", scope: "Kullanılabilirlik mühendisliği", status: "Yol haritasında" },
      ],
      note: { before: "Ayrıntılar için", link: "Kalite ve MDR", after: "sayfasına bakabilirsiniz." },
    },
    integration: {
      label: "Entegrasyon",
      title: "Hastane bilgi sistemiyle entegrasyon.",
      intro:
        "Bu bölüm bilgi işlem ve biyomedikal ekipleri için: hangi protokolle bağlanır, kimlik nasıl doğrulanır, nerede çalışır, neyi kaydeder. Her grubun kabiliyetleri ve durumları başlığın altında açılır.",
      statusLabels: { code: "Kod düzeyinde mevcut", design: "Mimari tasarım", planned: "Planlandı" },
      statusMeaning: {
        code: "PharmaDeux deposunda var ve otomatik testlerle çalışıyor.",
        design: "Nasıl kurulacağı yazıldı; kodu henüz yok.",
        planned: "Yol haritasında; kod veya ayrıntılı tasarım yok.",
      },
      gap: "Kodda mevcut olan bir kabiliyet hastanede doğrulanmış sayılmaz. Hiçbir arayüz bugüne kadar bir hastane bilgi yönetim sistemine (HBYS) bağlanmadı. Hastane ortamındaki doğrulama pilotta, kurumun bilgi işlem ekibiyle yapılacak.",
      columns: { capability: "Kabiliyet", detail: "Ayrıntı", status: "Durum" },
      groups: [
        {
          title: "Protokoller",
          items: [
            { name: "FHIR R4 Bundle", detail: "Analiz için Bundle içe aktarılır, sonuç Bundle olarak dışa aktarılır.", status: "code" },
            { name: "Kodlama", detail: "ATC (ilaç), ICD-10 (tanı), UCUM (birim).", status: "code" },
            { name: "FHIR Subscription (rest-hook)", detail: "Yeni ilaç isteminde HBYS'nin PharmaDeux'yü kendiliğinden çağırması.", status: "planned" },
            { name: "HL7 v2 (MLLP)", detail: "FHIR'a geçmemiş sistemlerden mesaj alıp FHIR R4'e dönüştürmek.", status: "planned" },
          ],
        },
        {
          title: "Güvenlik ve yetkilendirme",
          items: [
            { name: "Rol tabanlı erişim", detail: "Hekim, klinik eczacı ve klinik denetçi rolleri; her rol yalnızca izin verilen veriyi görür.", status: "code" },
            { name: "OAuth 2.0 ve SMART on FHIR", detail: "Uygulamanın HBYS oturumundan başlatılması ve yetkilendirilmesi.", status: "planned" },
            { name: "mTLS", detail: "Sunucular arasında karşılıklı TLS.", status: "planned" },
          ],
        },
        {
          title: "Dağıtım",
          items: [
            { name: "Docker konteyner", detail: "Uygulama ve servisler konteyner olarak paketlendi.", status: "code" },
            { name: "İzole sanal makine", detail: "Kurum içinde ayrılmış bir sanal makinede çalışma.", status: "design" },
            { name: "İnternetsiz (air-gapped) ağ", detail: "Dış ağa çıkışı olmayan kurum ağında çalışma.", status: "planned" },
            { name: "Kuruma ayrılmış VPC", detail: "Bulutta yalnızca o kuruma ayrılmış izole ağ.", status: "planned" },
          ],
        },
        {
          title: "Kayıt ve izlenebilirlik",
          items: [
            { name: "Klinik denetim kaydı", detail: "Analiz, uyarı geçme ve dışa aktarım olayları kullanıcı, rol ve zamanla sıra numarasıyla yazılır. Analiz kaydı kural sürümünü taşır.", status: "code" },
            { name: "Dışa aktarım özeti", detail: "Dışa aktarılan kayıt kümesinin SHA-256 özeti.", status: "code" },
            { name: "Kayıt özeti zinciri", detail: "Her kaydın bir önceki kaydın özetini içermesi.", status: "design" },
            { name: "Syslog (RFC 5424)", detail: "Uygulama kayıtlarının kurumun merkezi log sistemine gönderilmesi.", status: "planned" },
          ],
        },
      ],
      note: "Hangi arayüzün kurumunuzda nasıl kurulacağı, pilot öncesi teknik keşifte bilgi işlem ekibinizle birlikte belirlenir. Resmî FHIR profilleri ve OpenAPI belgesi henüz yayımlanmadı.",
      standardLink: "FHIR R4 entegrasyonu referans sayfası",
      fhirTitle: "Örnek FHIR R4 yükü",
      fhirBody: "QT simülatöründe seçtiğiniz iki ilaç, QTc değeri ve Tisdale skoru bu Bundle'a dönüşür. Kurgusal veridir.",
    },
    protocol: {
      label: "Klinik doğrulama",
      title: "Kullanıma girmeden önce geçmiş vakalarla ölçülecek.",
      intro:
        "Ölçüm henüz başlamadı. Aşağıdaki beş faz bir plandır: ilki hazırlıkta, diğerleri planlandı. Performans, anonimleştirilmiş gerçek vakalarda sistemi görmeyen bağımsız bir uzman paneline karşı ölçülecek.",
      phases: [
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
      note: "Ortak kurumlar protokolün yazımına katılabilir. Veri ancak etik kurul onayı alındıktan ve veri işleme koşulları yazılı hâle getirildikten sonra kullanılabilir. Bugün onaylanmış bir etik kurul başvurusu veya imzalanmış bir klinik iş birliği yok.",
    },
    collab: {
      label: "İş birliği",
      title: "Klinik araştırma ve pilot için bize yazın.",
      intro:
        "Geçmiş vakalarla doğrulama çalışmasına katılabilecek klinik eczacılık ekipleri, hekimler ve araştırma hastaneleriyle görüşmek istiyoruz. İlk adım 15 dakikalık bir tanışma görüşmesidir ve bir taahhüt istemez.",
      modes: [
        { title: "Tanışma görüşmesi", body: "15 dakika. Kurumunuzun sorusunu ve PharmaDeux'nün bugünkü durumunu konuşuruz.", link: "15 dk tanışma görüşmesi" },
        { title: "Akademik ve klinik ortaklık", body: "Protokol yazımı, referans paneli ve ortak yayın için araştırma iş birliği.", link: "Ortaklık için yazın" },
        { title: "Pilot ve geçmiş vaka doğrulaması", body: "Kapsam ve veri koşulları bağlayıcı olmayan bir Niyet Mektubu (LOI) ile yazılır.", link: "Pilot başvurusu (LOI)" },
      ],
      audiencesTitle: "Kimlerle çalışmak istiyoruz",
      audiences: [
        "Klinik eczacılık ve ilaç güvenliği ekipleri",
        "Üniversite ve eğitim-araştırma hastaneleri",
        "Geçmiş veriyle doğrulama çalışması yapabilecek kurumlar",
      ],
      legal: "LavieuxLabs henüz şirketleşmedi. Niyet Mektubu (LOI) bağlayıcı değildir ve bir sözleşme yerine geçmez. Bir doğrulama çalışmasında sözleşmeyi hangi tarafın imzalayacağı ve veri işleme koşulları, gerekli taraflar ve yetkili hukuk danışmanlarıyla netleştirilir.",
      email: "E-posta:",
      noPatientData: "İlk görüşmede hasta verisi paylaşmanız gerekmez.",
    },
  },
  en: {
    crumbs: { home: "Home", products: "Projects", here: "PharmaDeux CDSS", aria: "Breadcrumb" },
    hero: {
      name: "PharmaDeux CDSS",
      title: "Clinical decision support software that checks medication safety while the prescription is written.",
      lead: "PharmaDeux checks a prescription against the patient's kidney and liver values, measured QTc and other medicines. Each alert comes with the rule and threshold that triggered it. The physician makes the final decision and can override an alert with a reason, which is written to the record.",
      primary: "15-minute intro call",
      secondary: "Review an example case",
      academic: "Write to us about a clinical research partnership",
      summaryTitle: "At a glance",
      summary: [
        { label: "Ownership", value: "A joint project of the LavieuxLabs team" },
        { label: "Stage", value: `Prototype. ${trlLabel("en")}, the team's self-assessment; no independent assessment.` },
        { label: "Software", value: `${testsLabel("en")} automated tests; ${metrics.verifiedRules} rules verified on synthetic patient profiles.` },
        { label: "Clinical evidence", value: "None yet. Validation on past cases is planned and has not started." },
        { label: "Regulatory status", value: "Targeting MDR Class IIa. No CE mark." },
        {
          label: "Development",
          value: `Step ${metrics.currentPhase}/${metrics.totalPhases}, version ${metrics.version}, updated ${formatDate("en", metrics.lastUpdated)}`,
        },
      ],
      onPage: "On this page",
    },
    sections: [
      { id: "problem", label: "Problem" },
      { id: "vakalar", label: "Example case" },
      { id: "mimari", label: "Decision logic" },
      { id: "simulator", label: "QT simulator" },
      { id: "dogrulama", label: "Evidence" },
      { id: "entegrasyon", label: "Integration" },
      { id: "protokol", label: "Clinical validation" },
      { id: "is-birligi", label: "Collaboration" },
    ],
    problem: {
      label: "Problem",
      title: "Tracking risk by hand in polypharmacy is hard.",
      intro:
        "Risk does not come only from two drugs interacting. The number of drugs, kidney and liver function, and the total burden on a single organ have to be assessed together.",
      items: [
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
      source:
        "The World Health Organization estimates the global annual cost of medication errors at about USD 42 billion (WHO, Medication Without Harm, 2017).",
    },
    cases: {
      label: "Example case",
      title: "What PharmaDeux shows for one case.",
      intro: [
        "Pick one of three fictional patients, or change the eGFR and the antibiotic yourself. The panel looks at the whole prescription: kidney, liver and QTc values, the engine's finding and the standard behind it.",
      ],
    },
    logic: {
      label: "Decision logic",
      title: "Six steps from prescription to record.",
      intro:
        "Data comes in as standard resources, is assessed by versioned rules, and the result is shown to the physician with its reason. No step uses probabilistic prediction.",
      steps: [
        {
          title: "Data intake",
          body: "Patient, medication order, laboratory, diagnosis and allergy data arrive as HL7 FHIR R4 resources.",
        },
        {
          title: "Mapping",
          body: "Active substance, dose, unit and route are mapped to shared codes. Missing information is flagged, not skipped.",
        },
        {
          title: "Rule assessment",
          body: `The prescription is checked against versioned rules across ${metrics.safetyPlanes} safety planes. Design goal: the same input and the same rule version always give the same result.`,
        },
        {
          title: "Finding and reason",
          body: "A finding is shown with its severity: which rule, which value, which threshold.",
        },
        {
          title: "Physician decision",
          body: "The physician decides. Whether they accept the alert, change the order or override it with a reason, the choice is recorded.",
        },
        {
          title: "Record",
          body: "The physician's decision is written to a sequence-numbered audit log with the user, role and time.",
        },
      ],
      planesTitle: `${metrics.safetyPlanes} checks under four headings`,
      planesBody:
        "Each check has its own version and tests. Thresholds can be set to match the institution's policy. Linked checks have a reference page with the formula and source.",
      show: (n) => `Show ${n} checks`,
    },
    qt: {
      label: "QT simulator",
      title: "Pick two drugs and let the rule engine score them.",
      intro:
        "The measured QTc and the patient's risk factors are turned into the Tisdale score (0–21 points), and each point shows the factor it comes from. The tool does not predict how many milliseconds a drug pair will add to the QTc.",
      compareTitle: "What each tool shows",
      compare: [
        { tool: "Example case", body: "The whole prescription: three organ values, the engine's finding and the standard behind it." },
        { tool: "QT simulator", body: "One check: the Tisdale point breakdown for two chosen drugs and risk factors, and its FHIR R4 output." },
      ],
    },
    evidence: {
      label: "Evidence",
      title: "Level of evidence and where it stands.",
      intro:
        "Each number on this page belongs to a different level of evidence. There are code tests and synthetic rule verification. There is no clinical evidence yet, and synthetic verification does not stand in for it.",
      levels: [
        {
          title: "Software and code",
          status: "In place",
          body: `${testsNote("en")} This level shows that the software works as specified, not that it is clinically correct.`,
          rows: [
            { label: "Automated tests", value: testsLabel("en") },
            { label: "Data model", value: "HL7 FHIR R4 resources" },
          ],
        },
        {
          title: "Synthetic rule verification",
          status: "Ongoing",
          body: "Rules were parsed from their sources and tried on synthetic patient profiles for the expected result. They have not been tried on real patient data.",
          rows: [
            { label: "Verified rules", value: String(metrics.verifiedRules) },
            { label: "Real data", value: "Not yet" },
          ],
        },
        {
          title: "Clinical evidence",
          status: "None yet",
          body: "Clinical performance has not been measured. Sensitivity, specificity and positive predictive value will be measured in an ethics-approved study on past cases.",
          rows: [
            { label: "Case study", value: "Planned" },
            { label: "Hospital pilot", value: "Pending" },
          ],
        },
      ],
      claimsTitle: "What the numbers on this page mean",
      claimsMeta: "what six numbers show and do not show",
      claimColumns: { claim: "Number", shows: "What it shows", notShows: "What it does not show" },
      claims: [
        {
          value: String(metrics.safetyPlanes),
          label: "Safety planes",
          shows: "The number of check categories in the rule engine.",
          notShows: "That each plane gives the right result for a patient.",
        },
        {
          value: testsLabel("en"),
          label: "Automated tests",
          shows: "That the repository defines this many automated tests.",
          notShows: "That the tests pass on this release, or any clinical outcome.",
        },
        {
          value: "FHIR R4",
          label: "Data standard",
          shows: "That the data model and tests use FHIR R4 resource structures.",
          notShows: "A connection to a hospital system. No pilot integration has been done.",
        },
        {
          value: String(metrics.verifiedRules),
          label: "Verified rules",
          shows: "The number of rules that give the expected result on synthetic patient profiles.",
          notShows: "Sensitivity, specificity or PPV on real patients.",
        },
        {
          value: trlLabel("en"),
          label: "Technology readiness level",
          shows: "In the team's self-assessment, that components have been tried in a laboratory setting.",
          notShows: "An independent assessment, or that it works in a clinical setting.",
        },
        {
          value: "Class IIa",
          label: "MDR Rule 11",
          shows: "The target classification route we follow.",
          notShows: "A certificate, a CE mark or a notified body decision.",
        },
      ],
    },
    regulation: {
      title: "Regulatory status: targeting MDR Class IIa, no CE mark.",
      body: "PharmaDeux provides information used in drug therapy decisions, so it falls under Annex VIII Rule 11 of the EU Medical Device Regulation (MDR). Class IIa is the target route we follow under this rule. It is not a confirmed class or a certificate. The class is confirmed through the technical file and a notified body assessment. PharmaDeux is not on the market.",
      intendedUseLabel: "Intended use (draft)",
      intendedUse:
        "PharmaDeux does not make treatment decisions or intervene in a prescription. It presents pharmacological risk indicators and guideline parameters for the physician's clinical assessment. It does not diagnose or replace the physician's decision.",
      frameworksLabel: "Frameworks",
      frameworksMeta: "MDR, IEC 62304, ISO 14971, ISO 13485, IEC 62366-1",
      frameworks: [
        { code: "EU MDR 2017/745", scope: "Medical Device Regulation, Annex VIII Rule 11", status: "Target route: Class IIa" },
        { code: "IEC 62304", scope: "Medical device software life cycle", status: "Design input" },
        { code: "ISO 14971", scope: "Risk management for medical devices", status: "Design input" },
        { code: "ISO 13485", scope: "Quality management system", status: "On the roadmap" },
        { code: "IEC 62366-1", scope: "Usability engineering", status: "On the roadmap" },
      ],
      note: { before: "For details, see", link: "Quality and MDR", after: "." },
    },
    integration: {
      label: "Integration",
      title: "Integration with the hospital information system.",
      intro:
        "This section is for IT and biomedical engineering teams: how it connects, how clients are authenticated, where it runs and what it logs. Each group opens to its capabilities and their status.",
      statusLabels: { code: "In the code", design: "Architecture design", planned: "Planned" },
      statusMeaning: {
        code: "In the PharmaDeux repository and running under automated tests.",
        design: "How it will be set up is written down; there is no code yet.",
        planned: "On the roadmap; no code or detailed design yet.",
      },
      gap: "A capability that exists in the code has not been validated in a hospital. No interface has been connected to a hospital information system so far. Validation in a hospital setting will happen in a pilot, with the institution's IT team.",
      columns: { capability: "Capability", detail: "Detail", status: "Status" },
      groups: [
        {
          title: "Protocols",
          items: [
            { name: "FHIR R4 Bundle", detail: "A Bundle is imported for analysis and the result is exported as a Bundle.", status: "code" },
            { name: "Coding", detail: "ATC (medicines), ICD-10 (diagnoses), UCUM (units).", status: "code" },
            { name: "FHIR Subscription (rest-hook)", detail: "The hospital system calling PharmaDeux on its own when a new order is placed.", status: "planned" },
            { name: "HL7 v2 (MLLP)", detail: "Receiving messages from systems not yet on FHIR and converting them to FHIR R4.", status: "planned" },
          ],
        },
        {
          title: "Security and authorisation",
          items: [
            { name: "Role-based access", detail: "Physician, clinical pharmacist and clinical auditor roles; each role sees only the data it is allowed to.", status: "code" },
            { name: "OAuth 2.0 and SMART on FHIR", detail: "Launching and authorising the app from the hospital system's session.", status: "planned" },
            { name: "mTLS", detail: "Mutual TLS between servers.", status: "planned" },
          ],
        },
        {
          title: "Deployment",
          items: [
            { name: "Docker container", detail: "The application and its services are packaged as containers.", status: "code" },
            { name: "Isolated virtual machine", detail: "Running on a dedicated virtual machine inside the institution.", status: "design" },
            { name: "Air-gapped network", detail: "Running on an institutional network with no outside access.", status: "planned" },
            { name: "Dedicated VPC", detail: "An isolated cloud network reserved for one institution.", status: "planned" },
          ],
        },
        {
          title: "Logging and traceability",
          items: [
            { name: "Clinical audit log", detail: "Analysis, override and export events are written with user, role and time under a sequence number. The analysis record carries the rule version.", status: "code" },
            { name: "Export digest", detail: "A SHA-256 digest of the exported set of entries.", status: "code" },
            { name: "Per-entry digest chain", detail: "Each entry carrying the digest of the one before it.", status: "design" },
            { name: "Syslog (RFC 5424)", detail: "Sending application logs to the institution's central log system.", status: "planned" },
          ],
        },
      ],
      note: "Which interface is set up at your institution, and how, is agreed with your IT team during pre-pilot technical discovery. Official FHIR profiles and the OpenAPI document have not been published yet.",
      standardLink: "FHIR R4 integration reference page",
      fhirTitle: "Example FHIR R4 payload",
      fhirBody: "The two drugs, the QTc value and the Tisdale score you choose in the QT simulator become this Bundle. Fictional data.",
    },
    protocol: {
      label: "Clinical validation",
      title: "It will be measured on past cases before anyone uses it.",
      intro:
        "Measurement has not started. The five phases below are a plan: the first is in preparation, the rest are planned. Performance will be measured on anonymised real cases against an independent panel of experts who do not see the system.",
      phases: [
        {
          phase: "Phase 0",
          title: "Protocol and ethics committee",
          body: "Primary and secondary endpoints and the data management plan are written, and the ethics application is submitted.",
          status: "In preparation",
        },
        {
          phase: "Phase 1",
          title: "Historical data",
          body: "Anonymised past prescription and laboratory data are obtained from the partner institution in line with KVKK (Turkey's personal data protection law).",
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
      note: "Partner institutions can take part in writing the protocol. Data can be used only after ethics committee approval and once the data processing terms are in writing. Today there is no approved ethics application and no signed clinical collaboration.",
    },
    collab: {
      label: "Collaboration",
      title: "Write to us about clinical research and pilots.",
      intro:
        "We would like to talk with clinical pharmacy teams, physicians and research hospitals that could take part in a validation study on past cases. The first step is a 15-minute intro call, with no commitment.",
      modes: [
        { title: "Intro call", body: "15 minutes. We talk about your institution's question and where PharmaDeux stands today.", link: "15-minute intro call" },
        { title: "Academic and clinical partnership", body: "Research collaboration on protocol writing, the reference panel and joint publication.", link: "Write about a partnership" },
        { title: "Pilot and validation on past cases", body: "Scope and data conditions are written in a non-binding Letter of Intent (LOI).", link: "Apply for a pilot (LOI)" },
      ],
      audiencesTitle: "Who we would like to work with",
      audiences: [
        "Clinical pharmacy and medication safety teams",
        "University and training-and-research hospitals",
        "Institutions able to run a validation study on historical data",
      ],
      legal: "LavieuxLabs is not incorporated yet. A Letter of Intent (LOI) is non-binding and does not replace an agreement. For a validation study, which party signs the agreement and the data processing terms are settled with the parties involved and their authorised legal advisers.",
      email: "Email:",
      noPatientData: "You do not need to share patient data in the first conversation.",
    },
  },
});

const STATUSES: Status[] = ["code", "design", "planned"];

export default function PharmaDeuxView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);
  const groups = safetyPlaneGroups(locale);
  const offsets = groups.map((_, gi) => groups.slice(0, gi).reduce((n, g) => n + g.planes.length, 0));

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      <JsonLd data={pharmaDeuxJsonLd(locale)} />

      {/* Hero: what it is, who builds it, where it stands, and the first two ways in. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-8 px-4 pt-6 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:grid-cols-12 lg:gap-y-10 lg:px-8">
          <nav aria-label={c.crumbs.aria} className="lg:col-span-12">
            <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
              <li>
                <Link href={href("/")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.crumbs.home}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li>
                <Link href={href("/#platformlar")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.crumbs.products}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li aria-current="page" className="text-ink-2" lang="en">
                {c.crumbs.here}
              </li>
            </ol>
          </nav>

          <div className="lg:col-span-8">
            <p className="flex items-center gap-2.5">
              <Pill className="h-5 w-5 shrink-0 text-ink" strokeWidth={1.6} aria-hidden="true" />
              <span className="font-serif text-[20px] font-medium text-teal-700" lang="en">
                {c.hero.name}
              </span>
            </p>
            <h1
              id="hero-title"
              className="mt-3 max-w-[22ch] font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:mt-4 sm:text-[46px] lg:text-[54px]"
            >
              {c.hero.title}
            </h1>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.6] text-ink-2">{c.hero.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center print:hidden">
              <Link href={href(contactHref("intro", "pharmadeux"))} className={BUTTON}>
                {c.hero.primary}
              </Link>
              <a href="#vakalar" className={BUTTON_OUTLINE}>
                {c.hero.secondary}
              </a>
            </div>
            <Link href={href(contactHref("academic"))} className={`mt-2 print:hidden ${TEXT_ACTION}`}>
              {c.hero.academic}
            </Link>
          </div>

          <aside aria-labelledby="hero-summary" className="self-end border-t-2 border-ink pt-4 lg:col-span-4">
            <h2 id="hero-summary" className="font-serif text-[20px] font-semibold text-ink">
              {c.hero.summaryTitle}
            </h2>
            <dl className="mt-3 divide-y divide-rule border-t border-rule">
              {c.hero.summary.map((r) => (
                <div key={r.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                  <dt className="text-[13px] text-ink-3">{r.label}</dt>
                  <dd className="text-[14px] leading-snug text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <nav aria-label={c.hero.onPage} className="border-t border-rule pt-4 lg:col-span-12 print:hidden">
            <p className="font-serif text-[15px] text-ink-3">{c.hero.onPage}</p>
            <ul className="mt-1 flex flex-wrap gap-x-6">
              {c.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`inline-flex min-h-11 items-center text-[15px] text-ink-2 hover:text-ink ${LINK}`}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Problem: four problems in prose next to the pairwise figure. */}
      <PaperSection id="problem" label={c.problem.label} title={c.problem.title} intro={<p>{c.problem.intro}</p>}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {c.problem.items.map((p) => (
                <div key={p.title} className="border-t border-ink pt-4">
                  <dt className="text-[17px] font-semibold text-ink">{p.title}</dt>
                  <dd className="mt-2 text-[15px] leading-[1.6] text-ink-2">{p.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-[62ch] text-[14px] leading-relaxed text-ink-3">{c.problem.source}</p>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <PairwiseFigure locale={locale} />
          </div>
        </div>
      </PaperSection>

      {/* Example case: one case at the centre, on a dark workspace. #vakalar is the workspace itself (deep links). */}
      <section aria-labelledby="cases-title" className="border-t border-rule bg-paper-band">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-x-10 gap-y-3 lg:grid-cols-12">
            <p className="font-serif text-[17px] text-ink-3 lg:col-span-3 lg:pt-2">{c.cases.label}</p>
            <div className="lg:col-span-9">
              <h2 id="cases-title" className="max-w-[26ch] font-serif text-[30px] leading-[1.1] font-medium tracking-[-0.015em] text-ink sm:text-[40px]">
                {c.cases.title}
              </h2>
              <div className="mt-4 max-w-[64ch] space-y-3 text-[17px] leading-[1.65] text-ink-2">
                {c.cases.intro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-12">
            <PharmaCapsule locale={locale} layout="workspace" />
          </div>
        </div>
      </section>

      {/* Decision logic: the six steps (a real sequence, so numbered) and the safety planes, grouped. */}
      <PaperSection id="mimari" label={c.logic.label} title={c.logic.title} intro={<p>{c.logic.intro}</p>}>
        <div className="grid gap-12 lg:grid-cols-12">
          <ol className="space-y-6 lg:col-span-5">
            {c.logic.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-4">
                <span aria-hidden="true" className="font-serif text-[30px] leading-none text-ink-3 tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-[15px] leading-[1.6] text-ink-2">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="min-w-0 lg:col-span-7">
            <h3 className="font-serif text-[24px] leading-tight font-medium text-ink">{c.logic.planesTitle}</h3>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.6] text-ink-2">{c.logic.planesBody}</p>
            <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {groups.map((group, gi) => (
                <div key={group.title} className="border-t border-ink pt-4 pb-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-[17px] font-semibold text-ink">{group.title}</h4>
                    <span className="font-mono text-[14px] text-ink-3 tabular-nums">{group.planes.length}</span>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-2">{group.summary}</p>
                  <div className="mt-2">
                  <Disclosure summary={c.logic.show(group.planes.length)}>
                    <ul className="divide-y divide-rule border-y border-rule">
                      {group.planes.map((plane, pi) => {
                        const name = typeof plane === "string" ? plane : plane.name;
                        return (
                          <li key={name} className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline gap-2 py-2">
                            <span className="font-mono text-[12px] text-ink-3 tabular-nums">P{String(offsets[gi] + pi + 1).padStart(2, "0")}</span>
                            {typeof plane === "string" ? (
                              <span className="text-[14px] text-ink">{name}</span>
                            ) : (
                              <Link href={href(plane.href)} className={`-my-2 inline-block py-2 text-[14px] text-ink ${LINK}`}>
                                {name}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </Disclosure>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PaperSection>

      {/* QT/Tisdale simulator: one check, separated from the case panel above in words, not only in place. */}
      <PaperSection id="simulator" label={c.qt.label} title={c.qt.title} intro={<p>{c.qt.intro}</p>} band>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-[20px] font-medium text-ink">{c.qt.compareTitle}</h3>
            <dl className="mt-3 divide-y divide-rule border-y border-rule">
              {c.qt.compare.map((x) => (
                <div key={x.tool} className="py-3">
                  <dt className="text-[15px] font-semibold text-ink">{x.tool}</dt>
                  <dd className="mt-1 text-[14px] leading-[1.55] text-ink-2">{x.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="panel-dark min-w-0 [color-scheme:dark] lg:col-span-8">
            <QtSimulator locale={locale} />
          </div>
        </div>
      </PaperSection>

      {/* Evidence: three levels, the meaning of each headline number, and the regulatory status. */}
      <PaperSection id="dogrulama" label={c.evidence.label} title={c.evidence.title} intro={<p>{c.evidence.intro}</p>}>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {c.evidence.levels.map((level) => (
            <li key={level.title} className="flex flex-col border-t-2 border-ink pt-5">
              <h3 className="font-serif text-[24px] leading-tight font-medium text-ink">{level.title}</h3>
              <p className="mt-1 text-[15px] font-medium text-ink">{level.status}</p>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">{level.body}</p>
              <div className="mt-4 md:mt-auto md:pt-4">
                <FactRows rows={level.rows} labelWidth="sm:grid-cols-[130px_minmax(0,1fr)]" />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <Disclosure summary={c.evidence.claimsTitle} meta={c.evidence.claimsMeta}>
            <table className="hidden w-full border-collapse text-left text-[15px] md:table">
              <thead>
                <tr className="border-b border-ink text-[13px] text-ink-3">
                  <th scope="col" className="w-[22%] py-2.5 pr-4 font-medium">{c.evidence.claimColumns.claim}</th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">{c.evidence.claimColumns.shows}</th>
                  <th scope="col" className="py-2.5 font-medium">{c.evidence.claimColumns.notShows}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule border-b border-rule">
                {c.evidence.claims.map((claim) => (
                  <tr key={claim.label} className="align-top">
                    <th scope="row" className="py-3.5 pr-4 text-left font-normal">
                      <span className={`block text-ink ${/^\d/.test(claim.value) ? "font-mono tabular-nums" : "font-medium"}`}>{claim.value}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-3">{claim.label}</span>
                    </th>
                    <td className="py-3.5 pr-4 leading-snug text-ink">{claim.shows}</td>
                    <td className="py-3.5 leading-snug text-ink-2">{claim.notShows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="divide-y divide-rule border-y border-rule md:hidden">
              {c.evidence.claims.map((claim) => (
                <li key={claim.label} className="py-4">
                  <p>
                    <span className={`text-ink ${/^\d/.test(claim.value) ? "font-mono tabular-nums" : "font-medium"}`}>{claim.value}</span>{" "}
                    <span className="text-[14px] text-ink-3">{claim.label}</span>
                  </p>
                  <p className="mt-2 text-[13px] text-ink-3">{c.evidence.claimColumns.shows}</p>
                  <p className="text-[15px] leading-snug text-ink">{claim.shows}</p>
                  <p className="mt-2 text-[13px] text-ink-3">{c.evidence.claimColumns.notShows}</p>
                  <p className="text-[15px] leading-snug text-ink-2">{claim.notShows}</p>
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>

        <div id="regulasyon" className="mt-12 grid scroll-mt-20 gap-8 border-t border-rule pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h3 className="font-serif text-[26px] leading-tight font-medium text-ink">{c.regulation.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-ink-2">{c.regulation.body}</p>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <div className="border-l-2 border-ink pl-4">
              <p className="text-[13px] text-ink-3">{c.regulation.intendedUseLabel}</p>
              <p className="mt-1 text-[15px] leading-[1.6] text-ink">{c.regulation.intendedUse}</p>
            </div>
            <div className="mt-4">
              <Disclosure summary={c.regulation.frameworksLabel} meta={c.regulation.frameworksMeta}>
                <dl className="divide-y divide-rule border-y border-rule">
                  {c.regulation.frameworks.map((f) => (
                    <div key={f.code} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
                      <dt>
                        <span className="block text-[15px] font-medium text-ink">{f.code}</span>
                        <span className="block text-[13px] leading-snug text-ink-3">{f.scope}</span>
                      </dt>
                      <dd className="text-[14px] text-ink-2 sm:text-right">{f.status}</dd>
                    </div>
                  ))}
                </dl>
              </Disclosure>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-3">
              {c.regulation.note.before}{" "}
              <Link href={href("/legal/quality")} className={`text-ink-2 ${LINK}`}>
                {c.regulation.note.link}
              </Link>
              {locale === "tr" ? " " : ""}
              {c.regulation.note.after}
            </p>
          </div>
        </div>
      </PaperSection>

      {/* Integration, for IT teams: the status scale and the code/hospital gap stay visible; each group's
          capabilities open on demand, with their status counts shown on the closed summary. */}
      <PaperSection id="entegrasyon" label={c.integration.label} title={c.integration.title} intro={<p>{c.integration.intro}</p>} band>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <dl className="grid content-start gap-4 lg:col-span-4">
            {STATUSES.map((s) => (
              <div key={s} className="border-t border-ink pt-3">
                <dt className={`text-[15px] ${statusTone[s]}`}>{c.integration.statusLabels[s]}</dt>
                <dd className="mt-1 text-[14px] leading-[1.55] text-ink-2">{c.integration.statusMeaning[s]}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:col-span-8">
            <p className="border-l-2 border-ink pl-4 text-[17px] leading-[1.6] text-ink">{c.integration.gap}</p>
            <ul className="mt-8 border-t border-ink">
              {c.integration.groups.map((g) => (
                <li key={g.title} className="border-b border-rule py-1">
                  <Disclosure
                    summary={g.title}
                    meta={STATUSES.filter((s) => g.items.some((i) => i.status === s))
                      .map((s) => `${g.items.filter((i) => i.status === s).length} ${c.integration.statusLabels[s].toLocaleLowerCase(locale)}`)
                      .join(", ")}
                  >
                    <table className="mb-3 hidden w-full border-collapse text-left text-[15px] md:table">
                      <thead className="sr-only">
                        <tr>
                          <th scope="col">{c.integration.columns.capability}</th>
                          <th scope="col">{c.integration.columns.detail}</th>
                          <th scope="col">{c.integration.columns.status}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.items.map((item) => (
                          <tr key={item.name} className="border-t border-rule align-top">
                            <th scope="row" className="w-[30%] py-3 pr-4 text-left font-medium text-ink">{item.name}</th>
                            <td className="py-3 pr-4 leading-snug text-ink-2">{item.detail}</td>
                            <td className={`w-[24%] py-3 ${statusTone[item.status]}`}>{c.integration.statusLabels[item.status]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <ul className="mb-3 divide-y divide-rule border-t border-rule md:hidden">
                      {g.items.map((item) => (
                        <li key={item.name} className="py-3">
                          <p className="text-[15px] font-medium text-ink">{item.name}</p>
                          <p className={`mt-0.5 text-[14px] ${statusTone[item.status]}`}>{c.integration.statusLabels[item.status]}</p>
                          <p className="mt-1 text-[14px] leading-snug text-ink-2">{item.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </Disclosure>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] leading-[1.6] text-ink-2">{c.integration.note}</p>
            <Link href={href("/standartlar/fhir-r4-entegrasyonu")} className={`mt-1 ${TEXT_ACTION}`}>
              {c.integration.standardLink}
            </Link>
          </div>
        </div>

        <div id="fhir-onizleme" className="mt-12 grid scroll-mt-20 gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-[20px] font-medium text-ink">{c.integration.fhirTitle}</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">{c.integration.fhirBody}</p>
          </div>
          <div className="panel-dark min-w-0 [color-scheme:dark] lg:col-span-8">
            <FhirPreview locale={locale} />
          </div>
        </div>
      </PaperSection>

      {/* Clinical validation plan: a plan, written as one; no phase is described as done. */}
      <PaperSection id="protokol" label={c.protocol.label} title={c.protocol.title} intro={<p>{c.protocol.intro}</p>}>
        <ol className="divide-y divide-rule border-y border-rule">
          {c.protocol.phases.map((p) => (
            <li key={p.phase} className="grid gap-1 py-4 sm:grid-cols-[120px_minmax(0,1fr)_140px] sm:items-baseline sm:gap-6">
              <span className="font-serif text-[17px] text-ink-3">{p.phase}</span>
              <div>
                <h3 className="text-[17px] font-semibold text-ink">{p.title}</h3>
                <p className="mt-1 text-[15px] leading-[1.6] text-ink-2">{p.body}</p>
              </div>
              <span className="text-[14px] text-ink-2 sm:text-right">{p.status}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.6] text-ink-2">{c.protocol.note}</p>
      </PaperSection>

      {/* Collaboration: three ways in; the intro call is the default first step. */}
      <PaperSection id="is-birligi" label={c.collab.label} title={c.collab.title} intro={<p>{c.collab.intro}</p>} band>
        <div className="grid gap-8 md:grid-cols-3">
          {c.collab.modes.map((mode, i) => (
            <div key={mode.title} className="flex flex-col border-t-2 border-ink pt-5">
              <h3 className="font-serif text-[24px] leading-tight font-medium text-ink">{mode.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">{mode.body}</p>
              <Link
                href={href(i === 0 ? contactHref("intro", "pharmadeux") : i === 1 ? contactHref("academic") : contactHref("pilot", "pharmadeux"))}
                className={`mt-3 self-start md:mt-auto md:pt-3 ${TEXT_ACTION}`}
              >
                {mode.link}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[70ch] border-l-2 border-ink pl-4 text-[15px] leading-[1.6] text-ink">{c.collab.legal}</p>
        <div className="mt-10 grid gap-8 border-t border-rule pt-8 md:mt-14 md:grid-cols-2 md:gap-12 md:pt-10">
          <div>
            <h3 className="text-[17px] font-semibold text-ink">{c.collab.audiencesTitle}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.55] text-ink-2 marker:text-ink-3">
              {c.collab.audiences.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-2">
              {c.collab.email}
              <CopyEmail locale={locale} tone="paper" className="min-h-11 text-ink" />
            </p>
            <p className="text-[14px] text-ink-3">{c.collab.noPatientData}</p>
          </div>
        </div>
      </PaperSection>
    </main>
  );
}
