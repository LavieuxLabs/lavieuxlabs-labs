# Çok dilli yapı ayrıntıları, metrikler, sayfa tarihleri ve baskı

CLAUDE.md'den taşındı; metin değiştirilmedi (son bölümdeki sayfa tarihleri yenidir). Yeni sayfa veya referans sayfası eklemeden, metriklerle, sayfa tarihleriyle, sayı ve birim biçimiyle, yasal çeviri notuyla veya baskıyla çalışmadan önce okunur. CLAUDE.md'deki kurallar burada tekrar edilmez ve her zaman geçerlidir.

## Çok dilli yapı (TR / EN)

  * Her dilin kendi kök layout'u vardır, böylece `<html lang>` statik HTML'de doğrudur. Proxy/rewrite kullanılmaz. Eşleşmeyen URL'ler `src/app/global-not-found.tsx`'e düşer (`experimental.globalNotFound`).
  * Her sayfa kendi `canonical` ve `hreflang` (tr, en, x-default) bağlantılarını `defineMetadata` ile üretir; layout bunu yapamaz çünkü hangi sayfayı sardığını bilmez.
  * Standartlar ve referans portalı `/standartlar` altındadır (görünümler `src/views/standards/`, kabuk `StandardDoc`): Tisdale skoru, CKD-EPI 2021, FHIR R4 entegrasyonu. Yeni referans sayfası `ROUTES`'a ve hub'daki listeye eklenir; JSON-LD `standardPageJsonLd` ile üretilir (klinik sayfa `MedicalWebPage`, teknik sayfa `TechnicalArticle`). İçerik yalnızca kaynağı kesin olan formül, eşik ve kodları içerir; ürün davranışı olarak yalnızca sitede zaten belgelenmiş olan yazılır. Gerçek bir hekim incelemesi olmadan `reviewedBy` eklenmez. Resmi FHIR profilleri ve OpenAPI yayımlanana kadar "henüz yayımlanmadı" yazılır.
  * "Geliştirme adımı" klinik doğrulama fazlarıyla (Faz 0–4) karıştırılmaz. `version` `package.json` sürümüyle aynı olmalıdır, değilse derleme durur. `engineStatus` iç bilgidir ve ekranda gösterilmez ("active/canlı" izlenimi verilmez). Değerler `npm run metrics:update -- --phase 14 --rules 48` (`scripts/update-metrics.mjs`) ile güncellenir; script sürümü `package.json` ve `package-lock.json`'a da yazar, `lastUpdated`'a günün tarihini koyar, dosyaların satır sonlarını korur. `safetyPlanes` ve `trl` script ile değiştirilmez (içerikle birlikte elle). Dışarıdan güncelleme: `.github/workflows/update-metrics.yml`, `repository_dispatch` türü `update-metrics`, payload `{ "phase", "total", "rules", "tests", "version" }`; değerler kabuğa yalnızca ortam değişkeniyle geçer ve script doğrular.
  * Sayılar dile göre gruplanır (`2.480+` / `2,480+`, `groupDigits()`); birimler dile göre yazılır (`mL/dk/1,73 m²` / `mL/min/1.73 m²`).
  * Yasal metinlerin İngilizcesi kolaylık çevirisidir; `LegalDocument` İngilizce sayfada Türkçe metnin esas olduğunu belirtir.
  * Yazdırılabilir bölüm: kök elemana `data-print-sheet="ad"`, yanına `PrintButton target="ad"`. Baskıda beyaz zemin, siyah metin, A4 tek sayfa; site çerçevesi (navbar, footer, çerez bandı, backdrop, sayfa içi menü) `print:hidden` taşır. Baskı stilleri `globals.css` sonundaki `@media print` bloğundadır. Her sayfa baskıda ve PDF'te teknik bülten gibi çıkar: beyaz zemin, koyu grafit metin (`#1F2328`), `#D0D4DA` saç çizgileri; canvas gizlenir, kart, tablo satırı ve özellik satırı bölünmez, başlık sayfa sonunda yalnız kalmaz. Kopyalama gibi araç butonları `print:hidden` taşır.

## Sayfa tarihleri

- `STANDARDS_UPDATED`: Standartlar dizininin ve her referans sayfasının metninin son değiştiği tarih (ISO 8601). Sayfadaki "Son güncelleme" satırı ve JSON-LD `dateModified` buradan okunur. `StandardDoc` sayfanın yolunu `path` prop'u ile alır.
- `PAGE_UPDATED`: her rotanın metninin son değiştiği tarih; sitemap `lastModified` buradan üretilir. Standart ve yasal sayfalar `STANDARDS_UPDATED` ve `LEGAL_UPDATED`'tan gelir, diğer sayfalar burada elle yazılır. Yeni bir rota eklenince buraya da eklenir (tip `Record<RoutePath, string>`, eksik rota tip hatasıdır).
- `PILOT_PROTOCOL_REVISION`: basılan pilot protokolünün başlığındaki revizyon tarihi; protokol metni değişince güncellenir.
- `SITE_LAST_MODIFIED` elle yazılmaz: `PAGE_UPDATED`'taki en yeni tarihtir ve footer'daki doğrulama künyesinde gösterilir. Tarih, sayfanın metnini son değiştiren commit'in tarihidir.
