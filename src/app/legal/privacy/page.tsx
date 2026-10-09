import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { ControllerDetails, type LegalSection } from "@/components/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Politikası",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında LavieuxLabs aydınlatma metni ve gizlilik politikası.",
};

const sections: LegalSection[] = [
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
        <ControllerDetails />
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
                Çerez onay tercihiniz (<Link href="/legal/cookies">Çerez Politikası</Link>)
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
          Kişisel verileriniz; iletişim formu aracılığıyla oluşturulan e-posta taslağı, doğrudan gönderdiğiniz
          e-postalar ve web sitesi altyapısı tarafından otomatik yollarla toplanır. Veriler, KVKK md. 5/2 kapsamında
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
          Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olarak; e-posta ve barındırma hizmeti aldığımız
          tedarikçilere, hukuken yetkili kamu kurum ve kuruluşlarına ve talep edilmesi halinde yetkili mercilere
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

export default function PrivacyPage() {
  return (
    <LegalDocument
      currentHref="/legal/privacy"
      eyebrow="Yasal · KVKK aydınlatma metni"
      title="Gizlilik ve KVKK Politikası"
      summary="Hangi kişisel verinizi neden işlediğimizi, hangi hukuki sebebe dayandığımızı ve 6698 sayılı Kanun'daki haklarınızı nasıl kullanacağınızı anlatıyoruz."
      sections={sections}
    />
  );
}
