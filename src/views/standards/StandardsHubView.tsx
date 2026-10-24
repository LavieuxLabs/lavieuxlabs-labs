import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { LINK, PaperSection, TEXT_ACTION } from "@/components/paper/Editorial";
import StandardsIndex, { type StandardEntry } from "@/components/StandardsIndex";
import StandardsGrid, { PRINCIPLE_COUNT } from "@/components/StandardsGrid";
import { standardsHubJsonLd } from "@/lib/structuredData";
import { STANDARDS_UPDATED } from "@/lib/site";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/standartlar", {
  tr: {
    title: "Standartlar ve referanslar",
    description:
      "PharmaDeux ve Shield'ın dayandığı klinik, teknik ve idari standartlar: Tisdale QT risk skoru, CKD-EPI 2021 eGFR, kümülatif organ yükü, HL7 FHIR R4 entegrasyonu ve SUT fatura denetimi; formüller, eşikler, kodlar ve kaynaklar.",
  },
  en: {
    title: "Standards and references",
    description:
      "The clinical, technical and administrative standards behind PharmaDeux and Shield: the Tisdale QT risk score, CKD-EPI 2021 eGFR, cumulative organ burden, HL7 FHIR R4 integration and SUT billing audit, with formulas, thresholds, codes and sources.",
  },
});

/*
 * The standards hub on the paper surface (Academic Editorial). The hero says what the page holds and where the
 * work stands; the searchable list of reference pages comes first, because that is what a visitor looks for;
 * the eight design principles follow. The reference pages use the paper StandardDoc shell. Section
 * ids are linked from the footer and kept: #referanslar, #ilkeler.
 */
type Row = { label: string; value: ReactNode };

