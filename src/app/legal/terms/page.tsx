import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kullanım Şartları ve Koşulları",
  description: "LavieuxLabs web sitesinin kullanımına ilişkin şartlar ve koşullar.",
};

const sections: LegalSection[] = [
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
        <Link href="/legal/privacy">Gizlilik ve KVKK Politikası</Link> ile{" "}
        <Link href="/legal/cookies">Çerez Politikası</Link>’nda yer almaktadır.
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

export default function TermsPage() {
  return (
    <LegalDocument
      currentHref="/legal/terms"
      eyebrow="Yasal"
      title="Kullanım Şartları ve Koşulları"
      summary="LavieuxLabs web sitesinin kullanımına ilişkin koşulları, içeriklerin niteliğini ve tarafların sorumluluklarını açıklıyoruz."
      sections={sections}
    />
  );
}
