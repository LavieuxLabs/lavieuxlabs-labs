import Link from "next/link";
import LegalDocument, { type LegalFact, type LegalSection } from "@/components/LegalDocument";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { CONSENT_STORAGE_KEY } from "@/lib/site";
import { analyticsProvider } from "@/lib/analyticsConfig";
import { BUTTON_OUTLINE } from "@/components/paper/Editorial";
import { localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

// What the analytics category says follows the configured provider; with none, nothing loads and the banner does
// not offer the category. Text for a provider is shown only once that provider is configured.
const tool = analyticsProvider()?.kind ?? null;
const analyticsText = {
  tr: {
    none: "Sitenin nasıl kullanıldığını toplu olarak ölçmek için ayrılmış bir kategoridir. Şu an analitik aracı kullanılmıyor: hiçbir analitik scripti yüklenmez ve bu kategori çerez bandında gösterilmez. Bir araç devreye alınırsa bu metin ve çerez tablosu güncellenir, araç yalnızca onayınızla çalışır ve onayınız yeniden sorulur.",
    cookieless: "Sitenin nasıl kullanıldığını, çerez kullanmayacak biçimde yapılandırılmış bir araçla toplu olarak ölçer. Script yalnızca onayınızdan sonra yüklenir; onayınızı geri aldığınızda ölçüm durur.",
    ga4: "Sitenin nasıl kullanıldığını Google Analytics 4 ile ölçer. Bu araç çerez kullanır ve veriyi Google'a gönderir. Script yalnızca onayınızdan sonra yüklenir; onayınızı geri aldığınızda ölçüm durur.",
  },
  en: {
    none: "A category for measuring in aggregate how the site is used. No analytics tool is in use at the moment: no analytics script loads and the cookie banner does not offer this category. If a tool is introduced, this text and the cookie table are updated, the tool runs only with your consent, and you are asked again.",
    cookieless: "Measures in aggregate how the site is used, with a tool configured not to set cookies. The script loads only after you consent; measurement stops when you withdraw consent.",
    ga4: "Measures how the site is used with Google Analytics 4. This tool sets cookies and sends data to Google. The script loads only after you consent; measurement stops when you withdraw consent.",
  },
};
const gaRow = {
  tr: { labels: ["Ad", "Tür", "Kategori", "Amaç", "Süre"], type: "Üçüncü taraf çerezleri (Google)", category: "Analitik", purpose: "Ziyaretleri ayırt ederek kullanım istatistiği üretir.", duration: "Google tarafından belirlenir;", policy: "Google çerez politikası" },
  en: { labels: ["Name", "Type", "Category", "Purpose", "Duration"], type: "Third-party cookies (Google)", category: "Analytics", purpose: "Distinguishes visits to produce usage statistics.", duration: "Set by Google. See the", policy: "Google cookie policy" },
};
function GaRow({ locale }: { locale: Locale }) {
  if (tool !== "ga4") return null;
  const r = gaRow[locale];
  return (
    <tr>
      <td data-label={r.labels[0]} className="font-mono text-[13px]">_ga, _ga_*</td>
      <td data-label={r.labels[1]}>{r.type}</td>
      <td data-label={r.labels[2]}>{r.category}</td>
      <td data-label={r.labels[3]}>{r.purpose}</td>
      <td data-label={r.labels[4]}>
        {r.duration}{" "}
        <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
          {r.policy}
        </a>
      </td>
    </tr>
  );
}

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
          Dil ve görünüm gibi seçimleri hatırlamak için ayrılmış bir kategoridir. Şu an bu kategoride bir araç
          kullanılmıyor; bu yüzden çerez bandında gösterilmez.
        </p>
        <h3>Harici içerik</h3>
        <p>
          İletişim sayfasındaki Google Haritalar gibi üçüncü taraf içeriklerin yüklenmesine izin verir. Bu içerikler
          yüklendiğinde ilgili sağlayıcı kendi çerezlerini kullanabilir. Açık rızanıza tabidir; rıza vermediğiniz sürece
          harita yalnızca siz “Haritayı yükle” düğmesine tıkladığınızda, o sayfa görüntülemesi için yüklenir.
        </p>
        <h3>Analitik</h3>
        <p>{analyticsText.tr[tool ?? "none"]}</p>
      </>
    ),
  },
  {
    id: "kullanilanlar",
    title: "Sitede kullanılan çerezler ve benzeri teknolojiler",
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="stack">
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
                <td data-label="Ad" className="font-mono text-[13px]">{CONSENT_STORAGE_KEY}</td>
                <td data-label="Tür">Yerel depolama</td>
                <td data-label="Kategori">Zorunlu</td>
                <td data-label="Amaç">Çerez onay tercihinizi, tercih tarihini ve o sırada yapılandırılmış analitik aracını saklar.</td>
                <td data-label="Süre">Siz silene veya tercihinizi değiştirene kadar</td>
              </tr>
              <tr>
                <td data-label="Ad">Google Haritalar</td>
                <td data-label="Tür">Üçüncü taraf çerezleri (Google)</td>
                <td data-label="Kategori">Harici içerik</td>
                <td data-label="Amaç">
                  İletişim sayfasındaki konum haritasının gösterilmesi. Yalnızca onayınız veya talebiniz üzerine
                  yüklenir.
                </td>
                <td data-label="Süre">
                  Google tarafından belirlenir;{" "}
                  <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
                    Google çerez politikası
                  </a>
                </td>
              </tr>
              <GaRow locale="tr" />
            </tbody>
          </table>
        </div>
        <p>
          {tool === "ga4" ? "Bu sitede reklam amaçlı çerez kullanılmamaktadır." : "Bu sitede reklam veya takip amaçlı çerez kullanılmamaktadır."} Tercih veya analitik kategorisinde bir araç
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
        <CookieSettingsButton locale="tr" className={`mt-4 cursor-pointer ${BUTTON_OUTLINE}`} />
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
        <p>
          A category for remembering choices such as language and display. No tool in this category is in use at the
          moment, so the cookie banner does not offer it.
        </p>
        <h3>External content</h3>
        <p>
          Allows third-party content such as Google Maps on the contact page to load. When it loads, the provider may set
          its own cookies. Requires your explicit consent. Without it, the map loads only when you press “Load map” and
          only for that page view.
        </p>
        <h3>Analytics</h3>
        <p>{analyticsText.en[tool ?? "none"]}</p>
      </>
    ),
  },
  {
    id: "kullanilanlar",
    title: "Cookies and similar technologies on this site",
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="stack">
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
                <td data-label="Name" className="font-mono text-[13px]">{CONSENT_STORAGE_KEY}</td>
                <td data-label="Type">Local storage</td>
                <td data-label="Category">Strictly necessary</td>
                <td data-label="Purpose">Stores your cookie choice, the date you made it and the analytics tool configured at that time.</td>
                <td data-label="Duration">Until you delete it or change your choice</td>
              </tr>
              <tr>
                <td data-label="Name">Google Maps</td>
                <td data-label="Type">Third-party cookies (Google)</td>
                <td data-label="Category">External content</td>
                <td data-label="Purpose">Shows the location map on the contact page. Loads only with your consent or at your request.</td>
                <td data-label="Duration">
                  Set by Google. See the{" "}
                  <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
                    Google cookie policy
                  </a>
                </td>
              </tr>
              <GaRow locale="en" />
            </tbody>
          </table>
        </div>
        <p>
          {tool === "ga4" ? "This site does not use advertising cookies." : "This site does not use advertising or tracking cookies."} If a preference or analytics tool is introduced, this
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
          className={`mt-4 cursor-pointer ${BUTTON_OUTLINE}`}
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
      { label: "Hukuki dayanak", value: "KVKK md. 5/2(f); açık rıza" },
      { label: tool === "ga4" ? "Reklam çerezi" : "Takip ve reklam çerezi", value: "Kullanılmıyor" },
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
      { label: "Legal basis", value: "KVKK Art. 5(2)(f); explicit consent" },
      { label: tool === "ga4" ? "Advertising cookies" : "Tracking or ad cookies", value: "None used" },
    ],
    sections: sectionsEn,
  },
};

export default function CookiesView({ locale }: { locale: Locale }) {
  return <LegalDocument locale={locale} currentHref="/legal/cookies" {...documents[locale]} />;
}
