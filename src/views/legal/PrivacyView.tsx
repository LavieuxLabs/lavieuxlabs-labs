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
          <strong>Bu site hasta verisi toplamayı amaçlamaz.</strong> Lütfen iletişim formuna ve e-postalarınıza hasta
          verisi, gerçek fatura verisi veya diğer özel nitelikli kişisel verileri yazmayınız. Formdaki serbest metin
          alanı, böyle bir verinin yanlışlıkla yazılmasını teknik olarak engelleyemez; bu tür bir veri bize ulaşırsa
          yalnızca silinmesi için gereken ölçüde incelenir ve silinir.
        </p>
        <p>
          Pilot ve doğrulama çalışmaları kapsamında işlenebilecek sağlık verileri; bu metinden bağımsız olarak, ilgili
          kurumla imzalanan veri işleme sözleşmesi, etik kurul onayı ve ayrı bir aydınlatma çerçevesinde ele alınır.
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
              <td>E-posta adresi (kurumsal adres tercih edilir)</td>
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
          sağlayıcımız aracılığıyla iletişim adresimize (contact@lavieuxlabs.com) iletilen bilgiler, doğrudan gönderdiğiniz e-postalar ve
          web sitesi altyapısı tarafından otomatik yollarla toplanır. Her işleme faaliyeti için uygulanacak hukuki
          sebep ayrı değerlendirilir:
        </p>
        <ul>
          <li>
            <strong>md. 5/2(c):</strong> İlgili kişinin talebi üzerine bir sözleşmenin kurulmasına yönelik pilot veya
            iş birliği görüşmelerinin yürütülmesi için doğrudan gerekli olan işlemler,
          </li>
          <li>
            <strong>md. 5/2(ç):</strong> Somut olayda uygulanabilir bir kayıt, başvuru yanıtlama veya yetkili merciye
            bilgi verme yükümlülüğünün yerine getirilmesi,
          </li>
          <li>
            <strong>md. 5/2(f):</strong> İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri
            sorumlusunun meşru menfaati (ilk temas ve akademik iş birliği taleplerini yanıtlama, kötüye kullanımı
            önleme ve site güvenliği).
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
          Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olarak aşağıdaki hizmet sağlayıcıların sistemlerinden geçer
          veya bu sistemlerde tutulur. Ayrıca hukuken yetkili kamu kurum ve kuruluşlarına ve talep edilmesi halinde
          yetkili mercilere aktarılabilir.
        </p>
        <ul>
          <li>
            <strong>Vercel:</strong> web sitesinin ve iletişim formunun barındırılması, formun sunucu tarafında
            işlenmesi.
          </li>
          <li>
            <strong>Resend:</strong> form içeriğinin e-posta olarak iletişim adresimize gönderilmesi.
          </li>
          <li>
            <strong>Cloudflare:</strong> alan adı (DNS), ağ altyapısı ve contact@lavieuxlabs.com adresine gelen
            e-postaların yönlendirilmesi.
          </li>
          <li>
            <strong>Google (Gmail):</strong> yönlendirilen e-postaların ve yazışmaların tutulduğu posta kutusu.
          </li>
        </ul>
        <p>
          İletişim sayfasındaki konum haritasını yüklemeniz halinde, IP adresiniz ve tarayıcı bilgileriniz gibi veriler
          harita hizmetini sağlayan Google’a doğrudan iletilir; harita yalnızca onayınız veya talebiniz üzerine
          yüklenir. Bu sağlayıcıların sunucuları Türkiye dışında bulunabilir; bu nedenle verileriniz yurt dışına
          aktarılabilir. Sağlayıcıların içerik, kayıt ve yedek saklama koşulları kendi politikalarına tabidir. Kişisel
          verileriniz pazarlama amacıyla üçüncü kişilere satılmaz veya kiralanmaz.
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
          Sonuçlanmayan iletişim talepleri son yazışmadan itibaren en fazla 12 ay saklanır. Aktif bir pilot, iş birliği
          veya sözleşme görüşmesine dönüşen yazışmalar, görüşme sona erdikten sonra en fazla 24 ay saklanır; yürürlükteki
          mevzuatın daha uzun bir süreyi zorunlu kıldığı veya hukuki bir uyuşmazlık için saklamanın gerekli olduğu
          durumlar saklıdır. Resend, e-posta ve günlük verilerini kendi hizmet koşulları uyarınca 30 gün tutar. Süresi
          dolan kayıtlar üç ayda bir gözden geçirilir ve silinir; silme kayıtları ilgili mevzuatın gerektirdiği süre
          boyunca tutulur.
        </p>
        <p>
          Verilerinizin güvenliği için erişimin yetkili ekip üyeleriyle sınırlandırılması, iletim sırasında şifreleme ve
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
          <strong>This site does not aim to collect patient data.</strong> Please do not enter patient data, real claim
          data or other special categories of personal data in the contact form or in your emails. The free-text field
          cannot technically prevent such data from being entered by mistake; if it reaches us, it is reviewed only as
          far as needed to delete it, and then deleted.
        </p>
        <p>
          Health data that may be processed in pilot and validation studies is handled separately from this notice,
          under a data processing agreement signed with the institution, ethics committee approval and a separate
          information notice.
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
              <td>Email address (a work address is preferred)</td>
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
          to our contact address (contact@lavieuxlabs.com) by our email delivery provider when you submit it, the emails you send us
          directly, and automatically by the website infrastructure. The applicable legal basis is assessed separately
          for each processing activity:
        </p>
        <ul>
          <li>
            <strong>Art. 5(2)(c):</strong> processing directly necessary, at the individual&apos;s request, to take steps
            toward a pilot or collaboration agreement;
          </li>
          <li>
            <strong>Art. 5(2)(ç):</strong> processing necessary to meet a record-keeping, application-response or
            competent-authority obligation that applies in the specific case;
          </li>
          <li>
            <strong>Art. 5(2)(f):</strong> processing is necessary for the data controller’s legitimate interests
            (answering first-contact and academic collaboration requests, preventing abuse and keeping the site
            secure), provided it does not harm your fundamental rights and freedoms.
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
          Limited to the purposes above, your personal data passes through or is held in the systems of the service
          providers below. It may also be transferred to public institutions legally authorised to receive it, and to
          competent authorities on request.
        </p>
        <ul>
          <li>
            <strong>Vercel:</strong> hosting of the website and the contact form, and server-side processing of the
            form.
          </li>
          <li>
            <strong>Resend:</strong> delivery of the form content as an email to our contact address.
          </li>
          <li>
            <strong>Cloudflare:</strong> the domain name (DNS), network infrastructure and forwarding of email sent to
            contact@lavieuxlabs.com.
          </li>
          <li>
            <strong>Google (Gmail):</strong> the mailbox where forwarded emails and correspondence are kept.
          </li>
        </ul>
        <p>
          If you load the location map on the contact page, data such as your IP address and browser information is sent
          directly to Google, which provides the map. The map loads only with your consent or at your request. These providers’
          servers may be located outside Türkiye, so your personal data may be transferred abroad. The providers’
          conditions for keeping content, logs and backups follow their own policies. Your personal data is not sold or
          rented to third parties for marketing.
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
          Contact requests that do not proceed are kept for no more than 12 months after the last message. Messages that
          become part of an active pilot, collaboration or contract discussion are kept for no more than 24 months after
          that discussion ends, unless applicable law requires a longer period or they must be preserved for a legal
          dispute. Under its own service terms, Resend keeps email and log data for 30 days. Expired records are reviewed
          and deleted every three months; deletion records are kept for the period required by applicable law.
        </p>
        <p>
          To keep your data secure, we apply administrative and technical measures such as limiting access to authorised
          team members, encrypting data in transit and keeping access logs.
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
        This policy may be updated as the law or our activities change. The current version is always published on this page, and the
        “Last updated” date at the top shows the most recent change.
      </p>
    ),
  },
];

