---
name: design-system
description: LavieuxLabs design standards (Apple HIG · Geist · Linear · Dieter Rams) for this regulated health-tech site. Use whenever creating, changing or reviewing any UI in this project — pages, components, canvas visuals, colours, typography, motion, badges, eyebrows/labels, hover states, or clinical/financial example data — and before approving a visual change.
---

# 🎨 LavieuxLabs Design System (Apple HIG · Geist · Linear · Rams)

Bu proje klinik karar destek (PharmaDeux) ve gelir bütünlüğü (Shield) üreten regüle bir sağlık teknolojileri platformudur. Arayüzde "AI-generated" klişeler kesinlikle yasaktır.

## Kurallar

- GEIST DİSİPLİNİ (Bilgi Mimarisi & Tipografi):
  * Keskin 1px saç çizgisi sınırlar (`border-white/[0.08]` veya `border-navy-700`).
  * Rakam, metrik ve telemetri verilerinde daima `font-mono tabular-nums`. Bu kural sayısal değerin kendisi içindir (ör. `410 ms`, `₺1.280`, `F-2026-0414`); etiketler, açıklamalar ve bölüm başlıkları `font-sans` kalır.
  * Süslü italik (italic) ve degrade kelime vurguları yasaktır. Hiyerarşi yalnızca font ağırlığı (400, 500, 600) ve metin opaklığı (`text-white`, `text-white/60`) ile kurulur.
  * Bölüm etiketleri (eyebrow): `text-xs font-medium tracking-wide uppercase text-white/60`, `font-sans`. Monospace daktilo etiketleri kullanılmaz.

- LINEAR METHOD (Yüzey & Mikro Etkileşimler):
  * Kartların hover durumunda parlama yerine mikro yüzey tonu değişimi (`bg-white/[0.02]` -> `bg-white/[0.04]`).
  * Etkileşimlerde 120ms - 180ms arası hızlı, sönümlü geçişler (`transition-colors duration-150 ease-out`).
  * Dönen yapay lazer kenarlıklar (animated borders) kullanılmaz.
  * Durum noktaları sabittir (solid dot); `animate-ping` / `animate-pulse` kullanılmaz.

- APPLE HIG (Boşluk & Negatif Alan):
  * "Air as pedestal": Bölümler ve kartlar arasında ferah negatif alan bırak.
  * Neon ışımalar (`blur-3xl`, fosforlu ambient glow) yasaktır. Derinlik yalnızca zemin ton farkı (`navy-900`, `navy-850`, `navy-800`) ile verilir. Renkli `shadow-[0_0_...]` gölgeler kullanılmaz.
  * Tek ekranda tek sakin aksan rengi kuralı uygulanır.

- DIETER RAMS (Fonksiyonel Doğruluk):
  * Süs amaçlı 2D karalama organlar, bilim kurgu vizör çentikleri (`┌ ┐ └ ┘`) veya retro RPG kalkanları konulamaz.
  * Tıbbi ve operasyonel veriler gerçek klinik/finansal parametrelerle ve doğru birimleriyle temsil edilir (ör. QTc (Fridericia) ms cinsinden, Tisdale risk skoru puan cinsinden, eGFR mL/dk/1,73 m², provizyon kodu). Bir skor ile bir ölçüm birbirine karıştırılmaz: "Tisdale QTc 410 ms" yanlıştır; doğrusu "QTc 410 ms · Tisdale: düşük risk".
  * Örnek veya kurgusal veri gösteren her görsel bunu açıkça belirtir ("Örnek telemetri", "kurgusal veri").

## Token'lar (src/app/globals.css)

| Rol | Token | Değer |
| --- | --- | --- |
| Sayfa zemini | `navy-900` | `#0F1B2D` |
| Yüzey | `navy-850` | `#15253B` |
| Kart / hover yüzeyi | `navy-800` | `#1A2D47` |
| Derin yüzey (footer, kayıt) | `navy-950` | `#0C1726` |
| Kenarlık | `navy-700` / `white/[0.08]` | `#2A4262` |
| PharmaDeux aksanı | `pharma` (= `teal-400`) | `#4FC1B6` |
| Shield aksanı | `shield` (= `indigo-400`) | `#7FA2E6` |
| Akademik aksanı | `academic` | `#B7A6E8` |

`teal`, `indigo` ve `emerald` Tailwind skalaları `@theme` içinde klinik palete yeniden eşlenmiştir; yeni kodda mümkünse `pharma` / `shield` / `academic` adlarını kullan. Kırmızı (`rose`), turuncu (`amber`) ve yeşil (`emerald`) yalnızca klinik şiddet ve risk durumları için ayrılmıştır; marka aksanı veya süs olarak kullanılmaz.

Tailwind arbitrary değerlerinin içinde boşluk olmaz: `shadow-[0_0_8px_rgba(0,0,0,0.4)]` doğru, `rgba(0, 0, 0, 0.4)` sınıfı sessizce bozar.

## İnceleme kontrol listesi

Bir arayüz değişikliğini bitirmeden önce kodda şunları ara; her eşleşme bir ihlaldir:

```bash
grep -rnE "bg-clip-text|italic|<em[ >]" src            # degrade / italik vurgu
grep -rnE "shadow-\[0_0|blur-3xl|bg-\[radial-gradient" src  # neon ışıma (mask-image hariç)
grep -rnE "animate-(ping|pulse)" src                   # yanıp sönen nokta
grep -rnE "font-mono[^\"]*uppercase|uppercase[^\"]*font-mono" src  # daktilo etiket
grep -rnE "duration-(300|500|700)" src                 # yavaş hover geçişi
```

Ardından:
- Sayısal değerler `font-mono tabular-nums` mı, etiketler `font-sans` mı?
- Aynı ekranda birden fazla aksan rengi var mı? Varsa tek bir sakin aksana indir.
- Klinik örnekler doğru parametre ve birimle mi yazılmış? Örnek veri olarak etiketlenmiş mi?
- `prefers-reduced-motion` altında hareket statik bir kareye ya da kısa bir opaklık geçişine iniyor mu?
- Değişikliği masaüstü ve mobilde gerçek bir ekran görüntüsüyle kontrol et; yalnızca derlemenin geçmesi yeterli değildir.
