import StandardDoc from "@/components/StandardDoc";
import { medicationRequest, qtcObservation, tisdaleObservation } from "@/lib/fhirPayload";
import { highlightJson } from "@/lib/jsonHighlight";
import { standardPageJsonLd } from "@/lib/structuredData";
import { defineContent, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

const PATH = "/standartlar/fhir-r4-entegrasyonu";
// Fixed timestamp: the examples are prerendered and must not change between builds.
const AUTHORED = "2026-10-12T09:00:00+03:00";

export const metadata = defineMetadata(PATH, {
  tr: {
    title: "HL7 FHIR R4 entegrasyonu",
    description:
      "HBYS ekipleri için PharmaDeux'un HL7 FHIR R4 arayüzü: kullanılan kaynaklar (MedicationRequest, Observation), kod sistemleri, örnek JSON ve entegrasyon mimarisi.",
  },
  en: {
    title: "HL7 FHIR R4 integration",
    description:
      "PharmaDeux's HL7 FHIR R4 interface for hospital IT teams: resources used (MedicationRequest, Observation), code systems, example JSON and integration architecture.",
  },
});

const REFS = [
  "HL7 International. FHIR Release 4 (R4, v4.0.1). https://hl7.org/fhir/R4/",
  "WHO Collaborating Centre for Drug Statistics Methodology. ATC/DDD Index. https://www.whocc.no/atc_ddd_index/",
  "Regenstrief Institute. LOINC. https://loinc.org/",
  "The Unified Code for Units of Measure (UCUM). https://ucum.org/",
];

const copy = defineContent({
  tr: {
    crumb: "FHIR R4 entegrasyonu",
    eyebrow: "Teknik standart · birlikte çalışabilirlik",
    title: "HL7 FHIR R4 entegrasyonu",
    description:
      "Hastane bilgi işlem ekipleri için: PharmaDeux hangi FHIR kaynaklarını okur ve yazar, hangi kod sistemlerini kullanır, kurumunuza nasıl bağlanır.",
    status: "Durum",
    statusBody:
      "Bu sayfa arayüzün tasarımını belgeler. Resmi FHIR profilleri (StructureDefinition) ve OpenAPI belgesi henüz yayımlanmadı; pilot öncesi teknik keşifte bilgi işlem ekibinizle paylaşılır.",
    resources: "Kaynaklar ve alanlar",
    resource: "Kaynak",
    fields: "Kullanılan alanlar",
    codes: "Kod sistemi",
    rows: [
      ["MedicationRequest", "medicationCodeableConcept · dosageInstruction · authoredOn · subject", "WHO ATC · UCUM"],
      ["Observation (laboratuvar)", "code · valueQuantity · effectiveDateTime · interpretation", "LOINC · UCUM"],
      ["Observation (QTc)", "code · method · valueQuantity", "LOINC 8636-3 · Fridericia (method)"],
      ["Observation (Tisdale)", "code.text · valueInteger · component", "metin (standart kod yok)"],
      ["Patient · Condition · AllergyIntolerance", "Okunur; kimlik bilgisi sisteme girerken anonimleştirilir", "ICD-10"],
    ],
    rules: "Kurallar",
    rulesItems: [
      "Skor ve ölçüm ayrı kaynaklardır: Tisdale skoru QTc Observation'ının içine katılmaz, ayrı bir Observation'dır.",
      "LOINC 8636-3 \"QT interval corrected\" düzeltme yöntemini belirtmez; Fridericia method alanında metin olarak taşınır.",
      "Örnek ve test verisi meta.tag HTEST (v3 ActReason \"test health data\") taşır, gerçek kayıt yerine geçemez.",
    ],
    examples: "Örnek JSON",
    exRequest: "MedicationRequest · amiodaron 200 mg",
    exQtc: "Observation · QTc 485 ms (Fridericia)",
    exScore: "Observation · Tisdale skoru",
    examplesNote: "Örnekler PharmaDeux'un FHIR yükünü üreten kodla oluşturulur · kurgusal veri.",
    architecture: "Entegrasyon mimarisi",
    arch: [
      ["FHIR R4", "RESTful API · Subscription (rest-hook)"],
      ["HL7 v2", "MLLP dinleyici · FHIR R4 dönüştürücü katmanı"],
      ["Yetkilendirme", "OAuth 2.0 · SMART on FHIR"],
      ["Taşıma", "mTLS (karşılıklı TLS)"],
      ["Erişim", "RBAC · en az yetki ilkesi"],
      ["Kurulum", "Kurum içi (Docker konteyner, izole sanal makine) · kuruma ayrılmış izole VPC · internetsiz ağ desteği"],
      ["Kayıt", "Syslog (RFC 5424) · yalnızca eklenebilir denetim izi"],
    ],
    tisdaleFactors: ["Yaş ≥68", "Kadın", "Loop diüretik", "QTc ≥450 ms", "QT uzatan ilaç", "≥2 QT uzatan ilaç"],
    tabletText: "Amiodaron 200 mg tablet",
    related: [
      { href: "/initiatives/pharmadeux#entegrasyon", label: "Entegrasyon matrisi" },
      { href: "/initiatives/pharmadeux#simulator", label: "Simülatörden canlı FHIR yükü" },
      { href: "/standartlar/tisdale-score", label: "Tisdale skoru" },
    ],
  },
  en: {
    crumb: "FHIR R4 integration",
    eyebrow: "Technical standard · interoperability",
    title: "HL7 FHIR R4 integration",
    description:
      "For hospital IT teams: which FHIR resources PharmaDeux reads and writes, which code systems it uses, and how it connects to your institution.",
    status: "Status",
    statusBody:
      "This page documents the interface design. Formal FHIR profiles (StructureDefinition) and an OpenAPI document are not published yet; they are shared with your IT team during the pre-pilot technical review.",
    resources: "Resources and fields",
    resource: "Resource",
    fields: "Fields used",
    codes: "Code system",
    rows: [
      ["MedicationRequest", "medicationCodeableConcept · dosageInstruction · authoredOn · subject", "WHO ATC · UCUM"],
      ["Observation (laboratory)", "code · valueQuantity · effectiveDateTime · interpretation", "LOINC · UCUM"],
      ["Observation (QTc)", "code · method · valueQuantity", "LOINC 8636-3 · Fridericia (method)"],
      ["Observation (Tisdale)", "code.text · valueInteger · component", "text (no standard code)"],
      ["Patient · Condition · AllergyIntolerance", "Read; identifiers are anonymised as data enters the system", "ICD-10"],
    ],
    rules: "Rules",
    rulesItems: [
      "Score and measurement are separate resources: the Tisdale score is never folded into the QTc Observation; it is its own Observation.",
      "LOINC 8636-3 \"QT interval corrected\" does not fix the correction method; Fridericia is carried as text in method.",
      "Example and test data carry meta.tag HTEST (v3 ActReason \"test health data\") and cannot pass as a real record.",
    ],
    examples: "Example JSON",
    exRequest: "MedicationRequest · amiodarone 200 mg",
    exQtc: "Observation · QTc 485 ms (Fridericia)",
    exScore: "Observation · Tisdale score",
    examplesNote: "Examples are generated by the code that builds PharmaDeux's FHIR payloads · fictional data.",
    architecture: "Integration architecture",
    arch: [
      ["FHIR R4", "RESTful API · Subscription (rest-hook)"],
      ["HL7 v2", "MLLP listener · FHIR R4 conversion layer"],
      ["Authorisation", "OAuth 2.0 · SMART on FHIR"],
      ["Transport", "mTLS (mutual TLS)"],
      ["Access", "RBAC · least privilege"],
      ["Deployment", "On-premises (Docker container, isolated virtual machine) · isolated VPC dedicated to the institution · air-gapped network support"],
      ["Logging", "Syslog (RFC 5424) · append-only audit trail"],
    ],
    tisdaleFactors: ["Age ≥68", "Female", "Loop diuretic", "QTc ≥450 ms", "QT-prolonging drug", "≥2 QT-prolonging drugs"],
    tabletText: "Amiodarone 200 mg tablet",
    related: [
      { href: "/initiatives/pharmadeux#entegrasyon", label: "Integration matrix" },
      { href: "/initiatives/pharmadeux#simulator", label: "Live FHIR payload from the simulator" },
      { href: "/standartlar/tisdale-score", label: "Tisdale score" },
    ],
  },
});

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <figure className="mt-5 overflow-hidden rounded-xl border border-hairline">
      <figcaption className="border-b border-hairline px-4 py-2.5 font-mono text-[11.5px] text-white/60">{title}</figcaption>
      <pre className="max-h-[360px] overflow-auto bg-navy-900 px-4 py-3 font-mono text-[12px] leading-relaxed text-white/50">
        <code>{highlightJson(JSON.stringify(value, null, 2))}</code>
      </pre>
    </figure>
  );
}

