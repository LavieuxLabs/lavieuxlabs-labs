# Görsel sistem: koyu zemin, token'lar, renk anlamı, logo, kapsül, yeni ürün aksanı

CLAUDE.md'den taşındı; metin değiştirilmedi. Renk, token, logo, ikon, kart, hover, gölge, zemin, eyebrow etiketi veya koyu zemindeki bir bileşenle çalışmadan önce okunur. Koyu zemin kuralları kağıt yüzeyine taşınmaz. CLAUDE.md'deki kurallar burada tekrar edilmez ve her zaman geçerlidir.

## Yüzeyler: kağıt ve koyu zemin

- Aşağıdaki GEIST, LINEAR ve APPLE HIG bölümlerindeki yüzey, kart, ışık ve opaklık kuralları (navy kademeleri, `bg-white/[…]` hover, `text-white/50…` opaklıkları, `SiteBackdrop`, `TelemetryRails`, `RailMarker`, ürün ortam ışığı, `SpecCard` / `JoinedGrid` ızgaraları) yalnızca koyu zemin içindir ve kağıt yüzeyine taşınmaz.

## GEIST DİSİPLİNİ (Bilgi Mimarisi & Tipografi)

  * Keskin 1px saç çizgisi sınırlar: `border-hairline` / `divide-hairline` (token `--line`, beyaz %10; alternatif `border-navy-700`). Her kart dört kenarda da tam çerçeveye sahiptir; `gap-px` ızgaraların iç çizgileri de aynı token'dır (`bg-hairline`), böylece dış çerçeve ve iç kafes aynı ritimdedir. Yan yana duran özellik kartları ayrı kartlar olarak boşlukla dizilmez; birleşik ızgarada (`JoinedGrid`, `SpecCard variant="cell"`) tek bir dış çerçeve ve `gap-px` ile ortak 1px saç çizgisini paylaşır. Hücre içindeki özellik satırları ve kurumsal çıktı çizgisi hücrenin solundan sağına uçtan uca uzanır; aksan katmanı hücrenin üzerinde kalır. Izgara tek blok olarak belirir (hücre başına animasyon, arka plandaki saç çizgisi rengini parlatır). Hücreler `align` ile CSS subgrid olur (`grid-template-rows: subgrid`): başlık, açıklama, her özellik satırı ve kurumsal çıktı ayrı bir izde durur, böylece yan yana hücrelerin satır çizgileri cetvelle çizilmiş gibi aynı hizadadır; satırı az olan hücre kalan izleri boş bırakır. `border-white/[0.06]` sabit yazılmaz.
  * Süslü italik (italic) ve degrade kelime vurguları yasaktır. Başlık içinde tek bir kelime veya ifade ayrıştırılmaz (eski `font-signature` imza stili kaldırıldı). Hiyerarşi yalnızca font ağırlığı (400, 500, 600) ve metin tonu ile kurulur (koyu zeminde `text-white`, `text-white/60`; kağıtta `text-ink`, `text-ink-2`).
  * En düşük metin opaklıkları: etiket `text-white/50`, üçüncül metin `text-white/55` (tüm yüzeylerde ≥5.4:1). `text-white/20…45` metinde kullanılmaz; placeholder en az `placeholder:text-white/50`.
  * Büyük harfli bağlamda (etiket, breadcrumb) yabancı marka adları `lang="en"` ile işaretlenir; aksi halde `lang="tr"` altında CSS "Shield"i "SHİELD" yapar. OG görsellerinde büyük harf `upperTr()` ile kodda yapılır (Satori Türkçe kuralını bilmez).
  * Bölüm etiketleri (eyebrow) ve durum etiketleri tek stildedir: `text-[11px] font-medium uppercase tracking-wider text-white/50`, `font-sans`, çerçevesiz. Yanlarında süs çizgisi veya nokta olmaz. Monospace daktilo etiketleri kullanılmaz. Tek istisna ürün sayfası hero'sudur: eyebrow'un yanında ürün ikonu ürün aksanıyla durur (`PageHero` `eyebrowIcon`; PharmaDeux `Pill` + `text-pharma`, Shield `ShieldCheck` + `text-shield`). Etiket metni yine `text-white/50` kalır. Ürün sayfalarında `SectionHeader accent` eyebrow'un üstüne ürün aksanında kısa bir çizgi koyar (`w-10`, %70, mutlak konumlu; ray işaretçisi hizası kaymaz).
  * Klinik damga (eski ana sayfa hero'sundaki mono "CDSS · MDR…" etiketi) kaldırıldı ve hiçbir sayfada kullanılmaz.
  * Hero, sayfa ve bölüm başlıkları (h1, bölüm h2): `font-serif font-medium` (500), `tracking-[-0.02em]`; Newsreader'ın optik boyut ekseni büyük puntoda display kesimini kullanır. Kart ve küçük başlıklar: `font-sans font-semibold` (600), `tracking-[-0.03em]`. Başlıklar tam tondadır (koyu zeminde `text-white`, kağıtta `text-ink`) ve tek parçadır; soluk ikinci yarı (iki tonlu başlık) ve başlık içinde ayrışan ifade kullanılmaz.

## LINEAR METHOD (Yüzey & Mikro Etkileşimler)

  * Kartların hover durumunda parlama yerine mikro yüzey tonu değişimi (`bg-white/[0.02]` -> `bg-white/[0.04]`). Sınır da hafifçe aydınlanır (`hover:border-white/15`). Ürün sayfalarında kart hover'ı ürün aksanına döner: üst kenar çizgisi parlaklaşır (%45 → %55) ve ikon aksan alır; `gap-px` ızgara hücrelerinde 1px üst çizgi (%50) ve ikon. Dinlenme hâlinde kart nötrdür; ışıma yoktur.
  * Etkileşimlerde 120ms - 180ms arası hızlı, sönümlü geçişler (`transition-colors duration-150 ease-out`).
  * Dönen yapay lazer kenarlıklar (animated borders) kullanılmaz.
  * Durum noktaları sabittir (solid dot); `animate-ping` / `animate-pulse` kullanılmaz.
  * Hap rozetleri (`rounded-full` + kenarlık/zemin + iç boşluk) ve renkli durum noktaları kullanılmaz. Durum düz metinle yazılır: genel durumlar etiket stilinde, veri tablolarındaki risk/karar durumları yalnızca anlamsal renkli düz metinle (ör. `text-amber-200`).
  * Kartlarda şablon köşe numaraları (`01`, `02`), tikli (✓) madde yığınları ve etiket kümeleri olmaz. Kart = 2–3 cümlelik gövde + teknik özellik ızgarası.
  * Tam taşan ızgara (full-bleed mesh): kutu içindeki her yatay çizgi (tablo satırı, `divide-y` listesi, özellik satırı, toplam satırı, metrik altı çizgisi) kutunun sol duvarından sağ duvarına sıfıra sıfır uzanır ve dikey bölücülere/çerçeveye 90° ile değer. Kapsayıcının yatay padding'i satırları içeri itmez: satır negatif marjla (`-mx-5`) kenara taşınır, iç boşluk satırın içindeki metne verilir (`px-5`). Kutusuz, serbest duran listeler bu kurala girmez.
  * Standart ve uyum kartlarında durum, üç adımlı uygulama izidir (Tasarım girdisi → Hazırlık → Uygulamada; `SpecCard status.tone`, nötr beyaz çubuklar). Mühür, rozet veya sertifika görünümü kullanılmaz: sertifikası olmayan bir standart sertifikalı gibi görünmemelidir.
  * Navbar'daki birincil eylem sayfayla bütünleşir: koyu zeminde `border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1]`, kağıtta dolu mürekkep (`bg-ink text-white`). 768 px'ten (`md`) itibaren görünür; `md`–`lg` arasında aynı hedefe giden "İletişim" bağlantısı ve arama düğmesi gizlenir (arama Ctrl/⌘ K ile açılır). Sayfa içi hero'larda tek bir dolu birincil buton kullanılabilir (koyu zeminde beyaz, kağıtta mürekkep).

## APPLE HIG (Boşluk & Negatif Alan)

  * "Air as pedestal": Bölümler ve kartlar arasında ferah negatif alan bırak.
  * Neon ışımalar (`blur-3xl`, fosforlu ambient glow) yasaktır. Derinlik zemin kademeleriyle (`navy-900` → `navy-850` → `navy-800`) verilir. Tek istisna ürün ortam ışığıdır: ürün aksanında çok yayvan bir radial yıkama, %6–8 opaklık, yalnızca ürün sayfası hero'sunun arkasında (`PageHero ambient`). `globals.css`'teki `ambient-pharma` / `ambient-shield` utility'leriyle yazılır; blur filtresi, renkli gölge ve animasyon kullanılmaz, veri katmanına girmez. Renkli `shadow-[0_0_...]` gölgeler kullanılmaz; açılır menüler gibi yükseltilmiş yüzeylerde yalnızca nötr siyah gölge (`shadow-black/40`).
  * Zemin optik derinliktir, ışıma değil (`SiteBackdrop`): merkezde sakin grafit odak (`#0E1016`), kenarlara doğru obsidyen siyaha (`#050609`) düşen vinyet (`bg-optic`); seçilebilen milimetrik mikro ızgara (çizgi opaklığı 0.03, grafik kağıdı dokusu); tüm sayfa üzerinde ~%1.8 analog grain (`bg-grain`). Vinyet ve grain yalnızca `SiteBackdrop`'ta kullanılır. Zemine sayfaya göre hafif bir atmosfer veren mekanizma mevcuttur (`BackdropTint`, vinyet ile ızgara arasında), ancak `TINTED` listesi şu an boştur ve hiçbir sayfa zemin tonu almaz: yasal sayfalar da kağıt yüzeyindedir. Cerrahi çelik vinyeti (`backdrop-steel`) yalnızca koyu zeminde kalacak yeni bir sayfa için durur (`BackdropTint` içindeki `TINTED` listesi boştur). Ana sayfa opak kağıt yüzeyindedir ve zemin tonu almaz. İki ürün sayfası da kağıt yüzeyindedir ve ortam ışığı almaz (`ambient-pharma` ve `ambient-shield` şu an kullanılmıyor; `PageHero ambient` kuralı yeni bir koyu ürün sayfası için geçerlidir).
  * Sayfa omurgası: `TelemetryRails` (SiteShell'de bir kez) içerik kabının (max-w-7xl) kenarlarında, tepeden footer'a iki 1px dikey ray çizer (`bg-white/[0.03]`). Bölüm başlarında `RailMarker` (artı, üç saç çizgisi çentik, nokta; `text-white/[0.1]`) eyebrow satırına hizalı durur. Yeni bölüm eklenirken işaretçi eklenir; dönen, nefes alan veya ışıyan dekor eklenmez.
  * Logo tek kaynaktır: izometrik çift L ve tıp artısı (`src/lib/logoMark.ts`; `LogoMark`, `src/components/LogoMark.tsx`, `size` prop'u alır). Çatı markadır, hiçbir ürüne ait değildir: iç içe iki L izometrik izdüşümde (her L tek kapalı kontur: dikey bacak tabana dikişsiz, kesintisiz döner; kenarlar 2:3 eğimde), içteki L derinlik ekseninde geride; sağ kanatta eşit kollu tıp artısı. 32 birimlik ızgarada 1,75 birim kontur; iç yansıma, üçgen bölme, degrade, gölge, ışıma ve animasyon yoktur, hover'da değişmez. OG işareti (`ogImage.tsx`) aynı yolları kullanır. Favicon (`src/app/icon.svg`) aynı siluetlerin 16px için koyu zemin üzerinde düz beyaz dolgulu sürümüdür. Logo tek renktir: koyu zeminde gövde ve tıp artısı saf beyazdır (`#FFFFFF`, `MARK_COLOR`, yanındaki "Lavieux" yazısıyla aynı; artıda %15 aynı renkte dolgu), kağıtta mürekkeptir (`#16181C`, `LogoMark color`, OG kartında `surface: "paper"`). Artı sonradan eklenmiş bir parça gibi ayrışmaz. Logo ürün aksanı almaz. Kalkan, kapsül gibi tek bir ürünü çağrıştıran form logoya eklenmez.
  * Parlaklık sırası korunur: kenar `#050609` < zemin `#080A0F` < odak `#0E1016` < kart `navy-850` (`#151922`) < yükseltilmiş `navy-800` (`#1E2430`). Odak rengi değişirse kart kademeleri de odak üzerinde kalacak şekilde güncellenir; aksi halde kartlar zemine gömülmüş görünür.
  * Donuk cam (`material-bar`) yalnızca navigasyon gibi içeriğin üzerinde yüzen katmanlarda kullanılır; `prefers-reduced-transparency` tercihinde katı zemine düşer. Kartlarda cam efekti kullanılmaz.
  * Omurga (logo, menü, kılavuz, çerez bandı) nötr Cool Gray 5 C ve beyazdır. Bir ürün sayfasında yalnızca o ürünün aksanı kullanılır (PharmaDeux: Chinese Red, Shield: klinik hardal) ve o da yalnızca navigasyon odağında (aktif sekme, buton) ve hero ikonunda; ana sayfada (kağıt) yalnızca iki ürünün adı kendi aksanının koyu adımını taşır, geri kalan her şey mürekkeptir. Ürün sayfalarında aksan dinlenme hâlinde de görünür: hero ortam ışığı, metrik hücrelerinin altında %30 çizgi, `SpecCard accent` ile kartın tam nötr çerçevesinin üzerine yalnızca üst kenarda tek temiz aksan çizgisi (%45, hover'da %55; sol/sağ/alt kenar ve nötr ızgara asla aksan almaz, ezilmez); ürün ve nötr hücreleri karışık bir ızgarada üst çizgi yalnızca hover'da görünür (`accentLine="hover"`), dinlenme hâlinde tüm hücrelerin üst kenarı aynı nötr saç çizgisidir ve aksan yalnızca kod etiketinde kalır ve kart kodu (INT-01 vb.) aksan ailesinde. Kart kodları (STD-, REG-) kartın sahibi olan ürünün rengini alır; platform geneli standartlar nötr kalır (`text-white/70`), böylece renk ait olmadığı bir ürünü iddia etmez.

## Token'lar (src/app/globals.css)

| Rol | Token | Değer |
| --- | --- | --- |
| Kağıt zemini (ana sayfa, PharmaDeux, Shield, İletişim, Hakkımızda, Standartlar ve referans sayfaları, yasal sayfalar) | `paper` | `#F7F7F4` |
| Kağıt bölüm bandı | `paper-band` | `#EEEFEA` |
| Mürekkep: başlık ve gövde / ikincil / üçüncül metin (kağıt) | `ink` / `ink-2` / `ink-3` | `#16181C` / `#41464F` / `#5F6570` |
| Kağıt saç çizgisi | `rule` | `#D5D7D3` |
| Ürün adı kağıtta (PharmaDeux / Shield) | `teal-700` / `indigo-700` | `#6E171E` / `#765212` |
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

Durumlar markalama değildir. Ürün aksanı kimlik yüzeylerinde (navigasyon odağı, hero ikonu ve ortam ışığı, bölüm çizgileri, kart sınırları ve kodları) kullanılır; klinik durumun rengi ise yalnızca klinik duruma aittir (`rose` yüksek risk, `amber` dikkat, `emerald` düşük risk). Veri katmanı tamamen Cool Gray 5 C ve beyazdır: tablolar, veri akışları (`FlowDiagram` hover'ı dahil), kod blokları, grafikler, bir okumanın "normal" barı, veri miktarı gösteren barlar (ör. ikili kombinasyon sayısı) ve telemetri kartı kodları (P05, P06, P07) ürün aksanı almaz (`bg-white/45`, `titanium`). Alarm olmayan karar durumları (ör. Shield'da "düzeltmeye gönderildi") da nötr beyazdır.

Chinese Red rose'dan belirgin biçimde koyu ve doygundur; link metni pembeye kayan `#EC7A82` değil `#E8605F`'tir (`#EC7A82` yalnızca hover). Shield hardalı (`#D99B26`) koyu ve turuncuya yakındır; klinik dikkat ise Tailwind'in açık, parlak sarısıdır (`amber-300` `#FCD34D`, `amber-200` `#FDE68A`).

Kapsül: `PharmaCapsule` kırmızı-porselen sert kapsüldür. Kapak parlak, yarı saydam Chinese Red (lake kırmızı, `200, 42, 53`), gövde opak porselen beyazıdır (`248, 250, 252`). Kırmızı nesnenin kendi rengidir ve kabuğun içinde kalır: içteki granüller ve telemetri kartlarına akan kristaller saf beyaz buz kristalleridir, telemetri kodları ve "normal" barları nötrdür; kartlarda görünen her renk bir klinik durum anlamına gelir. Kapsül sahnesi (`layout="stage"`, varsayılan) şu an hiçbir sayfada kullanılmıyor; PharmaDeux sayfası kanvassız vaka çalışma alanını (`layout="workspace"`) kullanır. İki yerleşim aynı durumu, derin bağlantıları ve `pharmadeux:case` olayını paylaşır.

## Gelecek Ürünler İçin Aksan Genişletme Mimarisi

- Sabit katmanlar değişmez: nötr omurga (grafit obsidyen zemin `#080A0F`, mat titanyum paneller, Cool Gray 5 C `titanium`, `hairline`, mikro ızgara) ve klinik alarmlar (`rose` yüksek risk, `amber` dikkat, `emerald` düşük risk).
- Her ürün bir aksan slotu taşır: bugün PharmaDeux = Chinese Red (`teal-*` / `pharma`), Shield = klinik hardal (`indigo-*` / `shield`).
- 3. veya 4. bir ürün eklendiğinde (ör. Görüntüleme veya Genomik), alarmlarla çakışmayan yeni bir renk slotu tanımlanır (ör. cerrahi kobalt mavisi veya ametist). Slot rose, amber ve emerald'dan ton olarak belirgin biçimde ayrılmalı; metin adımı tüm yüzeylerde AA (≥4,5:1), dolgu/ikon adımı ≥3:1 olmalıdır.
- Yeni slot mevcut slotlarla aynı yapıyla eklenir: `@theme` içinde 50–950 skala ve ürün token'ı, `SpecCard` / `SectionHeader` / `PageHero` aksan haritalarına bir giriş, `ambient-*` ortam ışığı utility'si ve token tablosunda bir satır. Mevcut ürünlerin renkleri değişmez.
