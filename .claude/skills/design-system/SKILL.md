---
name: design-system
description: LavieuxLabs design standards (Apple HIG · Geist · Linear · Dieter Rams) for this regulated health-tech site. Use whenever creating, changing or reviewing any UI in this project — pages, components, canvas visuals, colours, typography, motion, badges, eyebrows/labels, hover states, or clinical/financial example data — and before approving a visual change.
---

# 🎨 LavieuxLabs Design System (Apple HIG · Geist · Linear · Rams)

Bu proje klinik karar destek (PharmaDeux) ve gelir bütünlüğü (Shield) üreten regüle bir sağlık teknolojileri platformudur. Arayüzde "AI-generated" klişeler kesinlikle yasaktır.

## Kurallar

- GEIST DİSİPLİNİ (Bilgi Mimarisi & Tipografi):
  * Yazı tipi hiyerarşisi tek kaynaktır (`src/lib/fonts.ts`): IBM Plex Sans gövde ve kart metni (`font-sans`, varsayılan) + Newsreader hero ve bölüm başlıkları (`font-serif`) + IBM Plex Mono veri ve metrikler (`font-mono`). Başka yazı tipi eklenmez.
  * Keskin 1px saç çizgisi sınırlar: `border-hairline` / `divide-hairline` (token `--line`, beyaz %10; alternatif `border-navy-700`). Her kart dört kenarda da tam çerçeveye sahiptir; `gap-px` ızgaraların iç çizgileri de aynı token'dır (`bg-hairline`), böylece dış çerçeve ve iç kafes aynı ritimdedir. Yan yana duran özellik kartları ayrı kartlar olarak boşlukla dizilmez; birleşik ızgarada (`JoinedGrid`, `SpecCard variant="cell"`) tek bir dış çerçeve ve `gap-px` ile ortak 1px saç çizgisini paylaşır. Hücre içindeki özellik satırları ve kurumsal çıktı çizgisi hücrenin solundan sağına uçtan uca uzanır; aksan katmanı hücrenin üzerinde kalır. Izgara tek blok olarak belirir (hücre başına animasyon, arka plandaki saç çizgisi rengini parlatır). Hücreler `align` ile CSS subgrid olur (`grid-template-rows: subgrid`): başlık, açıklama, her özellik satırı ve kurumsal çıktı ayrı bir izde durur, böylece yan yana hücrelerin satır çizgileri cetvelle çizilmiş gibi aynı hizadadır; satırı az olan hücre kalan izleri boş bırakır. `border-white/[0.06]` sabit yazılmaz.
  * Rakam, metrik ve telemetri verilerinde daima `font-mono tabular-nums`. Bu kural sayısal değerin kendisi içindir (ör. `410 ms`, `₺1.280`, `F-2026-0414`); etiketler ve açıklamalar `font-sans`, hero ve bölüm başlıkları `font-serif` kalır.
  * Süslü italik (italic) ve degrade kelime vurguları yasaktır. Tek istisna `font-signature` (Newsreader italik, 400; `globals.css`): ekran başına en fazla 1 anahtar klinik ifade için onaylı imza stilidir (ör. ana sayfa hero'sunda "karar destek"). `text-white` ile yazılır; gövde, kart, etiket ve veri metninde kullanılmaz. Hiyerarşi yalnızca font ağırlığı (400, 500, 600) ve metin opaklığı (`text-white`, `text-white/60`) ile kurulur.
  * Metin kontrastı WCAG 2.1 AA'dır (≥4.5:1). En düşük metin opaklıkları: etiket `text-white/50`, üçüncül metin `text-white/55` (tüm yüzeylerde ≥5.4:1). `text-white/20…45` metinde kullanılmaz; placeholder en az `placeholder:text-white/50`.
  * Büyük harfli bağlamda (etiket, breadcrumb) yabancı marka adları `lang="en"` ile işaretlenir; aksi halde `lang="tr"` altında CSS "Shield"i "SHİELD" yapar. OG görsellerinde büyük harf `upperTr()` ile kodda yapılır (Satori Türkçe kuralını bilmez).
  * Bölüm etiketleri (eyebrow) ve durum etiketleri tek stildedir: `text-[11px] font-medium uppercase tracking-wider text-white/50`, `font-sans`, çerçevesiz. Yanlarında süs çizgisi veya nokta olmaz. Monospace daktilo etiketleri kullanılmaz. Tek istisna ürün sayfası hero'sudur: eyebrow'un yanında ürün ikonu ürün aksanıyla durur (`PageHero` `eyebrowIcon`; PharmaDeux `Pill` + `text-pharma`, Shield `ShieldCheck` + `text-shield`). Etiket metni yine `text-white/50` kalır. Ürün sayfalarında `SectionHeader accent` eyebrow'un üstüne ürün aksanında kısa bir çizgi koyar (`w-10`, %70, mutlak konumlu; ray işaretçisi hizası kaymaz).
  * Tek istisna klinik damgadır: ana sayfa hero'sunda, başlığın üzerinde yalnızca 1 tane (`HomeView`, `stamp`). Dikdörtgen çerçeve (`rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1`, hap değil), `font-mono text-[11px] tracking-wide text-white/55`, CSS `uppercase` yok (metin büyük harfle yazılır, "IIa" korunur). Nokta, ikon ve animasyon yoktur. İçerik yalnızca doğrulanabilir düzenleyici gerçeklerdir ("CDSS · MDR SINIF IIa HEDEFİ · THS 4" / "CDSS · MDR CLASS IIa TARGET · TRL 4"); "ACTIVE", "LIVE", "canlı" gibi sahada çalışma izlenimi veren ifadeler yazılmaz. Başka sayfa veya bölümde kullanılmaz.
  * Hero, sayfa ve bölüm başlıkları (h1, bölüm h2): `font-serif font-medium` (500), `tracking-[-0.02em]`; Newsreader'ın optik boyut ekseni büyük puntoda display kesimini kullanır. Kart ve küçük başlıklar: `font-sans font-semibold` (600), `tracking-[-0.03em]`. Başlıklar saf beyazdır (`text-white`) ve tek parçadır; soluk ikinci yarı (`text-white/50`, iki tonlu başlık) kullanılmaz. Başlık içinde yalnızca imza ifadesi (`font-signature`) ayrışır.

- LINEAR METHOD (Yüzey & Mikro Etkileşimler):
  * Kartların hover durumunda parlama yerine mikro yüzey tonu değişimi (`bg-white/[0.02]` -> `bg-white/[0.04]`). Sınır da hafifçe aydınlanır (`hover:border-white/15`). Ürün sayfalarında kart hover'ı ürün aksanına döner: üst kenar çizgisi parlaklaşır (%45 → %55) ve ikon aksan alır; `gap-px` ızgara hücrelerinde 1px üst çizgi (%50) ve ikon. Dinlenme hâlinde kart nötrdür; ışıma yoktur.
  * Etkileşimlerde 120ms - 180ms arası hızlı, sönümlü geçişler (`transition-colors duration-150 ease-out`).
  * Dönen yapay lazer kenarlıklar (animated borders) kullanılmaz.
  * Durum noktaları sabittir (solid dot); `animate-ping` / `animate-pulse` kullanılmaz.
  * Hap rozetleri (`rounded-full` + kenarlık/zemin + iç boşluk) ve renkli durum noktaları kullanılmaz. Durum düz metinle yazılır: genel durumlar etiket stilinde, veri tablolarındaki risk/karar durumları yalnızca anlamsal renkli düz metinle (ör. `text-amber-200`).
  * Kartlarda şablon köşe numaraları (`01`, `02`), tikli (✓) madde yığınları ve etiket kümeleri olmaz. Kart = 2–3 cümlelik gövde + teknik özellik ızgarası.
  * Tam taşan ızgara (full-bleed mesh): kutu içindeki her yatay çizgi (tablo satırı, `divide-y` listesi, özellik satırı, toplam satırı, metrik altı çizgisi) kutunun sol duvarından sağ duvarına sıfıra sıfır uzanır ve dikey bölücülere/çerçeveye 90° ile değer. Kapsayıcının yatay padding'i satırları içeri itmez: satır negatif marjla (`-mx-5`) kenara taşınır, iç boşluk satırın içindeki metne verilir (`px-5`). Kutusuz, serbest duran listeler bu kurala girmez.
  * Standart ve uyum kartlarında durum, üç adımlı uygulama izidir (Tasarım girdisi → Hazırlık → Uygulamada; `SpecCard status.tone`, nötr beyaz çubuklar). Mühür, rozet veya sertifika görünümü kullanılmaz: sertifikası olmayan bir standart sertifikalı gibi görünmemelidir.
  * Navbar'daki birincil eylem sayfayla bütünleşir: `border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1]`. Sayfa içi hero'larda tek bir dolu beyaz birincil buton kullanılabilir.

- APPLE HIG (Boşluk & Negatif Alan):
  * "Air as pedestal": Bölümler ve kartlar arasında ferah negatif alan bırak.
  * Neon ışımalar (`blur-3xl`, fosforlu ambient glow) yasaktır. Derinlik zemin kademeleriyle (`navy-900` → `navy-850` → `navy-800`) verilir. Tek istisna ürün ortam ışığıdır: ürün aksanında çok yayvan bir radial yıkama, %6–8 opaklık, yalnızca ürün sayfası hero'sunun arkasında (`PageHero ambient`) ve ana sayfa ürün kartının içinde (`ambient-card-*`; hover'da `ambient-card-*-hover` katmanı 150ms opaklık geçişiyle açılır, PharmaDeux %20, Shield %18). `globals.css`'teki `ambient-*` utility'leriyle yazılır; blur filtresi, renkli gölge ve animasyon kullanılmaz, veri katmanına girmez. Renkli `shadow-[0_0_...]` gölgeler kullanılmaz; açılır menüler gibi yükseltilmiş yüzeylerde yalnızca nötr siyah gölge (`shadow-black/40`).
  * Zemin optik derinliktir, ışıma değil (`SiteBackdrop`): merkezde sakin grafit odak (`#0E1016`), kenarlara doğru obsidyen siyaha (`#050609`) düşen vinyet (`bg-optic`); seçilebilen milimetrik mikro ızgara (çizgi opaklığı 0.03, grafik kağıdı dokusu); tüm sayfa üzerinde ~%1.8 analog grain (`bg-grain`). Vinyet ve grain yalnızca `SiteBackdrop`'ta kullanılır. Zeminin kendisi sayfaya göre hafif bir atmosfer taşır (`BackdropTint`, vinyet ile ızgara arasında): ana sayfada üst köşelerden süzülen Chinese Red ve hardal ışığı (`backdrop-dual`, %13), Hakkımızda ve yasal sayfalarda üstten cerrahi çelik, alttan sıcak titanyum vinyeti (`backdrop-steel`). Ürün sayfaları zemin tonu almaz; onların ışığı hero ortam ışığıdır (PharmaDeux %7, Shield %11: hardal koyu zeminde kırmızıdan zayıf okunduğu için daha yüksek opaklık ve yayılım ister).
  * Sayfa omurgası: `TelemetryRails` (SiteShell'de bir kez) içerik kabının (max-w-7xl) kenarlarında, tepeden footer'a iki 1px dikey ray çizer (`bg-white/[0.03]`). Bölüm başlarında `RailMarker` (artı, üç saç çizgisi çentik, nokta; `text-white/[0.1]`) eyebrow satırına hizalı durur. Yeni bölüm eklenirken işaretçi eklenir; dönen, nefes alan veya ışıyan dekor eklenmez.
  * Logo tek kaynaktır: "LL" monogramı (`src/lib/logoMark.ts`; `LogoMark`, `Navbar.tsx`). Çatı markadır, hiçbir ürüne ait değildir: iç içe iki L, 32 birimlik ızgarada, ikisi de aynı çubuk kalınlığında (3,5), iki eksende eşit boşluk (1,5); içteki L daha aşağıdan başlar (basamaklı üst), iki taban aynı çizgide biter. Dolgulu düz form; kontur, degrade, gölge ve animasyon yoktur, hover'da değişmez. OG işareti (`ogImage.tsx`) aynı yolları kullanır. Favicon (`src/app/icon.svg`) aynı formun 16px'e ayarlı sürümüdür: çubuk ve boşluk 4 birim (16px'te tam 2px), tüm koordinatlar çift sayı; küçük boyutta iki L birbirine yapışmaz. Rengi nötr omurgadır (`text-titanium`, `#9E9FA5`); ürün aksanı almaz. Kalkan, kapsül gibi tek bir ürünü çağrıştıran form logoya eklenmez.
  * Parlaklık sırası korunur: kenar `#050609` < zemin `#080A0F` < odak `#0E1016` < kart `navy-850` (`#151922`) < yükseltilmiş `navy-800` (`#1E2430`). Odak rengi değişirse kart kademeleri de odak üzerinde kalacak şekilde güncellenir; aksi halde kartlar zemine gömülmüş görünür.
  * Donuk cam (`material-bar`) yalnızca navigasyon gibi içeriğin üzerinde yüzen katmanlarda kullanılır; `prefers-reduced-transparency` tercihinde katı zemine düşer. Kartlarda cam efekti kullanılmaz.
  * Tek ekranda tek sakin aksan rengi kuralı uygulanır. Omurga (logo, menü, kılavuz, çerez bandı) nötr Cool Gray 5 C ve beyazdır. Bir ürün sayfasında yalnızca o ürünün aksanı kullanılır (PharmaDeux: Chinese Red, Shield: klinik hardal) ve o da yalnızca navigasyon odağında (aktif sekme, buton) ve hero ikonunda; ana sayfada iki ürün kartı kendi aksanını taşır, geri kalan her şey nötrdür. Ürün sayfalarında aksan dinlenme hâlinde de görünür: hero ortam ışığı, metrik hücrelerinin altında %30 çizgi, `SpecCard accent` ile kartın tam nötr çerçevesinin üzerine yalnızca üst kenarda tek temiz aksan çizgisi (%45, hover'da %55; sol/sağ/alt kenar ve nötr ızgara asla aksan almaz, ezilmez); ürün ve nötr hücreleri karışık bir ızgarada (ör. Standartlar) üst çizgi yalnızca hover'da görünür (`accentLine="hover"`), dinlenme hâlinde tüm hücrelerin üst kenarı aynı nötr saç çizgisidir ve aksan yalnızca kod etiketinde kalır ve kart kodu (INT-01 vb.) aksan ailesinde. Hakkımızda'daki Ar-Ge kartları ait oldukları ürünün aksanını belirgin taşır (`prominent`: üst aksan çizgisi ve kart başlığı aksan metin tonunda; karar yolu → PharmaDeux, gelir → Shield, iki ürüne ortak veri katmanı nötr). Kart kodları (STD-, REG-) kartın sahibi olan ürünün rengini alır; platform geneli standartlar nötr kalır (`text-white/70`), böylece renk ait olmadığı bir ürünü iddia etmez.

- DİL (Metin):
  * Sahada çalışan klinik eczacının, hekimin ve sağlık yöneticisinin konuştuğu gibi yaz: kısa, düz, somut cümleler.
  * Ardı ardına üç-dört sıfat dizme ("deterministik, denetlenebilir ve insan denetimli"). Bir cümlede bir iddia.
  * Slogan başlık yok ("X değil, Y", "Pazarlık konusu olmayan…", "amiral gemisi"). Başlık konuyu doğrudan söyler: "Reçeteden kayda altı adım."
  * İddiayı ölçülebilir gerçeğe indir (2.480+ test, THS 4, CE işareti yok). Bir şey henüz yoksa "henüz yok" yaz.
  * Mümkünse somut bir klinik veya operasyonel örnek ver ("eGFR'si 90 olan hastada güvenli olan reçete 30'da doz ayarı gerektirebilir").
  * İngilizce jargon yalnızca terim olarak yerleşmişse kalır (FHIR, append-only); ürün açıklamasında Türkçe karşılık kullanılır ("gönderim öncesi", "pre-claim" değil).
  * Tüm iletişim adresi tek kaynaktan gelir: `CONTACT_EMAIL` (`contact@lavieuxlabs.com`); e-posta gösterilen kart ve butonlarda `CopyEmail` kullanılır (tıklayınca panoya kopyalar).
  * Pilot / LOI formu `mailto:` kullanmaz: `POST /api/loi` (Resend REST API) ile doğrudan `CONTACT_EMAIL`'e gönderir. Doğrulama `src/lib/loi.ts`'te tek yerdedir ve sunucuda tekrar çalışır. Ortam değişkenleri: `RESEND_API_KEY` (zorunlu), `RESEND_FROM` (Resend'de doğrulanmış alan adı).
  * İletişimin üç yolu vardır (`CONTACT_PATHS`, `src/lib/site.ts`): 15 dk tanışma (`intro`, varsayılan, taahhütsüz, mesaj isteğe bağlı), akademik / klinik ortaklık (`academic`, ürün seçimi yok) ve pilot / retrospektif doğrulama (`pilot`, LOI). İlk temas LOI ile başlamaz: navbar'ın birincil eylemi ve ürün hero'ları tanışmaya, sayfa sonu CTA panelleri pilota gider. Bağlantılar `contactHref(path, product)` ile yazılır (`/contact?path=…&product=pharmadeux|shield`; eski `?solution=` hâlâ okunur). Rol ve pilot türü listeleri ürüne göre ayrıdır (`CONTACT_OPTIONS`, `src/lib/loi.ts`): PharmaDeux hekim ve eczacıya, Shield gelir döngüsü ekibine seslenir; metinler `src/lib/contactContent.ts`'tedir.

- SEO ve paylaşım:
  * Kanonik adres tek kaynaktır: `SITE_URL` (`src/lib/site.ts`, `NEXT_PUBLIC_SITE_URL` ile değiştirilir). `metadataBase`, JSON-LD, sitemap, robots ve OG görselleri buradan beslenir.
  * Yeni bir sayfa eklendiğinde yolu `ROUTES` (`src/i18n/config.ts`) listesine eklenir; `src/app/sitemap.ts` iki dil için buradan üretilir.
  * JSON-LD (`src/lib/structuredData.ts`): kurum `ResearchOrganization`'dır, `MedicalOrganization` değil (o tür sağlık hizmeti sunucuları içindir). Ürünler `SoftwareApplication`'dır; `offers` eklenmez ve düzenleyici durum açıkça yazılır (CE işareti yok).
  * `/.well-known/security.txt` (RFC 9116) `CONTACT_EMAIL` ve `SITE_URL`'den üretilir (`src/app/.well-known/security.txt/route.ts`); PGP anahtarı olmadığı için `Encryption` alanı yoktur, `Expires` en geç bir yılda yenilenir. `robots.ts` `/api/`'yi taramaya kapatır.
  * Etkileşimli simülatörler gerçek modellerle çalışır ve uydurma sayı üretmez: PharmaDeux QT simülatörü (`QtSimulator`) ilaç çifti için QTc değişimini ms olarak tahmin etmez; ölçülen QTc ve risk faktörlerini Tisdale skoruna (0–21) dönüştürür, ilaçlar gerçek ATC koduyla gelir. Shield fatura simülatörü (`ClaimSimulator`) kurgusal kural setidir; gerçek ICD-10 kodları kullanır, SUT madde numarası göstermez. İkisi de "Örnek · kurgusal veri" notu taşır.
  * Sistem durumu bildirilirken yalnızca doğrulanabilir gerçek yazılır (`VerificationImprint`, footer): canlı servis, "tüm servisler operasyonel", canlı test sayacı veya sertifika iddiası yoktur; denetim izi demosu FNV-1a'dır, SHA-256 değildir. Yayımlanmamış bir arayüz belgesi (OpenAPI/Postman) için "henüz yayımlanmadı" yazılır.
  * Simülatör durumu URL'dedir ve paylaşılabilir: QT simülatörü `?drug1=…&drug2=…&qtc=430|455|480&risk=age,female,loop,lowk`, fatura simülatörü `?item=angio|vent|ct&code=<ICD-10>&pre=0|1&repeat=0|1&signed=0|1`. Geçersiz değer varsayılana düşer; "Bağlantıyı kopyala" (`ShareLinkButton`) o anki durumu kopyalar. QT simülatörü ile FHIR önizlemesi ortak bir store'u (`qtStore`) paylaşır: önizleme ve indirilen Bundle seçili iki ilacın ATC kodlu `MedicationRequest`'ini, seçili QTc'nin LOINC 8636-3 `Observation`'ını ve Tisdale skorunu ayrı bir `Observation` olarak içerir (skor ölçümün içine katılmaz).
  * Formül, skor ve mevzuat adlarının yanında kaynak işareti (`Cite`, `src/lib/citations.ts`) durur: tıklayınca literatür künyesi veya standardın resmi başlığı açılır. Yalnızca kesin bilinen künye bilgisi yazılır (hafızadan DOI veya sayfa eklenmez); CKD-EPI 2021 için kaynak Inker LA et al., N Engl J Med 2021'dir (Levey AS et al., Ann Intern Med 2009 önceki sürümdür).
  * Pilot başvurusunun başarı ekranı üç adımlı süreci gösterir (teknik keşif, güvenlik ve izolasyon protokolü, pilot entegrasyon ve doğrulama). Süre taahhüdü yazılmaz: pilot protokolüne göre süre ve servisler kurumla belirlenir ve LOI'de yazılır.
  * Analitik isteğe bağlıdır ve rızaya bağlıdır (`Analytics` SiteShell'de, `src/lib/analyticsConfig.ts`): ortam değişkeni yoksa hiçbir harici script yüklenmez ve CSP `'self'` kalır. `NEXT_PUBLIC_ANALYTICS_DOMAIN` (önerilen; çerezsiz, Plausible uyumlu, script adresi `NEXT_PUBLIC_ANALYTICS_SRC`) veya `NEXT_PUBLIC_GA_ID` (GA4; çerez kullanır, veriyi Google'a gönderir: etkinleştirilmeden önce çerez politikası tablosuna eklenir) tanımlanınca CSP yalnızca o sağlayıcının kaynağıyla genişler. Script, ziyaretçi çerez bandında "Analitik" kategorisine izin vermeden yüklenmez; rıza geri alınınca olaylar hemen durur. Olaylar `trackEvent()` (`src/lib/analytics.ts`) ile gönderilir ve yalnızca sayılabilir değerler taşır (araç adı, kalem türü, QTc değeri): ad, e-posta, kurum adı veya serbest metin asla gönderilmez.
  * PharmaDeux vaka simülatörü bağlantıyla doğrudan açılır: `?case=polypharmacy|renal|qtc` (veya `1`–`3`) ya da `#vaka-1…3`; sayfa açıkken komut paleti `pharmadeux:case` olayıyla vakayı değiştirir.
  * OG görselleri `src/lib/ogImage.tsx` şablonundan üretilir; site ile aynı hiyerarşiyi kullanır (başlık Newsreader 500, metin IBM Plex Sans, sayılar IBM Plex Mono). Yazı tipleri `src/app/fonts/` altında statik dosyalardır, çünkü Satori WOFF2 ve değişken font okumaz: IBM Plex Sans 400/600 ve Plex Mono 500 (WOFF), Newsreader 72pt Medium (TTF); lisanslar `OFL-IBMPlex.txt` ve `OFL-Newsreader.txt` (SIL OFL). Metrik şeridinde değerler tek satıra sığmalıdır.

- Çok dilli yapı (TR / EN):
  * Türkçe varsayılandır ve kökte yaşar (`src/app/(tr)/`, URL'ler değişmez); İngilizce `/en` altındadır (`src/app/en/`). Her dilin kendi kök layout'u vardır, böylece `<html lang>` statik HTML'de doğrudur. Proxy/rewrite kullanılmaz. Eşleşmeyen URL'ler `src/app/global-not-found.tsx`'e düşer (`experimental.globalNotFound`).
  * Route dosyaları incedir; sayfa içeriği ve JSX `src/views/*View.tsx` içindedir ve `locale` prop'u alır. Metin `defineContent({ tr, en })` ile yazılır: İngilizce girdide eksik veya fazla anahtar tip hatasıdır.
  * Yeni sayfa: `src/views` altına view + `defineMetadata(path, { tr, en })`, `src/app/(tr)` ve `src/app/en` altına iki ince route dosyası, `ROUTES` (`src/i18n/config.ts`) listesine yol. Sitemap ve hreflang buradan üretilir.
  * Site içi bağlantılar dil öneksiz yazılır ve `localizedPath(locale, path)` ile verilir; `href="/..."` sabit yazılmaz. Bölüm kimlikleri (`#standartlar`, `#konum`) iki dilde aynıdır; dil anahtarı sorguyu ve hash'i taşır.
  * Her sayfa kendi `canonical` ve `hreflang` (tr, en, x-default) bağlantılarını `defineMetadata` ile üretir; layout bunu yapamaz çünkü hangi sayfayı sardığını bilmez.
  * Standartlar ve referans portalı `/standartlar` altındadır (görünümler `src/views/standards/`, kabuk `StandardDoc`): Tisdale skoru, CKD-EPI 2021, FHIR R4 entegrasyonu. Yeni referans sayfası `ROUTES`'a ve hub'daki listeye eklenir; JSON-LD `standardPageJsonLd` ile üretilir (klinik sayfa `MedicalWebPage`, teknik sayfa `TechnicalArticle`). İçerik yalnızca kaynağı kesin olan formül, eşik ve kodları içerir; ürün davranışı olarak yalnızca sitede zaten belgelenmiş olan yazılır. Gerçek bir hekim incelemesi olmadan `reviewedBy` eklenmez. Resmi FHIR profilleri ve OpenAPI yayımlanana kadar "henüz yayımlanmadı" yazılır.
  * Proje metrikleri tek kaynaktır: `src/data/projectMetrics.json` (tip `src/types/metrics.ts`, okuma `src/lib/metrics.ts`). Güvenlik düzlemi sayısı, otomatik test sayısı (`testsLabel()`, "2.480+"), THS/TRL (`trlLabel()`), geliştirme adımı, doğrulanmış kural sayısı, sürüm ve güncelleme tarihi buradan okunur; bu değerler bileşenlerde sabit yazılmaz. "Geliştirme adımı" klinik doğrulama fazlarıyla (Faz 0–4) karıştırılmaz. `version` `package.json` sürümüyle aynı olmalıdır, değilse derleme durur. `engineStatus` iç bilgidir ve ekranda gösterilmez ("active/canlı" izlenimi verilmez). Düz metindeki sayılar da şablondur (`${metrics.safetyPlanes}`); PharmaDeux sayfasındaki düzlem listesi (`planeGroups`) JSON ile aynı sayıda olmalıdır, değilse derleme durur. Değerler `npm run metrics:update -- --phase 14 --rules 48` (`scripts/update-metrics.mjs`) ile güncellenir; script sürümü `package.json` ve `package-lock.json`'a da yazar, `lastUpdated`'a günün tarihini koyar, dosyaların satır sonlarını korur. `safetyPlanes` ve `trl` script ile değiştirilmez (içerikle birlikte elle). Dışarıdan güncelleme: `.github/workflows/update-metrics.yml`, `repository_dispatch` türü `update-metrics`, payload `{ "phase", "total", "rules", "tests", "version" }`; değerler kabuğa yalnızca ortam değişkeniyle geçer ve script doğrular.
  * Sayılar dile göre gruplanır (`2.480+` / `2,480+`, `groupDigits()`); birimler dile göre yazılır (`mL/dk/1,73 m²` / `mL/min/1.73 m²`). Klinik değerler `src/lib/clinicalCases.ts` içinde tek yerde tutulur, yalnızca metin dile göre değişir.
  * İngilizce metin aynı dil kurallarına uyar: kısa, düz, teknik İngilizce; "next-gen", "seamless", "cutting-edge", "revolutionary", "empower" gibi sıfatlar yasaktır. Türkiye'ye özgü kurumlar ilk geçtiği yerde açıklanır (SUT, SGK, KVKK). THS → TRL.
  * Yasal metinlerin İngilizcesi kolaylık çevirisidir; `LegalDocument` İngilizce sayfada Türkçe metnin esas olduğunu belirtir.
  * Yazdırılabilir bölüm: kök elemana `data-print-sheet="ad"`, yanına `PrintButton target="ad"`. Baskıda beyaz zemin, siyah metin, A4 tek sayfa; site çerçevesi (navbar, footer, çerez bandı, backdrop, sayfa içi menü) `print:hidden` taşır. Baskı stilleri `globals.css` sonundaki `@media print` bloğundadır. Her sayfa baskıda ve PDF'te teknik bülten gibi çıkar: beyaz zemin, koyu grafit metin (`#1F2328`), `#D0D4DA` saç çizgileri; canvas gizlenir, kart, tablo satırı ve özellik satırı bölünmez, başlık sayfa sonunda yalnız kalmaz. Kopyalama gibi araç butonları `print:hidden` taşır.

- DIETER RAMS (Fonksiyonel Doğruluk):
  * Süs amaçlı 2D karalama organlar, bilim kurgu vizör çentikleri (`┌ ┐ └ ┘`) veya retro RPG kalkanları konulamaz.
  * Tıbbi ve operasyonel veriler gerçek klinik/finansal parametrelerle ve doğru birimleriyle temsil edilir (ör. QTc (Fridericia) ms cinsinden, Tisdale risk skoru puan cinsinden, eGFR mL/dk/1,73 m², provizyon kodu). Bir skor ile bir ölçüm birbirine karıştırılmaz: "Tisdale QTc 410 ms" yanlıştır; doğrusu "QTc 410 ms · Tisdale: düşük risk".
  * Örnek veya kurgusal veri gösteren her görsel bunu açıkça belirtir ("Örnek telemetri", "kurgusal veri").
  * Gerçek kod sistemleri yalnızca doğru anlamlarıyla kullanılır (ICD-10 kodu ve doğru açıklaması). Doğruluğu bilinmeyen resmi kodlar (ör. SUT işlem kodları) uydurulmaz; bunun yerine gerçek kategoriye atıf yapılır (EK-2B hizmet başı, EK-2C tanıya dayalı paket).
  * Denetim izinde gösterilen hash'ler süs değildir; gerçekten hesaplanır ve önceki kaydın hash'ini içerir.

## Token'lar (src/app/globals.css)

| Rol | Token | Değer |
| --- | --- | --- |
| Optik odak (yalnızca `bg-optic`) | — | `#0E1016` |
| Base zemin (grafit obsidyen) | `navy-900` | `#080A0F` |
| Kart ve paneller (mat titanyum levha) | `navy-850` | `#151922` |
| Yükseltilmiş konsol / modal / açılır menü | `navy-800` | `#1E2430` |
| Derin yüzey (footer künyesi) | `navy-950` | `#06070A` |
| Saç çizgisi kenarlık | `hairline` (= `--line`, beyaz %10; alternatif `navy-700`) | `#2A3140` |
| Nötr omurga: logo, menü, kılavuz, tüm veri katmanı (Pantone Cool Gray 5 C) | `titanium`, `--muted` | `#9E9FA5` |
| PharmaDeux aksanı (Pantone Chinese Red): dolgu | `teal-400` | `#C82A35` |
| PharmaDeux ikon (yükseltilmiş panelde 3:1) | `pharma` | `#DB3B44` |
| PharmaDeux metin ve link (AA) | `teal-200` / `teal-300` | `#E8605F` |
| Shield aksanı (klinik hardal / antik amber) | `shield` (= `indigo-400`) | `#D99B26` |
| Shield metin ve link (AA) | `indigo-200` / `indigo-300` | `#E8B455` |
| Akademik | `academic` | `#9E9FA5` (nötr omurga) |
| Yüksek risk / dikkat / düşük risk (yalnızca klinik durum) | `rose` / `amber` / `emerald` (Tailwind, yeniden eşlenmez) | `#FDA4AF` / `#FCD34D`, `#FDE68A` / emerald |

`teal` (PharmaDeux, Chinese Red) ve `indigo` (Shield, klinik hardal) Tailwind skalaları `@theme` içinde ürün aksanlarına yeniden eşlenmiştir; `emerald` sakin klinik yeşildir. Yeni kodda mümkünse `pharma` / `shield` / `titanium` adlarını kullan; ürünler arası ortak arayüzde `teal-*` / `indigo-*` kullanma. Kırmızı (`rose`), turuncu (`amber`) ve yeşil (`emerald`) yalnızca klinik şiddet ve risk durumları için ayrılmıştır (Shield red riski, PharmaDeux toksisite uyarısı); logo, link, aktif sekme gibi marka aksanı veya süs olarak kullanılmaz.

Durumlar markalama değildir. Ürün aksanı kimlik yüzeylerinde (navigasyon odağı, hero ikonu ve ortam ışığı, bölüm çizgileri, kart sınırları ve kodları) kullanılır; klinik durumun rengi ise yalnızca klinik duruma aittir (`rose` yüksek risk, `amber` dikkat, `emerald` düşük risk). Veri katmanı tamamen Cool Gray 5 C ve beyazdır: tablolar, veri akışları (`FlowDiagram` hover'ı dahil), kod blokları, grafikler, bir okumanın "normal" barı, veri miktarı gösteren barlar (ör. ikili kombinasyon sayısı) ve telemetri kartı kodları (P05, P06, P07) ürün aksanı almaz (`bg-white/45`, `titanium`). Alarm olmayan karar durumları (ör. Shield'da "düzeltmeye gönderildi") da nötr beyazdır.

Ürün aksanı bir alarm rengine benzememelidir. Chinese Red rose'dan belirgin biçimde koyu ve doygundur; link metni pembeye kayan `#EC7A82` değil `#E8605F`'tir (`#EC7A82` yalnızca hover). Shield hardalı (`#D99B26`) koyu ve turuncuya yakındır; klinik dikkat ise Tailwind'in açık, parlak sarısıdır (`amber-300` `#FCD34D`, `amber-200` `#FDE68A`). `amber` skalası asla hardala yeniden eşlenmez.

Kapsül: `PharmaCapsule` kırmızı-porselen sert kapsüldür. Kapak parlak, yarı saydam Chinese Red (lake kırmızı, `200, 42, 53`), gövde opak porselen beyazıdır (`248, 250, 252`). Kırmızı nesnenin kendi rengidir ve kabuğun içinde kalır: içteki granüller ve telemetri kartlarına akan kristaller saf beyaz buz kristalleridir, telemetri kodları ve "normal" barları nötrdür; kartlarda görünen her renk bir klinik durum anlamına gelir.

#### Gelecek Ürünler İçin Aksan Genişletme Mimarisi

- Sabit katmanlar değişmez: nötr omurga (grafit obsidyen zemin `#080A0F`, mat titanyum paneller, Cool Gray 5 C `titanium`, `hairline`, mikro ızgara) ve klinik alarmlar (`rose` yüksek risk, `amber` dikkat, `emerald` düşük risk).
- Her ürün bir aksan slotu taşır: bugün PharmaDeux = Chinese Red (`teal-*` / `pharma`), Shield = klinik hardal (`indigo-*` / `shield`).
- 3. veya 4. bir ürün eklendiğinde (ör. Görüntüleme veya Genomik), alarmlarla çakışmayan yeni bir renk slotu tanımlanır (ör. cerrahi kobalt mavisi veya ametist). Slot rose, amber ve emerald'dan ton olarak belirgin biçimde ayrılmalı; metin adımı tüm yüzeylerde AA (≥4,5:1), dolgu/ikon adımı ≥3:1 olmalıdır.
- Yeni slot mevcut slotlarla aynı yapıyla eklenir: `@theme` içinde 50–950 skala ve ürün token'ı, `SpecCard` / `SectionHeader` / `PageHero` aksan haritalarına bir giriş, `ambient-*` ortam ışığı utility'si ve token tablosunda bir satır. Mevcut ürünlerin renkleri değişmez.

Tailwind arbitrary değerlerinin içinde boşluk olmaz: `shadow-[0_0_8px_rgba(0,0,0,0.4)]` doğru, `rgba(0, 0, 0, 0.4)` sınıfı sessizce bozar.

CSS'te `backdrop-filter`'ı yalnızca öneksiz yaz. Lightning CSS `-webkit-` önekini kendisi ekler; ikisini birlikte yazarsan yalnızca önekliyi tutar ve bulanıklık Chrome'da sessizce kaybolur.

Grid veya flex öğesi içinde yatay kayan bir tablo varsa öğeye `min-w-0` ver; yoksa tablo sütunu genişletir ve sayfa `overflow-x-clip` altında sessizce kırpılır.

## İnceleme kontrol listesi

Bir arayüz değişikliğini bitirmeden önce kodda şunları ara; her eşleşme bir ihlaldir:

```bash
grep -rnE "bg-clip-text|italic|<em[ >]" src | grep -v "font-style: italic"  # degrade / italik vurgu (font-signature tanımı hariç)
grep -rn "font-signature" src/components src/views    # imza: ekran başına en fazla 1 ifade
grep -rn 'span className="text-white/50"' src | grep -v "Labs</span>"  # soluk başlık yarısı (iki tonlu başlık)
grep -rnE "normal: \"bg-(pharma|teal|shield|indigo)|text-(pharma|teal-[0-9]+)\">\{node\.code" src  # durum markalama değildir: normal bar ve telemetri kodu nötr kalır
grep -rnE "badge: \"text-(indigo|teal|shield|pharma)|group-hover:(bg|border|text)-(pharma|shield)" src  # karar durumu ve veri akışı ürün rengi almaz
grep -n "color-amber" src/app/globals.css  # amber (dikkat) asla yeniden eşlenmez; eşleşme olmamalı
grep -rn "rounded-md border border-white/10 bg-white/\[0.03\]" src  # klinik damga: yalnızca HomeView hero, 1 adet
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
