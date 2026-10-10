---
name: design-system
description: LavieuxLabs design standards (Apple HIG · Geist · Linear · Dieter Rams) for this regulated health-tech site. Use whenever creating, changing or reviewing any UI in this project — pages, components, canvas visuals, colours, typography, motion, badges, eyebrows/labels, hover states, or clinical/financial example data — and before approving a visual change.
---

# 🎨 LavieuxLabs Design System (Apple HIG · Geist · Linear · Rams)

Bu proje klinik karar destek (PharmaDeux) ve gelir bütünlüğü (Shield) üreten regüle bir sağlık teknolojileri platformudur. Arayüzde "AI-generated" klişeler kesinlikle yasaktır.

## Kurallar

- GEIST DİSİPLİNİ (Bilgi Mimarisi & Tipografi):
  * Keskin 1px saç çizgisi sınırlar (`border-white/[0.06]` veya `border-navy-700`).
  * Rakam, metrik ve telemetri verilerinde daima `font-mono tabular-nums`. Bu kural sayısal değerin kendisi içindir (ör. `410 ms`, `₺1.280`, `F-2026-0414`); etiketler, açıklamalar ve bölüm başlıkları `font-sans` kalır.
  * Süslü italik (italic) ve degrade kelime vurguları yasaktır. Hiyerarşi yalnızca font ağırlığı (400, 500, 600) ve metin opaklığı (`text-white`, `text-white/60`) ile kurulur.
  * Metin kontrastı WCAG 2.1 AA'dır (≥4.5:1). En düşük metin opaklıkları: etiket `text-white/50`, üçüncül metin `text-white/55` (tüm yüzeylerde ≥5.4:1). `text-white/20…45` metinde kullanılmaz; placeholder en az `placeholder:text-white/50`.
  * Büyük harfli bağlamda (etiket, breadcrumb) yabancı marka adları `lang="en"` ile işaretlenir; aksi halde `lang="tr"` altında CSS "Shield"i "SHİELD" yapar. OG görsellerinde büyük harf `upperTr()` ile kodda yapılır (Satori Türkçe kuralını bilmez).
  * Bölüm etiketleri (eyebrow) ve durum etiketleri tek stildedir: `text-[11px] font-medium uppercase tracking-wider text-white/50`, `font-sans`, çerçevesiz. Yanlarında süs çizgisi veya nokta olmaz. Monospace daktilo etiketleri kullanılmaz.
  * Başlıklar tok ve sıkıdır: `font-semibold` (600) veya `font-bold` (700), `tracking-[-0.03em]`. İkinci cümle/yarı gerekiyorsa aynı başlıkta `text-white/50` ile yazılır (iki tonlu başlık).

- LINEAR METHOD (Yüzey & Mikro Etkileşimler):
  * Kartların hover durumunda parlama yerine mikro yüzey tonu değişimi (`bg-white/[0.02]` -> `bg-white/[0.04]`).
  * Etkileşimlerde 120ms - 180ms arası hızlı, sönümlü geçişler (`transition-colors duration-150 ease-out`).
  * Dönen yapay lazer kenarlıklar (animated borders) kullanılmaz.
  * Durum noktaları sabittir (solid dot); `animate-ping` / `animate-pulse` kullanılmaz.
  * Hap rozetleri (`rounded-full` + kenarlık/zemin + iç boşluk) ve renkli durum noktaları kullanılmaz. Durum düz metinle yazılır: genel durumlar etiket stilinde, veri tablolarındaki risk/karar durumları yalnızca anlamsal renkli düz metinle (ör. `text-amber-200`).
  * Kartlarda şablon köşe numaraları (`01`, `02`), tikli (✓) madde yığınları ve etiket kümeleri olmaz. Kart = 2–3 cümlelik gövde + teknik özellik ızgarası.
  * Navbar'daki birincil eylem sayfayla bütünleşir: `border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1]`. Sayfa içi hero'larda tek bir dolu beyaz birincil buton kullanılabilir.

