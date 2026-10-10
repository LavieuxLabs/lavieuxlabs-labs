import Link from "next/link";
import LegalDocument, { ControllerDetails, type LegalFact, type LegalSection } from "@/components/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";
import { localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/legal/privacy", {
  tr: {
    title: "Gizlilik ve KVKK Politikası",
    description:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında LavieuxLabs aydınlatma metni ve gizlilik politikası.",
  },
  en: {
    title: "Privacy Policy",
    description:
      "LavieuxLabs privacy notice and policy under Turkey's Law No. 6698 on the Protection of Personal Data (KVKK).",
  },
});

// Turkish original. The English version below is a convenience translation; LegalDocument states
// that the Turkish text prevails.
const sectionsTr: LegalSection[] = [
  {
    id: "veri-sorumlusu",
    title: "Veri sorumlusu",
    content: (
      <>
        <p>
          Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) md. 10 ve Aydınlatma
          Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, veri sorumlusu
          sıfatıyla LavieuxLabs (“LavieuxLabs”, “biz”) tarafından hazırlanmıştır.
        </p>
        <ControllerDetails locale="tr" />
      </>
    ),
  },
  {
    id: "kapsam",
    title: "Kapsam",
    content: (
      <>
        <p>
          Bu metin; web sitemizi ziyaret eden, iletişim ve Niyet Mektubu (LOI) formunu kullanan veya bizimle e-posta
          yoluyla iletişime geçen gerçek kişilerin kişisel verilerinin işlenmesine ilişkindir.
        </p>
        <p className="note">
          <strong>Hasta verisi bu sitede işlenmez.</strong> Pilot ve doğrulama çalışmaları kapsamında işlenebilecek
          sağlık verileri; bu metinden bağımsız olarak, ilgili kurumla imzalanan veri işleme sözleşmesi, etik kurul
          onayı ve ayrı bir aydınlatma çerçevesinde ele alınır. Lütfen iletişim kanallarımız üzerinden hasta verisi veya
          özel nitelikli kişisel veri paylaşmayınız.
        </p>
      </>
    ),
  },
  {
    id: "veri-kategorileri",
    title: "İşlenen kişisel veri kategorileri",
    content: (
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Örnek veriler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kimlik</td>
              <td>Ad, soyad</td>
            </tr>
            <tr>
              <td>İletişim</td>
              <td>Kurumsal e-posta adresi</td>
            </tr>
            <tr>
              <td>Mesleki</td>
              <td>Kurum adı, unvan / görev</td>
            </tr>
            <tr>
              <td>Talep içeriği</td>
              <td>İlgilenilen çözüm, talep türü, mesaj içeriği ve yazışmalar</td>
            </tr>
            <tr>
              <td>İşlem güvenliği</td>
              <td>IP adresi, tarayıcı bilgisi, erişim zamanı gibi barındırma altyapısı kayıtları</td>
            </tr>
            <tr>
              <td>Tercih</td>
              <td>
                Çerez onay tercihiniz (<Link href={localizedPath("tr", "/legal/cookies")}>Çerez Politikası</Link>)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "amaclar",
    title: "İşleme amaçları",
    content: (
      <ul>
        <li>
          Demo, pilot, Niyet Mektubu (LOI) ve iş birliği taleplerinin alınması, değerlendirilmesi ve yanıtlanması,
        </li>
        <li>Kurumsal iletişim faaliyetlerinin ve iş birliği süreçlerinin yürütülmesi,</li>
        <li>Sözleşme öncesi görüşmelerin planlanması ve kayıt altına alınması,</li>
        <li>Web sitesinin güvenliğinin sağlanması ve hizmet sürekliliğinin korunması,</li>
        <li>Mevzuattan doğan yükümlülüklerin yerine getirilmesi ve yetkili mercilerin taleplerinin karşılanması.</li>
      </ul>
    ),
  },
  {
    id: "hukuki-sebepler",
    title: "Toplama yöntemi ve hukuki sebepler",
    content: (
      <>
        <p>
          Kişisel verileriniz; iletişim formuna girdiğiniz ve form gönderildiğinde e-posta gönderim hizmeti
          sağlayıcımız aracılığıyla kurumsal e-posta adresimize iletilen bilgiler, doğrudan gönderdiğiniz e-postalar ve
          web sitesi altyapısı tarafından otomatik yollarla toplanır. Veriler, KVKK md. 5/2 kapsamında
          aşağıdaki hukuki sebeplere dayanılarak işlenir:
        </p>
        <ul>
          <li>
            <strong>md. 5/2(c):</strong> Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (pilot, LOI ve
            iş birliği görüşmeleri),
          </li>
          <li>
            <strong>md. 5/2(ç):</strong> Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi,
          </li>
          <li>
            <strong>md. 5/2(f):</strong> İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri
            sorumlusunun meşru menfaati (talep yanıtlama, site güvenliği).
          </li>
        </ul>
        <p>
          Zorunlu olmayan çerezler gibi açık rızaya dayanan işlemler, yalnızca rızanız alındıktan sonra gerçekleştirilir
          ve rızanızı dilediğiniz zaman geri alabilirsiniz.
        </p>
      </>
    ),
  },
  {
    id: "aktarim",
    title: "Kişisel verilerin aktarılması",
    content: (
      <>
        <p>
          Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olarak; e-posta, form iletimi ve barındırma hizmeti
          aldığımız tedarikçilere, hukuken yetkili kamu kurum ve kuruluşlarına ve talep edilmesi halinde yetkili mercilere
          aktarılabilir.
        </p>
        <p>
          İletişim sayfasındaki konum haritasını yüklemeniz halinde, IP adresiniz ve tarayıcı bilgileriniz gibi veriler
          harita hizmetini sağlayan Google’a doğrudan iletilir; harita yalnızca onayınız veya talebiniz üzerine
          yüklenir. Hizmet sağlayıcılarımızın sunucularının yurt dışında bulunması halinde aktarım, KVKK md. 9’da
          öngörülen aktarım mekanizmalarına uygun olarak gerçekleştirilir. Kişisel verileriniz pazarlama amacıyla üçüncü
          kişilere satılmaz veya kiralanmaz.
        </p>
      </>
    ),
  },
  {
    id: "saklama",
    title: "Saklama süresi ve güvenlik",
    content: (
      <>
        <p>
          Kişisel verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri
          boyunca saklanır. Bu sürelerin sona ermesiyle veriler silinir, yok edilir veya anonim hale getirilir.
        </p>
        <p>
          Verilerinizin güvenliği için erişimin yetkili personelle sınırlandırılması, iletim sırasında şifreleme ve
          erişim kayıtlarının tutulması gibi idari ve teknik tedbirler uygulanır.
        </p>
      </>
    ),
  },
  {
    id: "haklar",
    title: "KVKK md. 11 kapsamındaki haklarınız",
    content: (
      <>
        <p>KVKK md. 11 uyarınca veri sorumlusuna başvurarak:</p>
        <ol>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme,</li>
          <li>KVKK md. 7’de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
          <li>Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>
            Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına
            itiraz etme,
          </li>
          <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
        </ol>
        <p>haklarına sahipsiniz.</p>
      </>
    ),
  },
  {
    id: "basvuru",
    title: "Başvuru yöntemi",
    content: (
      <>
        <p>
          Haklarınıza ilişkin taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’e uygun olarak;
          kimliğinizi tespit etmeye yarayan bilgilerle birlikte{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("KVKK Başvurusu")}`}>{CONTACT_EMAIL}</a>{" "}
          adresine “KVKK Başvurusu” konu başlığıyla iletebilirsiniz.
        </p>
        <p>
          Başvurunuz, talebin niteliğine göre en kısa sürede ve en geç otuz gün içinde ücretsiz olarak sonuçlandırılır.
          İşlemin ayrıca bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen
          tarifedeki ücret alınabilir.
        </p>
      </>
    ),
  },
  {
    id: "degisiklikler",
    title: "Politikadaki değişiklikler",
    content: (
      <p>
        Bu politika, mevzuat ve faaliyetlerimizdeki değişikliklere bağlı olarak güncellenebilir. Güncel sürüm her zaman
        bu sayfada yayımlanır; sayfanın başındaki “Son güncelleme” tarihi en son değişikliği gösterir.
      </p>
    ),
  },
];

const sectionsEn: LegalSection[] = [
  {
    id: "veri-sorumlusu",
    title: "Data controller",
    content: (
      <>
        <p>
          This privacy notice is issued by LavieuxLabs (“LavieuxLabs”, “we”) as data controller under Article 10 of
          Turkey’s Law No. 6698 on the Protection of Personal Data (“KVKK”) and the Communiqué on the Procedures and
          Principles for Fulfilling the Obligation to Inform.
        </p>
        <ControllerDetails locale="en" />
      </>
    ),
  },
  {
    id: "kapsam",
    title: "Scope",
    content: (
      <>
        <p>
          This notice covers the processing of personal data of individuals who visit our website, use the contact and
          Letter of Intent (LOI) form, or contact us by email.
        </p>
        <p className="note">
          <strong>No patient data is processed on this site.</strong> Health data that may be processed in pilot and
          validation studies is handled separately from this notice, under a data processing agreement signed with the
          institution, ethics committee approval and a separate information notice. Please do not send patient data or
          other special categories of personal data through our contact channels.
        </p>
      </>
    ),
  },
  {
    id: "veri-kategorileri",
    title: "Categories of personal data",
    content: (
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Identity</td>
              <td>First name, last name</td>
            </tr>
            <tr>
              <td>Contact</td>
              <td>Work email address</td>
            </tr>
            <tr>
              <td>Professional</td>
              <td>Organisation name, job title</td>
            </tr>
            <tr>
              <td>Request content</td>
              <td>Product of interest, request type, message content and correspondence</td>
            </tr>
            <tr>
              <td>Transaction security</td>
              <td>Hosting infrastructure logs such as IP address, browser information and access time</td>
            </tr>
            <tr>
              <td>Preferences</td>
              <td>
                Your cookie consent choice (<Link href={localizedPath("en", "/legal/cookies")}>Cookie Policy</Link>)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "amaclar",
    title: "Purposes of processing",
    content: (
      <ul>
        <li>Receiving, assessing and answering demo, pilot, Letter of Intent (LOI) and collaboration requests;</li>
        <li>Carrying out institutional communication and collaboration processes;</li>
        <li>Planning and recording pre-contract discussions;</li>
        <li>Keeping the website secure and available;</li>
        <li>Meeting legal obligations and answering requests from competent authorities.</li>
      </ul>
    ),
  },
  {
    id: "hukuki-sebepler",
    title: "Collection method and legal bases",
    content: (
      <>
        <p>
          Your personal data is collected through the information you enter in the contact form, which is delivered
          to our company email address by our email delivery provider when you submit it, the emails you send us
          directly, and automatically by the website infrastructure. It is processed on the following legal bases under
          Article 5(2) of KVKK:
        </p>
        <ul>
          <li>
            <strong>Art. 5(2)(c):</strong> processing is directly related to concluding or performing a contract
            (pilot, LOI and collaboration discussions);
          </li>
          <li>
            <strong>Art. 5(2)(ç):</strong> processing is necessary for the data controller to meet a legal obligation;
          </li>
          <li>
            <strong>Art. 5(2)(f):</strong> processing is necessary for the data controller’s legitimate interests
            (answering requests, site security), provided it does not harm your fundamental rights and freedoms.
          </li>
        </ul>
        <p>
          Processing that relies on explicit consent, such as non-essential cookies, takes place only after you give
          consent, and you can withdraw consent at any time.
        </p>
      </>
    ),
  },
  {
    id: "aktarim",
    title: "Transfers of personal data",
    content: (
      <>
        <p>
          Limited to the purposes above, your personal data may be transferred to the providers of our email, form
          delivery and hosting services, to public institutions legally authorised to receive it, and to competent authorities on request.
        </p>
        <p>
          If you load the location map on the contact page, data such as your IP address and browser information is sent
          directly to Google, which provides the map; the map loads only with your consent or at your request. Where our
          service providers’ servers are located outside Türkiye, transfers follow the mechanisms set out in Article 9 of
          KVKK. Your personal data is not sold or rented to third parties for marketing.
        </p>
      </>
    ),
  },
  {
    id: "saklama",
    title: "Retention and security",
    content: (
      <>
        <p>
          Your personal data is kept for as long as the purpose of processing requires and for the limitation periods
          set by law. When these periods end, the data is deleted, destroyed or anonymised.
        </p>
        <p>
          To keep your data secure, we apply administrative and technical measures such as limiting access to authorised
          staff, encrypting data in transit and keeping access logs.
        </p>
      </>
    ),
  },
  {
    id: "haklar",
    title: "Your rights under Article 11 of KVKK",
    content: (
      <>
        <p>Under Article 11 of KVKK, you may apply to the data controller to:</p>
        <ol>
          <li>Learn whether your personal data is processed;</li>
          <li>Request information about it if it is;</li>
          <li>Learn the purpose of processing and whether the data is used for that purpose;</li>
          <li>Know the third parties in Türkiye or abroad to whom it is transferred;</li>
          <li>Request correction if it is incomplete or inaccurate;</li>
          <li>Request deletion or destruction under the conditions in Article 7 of KVKK;</li>
          <li>Request that third parties who received the data are notified of any correction, deletion or destruction;</li>
          <li>Object to a result against you that arises solely from analysis by automated systems;</li>
          <li>Claim compensation if you suffer damage because of unlawful processing.</li>
        </ol>
      </>
    ),
  },
  {
    id: "basvuru",
    title: "How to apply",
    content: (
      <>
        <p>
          In line with the Communiqué on the Procedures and Principles of Application to the Data Controller, you can
          send requests about your rights, together with information that identifies you, to{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("KVKK Başvurusu")}`}>{CONTACT_EMAIL}</a> with
          the subject line “KVKK Başvurusu” (KVKK application).
        </p>
        <p>
          Your application is concluded free of charge as soon as possible and within thirty days at the latest,
          depending on its nature. If the request involves an additional cost, the fee set by the Personal Data
          Protection Board may be charged.
        </p>
      </>
    ),
  },
  {
    id: "degisiklikler",
    title: "Changes to this policy",
    content: (
      <p>
        This policy may be updated as the law or our activities change. The current version is always published on this
        page; the “Last updated” date at the top shows the most recent change.
      </p>
    ),
  },
];

