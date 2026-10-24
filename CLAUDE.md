@AGENTS.md

### 🎨 LavieuxLabs Design System (Apple HIG · Geist · Linear · Rams)

Bu proje klinik karar destek (PharmaDeux) ve gelir bütünlüğü (Shield) üreten regüle bir sağlık teknolojileri platformudur. Arayüzde "AI-generated" klişeler kesinlikle yasaktır.

Ayrıntılı uygulama rehberi ve inceleme kontrol listesi: `.claude/skills/design-system/SKILL.md`.

#### Okuma yönlendirmesi (zorunlu)

- Bir sayfanın veya bileşenin arayüzünü değiştirmeden ya da incelemeden önce `.claude/skills/design-system/SKILL.md` dosyasını oku.
- Kağıt yüzeyindeki bir sayfanın (ana sayfa, PharmaDeux, Shield, İletişim, Hakkımızda, Standartlar dizini, referans ve yasal sayfalar) içeriğini, bölüm sırasını, bölüm kimliğini veya ortak kabuğun yüzey tonunu (Navbar, footer, çerez bandı, komut paleti) değiştirmeden önce `docs/agents/paper-pages.md` dosyasını oku.
- Renk, token, logo, ikon, kart, hover, gölge, zemin, eyebrow etiketi veya koyu zemindeki bir bileşenle çalışmadan önce `docs/agents/visual-system.md` dosyasını oku.
- JSON-LD, metadata, sitemap, robots, security.txt, OG görselleri, simülatörlerin URL durumu, `Cite`, analitik, çerez onayı, iletişim yolları veya `/api/loi` formuyla çalışmadan önce `docs/agents/seo-sharing.md` dosyasını oku.
- Yeni sayfa veya referans sayfası eklemeden, `projectMetrics.json` ya da metrik scriptiyle çalışmadan, bir sayfanın güncelleme tarihini, sayı ve birim biçimini, yasal çeviri notunu veya baskı stilini değiştirmeden önce `docs/agents/i18n-metrics-print.md` dosyasını oku.
- Bir iş birden fazla alana giriyorsa ilgili bütün dosyaları oku. Bu dosyalardaki kurallar bu dosyadaki kurallar kadar bağlayıcıdır; aralarında çelişki görürsen kullanıcıya sor.

#### Git ve dal güvenliği

- Commit, push, merge, PR ve deploy yalnızca kullanıcı açıkça istediğinde yapılır. Bir aşamada verilen yetki sonraki işler için geçerli sayılmaz.
- Değişiklik `main` üzerinde değil, ayrı bir dalda yapılır.
- Dosyalar tek tek eklenir; `git add .` ve `git add -A` kullanılmaz. Kullanıcının takip dışı dosyaları (ör. `.claude/skills/` altındaki ek skill klasörleri, aşama devir notları) eklenmez ve değiştirilmez.
- `git reset --hard`, `git clean -fd`, zorla checkout ve stash silme kullanılmaz.
- Next.js sürümü kullanıcı istemeden değiştirilmez.

#### Test ve doğrulama

- Kod değişikliğinden sonra `npx tsc --noEmit`, `npx eslint .` ve `npm run build` çalıştırılır ve sonuçları raporlanır. Build, analitik ortam değişkenleri tanımlı değilken alınır. Ek kontrollerin kapsamı değişikliğin riskine göre seçilir; çalıştırılmayan kontrol ve nedeni raporda yazılır.
- Arayüz veya metin değişikliği çalışan sunucuda iki dilde (`/` ve `/en`) kontrol edilir. Başarısız veya çalıştırılmamış test PASS sayılmaz; test edilmeyen akış raporda yazılır.
- Testlerde gerçek e-posta gönderilmez, canlı hesaplarda (Resend, Gmail, Cloudflare, Vercel, analitik sağlayıcısı) işlem yapılmaz ve dış servise gerçek kişisel veri aktarılmaz.

#### Yüzeyler: kağıt ve koyu zemin

