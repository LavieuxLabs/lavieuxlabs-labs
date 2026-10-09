@AGENTS.md

### 🎨 LavieuxLabs Design System (Apple HIG · Geist · Linear · Rams)

Bu proje klinik karar destek (PharmaDeux) ve gelir bütünlüğü (Shield) üreten regüle bir sağlık teknolojileri platformudur. Arayüzde "AI-generated" klişeler kesinlikle yasaktır.

Ayrıntılı uygulama rehberi ve inceleme kontrol listesi: `.claude/skills/design-system/SKILL.md`.

- GEIST DİSİPLİNİ (Bilgi Mimarisi & Tipografi):
  * Keskin 1px saç çizgisi sınırlar (`border-white/[0.06]` veya `border-navy-700`).
  * Rakam, metrik ve telemetri verilerinde daima `font-mono tabular-nums`. Bu kural sayısal değerin kendisi içindir (ör. `410 ms`, `₺1.280`, `F-2026-0414`); etiketler, açıklamalar ve bölüm başlıkları `font-sans` kalır.
  * Süslü italik (italic) ve degrade kelime vurguları yasaktır. Hiyerarşi yalnızca font ağırlığı (400, 500, 600) ve metin opaklığı (`text-white`, `text-white/60`) ile kurulur.
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
  * Sayfa zemininde yalnızca çok soluk koordinat ızgarası (çizgi opaklığı 0.025) ve üstten monokrom aydınlık düşüşü bulunur (`SiteBackdrop`).
  * Donuk cam (`material-bar`) yalnızca navigasyon gibi içeriğin üzerinde yüzen katmanlarda kullanılır; `prefers-reduced-transparency` tercihinde katı zemine düşer. Kartlarda cam efekti kullanılmaz.
  * Tek ekranda tek sakin aksan rengi kuralı uygulanır.

- DİL (Metin):
  * Sahada çalışan klinik eczacının, hekimin ve sağlık yöneticisinin konuştuğu gibi yaz: kısa, düz, somut cümleler.
  * Ardı ardına üç-dört sıfat dizme ("deterministik, denetlenebilir ve insan denetimli"). Bir cümlede bir iddia.
  * Slogan başlık yok ("X değil, Y", "Pazarlık konusu olmayan…", "amiral gemisi"). Başlık konuyu doğrudan söyler: "Reçeteden kayda altı adım."
  * İddiayı ölçülebilir gerçeğe indir (2.480+ test, THS 4, CE işareti yok). Bir şey henüz yoksa "henüz yok" yaz.
  * Mümkünse somut bir klinik veya operasyonel örnek ver ("eGFR'si 90 olan hastada güvenli olan reçete 30'da doz ayarı gerektirebilir").
  * İngilizce jargon yalnızca terim olarak yerleşmişse kalır (FHIR, append-only); ürün açıklamasında Türkçe karşılık kullanılır ("gönderim öncesi", "pre-claim" değil).
  * Tüm iletişim adresi tek kaynaktan gelir: `CONTACT_EMAIL` (`contact@lavieuxlabs.com`).

- DIETER RAMS (Fonksiyonel Doğruluk):
  * Süs amaçlı 2D karalama organlar, bilim kurgu vizör çentikleri (`┌ ┐ └ ┘`) veya retro RPG kalkanları konulamaz.
  * Tıbbi ve operasyonel veriler gerçek klinik/finansal parametrelerle ve doğru birimleriyle temsil edilir (ör. QTc (Fridericia) ms cinsinden, Tisdale risk skoru puan cinsinden, eGFR mL/dk/1,73 m², provizyon kodu). Bir skor ile bir ölçüm birbirine karıştırılmaz: "Tisdale QTc 410 ms" yanlıştır; doğrusu "QTc 410 ms · Tisdale: düşük risk".
  * Örnek veya kurgusal veri gösteren her görsel bunu açıkça belirtir ("Örnek telemetri", "kurgusal veri").
  * Gerçek kod sistemleri yalnızca doğru anlamlarıyla kullanılır (ICD-10 kodu ve doğru açıklaması). Doğruluğu bilinmeyen resmi kodlar (ör. SUT işlem kodları) uydurulmaz; bunun yerine gerçek kategoriye atıf yapılır (EK-2B hizmet başı, EK-2C tanıya dayalı paket).
  * Denetim izinde gösterilen hash'ler süs değildir; gerçekten hesaplanır ve önceki kaydın hash'ini içerir.

#### Token'lar (src/app/globals.css)

| Rol | Token | Değer |
| --- | --- | --- |
| Base zemin (cerrahi klinik lacivert) | `navy-900` | `#0B131F` |
| Kart ve yüzeyler | `navy-850` | `#111C2B` |
| Yükseltilmiş konsol / modal / açılır menü | `navy-800` | `#162335` |
| Derin yüzey (footer künyesi) | `navy-950` | `#080F19` |
| Saç çizgisi kenarlık | `white/[0.06]` (alternatif `navy-700`) | `#22344B` |
| PharmaDeux aksanı | `pharma` (= `teal-400`) | `#4FC1B6` |
| Shield aksanı | `shield` (= `indigo-400`) | `#7FA2E6` |
| Akademik aksanı | `academic` | `#B7A6E8` |

Kırmızı (`rose`), turuncu (`amber`) ve yeşil (`emerald`) yalnızca klinik şiddet ve risk durumları için ayrılmıştır; marka aksanı veya süs olarak kullanılmaz.
