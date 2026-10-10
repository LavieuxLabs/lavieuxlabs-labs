import Link from "next/link";
import LegalDocument, { type LegalFact, type LegalSection } from "@/components/LegalDocument";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { CONSENT_STORAGE_KEY } from "@/lib/site";
import { localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/legal/cookies", {
  tr: {
    title: "Çerez Politikası",
    description:
      "LavieuxLabs web sitesinde kullanılan çerezler ve benzeri teknolojiler ile tercihlerinizi nasıl yönetebileceğiniz.",
  },
  en: {
    title: "Cookie Policy",
    description:
      "The cookies and similar technologies used on the LavieuxLabs website, and how to manage your preferences.",
  },
});

// Turkish original. The English version below is a convenience translation; LegalDocument states
// that the Turkish text prevails.
const sectionsTr: LegalSection[] = [
  {
    id: "cerez-nedir",
    title: "Çerez nedir?",
    content: (
      <p>
        Çerezler ve tarayıcı yerel depolaması (localStorage) gibi benzeri teknolojiler, bir web sitesini ziyaret
        ettiğinizde cihazınızda saklanan küçük veri parçalarıdır. Sitenin çalışmasını sağlamak, tercihlerinizi
        hatırlamak ve kullanım istatistiklerini ölçmek amacıyla kullanılabilirler.
      </p>
    ),
  },
  {
    id: "kategoriler",
    title: "Çerez kategorileri",
    content: (
      <>
        <h3>Zorunlu</h3>
        <p>
          Sitenin temel işlevleri ve çerez tercihinizin hatırlanması için gereklidir. KVKK md. 5/2(f) kapsamında meşru
          menfaate dayanır ve devre dışı bırakılamaz.
        </p>
        <h3>Tercih</h3>
        <p>
          Dil ve görünüm gibi seçimlerinizi sonraki ziyaretlerinizde hatırlamak için kullanılır. Açık rızanıza tabidir.
        </p>
        <h3>Harici içerik</h3>
        <p>
          İletişim sayfasındaki Google Haritalar gibi üçüncü taraf içeriklerin yüklenmesine izin verir. Bu içerikler
          yüklendiğinde ilgili sağlayıcı kendi çerezlerini kullanabilir. Açık rızanıza tabidir; rıza vermediğiniz sürece
          harita yalnızca siz “Haritayı yükle” düğmesine tıkladığınızda, o sayfa görüntülemesi için yüklenir.
        </p>
        <h3>Analitik</h3>
        <p>
          Sitenin nasıl kullanıldığını anonim ve toplu olarak ölçmek için kullanılır. Açık rızanıza tabidir ve rıza
          vermediğiniz sürece etkinleştirilmez.
        </p>
      </>
    ),
  },
  {
    id: "kullanilanlar",
    title: "Sitede kullanılan çerezler ve benzeri teknolojiler",
    content: (
      <>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Tür</th>
                <th>Kategori</th>
                <th>Amaç</th>
                <th>Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-xs">{CONSENT_STORAGE_KEY}</td>
                <td>Yerel depolama</td>
                <td>Zorunlu</td>
                <td>Çerez onay tercihinizi ve tercih tarihini saklar.</td>
                <td>Siz silene veya tercihinizi değiştirene kadar</td>
              </tr>
              <tr>
                <td>Google Haritalar</td>
                <td>Üçüncü taraf çerezleri (Google)</td>
                <td>Harici içerik</td>
                <td>
                  İletişim sayfasındaki konum haritasının gösterilmesi. Yalnızca onayınız veya talebiniz üzerine
                  yüklenir.
                </td>
                <td>
                  Google tarafından belirlenir;{" "}
                  <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
                    Google çerez politikası
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Bu sitede reklam veya takip amaçlı çerez kullanılmamaktadır. Tercih veya analitik kategorisinde bir araç
          devreye alınması halinde bu tablo güncellenir ve ilgili araç yalnızca onayınızla etkinleştirilir.
        </p>
      </>
    ),
  },
  {
    id: "yonetim",
    title: "Tercihlerinizi yönetme",
    content: (
      <>
        <p>
          Çerez tercihlerinizi istediğiniz zaman aşağıdaki düğmeyi veya sayfa altbilgisindeki “Çerez Ayarları”
          bağlantısını kullanarak değiştirebilir, verdiğiniz rızayı geri alabilirsiniz.
        </p>
        <CookieSettingsButton locale="tr" className="mt-5 cursor-pointer rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]" />
        <p>
          Ayrıca tarayıcınızın ayarlarından çerezleri ve site verilerini silebilir veya engelleyebilirsiniz. Zorunlu
          verilerin engellenmesi halinde tercihiniz hatırlanamaz ve onay bildirimi her ziyarette yeniden gösterilir.
        </p>
      </>
    ),
  },
  {
    id: "iletisim",
    title: "İletişim",
    content: (
      <p>
        Çerezler aracılığıyla işlenen kişisel verilere ilişkin haklarınız ve başvuru yöntemi için{" "}
        <Link href={localizedPath("tr", "/legal/privacy")}>Gizlilik ve KVKK Politikası</Link>’nı inceleyebilirsiniz.
      </p>
    ),
  },
];