- APPLE HIG (Boşluk & Negatif Alan):
  * "Air as pedestal": Bölümler ve kartlar arasında ferah negatif alan bırak.
  * Neon ışımalar (`blur-3xl`, fosforlu ambient glow) yasaktır. Derinlik yalnızca zemin kademeleri (`navy-900` → `navy-850` → `navy-800`) ile verilir. Renkli `shadow-[0_0_...]` gölgeler kullanılmaz; açılır menüler gibi yükseltilmiş yüzeylerde yalnızca nötr siyah gölge (`shadow-black/40`).
  * Zemin optik derinliktir, ışıma değil (`SiteBackdrop`): merkezde sakin cerrahi lacivert odak (`#112035`), kenarlara doğru donanım siyah-laciverte (`#080E18`) düşen vinyet (`bg-optic`); neredeyse görünmez mikro ızgara (çizgi opaklığı 0.015); tüm sayfa üzerinde ~%1.8 analog grain (`bg-grain`). Vinyet ve grain yalnızca `SiteBackdrop`'ta kullanılır.
  * Sayfa omurgası: `TelemetryRails` (SiteShell'de bir kez) içerik kabının (max-w-7xl) kenarlarında, tepeden footer'a iki 1px dikey ray çizer (`bg-white/[0.03]`). Bölüm başlarında `RailMarker` (artı, üç saç çizgisi çentik, nokta; `text-white/[0.1]`) eyebrow satırına hizalı durur. Yeni bölüm eklenirken işaretçi eklenir; dönen, nefes alan veya ışıyan dekor eklenmez.
  * Logo tek kaynaktır: `LogoMark` (`Navbar.tsx`), "optik karar çekirdeği": 1.5px iris çemberi ve 8 Selçuklu ekseni çentiği, 1px odak halkası ve telemetri artısı, dolgulu çekirdek. Favicon (`src/app/icon.svg`) ve OG işareti (`ogImage.tsx`) aynı geometriyi kullanır; hover'da yalnızca artı 45° döner.
  * Parlaklık sırası korunur: kenar `#080E18` < zemin `#0B131F` < odak `#112035` < kart `navy-850` < yükseltilmiş `navy-800`. Odak rengi değişirse kart kademeleri de odak üzerinde kalacak şekilde güncellenir; aksi halde kartlar zemine gömülmüş görünür.
  * Donuk cam (`material-bar`) yalnızca navigasyon gibi içeriğin üzerinde yüzen katmanlarda kullanılır; `prefers-reduced-transparency` tercihinde katı zemine düşer. Kartlarda cam efekti kullanılmaz.
  * Tek ekranda tek sakin aksan rengi kuralı uygulanır.

- DİL (Metin):
  * Sahada çalışan klinik eczacının, hekimin ve sağlık yöneticisinin konuştuğu gibi yaz: kısa, düz, somut cümleler.
  * Ardı ardına üç-dört sıfat dizme ("deterministik, denetlenebilir ve insan denetimli"). Bir cümlede bir iddia.
  * Slogan başlık yok ("X değil, Y", "Pazarlık konusu olmayan…", "amiral gemisi"). Başlık konuyu doğrudan söyler: "Reçeteden kayda altı adım."
  * İddiayı ölçülebilir gerçeğe indir (2.480+ test, THS 4, CE işareti yok). Bir şey henüz yoksa "henüz yok" yaz.
  * Mümkünse somut bir klinik veya operasyonel örnek ver ("eGFR'si 90 olan hastada güvenli olan reçete 30'da doz ayarı gerektirebilir").
  * İngilizce jargon yalnızca terim olarak yerleşmişse kalır (FHIR, append-only); ürün açıklamasında Türkçe karşılık kullanılır ("gönderim öncesi", "pre-claim" değil).
  * Tüm iletişim adresi tek kaynaktan gelir: `CONTACT_EMAIL` (`lavieuxlabs@gmail.com`); e-posta gösterilen kart ve butonlarda `CopyEmail` kullanılır (tıklayınca panoya kopyalar).

- SEO ve paylaşım:
  * Kanonik adres tek kaynaktır: `SITE_URL` (`src/lib/site.ts`, `NEXT_PUBLIC_SITE_URL` ile değiştirilir). `metadataBase`, JSON-LD, sitemap, robots ve OG görselleri buradan beslenir.
  * Yeni bir sayfa eklendiğinde yolu `ROUTES` (`src/i18n/config.ts`) listesine eklenir; `src/app/sitemap.ts` iki dil için buradan üretilir.
  * JSON-LD (`src/lib/structuredData.ts`): kurum `ResearchOrganization`'dır, `MedicalOrganization` değil (o tür sağlık hizmeti sunucuları içindir). Ürünler `SoftwareApplication`'dır; `offers` eklenmez ve düzenleyici durum açıkça yazılır (CE işareti yok).
  * OG görselleri `src/lib/ogImage.tsx` şablonundan üretilir; yazı tipleri `src/app/fonts/` altında (SIL OFL, `OFL.txt` ile birlikte). Metrik şeridinde değerler tek satıra sığmalıdır.

- Çok dilli yapı (TR / EN):
  * Türkçe varsayılandır ve kökte yaşar (`src/app/(tr)/`, URL'ler değişmez); İngilizce `/en` altındadır (`src/app/en/`). Her dilin kendi kök layout'u vardır, böylece `<html lang>` statik HTML'de doğrudur. Proxy/rewrite kullanılmaz. Eşleşmeyen URL'ler `src/app/global-not-found.tsx`'e düşer (`experimental.globalNotFound`).
  * Route dosyaları incedir; sayfa içeriği ve JSX `src/views/*View.tsx` içindedir ve `locale` prop'u alır. Metin `defineContent({ tr, en })` ile yazılır: İngilizce girdide eksik veya fazla anahtar tip hatasıdır.
  * Yeni sayfa: `src/views` altına view + `defineMetadata(path, { tr, en })`, `src/app/(tr)` ve `src/app/en` altına iki ince route dosyası, `ROUTES` (`src/i18n/config.ts`) listesine yol. Sitemap ve hreflang buradan üretilir.
  * Site içi bağlantılar dil öneksiz yazılır ve `localizedPath(locale, path)` ile verilir; `href="/..."` sabit yazılmaz. Bölüm kimlikleri (`#standartlar`, `#konum`) iki dilde aynıdır; dil anahtarı sorguyu ve hash'i taşır.
  * Her sayfa kendi `canonical` ve `hreflang` (tr, en, x-default) bağlantılarını `defineMetadata` ile üretir; layout bunu yapamaz çünkü hangi sayfayı sardığını bilmez.
  * Sayılar dile göre gruplanır (`2.480+` / `2,480+`, `groupDigits()`); birimler dile göre yazılır (`mL/dk/1,73 m²` / `mL/min/1.73 m²`). Klinik değerler `src/lib/clinicalCases.ts` içinde tek yerde tutulur, yalnızca metin dile göre değişir.
  * İngilizce metin aynı dil kurallarına uyar: kısa, düz, teknik İngilizce; "next-gen", "seamless", "cutting-edge", "revolutionary", "empower" gibi sıfatlar yasaktır. Türkiye'ye özgü kurumlar ilk geçtiği yerde açıklanır (SUT, SGK, KVKK). THS → TRL.
  * Yasal metinlerin İngilizcesi kolaylık çevirisidir; `LegalDocument` İngilizce sayfada Türkçe metnin esas olduğunu belirtir.
  * Yazdırılabilir bölüm: kök elemana `data-print-sheet="ad"`, yanına `PrintButton target="ad"`. Baskıda beyaz zemin, siyah metin, A4 tek sayfa; site çerçevesi (navbar, footer, çerez bandı, backdrop, sayfa içi menü) `print:hidden` taşır. Baskı stilleri `globals.css` sonundaki `@media print` bloğundadır.

- DIETER RAMS (Fonksiyonel Doğruluk):
  * Süs amaçlı 2D karalama organlar, bilim kurgu vizör çentikleri (`┌ ┐ └ ┘`) veya retro RPG kalkanları konulamaz.
  * Tıbbi ve operasyonel veriler gerçek klinik/finansal parametrelerle ve doğru birimleriyle temsil edilir (ör. QTc (Fridericia) ms cinsinden, Tisdale risk skoru puan cinsinden, eGFR mL/dk/1,73 m², provizyon kodu). Bir skor ile bir ölçüm birbirine karıştırılmaz: "Tisdale QTc 410 ms" yanlıştır; doğrusu "QTc 410 ms · Tisdale: düşük risk".
  * Örnek veya kurgusal veri gösteren her görsel bunu açıkça belirtir ("Örnek telemetri", "kurgusal veri").
  * Gerçek kod sistemleri yalnızca doğru anlamlarıyla kullanılır (ICD-10 kodu ve doğru açıklaması). Doğruluğu bilinmeyen resmi kodlar (ör. SUT işlem kodları) uydurulmaz; bunun yerine gerçek kategoriye atıf yapılır (EK-2B hizmet başı, EK-2C tanıya dayalı paket).
  * Denetim izinde gösterilen hash'ler süs değildir; gerçekten hesaplanır ve önceki kaydın hash'ini içerir.

## Token'lar (src/app/globals.css)

| Rol | Token | Değer |
| --- | --- | --- |
| Optik odak (yalnızca `bg-optic`) | — | `#112035` |
| Base zemin (cerrahi klinik lacivert) | `navy-900` | `#0B131F` |
| Kart ve yüzeyler | `navy-850` | `#14233A` |
| Yükseltilmiş konsol / modal / açılır menü | `navy-800` | `#1A2B44` |
| Derin yüzey (footer künyesi) | `navy-950` | `#080F19` |
| Saç çizgisi kenarlık | `white/[0.06]` (alternatif `navy-700`) | `#22344B` |
| PharmaDeux aksanı | `pharma` (= `teal-400`) | `#4FC1B6` |
| Shield aksanı | `shield` (= `indigo-400`) | `#7FA2E6` |
| Akademik aksanı | `academic` | `#B7A6E8` |

`teal`, `indigo` ve `emerald` Tailwind skalaları `@theme` içinde klinik palete yeniden eşlenmiştir; yeni kodda mümkünse `pharma` / `shield` / `academic` adlarını kullan. Kırmızı (`rose`), turuncu (`amber`) ve yeşil (`emerald`) yalnızca klinik şiddet ve risk durumları için ayrılmıştır; marka aksanı veya süs olarak kullanılmaz.

Tailwind arbitrary değerlerinin içinde boşluk olmaz: `shadow-[0_0_8px_rgba(0,0,0,0.4)]` doğru, `rgba(0, 0, 0, 0.4)` sınıfı sessizce bozar.

CSS'te `backdrop-filter`'ı yalnızca öneksiz yaz. Lightning CSS `-webkit-` önekini kendisi ekler; ikisini birlikte yazarsan yalnızca önekliyi tutar ve bulanıklık Chrome'da sessizce kaybolur.

Grid veya flex öğesi içinde yatay kayan bir tablo varsa öğeye `min-w-0` ver; yoksa tablo sütunu genişletir ve sayfa `overflow-x-clip` altında sessizce kırpılır.

## İnceleme kontrol listesi

Bir arayüz değişikliğini bitirmeden önce kodda şunları ara; her eşleşme bir ihlaldir:

```bash
grep -rnE "bg-clip-text|italic|<em[ >]" src            # degrade / italik vurgu
grep -rnE "shadow-\[0_0|blur-3xl|bg-\[radial-gradient" src  # neon ışıma (mask-image hariç)
grep -rnE "animate-(ping|pulse)" src                   # yanıp sönen nokta
grep -rnE "font-mono[^\"]*uppercase|uppercase[^\"]*font-mono" src  # daktilo etiket
grep -rnE "duration-(300|500|700)" src                 # yavaş hover geçişi
grep -rnE "rounded-full[^\"]*(border|bg-)[^\"]*px-[0-9]" src  # hap rozeti
grep -rnE "rounded-full bg-(teal|emerald|amber|rose)-" src  # renkli durum noktası
grep -rniE "amiral|uçtan uca|yeni nesil|devrim|kusursuz|pazarlık konusu|iddiayla değil" src  # klişe metin
grep -rnE "(^|[^:/a-z-])text-white/(20|25|30|35|40|45)\b" src  # AA altı metin opaklığı
grep -rnE 'href="/[a-z]' src/components src/views | grep -v "hrefLang\|global-not-found"  # dil öneksiz sabit bağlantı (localizedPath kullan)
grep -rniE "next-gen|seamless|cutting-edge|revolutionary|empower|state-of-the-art" src  # İngilizce klişe
```

Ardından:
- Sayısal değerler `font-mono tabular-nums` mı, etiketler `font-sans` mı?
- Aynı ekranda birden fazla aksan rengi var mı? Varsa tek bir sakin aksana indir.
- Klinik örnekler doğru parametre ve birimle mi yazılmış? Örnek veri olarak etiketlenmiş mi?
- `prefers-reduced-motion` altında hareket statik bir kareye ya da kısa bir opaklık geçişine iniyor mu?
- Değişikliği masaüstü ve mobilde gerçek bir ekran görüntüsüyle kontrol et; yalnızca derlemenin geçmesi yeterli değildir.
