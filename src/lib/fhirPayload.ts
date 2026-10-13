import type { ClinicalCase, Tone } from "@/lib/clinicalCases";
import { SITE_URL } from "@/lib/site";

// Simulated HL7 FHIR R4 payloads for the "copy as FHIR JSON" buttons on the example panels. Every
// resource carries meta.tag HTEST (v3 ActReason "test health data") so it cannot pass as a real record.
// Codings are real and used with their real meaning: LOINC for the three measurements, ICD-10 for
// diagnoses, UCUM for units, and the HL7 claim-type / process-priority / observation-category /
// interpretation code systems. The Tisdale score and SUT annex have no standard code here, so they are
// sent as text only rather than with an invented code.

const TEST_TAG = [
  { system: "http://terminology.hl7.org/CodeSystem/v3-ActReason", code: "HTEST", display: "test health data" },
];
const PATIENT = { reference: "Patient/example" };

// Tone is the simulator's severity, not a direction, so it maps to normal / abnormal / critical abnormal.
const INTERPRETATION: Record<Tone, { code: string; display: string }> = {
  normal: { code: "N", display: "Normal" },
  caution: { code: "A", display: "Abnormal" },
  high: { code: "AA", display: "Critical abnormal" },
};

const MEASUREMENTS = {
  liver: {
    loinc: "1742-6",
    display: "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    category: "laboratory",
    unit: "U/L",
    ucum: "U/L",
  },
  qtc: {
    loinc: "8636-3",
    display: "Q-T interval corrected",
    category: "procedure",
    unit: "ms",
    ucum: "ms",
  },
  renal: {
    // 98979-8 is the race-free CKD-EPI 2021 creatinine equation the site uses (62238-1 is the 2009 equation).
    loinc: "98979-8",
    display: "Glomerular filtration rate/1.73 sq M.predicted [Volume Rate/Area] in Serum, Plasma or Blood by Creatinine-based formula (CKD-EPI 2021)",
    category: "laboratory",
    unit: "mL/min/1.73 m2",
    ucum: "mL/min/{1.73_m2}",
  },
} as const;

// LOINC 8636-3 is "QT interval corrected" without a fixed method, so the correction formula is sent as
// Observation.method (text only; no method code is invented).
const QTC_METHOD = { text: "Fridericia formula (QTc = QT / RR^(1/3))" };

const toNumber = (value: string) => Number(value.replace(/\s/g, "").replace(",", "."));

/** A collection Bundle of the case's Observations (ALT, QTc, eGFR, and the Tisdale score when present). */
export function caseToFhirBundle(item: ClinicalCase, caseRef: string, effective: string) {
  const observations = (Object.keys(MEASUREMENTS) as (keyof typeof MEASUREMENTS)[]).map((key) => {
    const m = MEASUREMENTS[key];
    const reading = item.readings[key];
    return {
      resourceType: "Observation",
      id: `${caseRef}-${key}`,
      meta: { tag: TEST_TAG },
      status: "final",
      category: [
        {
          coding: [
            { system: "http://terminology.hl7.org/CodeSystem/observation-category", code: m.category },
          ],
        },
      ],
      code: { coding: [{ system: "http://loinc.org", code: m.loinc, display: m.display }] },
      subject: { ...PATIENT, display: item.patient },
      effectiveDateTime: effective,
      ...(key === "qtc" ? { method: QTC_METHOD } : {}),
      valueQuantity: { value: toNumber(reading.value), unit: m.unit, system: "http://unitsofmeasure.org", code: m.ucum },
      interpretation: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
              ...INTERPRETATION[reading.tone],
            },
          ],
          text: reading.status,
        },
      ],
    };
  });

  const tisdale = item.tisdale
    ? [
        {
          resourceType: "Observation",
          id: `${caseRef}-tisdale`,
          meta: { tag: TEST_TAG },
          status: "final",
          code: { text: "Tisdale QT prolongation risk score" },
          subject: { ...PATIENT, display: item.patient },
          effectiveDateTime: effective,
          valueInteger: item.tisdale.reduce((n, t) => n + t.points, 0),
          component: item.tisdale.map((t) => ({ code: { text: t.factor }, valueInteger: t.points })),
        },
      ]
    : [];

  return {
    resourceType: "Bundle",
    id: `pharmadeux-${caseRef}`,
    meta: { tag: TEST_TAG },
    type: "collection",
    timestamp: effective,
    entry: [...observations, ...tisdale].map((resource) => ({
      fullUrl: `urn:uuid:${resource.id}`,
      resource,
    })),
  };
}