const copy = defineContent<{
  crumbs: { home: string; here: string; aria: string };
  title: string;
  description: string;
  jumps: { href: string; label: string }[];
  summaryTitle: string;
  summary: (counts: { pages: number; clinical: number; technical: number; administrative: number; principles: number }) => Row[];
  index: { label: string; title: string; intro: string };
  rules: { label: string; title: string; intro: string[] };
  entries: StandardEntry[];
  more: string;
  moreLink: string;
  disclaimer: string;
  updated: string;
}>({
  tr: {
    crumbs: { home: "Ana sayfa", here: "Standartlar", aria: "Sayfa konumu" },
    title: "Kural motorunun dayandığı standartlar.",
    description:
      "Her skorun, formülün ve kodun kaynağını tek yerde topladık. Hekim formülün kaynağını, bilgi işlem ekibi veri modelini buradan doğrulayabilir.",
    jumps: [
      { href: "#referanslar", label: "Referans sayfaları" },
      { href: "#ilkeler", label: "Sekiz ilke" },
    ],
    summaryTitle: "Kısaca",
    summary: (n) => [
      { label: "Referans sayfaları", value: `${n.pages} sayfa: ${n.clinical} klinik, ${n.technical} teknik, ${n.administrative} idari` },
      { label: "Tasarım ilkeleri", value: `${n.principles} ilke; her birinin referans aldığı standart yanında yazılı` },
      { label: "Aşama", value: "PharmaDeux ve Shield prototip. Klinik doğrulama, CE işareti ve sertifika yok." },
      { label: "Shield", value: "Tarık Ziya Eren'in bağımsız projesi. 0–100 değeri kural skorudur, ret olasılığı değildir." },
    ],
    index: {
      label: "Referans sayfaları",
      title: "Skorlar, formüller ve veri modelleri.",
      intro: "Her sayfa formülü veya veri modelini, eşikleri, kullanılan kodları ve orijinal kaynağı içerir.",
    },
    rules: {
      label: "İlkeler",
      title: "PharmaDeux ve Shield'ın uyduğu sekiz kural.",
      intro: [
        "Bunlar yazılımın kendi tasarım ilkeleridir; her birinin yanında referans aldığı standart yazılı. Bir standardı referans almak, o standarda göre sertifikalı olmak demek değildir.",
        "“Prototipte uygulandı”, ilkenin kodda olduğunu ve yazılım testlerinden geçtiğini söyler. Hastanede yapılmış bir klinik doğrulama anlamına gelmez.",
      ],
    },
    entries: [
      {
        href: "/standartlar/tisdale-score",
        category: "clinical",
        title: "Tisdale QT risk skoru",
        summary: "On risk faktörüyle hastanede yatan hastada QT uzaması riski; 0–21 puan, ≥11 yüksek risk.",
        codes: ["0–21 puan", "QTc ≥450 ms", "Fridericia"],
        source: "Tisdale JE et al. Circ Cardiovasc Qual Outcomes 2013",
        product: "PharmaDeux, QT risk motoru",
        status: "Algoritmik olarak uygulandı; sentetik testten geçiyor",
      },
      {
        href: "/standartlar/ckd-epi-2021",
        category: "clinical",
        title: "CKD-EPI 2021 eGFR",
        summary: "Irk katsayısı olmadan kreatininden eGFR; KDIGO kategorileri ve renal doz kontrol ilkeleri.",
        codes: ["LOINC 98979-8", "mL/dk/1,73 m²", "G1–G5"],
        source: "Inker LA et al. N Engl J Med 2021",
        product: "PharmaDeux, renal doz kontrolü",
        status: "Algoritmik olarak uygulandı; sentetik testten geçiyor",
      },
      {
        href: "/standartlar/kumulatif-organ-yuku",
        category: "clinical",
        title: "Polifarmaside kümülatif organ yükü",
        summary: "İkili etkileşimin ötesinde renal, kardiyak, hepatik ve antikolinerjik yük; triple whammy mekanizması.",
        codes: ["eGFR", "QTc", "ALT", "AST", "Triple whammy"],
        source: "Lapi F et al. BMJ 2013",
        product: "PharmaDeux, organ toksisitesi ve kümülatif yük düzlemleri",
        status: "Her düzlem sürümlü ve testli; klinik etkisi henüz bir kurumda ölçülmedi",
      },
      {
        href: "/standartlar/fhir-r4-entegrasyonu",
        category: "technical",
        title: "HL7 FHIR R4 entegrasyonu",
        summary: "MedicationRequest ve Observation kaynakları, kod sistemleri, örnek JSON ve entegrasyon mimarisi.",
        codes: ["FHIR R4", "ATC", "LOINC", "UCUM"],
        source: "HL7 International, FHIR R4 (v4.0.1)",
        product: "PharmaDeux ve Shield, veri katmanı",
        status: "Veri modeli entegre; canlı HBYS bağlantısı yok",
      },
      {
        href: "/standartlar/sut-fatura-denetimi",
        category: "administrative",
        title: "SUT fatura denetimi",
        summary: "Shield'ın gönderim öncesi kural motoru: dört denetim düzlemi, 0–100 kural skoru ve denetim izi.",
        codes: ["EK-2B", "EK-2C", "ICD-10", "0–100"],
        source: "SGK, Sağlık Uygulama Tebliği (SUT)",
        product: "Shield, fatura denetimi (Tarık Ziya Eren'in bağımsız projesi)",
        status: "4 düzlemden 3'ü uygulandı; sentetik faturalarla test ediliyor",
      },
    ],
    more: "Kalite ve regülasyon durumu için:",
    moreLink: "Kalite, bilgi güvenliği ve MDR",
    disclaimer:
      "Bu sayfa bilgilendirme amaçlıdır ve klinik karar için kullanılmaz. Karar için ürün bilgisi (KÜB/KT), güncel kılavuzlar ve hekimin değerlendirmesi esastır.",
    updated: "Son güncelleme",
  },
  en: {
    crumbs: { home: "Home", here: "Standards", aria: "Breadcrumb" },
    title: "The standards the rule engine stands on.",
    description:
      "The source of every score, formula and code in one place. Physicians can check where a formula comes from, and IT teams can check the data model.",
    jumps: [
      { href: "#referanslar", label: "Reference pages" },
      { href: "#ilkeler", label: "Eight principles" },
    ],
    summaryTitle: "In brief",
    summary: (n) => [
      { label: "Reference pages", value: `${n.pages} pages: ${n.clinical} clinical, ${n.technical} technical, ${n.administrative} administrative` },
      { label: "Design principles", value: `${n.principles} principles, each with the standard it is designed against` },
      { label: "Stage", value: "PharmaDeux and Shield are prototypes. No clinical validation, CE mark or certification." },
      { label: "Shield", value: "An independent project by Tarık Ziya Eren. The 0–100 value is a rule score, not a rejection probability." },
    ],
    index: {
      label: "Reference pages",
      title: "Scores, formulas and data models.",
      intro: "Each page gives the formula or data model, the thresholds, the codes used and the original source.",
    },
    rules: {
      label: "Principles",
      title: "Eight rules PharmaDeux and Shield both follow.",
      intro: [
        "These are the software's own design principles; each names the standard it is designed against. Working against a standard is not the same as being certified to it.",
        "“Implemented in the prototype” means the principle is in the code and passes software tests. It does not mean clinical validation in a hospital.",
      ],
    },
    entries: [
      {
        href: "/standartlar/tisdale-score",
        category: "clinical",
        title: "Tisdale QT risk score",
        summary: "QT prolongation risk in hospitalised patients from ten risk factors; 0–21 points, ≥11 high risk.",
        codes: ["0–21 points", "QTc ≥450 ms", "Fridericia"],
        source: "Tisdale JE et al. Circ Cardiovasc Qual Outcomes 2013",
        product: "PharmaDeux, QT risk engine",
        status: "Implemented algorithmically; passes synthetic tests",
      },
      {
        href: "/standartlar/ckd-epi-2021",
        category: "clinical",
        title: "CKD-EPI 2021 eGFR",
        summary: "eGFR from creatinine without a race coefficient; KDIGO categories and renal dose check principles.",
        codes: ["LOINC 98979-8", "mL/min/1.73 m²", "G1–G5"],
        source: "Inker LA et al. N Engl J Med 2021",
        product: "PharmaDeux, renal dose check",
        status: "Implemented algorithmically; passes synthetic tests",
      },
      {
        href: "/standartlar/kumulatif-organ-yuku",
        category: "clinical",
        title: "Cumulative organ burden in polypharmacy",
        summary: "Renal, cardiac, hepatic and anticholinergic burden beyond pairwise interactions; the triple whammy mechanism.",
        codes: ["eGFR", "QTc", "ALT", "AST", "Triple whammy"],
        source: "Lapi F et al. BMJ 2013",
        product: "PharmaDeux, organ toxicity and cumulative burden planes",
        status: "Each plane versioned and tested; clinical effect not yet measured in an institution",
      },
      {
        href: "/standartlar/fhir-r4-entegrasyonu",
        category: "technical",
        title: "HL7 FHIR R4 integration",
        summary: "MedicationRequest and Observation resources, code systems, example JSON and integration architecture.",
        codes: ["FHIR R4", "ATC", "LOINC", "UCUM"],
        source: "HL7 International, FHIR R4 (v4.0.1)",
        product: "PharmaDeux and Shield, data layer",
        status: "Data model integrated; no live HIS connection",
      },
      {
        href: "/standartlar/sut-fatura-denetimi",
        category: "administrative",
        title: "SUT billing audit",
        summary: "Shield's pre-submission rule engine: four audit planes, a 0–100 rule score and the audit trail.",
        codes: ["EK-2B", "EK-2C", "ICD-10", "0–100"],
        source: "SGK, Health Implementation Communiqué (SUT)",
        product: "Shield, billing audit (an independent project by Tarık Ziya Eren)",
        status: "3 of 4 planes implemented; tested on synthetic claims",
      },
    ],
    more: "For quality and regulatory status:",
    moreLink: "Quality, information security and MDR",
    disclaimer:
      "This page is for information only and is not for clinical decisions. Decisions rest on the product information (SmPC/PIL), current guidelines and the physician's judgement.",
    updated: "Last updated",
  },
});

