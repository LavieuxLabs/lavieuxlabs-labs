import type { Metadata } from "next";
import LegalDocument, { type LegalSection } from "@/components/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kalite, Bilgi Güvenliği ve MDR Standartları",
  description:
    "LavieuxLabs ürün geliştirme süreçlerinde referans alınan kalite yönetimi, bilgi güvenliği ve tıbbi cihaz mevzuatı çerçevesi.",
};

const frameworks = [
  [
    "EU MDR 2017/745",
    "Tıbbi cihaz yönetmeliği; Ek VIII Kural 11 kapsamında yazılım sınıflandırması",
    "PharmaDeux için Sınıf IIa hedefi",
  ],
  ["Tıbbi Cihaz Yönetmeliği (TİTCK)", "MDR ile uyumlaştırılmış ulusal düzenleme", "Referans çerçeve"],
  ["IEC 62304", "Tıbbi cihaz yazılımı yaşam döngüsü süreçleri", "Mimari uyum"],
  ["ISO 14971", "Tıbbi cihazlar için risk yönetimi", "Mimari uyum"],
  ["ISO 13485", "Tıbbi cihaz kalite yönetim sistemi", "Yol haritasında"],
  ["IEC 62366-1", "Kullanılabilirlik mühendisliği", "Yol haritasında"],
  ["ISO/IEC 27001", "Bilgi güvenliği yönetim sistemi", "Kontrol setine uyum hedefi"],
  ["HL7 FHIR R4", "Sağlık verisi birlikte çalışabilirlik standardı", "Uygulamada"],
];

const sections: LegalSection[] = [
  {
    id: "durum",
    title: "Düzenleyici durum beyanı",
    content: (
      <>
        <p className="note">
          <strong>PharmaDeux CDSS ve Shield geliştirme aşamasındadır.</strong> Ürünlerimiz henüz CE işareti taşımamakta
          ve piyasaya arz edilmemiş olup, klinik ortamda yalnızca etik kurul onaylı araştırma protokolleri kapsamında
          kullanılabilir. Bu sayfada yer alan standartlar, geliştirme süreçlerimizde referans alınan çerçeveyi ifade
          eder; ayrıca belirtilmedikçe bir sertifikasyon beyanı değildir.
        </p>
      </>
    ),
  },
  {
    id: "cerceve",
    title: "Referans alınan standartlar",
    content: (
      <>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Standart / mevzuat</th>
                <th>Kapsam</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {frameworks.map(([code, scope, status]) => (
                <tr key={code}>
                  <td className="font-mono text-xs whitespace-nowrap text-white/85">{code}</td>
                  <td>{scope}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Mimari uyum:</strong> Süreç ve dokümantasyon, standardın gerekliliklerine göre kurgulanmaktadır.{" "}
          <strong>Yol haritasında:</strong> Uygulama ve belgelendirme, ürünün düzenleyici yol haritasında planlanmıştır.
        </p>
      </>
    ),
  },
  {
    id: "mdr",
    title: "MDR ve yazılımın tıbbi cihaz olarak konumlandırılması",
    content: (
      <>
        <p>
          PharmaDeux, ilaç tedavisine ilişkin kararları bilgilendirmek amacıyla bilgi sağlayan bir yazılım olarak, MDR
          Ek VIII Kural 11 kapsamında Sınıf IIa tıbbi cihaz yazılımı (SaMD) hedefiyle tasarlanmaktadır. Bu kapsamda:
        </p>
        <ul>
          <li>Kullanım amacı, hedef kullanıcı ve hedef hasta popülasyonu yazılı olarak tanımlanır,</li>
          <li>
            Klinik değerlendirme; literatür, retrospektif doğrulama ve gerektiğinde prospektif çalışmalarla desteklenir,
          </li>
          <li>Risk yönetimi, tasarımın tüm aşamalarında ISO 14971 yaklaşımıyla yürütülür,</li>
          <li>Piyasaya arz sonrası gözetim (PMS) ve olay bildirim süreçleri ürünle birlikte planlanır.</li>
        </ul>
        <p>
          Shield, klinik tanı veya tedavi kararı üretmeyen; geri ödeme ve provizyon süreçlerini destekleyen operasyonel
          bir platform olarak tasarlanmıştır. Düzenleyici sınıflandırması, nihai kullanım amacına göre değerlendirilir.
        </p>
      </>
    ),
  },
  {
    id: "kalite",
    title: "Kalite yönetimi ilkeleri",
    content: (
      <ul>
        <li>
          <strong>İzlenebilirlik:</strong> Her gereksinim; tasarım öğesine, uygulamaya ve doğrulama testine bağlanır.
        </li>
        <li>
          <strong>Doğrulama:</strong> Yazılım değişiklikleri otomatik birim ve entegrasyon testlerinden geçmeden yayına
          alınmaz. PharmaDeux test kümesi 2.480’den fazla otomatik testten oluşur.
        </li>
        <li>
          <strong>Değişiklik kontrolü:</strong> Kural setleri ve bilgi tabanı sürümlenir; her değişiklik gözden
          geçirilir ve kayıt altına alınır.
        </li>
        <li>
          <strong>Deterministik davranış:</strong> Klinik ve operasyonel karar yolunda üretken veya olasılıksal modeller
          kullanılmaz; aynı girdi aynı kural sürümüyle her zaman aynı çıktıyı üretir.
        </li>
        <li>
          <strong>İnsan denetimi:</strong> Sistemler öneri ve risk sinyali üretir; nihai karar yetkili kullanıcıya
          aittir.
        </li>
      </ul>
    ),
  },
  {
    id: "bilgi-guvenligi",
    title: "Bilgi güvenliği",
    content: (
      <>
        <p>Platform mimarimiz aşağıdaki güvenlik ilkeleri üzerine kurgulanır:</p>
        <ul>
          <li>Rol tabanlı erişim kontrolü (RBAC) ve en az yetki ilkesi,</li>
          <li>Multi-tenant mimaride kurum verilerinin mantıksal olarak izolasyonu,</li>
          <li>
            Kararların ve kullanıcı işlemlerinin yalnızca eklenebilir (append-only) denetim kayıtlarında tutulması,
          </li>
          <li>Veri minimizasyonu ve pilot çalışmalarda anonimleştirme / takma adlandırma,</li>
          <li>İletim sırasında şifreleme ve güvenli yazılım geliştirme yaşam döngüsü uygulamaları.</li>
        </ul>
      </>
    ),
  },
  {
    id: "bildirim",
    title: "Güvenlik ve kalite bildirimleri",
    content: (
      <p>
        Ürünlerimizle ilgili bir güvenlik açığı, kalite sorunu veya klinik güvenlik endişesi tespit ettiyseniz, lütfen{" "}
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Güvenlik / Kalite Bildirimi")}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        adresine “Güvenlik / Kalite Bildirimi” konu başlığıyla bildiriniz. Bildirimler öncelikli olarak değerlendirilir.
      </p>
    ),
  },
];

export default function QualityPage() {
  return (
    <LegalDocument
      currentHref="/legal/quality"
      eyebrow="Yasal · Kalite ve regülasyon"
      title="Kalite, Bilgi Güvenliği ve MDR"
      summary="Ürünleri geliştirirken hangi standartları referans aldığımızı ve düzenleyici süreçte bugün nerede olduğumuzu yazdık. Bu sayfa bir sertifika beyanı değildir."
      sections={sections}
    />
  );
}