- Site iki yüzey kullanır; bir kuralın nerede geçerli olduğu yüzeye bağlıdır.
- Kağıt yüzeyi (Academic Editorial): ana sayfa (`HomeView`), iki ürün sayfası (`PharmaDeuxView`, `ShieldView`), İletişim (`ContactView`), Hakkımızda (`AboutView`) Standartlar dizini (`StandardsHubView`) beş referans sayfası (`StandardDoc` kabuğu) ve dört yasal sayfa (`LegalDocument` kabuğu), hepsi `<main className="surface-paper">`. Kağıt yollar tek kaynaktadır: `PAPER_PATHS` (birebir) ve `PAPER_PREFIXES` (bölüm: `/standartlar/`, `/legal/`) (`src/lib/surface.ts`). Zemin `paper` (#F7F7F4, krem değil), bölüm bandı `paper-band`, metin `ink` / `ink-2` / `ink-3`, çizgi `rule`.
- Koyu zemin: diğer bütün sayfalar.
- İki yüzeyde de geçerli: DİL, SEO ve paylaşım, çok dilli yapı, DIETER RAMS bölümleri; klinik durum renklerinin anlamı; tek sakin aksan ilkesi; yazı tipi rolleri; `font-mono tabular-nums` yalnızca veri sayılarında; WCAG 2.1 AA.
- Bu bölümlerden DİL ve DIETER RAMS bu dosyadadır. GEIST, LINEAR ve APPLE HIG bölümleri ile token tablosu `docs/agents/visual-system.md`, SEO ve paylaşım `docs/agents/seo-sharing.md`, çok dilli yapının ayrıntıları ve baskı `docs/agents/i18n-metrics-print.md` dosyasındadır.

Kağıt yüzeyi kuralları:
  * Yazı tipi rolleri: Newsreader sayfa başlığı (h1), bölüm başlıkları, proje ve kişi adları, adım numaraları; IBM Plex Sans bütün akan metin, etiket ve tablolar; IBM Plex Mono yalnızca veri olan sayılar. Bölüm etiketi büyük harfli eyebrow değildir: sol sütunda küçük Newsreader (`text-ink-3`). Büyük harfli etiket, orta noktalı meta dizisi, bağlantı sonuna ok ve küçük etiketlerde mono kullanılmaz.
  * Renk: kağıt üzerinde mürekkep. Ürün aksanı yalnızca ürünün kendi adında ve aksan skalasının koyu adımındadır (PharmaDeux `teal-700`, Shield `indigo-700`). Şekillerdeki veri mürekkeptir; renk yalnızca klinik veya inceleme durumu taşıyan değerde kullanılır (`rose-700` yüksek risk, `amber-700` dikkat ve uzman incelemesi, `emerald-700` düşük risk).
  * Yerleşim: 12 sütunlu editoryal ızgara (bölüm etiketi 3, içerik 9 sütun). Her bölümün iç düzeni içeriğine göre değişir; aynı kart kalıbı tekrar edilmez. Çerçeveli yüzey yalnızca şekil içindir (`Figure`: beyaz zemin, `rule` çerçeve, altyazı).
  * Şekiller (`src/components/home/HomeFigures.tsx`) gerçek bir modeli çizer: ikili kombinasyon formülü, `CLINICAL_CASES`, PharmaDeux düzlem listesi (`safetyPlaneGroups`), Shield örnek kural seti (`src/lib/claimRules.ts`), kanıt merdiveni. Bir modele dayanmayan şekil eklenmez; örnek veri altyazıda "kurgusal" diye yazılır.
  * Hareket yoktur: sayfa ilk yüklemede tamamdır; giriş animasyonu, ortam ışığı ve grain dekoru kullanılmaz.
  * Hero, ne geliştirdiğimizi söyleyen başlık ile kim olduğumuzu ve aşamayı (THS, klinik kanıt, düzenleyici durum) veren "Kısaca" özetinden oluşur.

#### İki yüzeyde de geçerli tipografi ve renk

- Yazı tipi hiyerarşisi tek kaynaktır (`src/lib/fonts.ts`): IBM Plex Sans gövde ve kart metni (`font-sans`, varsayılan) + Newsreader hero ve bölüm başlıkları (`font-serif`) + IBM Plex Mono veri ve metrikler (`font-mono`). Başka yazı tipi eklenmez.
- Rakam, metrik ve telemetri verilerinde daima `font-mono tabular-nums`. Bu kural sayısal değerin kendisi içindir (ör. `410 ms`, `₺1.280`, `F-2026-0414`); etiketler ve açıklamalar `font-sans`, hero ve bölüm başlıkları `font-serif` kalır.
- Metin kontrastı WCAG 2.1 AA'dır (≥4.5:1).
- Tek ekranda tek sakin aksan rengi kuralı uygulanır.
- Kırmızı (`rose`), turuncu (`amber`) ve yeşil (`emerald`) yalnızca klinik şiddet ve risk durumları için ayrılmıştır (Shield red riski, PharmaDeux toksisite uyarısı); logo, link, aktif sekme gibi marka aksanı veya süs olarak kullanılmaz.
- Ürün aksanı bir alarm rengine benzememelidir. `amber` skalası asla hardala yeniden eşlenmez.
- Aşama ve düzenleyici durum ana sayfada "Kısaca" özetinde düz metinle yazılır; "ACTIVE", "LIVE", "canlı" gibi sahada çalışma izlenimi veren ifadeler hiçbir yerde yazılmaz.

#### Shield ve ekip (sayfa kurallarından)

- Skor her yerde "kural skoru"dur; SGK ret olasılığı, finansal kayıp veya tasarruf tahmini olarak sunulmaz.
- Ekip tek kaynaktır: `TEAM` ve `teamCopy` (`src/lib/team.ts`); ana sayfa ekip bölümü, Hakkımızda ve JSON-LD buradan okur, isim, rol veya profil bağlantısı başka yerde kopyalanmaz. Ekip PharmaDeux üzerinde çalışır; Shield ekip üyelerine atfedilmez.

#### Doğruluk ve hukuki sınırlar

- Klinik doğrulama, hastane pilotu, kurum iş birliği, CE işareti veya sertifika henüz yoksa var gibi yazılmaz ve ima edilmez.
- Veri güvenliği, KVKK uyumu, veri yerelliği veya hukuki uygunluk hakkında kanıtı olmayan beyan yazılmaz.
- Veri sorumlusu, yurt dışına aktarım (KVKK md. 9), LOI imza tarafı ve e-posta saklama prosedürü gibi açık hukuki konular, kullanıcı doğrulamadan çözülmüş gibi yazılmaz.

#### İki yüzeyde de geçerli bölümler

- DİL (Metin):
  * Sahada çalışan klinik eczacının, hekimin ve sağlık yöneticisinin konuştuğu gibi yaz: kısa, düz, somut cümleler.
  * Ardı ardına üç-dört sıfat dizme ("deterministik, denetlenebilir ve insan denetimli"). Bir cümlede bir iddia.
  * Slogan başlık yok ("X değil, Y", "Pazarlık konusu olmayan…", "amiral gemisi"). Başlık konuyu doğrudan söyler: "Reçeteden kayda altı adım."
  * İddiayı ölçülebilir gerçeğe indir (2.480+ test, THS 4, CE işareti yok). Bir şey henüz yoksa "henüz yok" yaz.
  * Mümkünse somut bir klinik veya operasyonel örnek ver ("eGFR'si 90 olan hastada güvenli olan reçete 30'da doz ayarı gerektirebilir").
  * İngilizce jargon yalnızca terim olarak yerleşmişse kalır (FHIR, append-only); ürün açıklamasında Türkçe karşılık kullanılır ("gönderim öncesi", "pre-claim" değil).
  * Tüm iletişim adresi tek kaynaktan gelir: `CONTACT_EMAIL` (`contact@lavieuxlabs.com`); e-posta gösterilen kart ve butonlarda `CopyEmail` kullanılır (tıklayınca panoya kopyalar).

- DIETER RAMS (Fonksiyonel Doğruluk):
  * Süs amaçlı 2D karalama organlar, bilim kurgu vizör çentikleri (`┌ ┐ └ ┘`) veya retro RPG kalkanları konulamaz.
  * Tıbbi ve operasyonel veriler gerçek klinik/finansal parametrelerle ve doğru birimleriyle temsil edilir (ör. QTc (Fridericia) ms cinsinden, Tisdale risk skoru puan cinsinden, eGFR mL/dk/1,73 m², provizyon kodu). Bir skor ile bir ölçüm birbirine karıştırılmaz: "Tisdale QTc 410 ms" yanlıştır; doğrusu "QTc 410 ms · Tisdale: düşük risk".
  * Örnek veya kurgusal veri gösteren her görsel bunu açıkça belirtir ("Örnek telemetri", "kurgusal veri").
  * Gerçek kod sistemleri yalnızca doğru anlamlarıyla kullanılır (ICD-10 kodu ve doğru açıklaması). Doğruluğu bilinmeyen resmi kodlar (ör. SUT işlem kodları) uydurulmaz; bunun yerine gerçek kategoriye atıf yapılır (EK-2B hizmet başı, EK-2C tanıya dayalı paket).
  * Denetim izinde gösterilen hash'ler süs değildir; gerçekten hesaplanır ve önceki kaydın hash'ini içerir.

- SEO ve paylaşım:
  * Kanonik adres tek kaynaktır: `SITE_URL` (`src/lib/site.ts`, `NEXT_PUBLIC_SITE_URL` ile değiştirilir). `metadataBase`, JSON-LD, sitemap, robots ve OG görselleri buradan beslenir.
  * Kurum açıklaması Shield'ı kurumun ürünü gibi anlatmaz: PharmaDeux ekibin ortak projesidir, Shield Tarık Ziya Eren'in sitede tanıtılan bağımsız projesidir (`creator` Person, sayfanın `publisher`'ı kurum). Ürünler `SoftwareApplication`'dır; `offers` eklenmez ve düzenleyici durum açıkça yazılır (CE işareti yok).
  * Sistem durumu bildirilirken yalnızca doğrulanabilir gerçek yazılır (`VerificationImprint`, footer): canlı servis, "tüm servisler operasyonel", canlı test sayacı veya sertifika iddiası yoktur; denetim izi demosu FNV-1a'dır, SHA-256 değildir. Yayımlanmamış bir arayüz belgesi (OpenAPI/Postman) için "henüz yayımlanmadı" yazılır.
  * Yalnızca kesin bilinen künye bilgisi yazılır (hafızadan DOI veya sayfa eklenmez); CKD-EPI 2021 için kaynak Inker LA et al., N Engl J Med 2021'dir (Levey AS et al., Ann Intern Med 2009 önceki sürümdür).
  * Olaylar `trackEvent()` (`src/lib/analytics.ts`) ile gönderilir ve yalnızca sayılabilir değerler taşır (araç adı, kalem türü, QTc değeri): ad, e-posta, kurum adı veya serbest metin asla gönderilmez. Yasal sayfaların her birinin kendi son güncelleme tarihi vardır (`LEGAL_UPDATED`, `src/lib/site.ts`); bir sayfanın metni değişince yalnızca onun tarihi güncellenir, footer en son tarihi gösterir.

- Çok dilli yapı (TR / EN):
  * Türkçe varsayılandır ve kökte yaşar (`src/app/(tr)/`, URL'ler değişmez); İngilizce `/en` altındadır (`src/app/en/`).
  * Route dosyaları incedir; sayfa içeriği ve JSX `src/views/*View.tsx` içindedir ve `locale` prop'u alır. Metin `defineContent({ tr, en })` ile yazılır: İngilizce girdide eksik veya fazla anahtar tip hatasıdır.
  * Yeni sayfa: `src/views` altına view + `defineMetadata(path, { tr, en })`, `src/app/(tr)` ve `src/app/en` altına iki ince route dosyası, `ROUTES` (`src/i18n/config.ts`) listesine yol. Sitemap ve hreflang buradan üretilir.
  * Site içi bağlantılar dil öneksiz yazılır ve `localizedPath(locale, path)` ile verilir; `href="/..."` sabit yazılmaz. Bölüm kimlikleri (`#standartlar`, `#konum`) iki dilde aynıdır; dil anahtarı sorguyu ve hash'i taşır.
  * Proje metrikleri tek kaynaktır: `src/data/projectMetrics.json` (tip `src/types/metrics.ts`, okuma `src/lib/metrics.ts`). Güvenlik düzlemi sayısı, otomatik test sayısı (`testsLabel()`, "2.480+"), THS/TRL (`trlLabel()`), geliştirme adımı, doğrulanmış kural sayısı, sürüm ve güncelleme tarihi buradan okunur; bu değerler bileşenlerde sabit yazılmaz. Düz metindeki sayılar da şablondur (`${metrics.safetyPlanes}`); PharmaDeux düzlem listesi (`src/lib/safetyPlanes.ts`, `safetyPlaneGroups()`; ürün sayfası ve ana sayfa şekli buradan okur) JSON ile aynı sayıda olmalıdır, değilse derleme durur.
  * Klinik değerler `src/lib/clinicalCases.ts` içinde tek yerde tutulur, yalnızca metin dile göre değişir.
  * İngilizce metin aynı dil kurallarına uyar: kısa, düz, teknik İngilizce; "next-gen", "seamless", "cutting-edge", "revolutionary", "empower" gibi sıfatlar yasaktır. Türkiye'ye özgü kurumlar ilk geçtiği yerde açıklanır (SUT, SGK, KVKK). THS → TRL.
  * Bir metin değişikliği Türkçe ve İngilizce girdide birlikte yapılır; iki dil aynı iddiayı ve aynı durumu taşır.
  * Sayfa tarihleri `src/lib/site.ts`'tedir: `LEGAL_UPDATED`, `STANDARDS_UPDATED`, `PAGE_UPDATED`, `PILOT_PROTOCOL_REVISION`. Bir sayfanın metni değişince yalnızca onun tarihi güncellenir; bilinmeyen tarih uydurulmaz.
  * `metrics.lastUpdated` yalnızca PharmaDeux ürün ilerlemesinin tarihidir; sayfa güncelleme tarihi olarak kullanılmaz.
