import Link from "next/link";
import LegalDocument, { type LegalFact, type LegalSection } from "@/components/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";
import { localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/legal/terms", {
  tr: {
    title: "Kullanım Şartları ve Koşulları",
    description:
      "LavieuxLabs web sitesinin kullanımına ilişkin şartlar ve koşullar.",
  },
  en: {
    title: "Terms of Use",
    description:
      "The terms and conditions for using the LavieuxLabs website.",
  },
});

// Turkish original. The English version below is a convenience translation; LegalDocument states
// that the Turkish text prevails.
const sectionsTr: LegalSection[] = [
  {
    id: "kabul",
    title: "Kabul",
    content: (
      <p>
        Bu web sitesini ziyaret ederek veya kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. Şartları
        kabul etmiyorsanız lütfen siteyi kullanmayınız.
      </p>
    ),
  },
  {
    id: "tibbi-tavsiye",
    title: "Tıbbi tavsiye niteliği taşımama",
    content: (
      <>
        <p className="note">
          Bu sitedeki içerikler yalnızca kurumsal bilgilendirme amaçlıdır; tıbbi tavsiye, tanı veya tedavi önerisi
          niteliği taşımaz ve bir sağlık profesyonelinin değerlendirmesinin yerine geçmez.
        </p>
        <p>
          PharmaDeux CDSS ve Shield geliştirme aşamasındadır ve piyasaya arz edilmemiştir. Sitede yer alan ürün
          açıklamaları, ekran görüntüleri ve etkileşimli örnekler tanıtım amaçlıdır; örneklerde kullanılan veriler
          kurgusaldır.
        </p>
      </>
    ),
  },
  {
    id: "fikri-mulkiyet",
    title: "Fikri mülkiyet",
    content: (
      <p>
        Sitedeki metinler, görseller, logolar, yazılım ve tasarım öğeleri dahil tüm içerik üzerindeki haklar
        LavieuxLabs’e veya lisans verenlerine aittir. İçerik, önceden yazılı izin alınmaksızın çoğaltılamaz,
        dağıtılamaz, değiştirilemez veya ticari amaçla kullanılamaz. Kaynak gösterilerek yapılan kısa alıntılar bu
        kapsamın dışındadır.
      </p>
    ),
  },
  {
    id: "kullanim",
    title: "Kabul edilebilir kullanım",
    content: (
      <>
        <p>Siteyi kullanırken aşağıdaki davranışlardan kaçınmayı kabul edersiniz:</p>
        <ul>
          <li>Sitenin işleyişini bozacak, aşırı yük oluşturacak veya güvenliğini tehlikeye atacak girişimler,</li>
          <li>Otomatik araçlarla izinsiz veri toplanması,</li>
          <li>İletişim kanallarımız üzerinden hasta verisi veya üçüncü kişilere ait kişisel verilerin paylaşılması,</li>
          <li>Yürürlükteki mevzuata aykırı her türlü kullanım.</li>
        </ul>
      </>
    ),
  },
  {
    id: "loi",
    title: "Talepler ve Niyet Mektupları",
    content: (
      <p>
        İletişim formu aracılığıyla iletilen talepler ve bunları takip eden Niyet Mektupları (LOI), aksi açıkça yazılı
        olarak kararlaştırılmadıkça taraflar için bağlayıcı bir yükümlülük doğurmaz. Pilot ve iş birliği çalışmalarının
        koşulları, taraflar arasında ayrıca imzalanacak sözleşmelerle belirlenir.
      </p>
    ),
  },
  {
    id: "sorumluluk",
    title: "Sorumluluğun sınırlandırılması",
    content: (
      <p>
        Sitedeki bilgilerin doğru ve güncel olması için özen gösterilir; ancak içeriğin eksiksizliği, doğruluğu veya
        belirli bir amaca uygunluğu konusunda açık ya da örtülü bir garanti verilmez. Yürürlükteki mevzuatın izin
        verdiği ölçüde, sitenin kullanımından veya kullanılamamasından doğan doğrudan ya da dolaylı zararlardan
        LavieuxLabs sorumlu tutulamaz.
      </p>
    ),
  },
  {
    id: "baglantilar",
    title: "Üçüncü taraf bağlantıları",
    content: (
      <p>
        Site, üçüncü taraflara ait web sitelerine bağlantılar içerebilir. Bu sitelerin içeriği ve gizlilik uygulamaları
        üzerinde kontrolümüz bulunmamaktadır ve bunlardan sorumlu değiliz.
      </p>
    ),
  },
  {
    id: "kisisel-veriler",
    title: "Kişisel veriler",
    content: (
      <p>
        Kişisel verilerinizin işlenmesine ilişkin ayrıntılar{" "}
        <Link href={localizedPath("tr", "/legal/privacy")}>Gizlilik ve KVKK Politikası</Link> ile{" "}
        <Link href={localizedPath("tr", "/legal/cookies")}>Çerez Politikası</Link>’nda yer almaktadır.
      </p>
    ),
  },
  {
    id: "hukuk",
    title: "Uygulanacak hukuk ve değişiklikler",
    content: (
      <>
        <p>
          Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. LavieuxLabs bu şartları önceden bildirimde bulunmaksızın
          güncelleyebilir; güncel sürüm bu sayfada yayımlandığı tarihte yürürlüğe girer.
        </p>
        <p>
          Sorularınız için <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresinden bize ulaşabilirsiniz.
        </p>
      </>
    ),
  },
];

