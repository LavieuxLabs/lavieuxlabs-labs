import LegalDocument, { type LegalFact, type LegalSection } from "@/components/LegalDocument";
import Cite from "@/components/Cite";
import type { CiteKey } from "@/lib/citations";
import { CONTACT_EMAIL } from "@/lib/site";
import { testsLabel } from "@/lib/metrics";
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

// Source marker next to a standard or regulation in the framework tables (only entries in CITATIONS).
const FRAMEWORK_CITE: Partial<Record<string, CiteKey>> = {
  "EU MDR 2017/745": "mdrRule11",
  "IEC 62304": "iec62304",
  "ISO 14971": "iso14971",
  "ISO 13485": "iso13485",
  "IEC 62366-1": "iec62366",
  "ISO/IEC 27001": "iso27001",
};

// Turkish original. The English version below is a convenience translation; LegalDocument states
// that the Turkish text prevails.
const frameworksTr = [
  [
    "EU MDR 2017/745",
    "Tıbbi cihaz yönetmeliği; Ek VIII Kural 11 kapsamında yazılım sınıflandırması",
    "PharmaDeux için Sınıf IIa hedefi",
  ],
  ["Tıbbi Cihaz Yönetmeliği (TİTCK)", "MDR ile uyumlaştırılmış ulusal düzenleme", "Referans çerçeve"],
  ["IEC 62304", "Tıbbi cihaz yazılımı yaşam döngüsü süreçleri", "Tasarım girdisi"],
  ["ISO 14971", "Tıbbi cihazlar için risk yönetimi", "Tasarım girdisi"],
  ["ISO 13485", "Tıbbi cihaz kalite yönetim sistemi", "Yol haritasında"],
  ["IEC 62366-1", "Kullanılabilirlik mühendisliği", "Yol haritasında"],
  ["ISO/IEC 27001", "Bilgi güvenliği yönetim sistemi", "Kontrol setine uyum hedefi"],
  ["HL7 FHIR R4", "Sağlık verisi birlikte çalışabilirlik standardı", "Veri modeli entegre; canlı HBYS bağlantısı yok"],
];

