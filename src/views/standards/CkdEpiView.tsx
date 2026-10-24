import Cite from "@/components/Cite";
import StandardDoc, { Formula, Term, ToolPanel } from "@/components/StandardDoc";
import EgfrCalculator from "@/components/EgfrCalculator";
import { CKD_EPI_2021 as K, KDIGO_BANDS } from "@/lib/ckdEpi";
import { CITATIONS } from "@/lib/citations";
import { standardPageJsonLd } from "@/lib/structuredData";
import { defineContent, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

const PATH = "/standartlar/ckd-epi-2021";

export const metadata = defineMetadata(PATH, {
  tr: {
    title: "CKD-EPI 2021 eGFR",
    description:
      "CKD-EPI 2021 kreatinin denklemi: formül ve katsayılar, Cockcroft–Gault ile farkı, LOINC 98979-8 eşlemesi, KDIGO GFR kategorileri, renal doz kontrol ilkeleri ve sınırlar.",
  },
  en: {
    title: "CKD-EPI 2021 eGFR",
    description:
      "The CKD-EPI 2021 creatinine equation: formula and coefficients, how it differs from Cockcroft–Gault, LOINC 98979-8 mapping, KDIGO GFR categories, renal dose check principles and limits.",
  },
});

// KDIGO GFR categories (mL/min/1.73 m²); ranges from the shared bands in src/lib/ckdEpi.ts.
const KDIGO_LABELS: Record<string, { tr: string; en: string }> = {
  G1: { tr: "Normal veya yüksek", en: "Normal or high" },
  G2: { tr: "Hafif azalmış", en: "Mildly decreased" },
  G3a: { tr: "Hafif–orta azalmış", en: "Mildly to moderately decreased" },
  G3b: { tr: "Orta–ağır azalmış", en: "Moderately to severely decreased" },
  G4: { tr: "Ağır azalmış", en: "Severely decreased" },
  G5: { tr: "Böbrek yetmezliği", en: "Kidney failure" },
};
const KDIGO = KDIGO_BANDS.map((b) => ({ g: b.stage, range: b.range, ...KDIGO_LABELS[b.stage] }));

const copy = defineContent({
  tr: {
    crumb: "CKD-EPI 2021",
    eyebrow: "Klinik standart: böbrek fonksiyonu",
    title: "CKD-EPI 2021 ile eGFR",
    description:
      "Serum kreatinin, yaş ve cinsiyetten ırk katsayısı kullanmadan tahmini glomerüler filtrasyon hızı (eGFR) hesaplayan denklem.",
    problem: "Klinik problem",
    problemBody: [
      "Böbrekle atılan bir ilaçta klirens düşer ama doz aynı kalırsa ilaç birikir. Birikim, aynı organı etkileyen diğer ilaçlarla birlikte kümülatif organ yükünü artırır.",
      "Laboratuvar raporundaki eGFR (CKD-EPI) vücut yüzeyine göre düzeltilmiştir (mL/dk/1,73 m²). Birçok ürün bilgisi ise Cockcroft–Gault ile tahmin edilen kreatinin klirensini verir (mL/dk). İkisi aynı sayı değildir.",
    ],
    formula: "Formül",
    formulaBody: "Serum kreatinin (Scr) mg/dL, yaş yıl cinsindendir. Sonuç vücut yüzeyine göre düzeltilmiştir (mL/dk/1,73 m²).",
    cg: "Cockcroft–Gault ile farkı",
    cgBody: "Ağırlık kg, Scr mg/dL cinsindendir. Sonuç kreatinin klirensidir ve vücut yüzeyine göre düzeltilmemiştir (mL/dk).",
    cgAbsolute:
      "Vücut yüzeyi ortalamadan çok farklı hastada indekslenmemiş eGFR (mL/dk) şöyle bulunur: eGFR × VYA / 1,73. VYA, vücut yüzey alanıdır (m²).",
    coefficients: "Katsayılar",
    param: "Parametre",
    female: "Kadın",
    male: "Erkek",
    femaleFactor: "Kadın çarpanı",
    loinc: "LOINC eşlemesi",
    loincBody:
      "PharmaDeux eGFR'yi FHIR Observation'da LOINC 98979-8 (CKD-EPI 2021, kreatinin temelli) ile taşır. LOINC 62238-1 2009 denklemine aittir; iki kod birbirinin yerine kullanılmaz.",
    code: "Kod",
    meaning: "Anlam",
    loinc2021: "eGFR, kreatinin temelli, CKD-EPI 2021",
    loinc2009: "eGFR, kreatinin temelli, CKD-EPI (2009)",
    unit: "UCUM birimi",
    kdigo: "KDIGO GFR kategorileri",
    category: "Kategori",
    gfr: "eGFR (mL/dk/1,73 m²)",
    label: "Tanım",
    dosing: "Renal doz kontrolünde temel ilkeler",
    kdigoNote:
      "Doz eşiği ilaca özgüdür ve ürün bilgisinden gelir. Bu yüzden PharmaDeux'ta kategori başına sabit bir davranış tanımlanmaz: aynı G3b hastada bir ilaç doz ayarı gerektirirken diğeri gerektirmeyebilir. Kural çıktıları kurumun klinik politikasına göre ayarlanır ve son karar hekimindir.",
    dosingBody: "Böbrek fonksiyonuna göre doz kontrolünde gözetilen ilkeler:",
    dosingItems: [
      "Doz eşiği ürün bilgisinden (KÜB) gelir ve ürün bilgisinin kullandığı ölçüte göre uygulanır. Ürün bilgisi kreatinin klirensi (Cockcroft–Gault, mL/dk) veriyorsa eGFR (mL/dk/1,73 m²) onun yerine konmaz.",
      "PharmaDeux'ta kural güncel laboratuvar değerine bakar; gerekli değer yoksa eksik veri olarak işaretlenir, atlanmaz.",
      "Aynı reçete farklı böbrek fonksiyonunda farklı sonuç verebilir: eGFR'si 90 olan hastada güvenli olan doz 30'da ayar gerektirebilir.",
    ],
    limits: "Sınırlar",
    limitsItems: [
      "Akut böbrek hasarında kreatinin kararlı değildir. Denklemle hesaplanan eGFR bu durumda gerçek filtrasyonu yansıtmayabilir.",
      "Kreatinin kas kütlesine bağlıdır. Kaşektik veya kas kütlesi çok düşük hastada eGFR filtrasyonu olduğundan yüksek gösterebilir. Aşırı obez hastada indeksli ve indekslenmemiş değerler belirgin biçimde ayrışır.",
      "CKD-EPI 2021 erişkinler (18 yaş ve üzeri) için geliştirilmiştir. Çocuklarda pediatrik denklemler (ör. Schwartz) kullanılır.",
    ],
    review: "Klinik inceleme: bu sayfa henüz bir hekim tarafından incelenmedi.",
    related: [
      { href: "/initiatives/pharmadeux?case=renal#vakalar", label: "Örnek vaka: renal doz eşiği" },
      { href: "/standartlar/tisdale-score", label: "Tisdale skoru" },
      { href: "/standartlar/kumulatif-organ-yuku", label: "Kümülatif organ yükü" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 entegrasyonu" },
    ],
  },
  en: {
    crumb: "CKD-EPI 2021",
    eyebrow: "Clinical standard: kidney function",
    title: "eGFR with CKD-EPI 2021",
    description:
      "The equation estimating glomerular filtration rate (eGFR) from serum creatinine, age and sex, without a race coefficient.",
    problem: "Clinical problem",
    problemBody: [
      "When clearance of a renally excreted drug falls but the dose stays the same, the drug accumulates. Together with other drugs acting on the same organ, this raises the cumulative organ burden.",
      "The eGFR on a laboratory report (CKD-EPI) is indexed to body surface area (mL/min/1.73 m²). Many product labels instead give creatinine clearance estimated with Cockcroft–Gault (mL/min). The two are not the same number.",
    ],
    formula: "Formula",
    formulaBody: "Serum creatinine (Scr) in mg/dL, age in years. The result is indexed to body surface area (mL/min/1.73 m²).",
    cg: "How it differs from Cockcroft–Gault",
    cgBody: "Weight in kg, Scr in mg/dL. The result is creatinine clearance and is not indexed to body surface area (mL/min).",
    cgAbsolute:
      "When body surface area is far from average, the non-indexed eGFR (mL/min) is eGFR × BSA / 1.73, where BSA is body surface area (m²).",
    coefficients: "Coefficients",
    param: "Parameter",
    female: "Female",
    male: "Male",
    femaleFactor: "Female factor",
    loinc: "LOINC mapping",
    loincBody:
      "PharmaDeux carries eGFR in a FHIR Observation with LOINC 98979-8 (CKD-EPI 2021, creatinine-based). LOINC 62238-1 belongs to the 2009 equation, and the two codes are not interchangeable.",
    code: "Code",
    meaning: "Meaning",
    loinc2021: "eGFR, creatinine-based, CKD-EPI 2021",
    loinc2009: "eGFR, creatinine-based, CKD-EPI (2009)",
    unit: "UCUM unit",
    kdigo: "KDIGO GFR categories",
    category: "Category",
    gfr: "eGFR (mL/min/1.73 m²)",
    label: "Description",
    dosing: "Core principles of renal dose checks",
    kdigoNote:
      "Dose thresholds are drug-specific and come from the product information. PharmaDeux therefore defines no fixed behaviour per category: in the same G3b patient, one drug may need a dose adjustment and another may not. Rule outputs are configured to the institution's clinical policy, and the physician makes the final decision.",
    dosingBody: "Principles that apply when checking doses against kidney function:",
    dosingItems: [
      "The dose threshold comes from the product information (SmPC) and is applied on the measure the label uses. If the label gives creatinine clearance (Cockcroft–Gault, mL/min), eGFR (mL/min/1.73 m²) is not substituted for it.",
      "In PharmaDeux, a rule reads the latest laboratory value. If a required value is missing, it is flagged, never skipped.",
      "The same order can give a different result at different kidney function: a dose that is safe at an eGFR of 90 may need adjusting at 30.",
    ],
    limits: "Limits",
    limitsItems: [
      "In acute kidney injury, creatinine is not at steady state. An equation-based eGFR may not reflect true filtration.",
      "Creatinine depends on muscle mass. In cachexia or very low muscle mass, eGFR can overestimate filtration. In severe obesity, indexed and non-indexed values diverge markedly.",
      "CKD-EPI 2021 was developed for adults (18 years and older). Children are assessed with paediatric equations (e.g. Schwartz).",
    ],
    review: "Clinical review: this page has not been reviewed by a physician yet.",
    related: [
      { href: "/initiatives/pharmadeux?case=renal#vakalar", label: "Example case: renal dose threshold" },
      { href: "/standartlar/tisdale-score", label: "Tisdale score" },
      { href: "/standartlar/kumulatif-organ-yuku", label: "Cumulative organ burden" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 integration" },
    ],
  },
});

export default function CkdEpiView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const refs = [...CITATIONS.ckdepi2021.refs, ...CITATIONS.cockcroftGault.refs, ...CITATIONS.kdigo2024.refs];
  return (
    <StandardDoc
      locale={locale}
      path={PATH}
      crumb={c.crumb}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      toc={[
        { id: "problem", label: c.problem },
        { id: "formul", label: c.formula },
        { id: "loinc", label: c.loinc },
        { id: "kdigo", label: c.kdigo },
        { id: "doz", label: c.dosing },
        { id: "sinirlar", label: c.limits },
      ]}
      references={refs}
      related={c.related}
      jsonLd={standardPageJsonLd({
        locale,
        path: PATH,
        name: c.title,
        description: metadata[locale].description as string,
        kind: "medical",
        about: {
          "@type": "MedicalTest",
          name: "Estimated glomerular filtration rate (CKD-EPI 2021 creatinine equation)",
          code: { "@type": "MedicalCode", codeValue: "98979-8", codingSystem: "LOINC" },
        },
        citations: refs,
      })}
    >
      <h2 id="problem">{c.problem}</h2>
      {c.problemBody.map((text) => (
        <p key={text}>{text}</p>
      ))}

      <h2 id="formul" className="mt-12">{c.formula}</h2>
      <Formula
        plain="eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200 × 0.9938^Age × 1.012 [if female]"
        caption={
          <>
            CKD-EPI 2021
            <Cite id="ckdepi2021" tone="paper" />
          </>
        }
      >
        <Term>eGFR = 142</Term> <Term>× min(Scr/κ, 1)<sup>α</sup></Term> <Term>× max(Scr/κ, 1)<sup>−1.200</sup></Term>{" "}
        <Term>× 0.9938<sup>Age</sup></Term> <Term>× 1.012 [if female]</Term>
      </Formula>
      <p>{c.formulaBody}</p>

      <h3>{c.coefficients}</h3>
      <table>
        <thead>
          <tr>
            <th>{c.param}</th>
            <th className="text-right">{c.female}</th>
            <th className="text-right">{c.male}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-serif text-[17px] text-ink">κ</td>
            <td className="text-right font-mono tabular-nums">{K.kappa.female}</td>
            <td className="text-right font-mono tabular-nums">{K.kappa.male}</td>
          </tr>
          <tr>
            <td className="font-serif text-[17px] text-ink">α</td>
            <td className="text-right font-mono tabular-nums">{String(K.alpha.female).replace("-", "−")}</td>
            <td className="text-right font-mono tabular-nums">{String(K.alpha.male).replace("-", "−")}</td>
          </tr>
          <tr>
            <td>{c.femaleFactor}</td>
            <td className="text-right font-mono tabular-nums">{K.femaleFactor}</td>
            <td className="text-right font-mono tabular-nums">—</td>
          </tr>
        </tbody>
      </table>

      <ToolPanel>
        <EgfrCalculator locale={locale} />
      </ToolPanel>

      <h3>{c.cg}</h3>
      <Formula
        plain="CrCl = (140 − Age) × Weight / (72 × Scr) × 0.85 [if female]"
        caption={
          <>
            Cockcroft–Gault
            <Cite id="cockcroftGault" tone="paper" />
          </>
        }
      >
        <Term>CrCl = (140 − Age) × Weight</Term> <Term>/ (72 × Scr)</Term> <Term>× 0.85 [if female]</Term>
      </Formula>
      <p>{c.cgBody}</p>
      <p>{c.cgAbsolute}</p>

      <h2 id="loinc" className="mt-12">{c.loinc}</h2>
      <p>{c.loincBody}</p>
      <table>
        <thead>
          <tr>
            <th>{c.code}</th>
            <th>{c.meaning}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-mono text-ink">98979-8</td>
            <td>{c.loinc2021}</td>
          </tr>
          <tr>
            <td className="font-mono">62238-1</td>
            <td>{c.loinc2009}</td>
          </tr>
          <tr>
            <td className="font-mono">{"mL/min/{1.73_m2}"}</td>
            <td>{c.unit}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="kdigo" className="mt-12">{c.kdigo}</h2>
      <table>
        <thead>
          <tr>
            <th>{c.category}</th>
            <th>{c.gfr}</th>
            <th>{c.label}</th>
          </tr>
        </thead>
        <tbody>
          {KDIGO.map((k) => (
            <tr key={k.g}>
              <td className="font-mono text-ink">{k.g}</td>
              <td className="font-mono tabular-nums">{k.range}</td>
              <td>{k[locale]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{c.kdigoNote}</p>

      <h2 id="doz" className="mt-12">{c.dosing}</h2>
      <p>{c.dosingBody}</p>
      <ul>
        {c.dosingItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 id="sinirlar" className="mt-12">{c.limits}</h2>
      <ul>
        {c.limitsItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-[14px]">{c.review}</p>
    </StandardDoc>
  );
}