const sectionsEn: LegalSection[] = [
  {
    id: "kabul",
    title: "Acceptance",
    content: (
      <p>
        By visiting or using this website, you accept the terms of use below. If you do not accept them, please do not
        use the site.
      </p>
    ),
  },
  {
    id: "tibbi-tavsiye",
    title: "Not medical advice",
    content: (
      <>
        <p className="note">
          The content on this site is for institutional information only. It is not medical advice, diagnosis or a
          treatment recommendation, and it does not replace the judgement of a healthcare professional.
        </p>
        <p>
          PharmaDeux CDSS and Shield are in development and have not been placed on the market. Product descriptions,
          screenshots and interactive examples on the site are for illustration; the data in the examples is fictional.
        </p>
      </>
    ),
  },
  {
    id: "fikri-mulkiyet",
    title: "Intellectual property",
    content: (
      <p>
        All rights in the content of the site, including text, images, logos, software and design elements, belong to
        LavieuxLabs or its licensors. The content may not be copied, distributed, modified or used commercially without
        prior written permission. Short quotations with attribution are excluded.
      </p>
    ),
  },
  {
    id: "kullanim",
    title: "Acceptable use",
    content: (
      <>
        <p>When using the site, you agree not to:</p>
        <ul>
          <li>Attempt to disrupt the site, overload it or compromise its security;</li>
          <li>Collect data from it with automated tools without permission;</li>
          <li>Send patient data or third parties’ personal data through our contact channels;</li>
          <li>Use it in any way that breaks applicable law.</li>
        </ul>
      </>
    ),
  },
  {
    id: "loi",
    title: "Requests and Letters of Intent",
    content: (
      <p>
        Requests sent through the contact form, and any Letters of Intent (LOI) that follow, do not create binding
        obligations for either party unless expressly agreed in writing. The terms of pilot and collaboration work are
        set in separate contracts signed by the parties.
      </p>
    ),
  },
  {
    id: "sorumluluk",
    title: "Limitation of liability",
    content: (
      <p>
        We take care to keep the information on the site accurate and up to date, but give no express or implied warranty
        that it is complete, accurate or fit for a particular purpose. To the extent permitted by applicable law,
        LavieuxLabs is not liable for direct or indirect damage arising from the use of, or inability to use, the site.
      </p>
    ),
  },
  {
    id: "baglantilar",
    title: "Third-party links",
    content: (
      <p>
        The site may contain links to websites run by third parties. We have no control over their content or privacy
        practices and are not responsible for them.
      </p>
    ),
  },
  {
    id: "kisisel-veriler",
    title: "Personal data",
    content: (
      <p>
        Details on how your personal data is processed are in the <Link href={localizedPath("en", "/legal/privacy")}>Privacy Policy</Link>{" "}
        and the <Link href={localizedPath("en", "/legal/cookies")}>Cookie Policy</Link>.
      </p>
    ),
  },
  {
    id: "hukuk",
    title: "Governing law and changes",
    content: (
      <>
        <p>
          These terms are governed by the laws of the Republic of Türkiye. LavieuxLabs may update them without prior
          notice; the current version takes effect on the date it is published on this page.
        </p>
        <p>
          For questions, write to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
];

const documents: Record<
  Locale,
  { eyebrow: string; title: string; summary: string; facts: LegalFact[]; sections: LegalSection[] }
> = {
  tr: {
    eyebrow: "Yasal",
    title: "Kullanım Şartları ve Koşulları",
    summary:
      "Bu siteyi kullanırken geçerli olan koşulları ve sitedeki içeriğin ne olduğunu, ne olmadığını yazdık.",
    facts: [
      { label: "Belge türü", value: "Kullanım şartları" },
      { label: "Kapsam", value: "lavieuxlabs.com" },
      { label: "Uygulanacak hukuk", value: "Türkiye Cumhuriyeti" },
    ],
    sections: sectionsTr,
  },
  en: {
    eyebrow: "Legal",
    title: "Terms of Use",
    summary:
      "The conditions that apply when you use this site, and what the content on it is and is not.",
    facts: [
      { label: "Document type", value: "Terms of use" },
      { label: "Scope", value: "lavieuxlabs.com" },
      { label: "Governing law", value: "Republic of Türkiye" },
    ],
    sections: sectionsEn,
  },
};

export default function TermsView({ locale }: { locale: Locale }) {
  return <LegalDocument locale={locale} currentHref="/legal/terms" {...documents[locale]} />;
}