const sectionsTr: LegalSection[] = [
  {
    id: "durum",
    title: "Düzenleyici durum beyanı",
    content: (
      <>
        <p className="note">
          <strong>PharmaDeux CDSS geliştirme aşamasındadır.</strong> CE işareti yoktur, piyasaya arz edilmemiştir ve
          klinik kullanımda değildir. Bu sayfadaki standartlar, PharmaDeux geliştirilirken referans alınan çerçeveyi
          gösterir; bir sertifikasyon beyanı değildir. LavieuxLabs’ın işleyen bir kalite yönetim sistemi henüz yoktur.
        </p>
        <p>
          Shield, Tarık Ziya Eren’in bağımsız prototip projesidir ve bu sayfadaki çerçevenin parçası değildir.
          Düzenleyici değerlendirmesi aşağıda ayrıca anlatılır.
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
          <table className="stack">
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
                  <td data-label="Standart / mevzuat" className="font-mono text-[13px] text-ink">
                    {code}
                    {FRAMEWORK_CITE[code] && <Cite id={FRAMEWORK_CITE[code]} tone="paper" />}
                  </td>
                  <td data-label="Kapsam">{scope}</td>
                  <td data-label="Durum">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Tasarım girdisi:</strong> Standart, yazılımın mimarisi ve geliştirme süreçleri tasarlanırken referans
          alınır; uygunluk değerlendirmesi veya sertifikasyon yapılmadı.{" "}
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
          <li>Kullanım amacı, hedef kullanıcı ve hedef hasta popülasyonu yazılı olarak tanımlanacaktır,</li>
          <li>
            Klinik değerlendirmenin literatür, retrospektif doğrulama ve gerektiğinde prospektif çalışmalarla
            desteklenmesi planlanır; retrospektif doğrulama henüz yapılmadı,
          </li>
          <li>Risk yönetiminin tasarımın tüm aşamalarında ISO 14971 yaklaşımıyla yürütülmesi hedeflenir,</li>
          <li>Piyasaya arz sonrası gözetim (PMS) ve olay bildirim süreçleri ürünle birlikte planlanır.</li>
        </ul>
        <p>
          Shield, Tarık Ziya Eren’in bağımsız projesidir. Klinik tanı veya tedavi kararı üretmeyen; geri ödeme ve
          provizyon süreçlerini destekleyen operasyonel bir prototip olarak tasarlanmıştır. Düzenleyici
          sınıflandırması, nihai kullanım amacına göre değerlendirilir.
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
          alınmaz. PharmaDeux test kümesinde {testsLabel("tr")} otomatik test bulunur; bu yazılım düzeyinde bir
          ölçüdür, klinik doğrulama değildir.
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
        <p>
          PharmaDeux’un mimarisi aşağıdaki güvenlik ilkeleri üzerine tasarlanır. Bunlar tasarım ilkeleridir; hangisinin
          prototipte uygulandığı ürün sayfasında ayrıca yazılır.
        </p>
        <ul>
          <li>Rol tabanlı erişim kontrolü (RBAC) ve en az yetki ilkesi,</li>
          <li>Çok kurumlu mimaride, tasarım gereği kurum verilerinin mantıksal izolasyonu,</li>
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
        PharmaDeux, Shield veya bu site ile ilgili bir güvenlik açığı, kalite sorunu veya klinik güvenlik endişesi
        tespit ettiyseniz, lütfen{" "}
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Güvenlik / Kalite Bildirimi")}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        adresine “Güvenlik / Kalite Bildirimi” konu başlığıyla bildiriniz. Bildirimler öncelikli olarak değerlendirilir.
        Güvenlik açığı bildirimine ilişkin iletişim bilgileri RFC 9116 biçiminde{" "}
        <a href="/.well-known/security.txt">security.txt</a> dosyasında da yer alır.
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
  ["IEC 62304", "Medical device software life cycle processes", "Design input"],
  ["ISO 14971", "Risk management for medical devices", "Design input"],
  ["ISO 13485", "Quality management system for medical devices", "On the roadmap"],
  ["IEC 62366-1", "Usability engineering", "On the roadmap"],
  ["ISO/IEC 27001", "Information security management system", "Control set target"],
  ["HL7 FHIR R4", "Health data interoperability standard", "Data model integrated; no live HIS connection"],
];

const sectionsEn: LegalSection[] = [
  {
    id: "durum",
    title: "Regulatory status",
    content: (
      <>
        <p className="note">
          <strong>PharmaDeux CDSS is in development.</strong> It has no CE mark, has not been placed on the market and is
          not in clinical use. The standards on this page show the framework used as a reference while PharmaDeux is
          developed; they are not a statement of certification. LavieuxLabs does not have an operating quality management
          system yet.
        </p>
        <p>
          Shield is an independent prototype by Tarık Ziya Eren and is not part of the framework on this page. Its
          regulatory assessment is described separately below.
        </p>
      </>
    ),
  },
  {
    id: "cerceve",
    title: "Reference standards",
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="stack">
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
                  <td data-label="Standard / regulation" className="font-mono text-[13px] text-ink">
                    {code}
                    {FRAMEWORK_CITE[code] && <Cite id={FRAMEWORK_CITE[code]} tone="paper" />}
                  </td>
                  <td data-label="Scope">{scope}</td>
                  <td data-label="Status">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Design input:</strong> the standard is used as a reference when the software architecture and
          development processes are designed; no conformity assessment or certification has been done.{" "}
          <strong>On the roadmap:</strong> implementation and certification are planned in the product’s
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
          <li>The intended use, intended users and intended patient population will be defined in writing;</li>
          <li>
            Clinical evaluation is planned to be supported by literature, retrospective validation and, where needed,
            prospective studies; no retrospective validation has been done yet;
          </li>
          <li>Risk management is intended to follow ISO 14971 throughout design;</li>
          <li>Post-market surveillance (PMS) and incident reporting are planned together with the product.</li>
        </ul>
        <p>
          Shield is an independent project by Tarık Ziya Eren. It is designed as an operational prototype that supports
          reimbursement and pre-authorisation processes and does not produce clinical diagnoses or treatment decisions.
          Its regulatory classification is assessed against its final intended use.
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
          integration tests. The PharmaDeux test suite has {testsLabel("en")} automated tests; this is a
          software-level measure, not clinical validation.
        </li>
        <li>
          <strong>Change control:</strong> rule sets and the knowledge base are
          versioned, and every change is reviewed and recorded.
        </li>
        <li>
          <strong>Deterministic behaviour:</strong> no generative or probabilistic models are used in the clinical or
          operational decision path. The same input with the same rule version always gives the same output.
        </li>
        <li>
          <strong>Human oversight:</strong> the systems produce findings and risk signals. The final decision belongs
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
        <p>
          PharmaDeux’s architecture is designed on the following security principles. These are design principles; which
          of them are implemented in the prototype is stated separately on the product page.
        </p>
        <ul>
          <li>Role-based access control (RBAC) and least privilege;</li>
          <li>By design, logical isolation of each institution’s data in a multi-institution architecture;</li>
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
        If you find a security vulnerability, quality issue or clinical safety concern related to PharmaDeux, Shield or
        this site, please
        report it to{" "}
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Güvenlik / Kalite Bildirimi")}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        with the subject line “Güvenlik / Kalite Bildirimi” (security / quality report). Reports are handled with
        priority. Contact details for vulnerability reports are also published in RFC 9116 format in{" "}
        <a href="/.well-known/security.txt">security.txt</a>.
      </p>
    ),
  },
];

const documents: Record<
  Locale,
  { eyebrow: string; title: string; summary: string; facts: LegalFact[]; sections: LegalSection[] }
> = {
  tr: {
    eyebrow: "Yasal: Kalite ve regülasyon",
    title: "Kalite, Bilgi Güvenliği ve MDR",
    summary:
      "PharmaDeux'u geliştirirken hangi standartları referans aldığımızı ve düzenleyici süreçte bugün nerede olduğumuzu yazdık. Bu sayfa bir sertifika beyanı değildir.",
    facts: [
      { label: "Belge türü", value: "Düzenleyici durum beyanı" },
      { label: "Kapsam", value: "PharmaDeux CDSS; Shield ayrı bir projedir" },
      { label: "Durum", value: "Geliştirmede; CE işareti yok" },
    ],
    sections: sectionsTr,
  },
  en: {
    eyebrow: "Legal: Quality and regulation",
    title: "Quality, Information Security and MDR",
    summary:
      "The standards PharmaDeux is developed against, and where it stands in the regulatory process today. This page is not a certification statement.",
    facts: [
      { label: "Document type", value: "Regulatory status statement" },
      { label: "Scope", value: "PharmaDeux CDSS; Shield is a separate project" },
      { label: "Status", value: "In development; no CE mark" },
    ],
    sections: sectionsEn,
  },
};

export default function QualityView({ locale }: { locale: Locale }) {
  return <LegalDocument locale={locale} currentHref="/legal/quality" {...documents[locale]} />;
}
