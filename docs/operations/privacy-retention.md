# İletişim verisi saklama ve silme prosedürü

Bu prosedür yalnızca `lavieuxlabs.com` iletişim formu ve bu formu izleyen e-posta yazışmaları içindir. Hasta verisi, gerçek fatura verisi veya özel nitelikli kişisel veri bu kanallardan istenmez ve bilerek saklanmaz.

## Saklama takvimi

| Kayıt | Azami süre | İşlem |
| --- | --- | --- |
| Sonuçlanmayan tanışma, akademik iş birliği veya pilot talebi | Son yazışmadan sonra 12 ay | Gelen kutusu, gönderilenler ve ilgili etiketlerden sil |
| Aktif pilot, iş birliği veya sözleşme görüşmesi | Görüşme sona erdikten sonra 24 ay | Hukuki zorunluluk veya uyuşmazlık yoksa sil |
| Resend e-posta ve günlük verileri | Sağlayıcının güncel politikası uyarınca 30 gün | Sağlayıcı tarafından otomatik silinir; ayar değişikliklerini üç ayda bir kontrol et |
| Vercel çalışma zamanı günlükleri | Hesap planının güncel saklama süresi | Form içeriğini hiçbir zaman uygulama günlüklerine yazma; Log Drain açılırsa bu tabloyu güncelle |
| Silme işlemi kayıtları | En az 3 yıl | Yalnızca tarih, kapsam, yöntem ve işlemi yapan kişi; başvuru içeriğini kayda alma |

## Üç aylık kontrol

Ocak, Nisan, Temmuz ve Ekim aylarının ilk haftasında:

1. `contact@lavieuxlabs.com` gelen kutusu, gönderilenler, arşiv, çöp ve oluşturulmuş tüm etiketleri kontrol et.
2. Son yazışma tarihine göre süresi dolan konuşmaları sil. Hukuki saklama gerekçesi varsa konuşmaya erişimi sınırlandırılmış `legal-hold` etiketi ekle; gerekçeyi ve gözden geçirme tarihini silme kaydına yaz.
3. Çöp kutusunu kalıcı olarak boşalt. Sağlayıcının yedek veya kurtarma süresi ayrıca işleyebilir; bunu aydınlatma metninde kesin anlık silme olarak anlatma.
4. Resend ve Vercel'in güncel saklama süreleri ile alt işleyen listesini kontrol et.
5. Tarih, silinen konuşma sayısı, istisna sayısı ve işlemi yapan kişiyi içeren bir silme kaydı oluştur. İsim, e-posta adresi veya mesaj içeriği yazma.

## Olay kuralı

Hasta verisi, gerçek fatura verisi veya başka özel nitelikli kişisel veri yanlışlıkla ulaşırsa içeriği normal talep gibi dolaşıma sokma. Yalnızca silme için gereken ölçüde incele, erişimi sınırla, göndereni güvenli kanal kullanması konusunda uyar ve silme işlemini içerik ayrıntısı olmadan kaydet.

## Yayın öncesi zorunlu doğrulamalar

- Gerçek kişi veya tüzel kişi veri sorumlusu açıkça belirlenmiş ve aydınlatma metninde doğru kimlikle yazılmış olmalı.
- Vercel, Resend, Cloudflare ve Google üzerinden gerçekleşen yurt dışı aktarımlar için uygulanacak KVKK md. 9 mekanizması hukuk danışmanıyla doğrulanmış olmalı.
- `contact@lavieuxlabs.com` posta kutusuna erişebilen kişiler yazılı olarak sınırlandırılmalı.
- LOI şablonu, LavieuxLabs'ı tüzel kişi gibi göstermemeli; her belge gerçek tarafı ve imza yetkisini ayrı göstermeli.