const documents: Record<
  Locale,
  { eyebrow: string; title: string; summary: string; facts: LegalFact[]; sections: LegalSection[] }
> = {
  tr: {
    eyebrow: "Yasal · KVKK aydınlatma metni",
    title: "Gizlilik ve KVKK Politikası",
    summary:
      "Hangi kişisel verinizi neden işlediğimizi, hangi hukuki sebebe dayandığımızı ve 6698 sayılı Kanun'daki haklarınızı nasıl kullanacağınızı anlatıyoruz.",
    facts: [
      { label: "Belge türü", value: "Aydınlatma metni ve gizlilik politikası" },
      { label: "Mevzuat", value: "6698 sayılı KVKK · md. 10–11" },
      { label: "Veri sorumlusu", value: "LavieuxLabs" },
    ],
    sections: sectionsTr,
  },
  en: {
    eyebrow: "Legal · KVKK privacy notice",
    title: "Privacy Policy",
    summary:
      "Which personal data we process and why, the legal basis we rely on, and how to use your rights under Turkey's data protection law (KVKK, Law No. 6698).",
    facts: [
      { label: "Document type", value: "Privacy notice and policy" },
      { label: "Law", value: "KVKK (Law No. 6698) · Art. 10–11" },
      { label: "Data controller", value: "LavieuxLabs" },
    ],
    sections: sectionsEn,
  },
};

export default function PrivacyView({ locale }: { locale: Locale }) {
  return <LegalDocument locale={locale} currentHref="/legal/privacy" {...documents[locale]} />;
}