const documents: Record<
  Locale,
  { eyebrow: string; title: string; summary: string; facts: LegalFact[]; sections: LegalSection[] }
> = {
  tr: {
    eyebrow: "Yasal: KVKK aydınlatma metni",
    title: "Gizlilik ve KVKK Politikası",
    summary:
      "Hangi kişisel verinizi neden işlediğimizi, hangi hukuki sebebe dayandığımızı ve 6698 sayılı Kanun'daki haklarınızı nasıl kullanacağınızı anlatıyoruz.",
    facts: [
      { label: "Belge türü", value: "Aydınlatma metni ve gizlilik politikası" },
      { label: "Mevzuat", value: "6698 sayılı KVKK, md. 10–11" },
      { label: "Veri sorumlusu", value: "LavieuxLabs" },
    ],
    sections: sectionsTr,
  },
  en: {
    eyebrow: "Legal: KVKK privacy notice",
    title: "Privacy Policy",
    summary:
      "Which personal data we process and why, the legal basis we rely on, and how to use your rights under Turkey's data protection law (KVKK, Law No. 6698).",
    facts: [
      { label: "Document type", value: "Privacy notice and policy" },
      { label: "Law", value: "KVKK (Law No. 6698), Art. 10–11" },
      { label: "Data controller", value: "LavieuxLabs" },
    ],
    sections: sectionsEn,
  },
};

export default function PrivacyView({ locale }: { locale: Locale }) {
  return <LegalDocument locale={locale} currentHref="/legal/privacy" {...documents[locale]} />;
}