const sectionsEn: LegalSection[] = [
  {
    id: "cerez-nedir",
    title: "What is a cookie?",
    content: (
      <p>
        Cookies and similar technologies such as browser local storage (localStorage) are small pieces of data stored on
        your device when you visit a website. They can be used to make the site work, to remember your preferences and
        to measure how the site is used.
      </p>
    ),
  },
  {
    id: "kategoriler",
    title: "Cookie categories",
    content: (
      <>
        <h3>Strictly necessary</h3>
        <p>
          Needed for the site’s basic functions and to remember your cookie choice. Based on legitimate interest under
          Article 5(2)(f) of KVKK; cannot be turned off.
        </p>
        <h3>Preferences</h3>
        <p>Used to remember choices such as language and display on your next visit. Requires your explicit consent.</p>
        <h3>External content</h3>
        <p>
          Allows third-party content such as Google Maps on the contact page to load. When it loads, the provider may set
          its own cookies. Requires your explicit consent; without it, the map loads only when you press “Load map”, and
          only for that page view.
        </p>
        <h3>Analytics</h3>
        <p>
          Used to measure, anonymously and in aggregate, how the site is used. Requires your explicit consent and is not
          enabled without it.
        </p>
      </>
    ),
  },
  {
    id: "kullanilanlar",
    title: "Cookies and similar technologies on this site",
    content: (
      <>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-xs">{CONSENT_STORAGE_KEY}</td>
                <td>Local storage</td>
                <td>Strictly necessary</td>
                <td>Stores your cookie choice and the date you made it.</td>
                <td>Until you delete it or change your choice</td>
              </tr>
              <tr>
                <td>Google Maps</td>
                <td>Third-party cookies (Google)</td>
                <td>External content</td>
                <td>Shows the location map on the contact page. Loads only with your consent or at your request.</td>
                <td>
                  Set by Google; see the{" "}
                  <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
                    Google cookie policy
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          This site does not use advertising or tracking cookies. If a preference or analytics tool is introduced, this
          table will be updated and the tool will only be enabled with your consent.
        </p>
      </>
    ),
  },
  {
    id: "yonetim",
    title: "Managing your preferences",
    content: (
      <>
        <p>
          You can change your cookie preferences or withdraw consent at any time with the button below or the “Cookie
          settings” link in the footer.
        </p>
        <CookieSettingsButton
          locale="en"
          className="mt-5 cursor-pointer rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
        />
        <p>
          You can also delete or block cookies and site data in your browser settings. If necessary data is blocked,
          your choice cannot be remembered and the consent notice will appear on every visit.
        </p>
      </>
    ),
  },
  {
    id: "iletisim",
    title: "Contact",
    content: (
      <p>
        For your rights regarding personal data processed through cookies, and how to exercise them, see the{" "}
        <Link href={localizedPath("en", "/legal/privacy")}>Privacy Policy</Link>.
      </p>
    ),
  },
];

const documents: Record<
  Locale,
  { eyebrow: string; title: string; summary: string; facts: LegalFact[]; sections: LegalSection[] }
> = {
  tr: {
    eyebrow: "Yasal",
    title: "Çerez Politikası",
    summary:
      "Bu sitede hangi çerezleri ve benzeri teknolojileri neden kullandığımızı ve tercihinizi nasıl değiştirebileceğinizi anlatıyoruz.",
    facts: [
      { label: "Belge türü", value: "Çerez politikası" },
      { label: "Hukuki dayanak", value: "KVKK md. 5/2(f) · açık rıza" },
      { label: "Takip ve reklam çerezi", value: "Kullanılmıyor" },
    ],
    sections: sectionsTr,
  },
  en: {
    eyebrow: "Legal",
    title: "Cookie Policy",
    summary:
      "Which cookies and similar technologies this site uses, why, and how you can change your choice.",
    facts: [
      { label: "Document type", value: "Cookie policy" },
      { label: "Legal basis", value: "KVKK Art. 5(2)(f) · explicit consent" },
      { label: "Tracking or ad cookies", value: "None used" },
    ],
    sections: sectionsEn,
  },
};

export default function CookiesView({ locale }: { locale: Locale }) {
  return <LegalDocument locale={locale} currentHref="/legal/cookies" {...documents[locale]} />;
}
