import LegalDocument, { type LegalFact, type LegalSection } from "@/components/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/legal/quality", {
  tr: {
    title: "Kalite, Bilgi Güvenliği ve MDR Standartları",
    description:
      "LavieuxLabs ürün geliştirme süreçlerinde referans alınan kalite yönetimi, bilgi güvenliği ve tıbbi cihaz mevzuatı çerçevesi.",
  },
  en: {
    title: "Quality, Information Security and MDR",
    description:
      "The quality management, information security and medical device regulatory framework LavieuxLabs develops its products against.",
  },
});

// Turkish original. The English version below is a convenience translation; LegalDocument states
// that the Turkish text prevails.
const frameworksTr = [
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

const sectionsTr: LegalSection[] = [
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
              {frameworksTr.map(([code, scope, status]) => (
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

const frameworksEn = [
  [
    "EU MDR 2017/745",
    "Medical Device Regulation; software classification under Annex VIII Rule 11",
    "Class IIa target for PharmaDeux",
  ],
  ["Medical Device Regulation (TİTCK)", "Turkish national regulation harmonised with the MDR", "Reference framework"],
  ["IEC 62304", "Medical device software life cycle processes", "Architecture aligned"],
  ["ISO 14971", "Risk management for medical devices", "Architecture aligned"],
  ["ISO 13485", "Quality management system for medical devices", "On the roadmap"],
  ["IEC 62366-1", "Usability engineering", "On the roadmap"],
  ["ISO/IEC 27001", "Information security management system", "Control set target"],
  ["HL7 FHIR R4", "Health data interoperability standard", "In use"],
];

const sectionsEn: LegalSection[] = [
  {
    id: "durum",
    title: "Regulatory status",
    content: (
      <p className="note">
        <strong>PharmaDeux CDSS and Shield are in development.</strong> Our products do not yet carry a CE mark and have
        not been placed on the market; in a clinical setting they may only be used within research protocols approved by
        an ethics committee. The standards on this page describe the framework we use as a reference during development;
        unless stated otherwise, they are not a statement of certification.
      </p>
    ),
  },
  {
    id: "cerceve",
    title: "Reference standards",
    content: (
      <>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Standard / regulation</th>
                <th>Scope</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {frameworksEn.map(([code, scope, status]) => (
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
          <strong>Architecture aligned:</strong> processes and documentation are being built to the standard’s
          requirements. <strong>On the roadmap:</strong> implementation and certification are planned in the product’s
          regulatory roadmap.
        </p>
      </>
    ),
  },
  {
    id: "mdr",
    title: "MDR and positioning the software as a medical device",
    content: (
      <>
        <p>
          PharmaDeux provides information used to inform drug therapy decisions, and is designed as medical device
          software (SaMD) targeting Class IIa under MDR Annex VIII Rule 11. Accordingly:
        </p>
        <ul>
          <li>The intended use, intended users and intended patient population are defined in writing;</li>
          <li>Clinical evaluation is supported by literature, retrospective validation and, where needed, prospective studies;</li>
          <li>Risk management follows ISO 14971 throughout design;</li>
          <li>Post-market surveillance (PMS) and incident reporting are planned together with the product.</li>
        </ul>
        <p>
          Shield is designed as an operational platform that supports reimbursement and pre-authorisation processes and
          does not produce clinical diagnoses or treatment decisions. Its regulatory classification is assessed against
          its final intended use.
        </p>
      </>
    ),
  },
  {
    id: "kalite",
    title: "Quality management principles",
    content: (
      <ul>
        <li>
          <strong>Traceability:</strong> each requirement is linked to a design element, its implementation and a
          verification test.
        </li>
        <li>
          <strong>Verification:</strong> software changes are not released until they pass automated unit and
          integration tests. The PharmaDeux test suite has more than 2,480 automated tests.
        </li>
        <li>
          <strong>Change control:</strong> rule sets and the knowledge base are versioned; every change is reviewed and
          recorded.
        </li>
        <li>
          <strong>Deterministic behaviour:</strong> no generative or probabilistic models are used in the clinical or
          operational decision path; the same input with the same rule version always gives the same output.
        </li>
        <li>
          <strong>Human oversight:</strong> the systems produce suggestions and risk signals; the final decision belongs
          to the authorised user.
        </li>
      </ul>
    ),
  },
  {
    id: "bilgi-guvenligi",
    title: "Information security",
    content: (
      <>
        <p>Our platform architecture is built on the following security principles:</p>
        <ul>
          <li>Role-based access control (RBAC) and least privilege;</li>
          <li>Logical isolation of each institution’s data in a multi-tenant architecture;</li>
          <li>Decisions and user actions kept in append-only audit logs;</li>
          <li>Data minimisation, and anonymisation or pseudonymisation in pilot studies;</li>
          <li>Encryption in transit and secure software development life cycle practices.</li>
        </ul>
      </>
    ),
  },
  {
    id: "bildirim",
    title: "Security and quality reports",
    content: (
      <p>
        If you find a security vulnerability, quality issue or clinical safety concern related to our products, please
        report it to{" "}
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Güvenlik / Kalite Bildirimi")}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        with the subject line “Güvenlik / Kalite Bildirimi” (security / quality report). Reports are handled with
        priority.
      </p>
    ),
  },
];

const documents: Record<
  Locale,
  { eyebrow: string; title: string; summary: string; facts: LegalFact[]; sections: LegalSection[] }
> = {
  tr: {
    eyebrow: "Yasal · Kalite ve regülasyon",
    title: "Kalite, Bilgi Güvenliği ve MDR",
    summary:
      "Ürünleri geliştirirken hangi standartları referans aldığımızı ve düzenleyici süreçte bugün nerede olduğumuzu yazdık. Bu sayfa bir sertifika beyanı değildir.",
    facts: [
      { label: "Belge türü", value: "Düzenleyici durum beyanı" },
      { label: "Kapsam", value: "PharmaDeux CDSS · Shield" },
      { label: "Durum", value: "Geliştirmede · CE işareti yok" },
    ],
    sections: sectionsTr,
  },
  en: {
    eyebrow: "Legal · Quality and regulation",
    title: "Quality, Information Security and MDR",
    summary:
      "The standards we develop our products against, and where we stand in the regulatory process today. This page is not a certification statement.",
    facts: [
      { label: "Document type", value: "Regulatory status statement" },
      { label: "Scope", value: "PharmaDeux CDSS · Shield" },
      { label: "Status", value: "In development · no CE mark" },
    ],
    sections: sectionsEn,
  },
};

export default function QualityView({ locale }: { locale: Locale }) {
  return <LegalDocument locale={locale} currentHref="/legal/quality" {...documents[locale]} />;
}