export default function StandardsHubView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);
  const count = (cat: StandardEntry["category"]) => c.entries.filter((e) => e.category === cat).length;
  const summary = c.summary({
    pages: c.entries.length,
    clinical: count("clinical"),
    technical: count("technical"),
    administrative: count("administrative"),
    principles: PRINCIPLE_COUNT,
  });

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      <JsonLd data={standardsHubJsonLd(locale, c.entries.map((e) => ({ name: e.title, path: e.href })))} />

      {/* Hero: what the page holds, two jump links, and where the work stands. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-10 px-4 pt-6 pb-12 sm:px-6 sm:pt-12 sm:pb-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <nav aria-label={c.crumbs.aria}>
              <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
                <li>
                  <Link href={href("/")} className={`-my-3 inline-block py-3 ${LINK}`}>
                    {c.crumbs.home}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </li>
                <li aria-current="page" className="text-ink-2">
                  {c.crumbs.here}
                </li>
              </ol>
            </nav>
            <h1
              id="hero-title"
              className="mt-6 max-w-[20ch] font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:mt-8 sm:text-[46px] lg:text-[52px]"
            >
              {c.title}
            </h1>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-2">{c.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-8">
              {c.jumps.map((j) => (
                <li key={j.href}>
                  <a href={j.href} className={TEXT_ACTION}>
                    {j.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <aside aria-labelledby="standards-summary" className="self-end border-t-2 border-ink pt-4 lg:col-span-4">
            <h2 id="standards-summary" className="font-serif text-[20px] font-semibold text-ink">
              {c.summaryTitle}
            </h2>
            <dl className="mt-3 divide-y divide-rule border-t border-rule">
              {summary.map((r) => (
                <div key={r.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                  <dt className="text-[13px] text-ink-3">{r.label}</dt>
                  <dd className="text-[14px] leading-snug text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <PaperSection id="referanslar" label={c.index.label} title={c.index.title} intro={<p>{c.index.intro}</p>}>
        <Content>
          <StandardsIndex locale={locale} entries={c.entries} />
        </Content>
      </PaperSection>

      <PaperSection
        id="ilkeler"
        label={c.rules.label}
        title={c.rules.title}
        intro={c.rules.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        band
      >
        <Content>
          <StandardsGrid locale={locale} />
          <div className="mt-10 max-w-[70ch] space-y-3 border-t border-rule pt-6">
            <p className="text-[15px] leading-[1.6] text-ink-2">
              {c.more}{" "}
              <Link href={href("/legal/quality")} className={LINK}>
                {c.moreLink}
              </Link>
            </p>
            <p className="text-[14px] leading-[1.6] text-ink-3">
              {c.disclaimer}{" "}
              <span className="whitespace-nowrap">
                {c.updated}: {formatDate(locale, STANDARDS_UPDATED["/standartlar"])}
              </span>
            </p>
          </div>
        </Content>
      </PaperSection>
    </main>
  );
}

/** Section content in the nine content columns, under PaperSection's heading. */
function Content({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-x-10 lg:grid-cols-12">
      <div className="lg:col-span-9 lg:col-start-4">{children}</div>
    </div>
  );
}