export default function FhirStandardView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const points = [1, 1, 1, 2, 3, 3];
  const request = medicationRequest("example-amiodarone", { atc: "C01BD01", display: "amiodarone", text: c.tabletText, doseMg: 200 }, AUTHORED);
  const qtc = qtcObservation("example-qtc", 485, AUTHORED);
  const score = tisdaleObservation(
    "example-tisdale",
    c.tisdaleFactors.map((factor, i) => ({ factor, points: points[i] })),
    AUTHORED,
  );

  return (
    <StandardDoc
      locale={locale}
      crumb={c.crumb}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      references={REFS}
      related={c.related}
      jsonLd={standardPageJsonLd({
        locale,
        path: PATH,
        name: c.title,
        description: metadata[locale].description as string,
        kind: "technical",
        about: { "@type": "Thing", name: "HL7 FHIR Release 4", sameAs: "https://hl7.org/fhir/R4/" },
        citations: REFS,
      })}
    >
      <h2>{c.status}</h2>
      <p className="note">{c.statusBody}</p>

      <h2 className="mt-12">{c.resources}</h2>
      <table>
        <thead>
          <tr>
            <th>{c.resource}</th>
            <th>{c.fields}</th>
            <th>{c.codes}</th>
          </tr>
        </thead>
        <tbody>
          {c.rows.map(([resource, fields, codes]) => (
            <tr key={resource}>
              <td className="font-mono text-[12.5px] text-white">{resource}</td>
              <td className="font-mono text-[12px]">{fields}</td>
              <td>{codes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{c.rules}</h3>
      <ul>
        {c.rulesItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-12">{c.examples}</h2>
      <JsonBlock title={c.exRequest} value={request} />
      <JsonBlock title={c.exQtc} value={qtc} />
      <JsonBlock title={c.exScore} value={score} />
      <p className="text-[13px]">{c.examplesNote}</p>

      <h2 className="mt-12">{c.architecture}</h2>
      <table>
        <tbody>
          {c.arch.map(([label, value]) => (
            <tr key={label}>
              <td className="w-36 text-white/60">{label}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StandardDoc>
  );
}