type ClaimInput = {
  id: string;
  icd: string;
  icdText: string;
  procedure: string;
  annexText: string;
  amount: number;
  score: number;
  factors: { rule: string; weight: number; text: string }[];
};

/** A Claim resource for the selected example claim, with Shield's score and rule matches as extensions. */
export function claimToFhir(claim: ClaimInput, created: string) {
  const ext = `${SITE_URL}/fhir/StructureDefinition`;
  return {
    resourceType: "Claim",
    id: claim.id.toLowerCase(),
    meta: { tag: TEST_TAG },
    identifier: [{ value: claim.id }],
    status: "active",
    type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/claim-type", code: "institutional" }] },
    use: "claim",
    patient: PATIENT,
    created,
    provider: { display: "Example hospital" },
    priority: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/processpriority", code: "normal" }] },
    insurance: [{ sequence: 1, focal: true, coverage: { display: "SGK" } }],
    diagnosis: [
      {
        sequence: 1,
        diagnosisCodeableConcept: {
          coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: claim.icd, display: claim.icdText }],
        },
      },
    ],
    item: [
      {
        sequence: 1,
        diagnosisSequence: [1],
        productOrService: { text: `${claim.procedure} · SUT ${claim.annexText}` },
        net: { value: claim.amount, currency: "TRY" },
      },
    ],
    total: { value: claim.amount, currency: "TRY" },
    extension: [
      { url: `${ext}/shield-risk-score`, valueInteger: claim.score },
      ...claim.factors.map((f) => ({
        url: `${ext}/shield-rule-match`,
        valueString: `${f.rule} +${f.weight} · ${f.text}`,
      })),
    ],
  };
}

/** A MedicationRequest for one example order line, coded with WHO ATC; dose in UCUM. */
export function medicationRequest(
  id: string,
  drug: { atc: string; display: string; text: string; doseMg: number },
  authoredOn: string,
) {
  return {
    resourceType: "MedicationRequest",
    id,
    meta: { tag: TEST_TAG },
    status: "active",
    intent: "order",
    medicationCodeableConcept: {
      coding: [{ system: "http://www.whocc.no/atc", code: drug.atc, display: drug.display }],
      text: drug.text,
    },
    subject: PATIENT,
    authoredOn,
    dosageInstruction: [
      {
        text: `${drug.doseMg} mg 1×1`,
        timing: { repeat: { frequency: 1, period: 1, periodUnit: "d" } },
        doseAndRate: [{ doseQuantity: { value: drug.doseMg, unit: "mg", system: "http://unitsofmeasure.org", code: "mg" } }],
      },
    ],
  };
}

/** A measured QTc (Fridericia) Observation in ms; no interpretation is attached to a raw measurement. */
export function qtcObservation(id: string, ms: number, effective: string) {
  const m = MEASUREMENTS.qtc;
  return {
    resourceType: "Observation",
    id,
    meta: { tag: TEST_TAG },
    status: "final",
    category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: m.category }] }],
    code: { coding: [{ system: "http://loinc.org", code: m.loinc, display: m.display }], text: "QTc (Fridericia)" },
    subject: PATIENT,
    effectiveDateTime: effective,
    method: QTC_METHOD,
    valueQuantity: { value: ms, unit: m.unit, system: "http://unitsofmeasure.org", code: m.ucum },
  };
}

/** The Tisdale QT risk score as a separate Observation: a score is never folded into the QTc measurement. */
export function tisdaleObservation(id: string, components: { factor: string; points: number }[], effective: string) {
  return {
    resourceType: "Observation",
    id,
    meta: { tag: TEST_TAG },
    status: "final",
    code: { text: "Tisdale QT prolongation risk score" },
    subject: PATIENT,
    effectiveDateTime: effective,
    valueInteger: components.reduce((n, c) => n + c.points, 0),
    component: components.map((c) => ({ code: { text: c.factor }, valueInteger: c.points })),
  };
}
