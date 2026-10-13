import StandardDoc from "@/components/StandardDoc";
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
      "CKD-EPI 2021 kreatinin denklemi: formül ve katsayılar, LOINC 98979-8 eşlemesi, KDIGO GFR kategorileri ve PharmaDeux'un renal doz kontrol ilkeleri.",
  },
  en: {
    title: "CKD-EPI 2021 eGFR",
    description:
      "The CKD-EPI 2021 creatinine equation: formula and coefficients, LOINC 98979-8 mapping, KDIGO GFR categories and PharmaDeux's renal dose check principles.",
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

const KDIGO_REF =
  "Kidney Disease: Improving Global Outcomes (KDIGO) CKD Work Group. KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney International Supplements. 2013.";

const copy = defineContent({
  tr: {
    crumb: "CKD-EPI 2021",
    eyebrow: "Klinik standart · böbrek fonksiyonu",
    title: "CKD-EPI 2021 ile eGFR",
    description:
      "Serum kreatinin, yaş ve cinsiyetten ırk katsayısı kullanmadan tahmini glomerüler filtrasyon hızı (eGFR) hesaplayan denklem.",
    formula: "Formül",
    formulaBody: "Serum kreatinin (Scr) mg/dL, yaş yıl cinsindendir. Sonuç vücut yüzeyine göre düzeltilmiştir (mL/dk/1,73 m²).",
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
    dosingBody: "Böbrek fonksiyonuna göre doz kontrolünde gözetilen ilkeler:",
    dosingItems: [
      "Doz eşiği ürün bilgisinden (KÜB) gelir ve ürün bilgisinin kullandığı ölçüte göre uygulanır. Ürün bilgisi kreatinin klirensi (Cockcroft–Gault, mL/dk) veriyorsa eGFR (mL/dk/1,73 m²) onun yerine konmaz.",
      "PharmaDeux'da kural güncel laboratuvar değerine bakar; gerekli değer yoksa eksik veri olarak işaretlenir, atlanmaz.",
      "Aynı reçete farklı böbrek fonksiyonunda farklı sonuç verebilir: eGFR'si 90 olan hastada güvenli olan doz 30'da ayar gerektirebilir.",
      "Akut böbrek hasarında kreatinin kararlı değildir; denklemle hesaplanan eGFR bu durumda gerçek filtrasyonu yansıtmayabilir.",
    ],
    related: [
      { href: "/initiatives/pharmadeux?case=renal#simulator", label: "Örnek vaka: renal doz eşiği" },
      { href: "/standartlar/tisdale-score", label: "Tisdale skoru" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 entegrasyonu" },
    ],
  },
  en: {
    crumb: "CKD-EPI 2021",
    eyebrow: "Clinical standard · kidney function",
    title: "eGFR with CKD-EPI 2021",
    description:
      "The equation estimating glomerular filtration rate (eGFR) from serum creatinine, age and sex, without a race coefficient.",
    formula: "Formula",
    formulaBody: "Serum creatinine (Scr) in mg/dL, age in years. The result is indexed to body surface area (mL/min/1.73 m²).",
    coefficients: "Coefficients",
    param: "Parameter",
    female: "Female",
    male: "Male",
    femaleFactor: "Female factor",
    loinc: "LOINC mapping",
    loincBody:
      "PharmaDeux carries eGFR in a FHIR Observation with LOINC 98979-8 (CKD-EPI 2021, creatinine-based). LOINC 62238-1 belongs to the 2009 equation; the two codes are not interchangeable.",
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
    dosingBody: "Principles that apply when checking doses against kidney function:",
    dosingItems: [
      "The dose threshold comes from the product information (SmPC) and is applied on the measure the label uses. If the label gives creatinine clearance (Cockcroft–Gault, mL/min), eGFR (mL/min/1.73 m²) is not substituted for it.",
      "In PharmaDeux a rule reads the latest laboratory value; if a required value is missing it is flagged, never skipped.",
      "The same order can give a different result at different kidney function: a dose that is safe at an eGFR of 90 may need adjusting at 30.",
      "In acute kidney injury creatinine is not at steady state; an equation-based eGFR may then not reflect true filtration.",
    ],
    related: [
      { href: "/initiatives/pharmadeux?case=renal#simulator", label: "Example case: renal dose threshold" },
      { href: "/standartlar/tisdale-score", label: "Tisdale score" },
      { href: "/standartlar/fhir-r4-entegrasyonu", label: "FHIR R4 integration" },
    ],
  },
});

export default function CkdEpiView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const refs = [...CITATIONS.ckdepi2021.refs, KDIGO_REF];
  return (
    <StandardDoc
      locale={locale}
      crumb={c.crumb}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
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
      <h2>{c.formula}</h2>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-hairline bg-navy-900 px-5 py-4 font-mono text-[13px] leading-relaxed text-white/85">
        {"eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200\n       × 0.9938^Age × 1.012 [if female]"}
      </pre>
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
            <td className="font-mono">κ</td>
            <td className="text-right font-mono tabular-nums">{K.kappa.female}</td>
            <td className="text-right font-mono tabular-nums">{K.kappa.male}</td>
          </tr>
          <tr>
            <td className="font-mono">α</td>
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

      <EgfrCalculator locale={locale} />

      <h2 className="mt-12">{c.loinc}</h2>
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
            <td className="font-mono text-white">98979-8</td>
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

      <h2 className="mt-12">{c.kdigo}</h2>
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
              <td className="font-mono text-white">{k.g}</td>
              <td className="font-mono tabular-nums">{k.range}</td>
              <td>{k[locale]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-12">{c.dosing}</h2>
      <p>{c.dosingBody}</p>
      <ul>
        {c.dosingItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </StandardDoc>
  );
}
