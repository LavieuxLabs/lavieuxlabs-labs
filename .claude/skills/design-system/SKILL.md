---
name: design-system
description: LavieuxLabs design standards (Apple HIG · Geist · Linear · Dieter Rams) for this regulated health-tech site. Use whenever creating, changing or reviewing any UI in this project — pages, components, canvas visuals, colours, typography, motion, badges, eyebrows/labels, hover states, or clinical/financial example data — and before approving a visual change.
---

# 🎨 LavieuxLabs Design System (Apple HIG · Geist · Linear · Rams)

## Ne zaman kullanılır

Bu projede bir sayfa, bileşen, canvas görseli, renk, tipografi, hareket, rozet, eyebrow veya etiket, hover durumu ya da klinik veya finansal örnek veri oluşturulurken, değiştirilirken veya incelenirken ve görsel bir değişiklik onaylanmadan önce kullanılır.

## Önce oku (zorunlu)

Tasarım kuralları bu dosyada tekrarlanmaz; tek kaynakları aşağıdaki dosyalardır ve kendiliğinden yüklenmez. Bu skill kullanıldığında:

- `CLAUDE.md` her oturumda yüklüdür: yüzeyler, kağıt yüzeyi genel kuralları, iki yüzeyde geçerli tipografi ve renk, DİL, DIETER RAMS, doğruluk ve hukuki sınırlar ile okuma yönlendirmesi oradadır.
- Her arayüz işinde `docs/agents/visual-system.md` dosyasını oku: GEIST, LINEAR ve APPLE HIG bölümleri, token tablosu, renk anlamı, logo, kapsül ve yeni ürün aksanı.
- Kağıt yüzeyindeki bir sayfa veya ortak kabuk (Navbar, footer, çerez bandı, komut paleti) söz konusuysa `docs/agents/paper-pages.md` dosyasını oku. Bugün bütün içerik sayfaları kağıt yüzeyindedir.
- Metadata, JSON-LD, OG görseli, simülatör URL durumu, `Cite`, analitik, çerez onayı, iletişim yolları veya form söz konusuysa `docs/agents/seo-sharing.md` dosyasını oku. SEO ve paylaşım kurallarının ayrıntılı kaynağı bu dosyadır.
- Yeni sayfa, metrik, sayfa tarihi, sayı ve birim biçimi, yasal çeviri notu veya baskı söz konusuysa `docs/agents/i18n-metrics-print.md` dosyasını oku.
- İş birden fazla alana giriyorsa ilgili bütün dosyaları oku. Bu dosyalar ile `CLAUDE.md` aynı önceliktedir; aralarında çelişki görürsen kullanıcıya sor.

## Ek uygulama notları

Aşağıdaki notlar yalnızca bu skill'de bulunur.

- `teal` (PharmaDeux, Chinese Red) ve `indigo` (Shield, klinik hardal) Tailwind skalaları `@theme` içinde ürün aksanlarına yeniden eşlenmiştir; `emerald` sakin klinik yeşildir. Yeni kodda mümkünse `pharma` / `shield` / `titanium` adlarını kullan; ürünler arası ortak arayüzde `teal-*` / `indigo-*` kullanma.
- Tailwind arbitrary değerlerinin içinde boşluk olmaz: `shadow-[0_0_8px_rgba(0,0,0,0.4)]` doğru, `rgba(0, 0, 0, 0.4)` sınıfı sessizce bozar.
- CSS'te `backdrop-filter`'ı yalnızca öneksiz yaz. Lightning CSS `-webkit-` önekini kendisi ekler; ikisini birlikte yazarsan yalnızca önekliyi tutar ve bulanıklık Chrome'da sessizce kaybolur.
- Grid veya flex öğesi içinde yatay kayan bir tablo varsa öğeye `min-w-0` ver; yoksa tablo sütunu genişletir ve sayfa `overflow-x-clip` altında sessizce kırpılır.

## İnceleme kontrol listesi

Bir arayüz değişikliğini bitirmeden önce kodda şunları ara; her eşleşme bir ihlaldir:

```bash
grep -rnE "bg-clip-text|italic|<em[ >]" src | grep -v "font-style: italic\|not-italic"  # degrade / italik vurgu
grep -rn "font-signature" src    # imza stili kaldırıldı; eşleşme olmamalı
grep -rnE "text-white/|bg-white/\[|navy-|hairline" src/views/HomeView.tsx src/components/home  # kağıt yüzeyinde koyu zemin sınıfı
grep -rnE "uppercase|tracking-wider" src/views/HomeView.tsx src/components/home  # kağıtta büyük harfli eyebrow yok
grep -rn 'span className="text-white/50"' src | grep -v "Labs</span>"  # soluk başlık yarısı (iki tonlu başlık)
grep -rnE "normal: \"bg-(pharma|teal|shield|indigo)|text-(pharma|teal-[0-9]+)\">\{node\.code" src  # durum markalama değildir: normal bar ve telemetri kodu nötr kalır
grep -rnE "badge: \"text-(indigo|teal|shield|pharma)|group-hover:(bg|border|text)-(pharma|shield)" src  # karar durumu ve veri akışı ürün rengi almaz
grep -n "color-amber" src/app/globals.css  # amber (dikkat) asla yeniden eşlenmez; eşleşme olmamalı
grep -rn "rounded-md border border-white/10 bg-white/\[0.03\]" src  # klinik damga kaldırıldı; eşleşme olmamalı
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
