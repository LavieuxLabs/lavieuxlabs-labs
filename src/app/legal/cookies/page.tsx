import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/LegalDocument";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { CONSENT_STORAGE_KEY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "LavieuxLabs web sitesinde kullanılan çerezler ve benzeri teknolojiler ile tercihlerinizi nasıl yönetebileceğiniz.",
};

const sections: LegalSection[] = [
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
        <CookieSettingsButton className="mt-5 cursor-pointer rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]" />
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
        <Link href="/legal/privacy">Gizlilik ve KVKK Politikası</Link>’nı inceleyebilirsiniz.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalDocument
      currentHref="/legal/cookies"
      eyebrow="Yasal"
      title="Çerez Politikası"
      summary="Bu sitede hangi çerezleri ve benzeri teknolojileri neden kullandığımızı ve tercihinizi nasıl değiştirebileceğinizi anlatıyoruz."
      sections={sections}
    />
  );
}
