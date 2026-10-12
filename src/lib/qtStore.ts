import { useSyncExternalStore } from "react";
import { BASELINE_QTC, DRUGS, type Baseline, type Patient } from "@/lib/qtSimulator";

// Shared state of the PharmaDeux QT simulator. The simulator writes it, the FHIR preview reads it, so the
// payload always describes the drugs and QTc currently selected. It is mirrored to the URL query
// (?drug1=…&drug2=…&qtc=…&risk=age,female,loop) so a case can be shared as a link.

export type QtState = { drug1: string; drug2: string; patient: Patient };

export const QT_DEFAULT: QtState = {
  drug1: "amiodarone",
  drug2: "azithromycin",
  patient: { age68: true, female: true, loopDiuretic: true, lowK: false, qtc: 455 },
};

const RISK_KEYS = { age: "age68", female: "female", loop: "loopDiuretic", lowk: "lowK" } as const;

let state: QtState = QT_DEFAULT;
const listeners = new Set<() => void>();

export function setQtState(next: QtState) {
  state = next;
  listeners.forEach((l) => l());
}

export function useQtState(): QtState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => QT_DEFAULT,
  );
}

const isDrug = (id: string | null): id is string => Boolean(id && DRUGS.some((d) => d.id === id));

/** Reads a shared case from the query; returns null when the URL carries no simulator parameters. */
export function qtFromSearch(search: string): QtState | null {
  const q = new URLSearchParams(search);
  if (!q.has("drug1") && !q.has("drug2") && !q.has("qtc") && !q.has("risk")) return null;
  const d1 = q.get("drug1");
  const d2 = q.get("drug2");
  const drug1 = isDrug(d1) ? d1 : QT_DEFAULT.drug1;
  let drug2 = isDrug(d2) ? d2 : QT_DEFAULT.drug2;
  if (drug2 === drug1) drug2 = DRUGS.find((d) => d.id !== drug1)!.id;
  const qtcN = Number(q.get("qtc"));
  const qtc = (BASELINE_QTC as readonly number[]).includes(qtcN) ? (qtcN as Baseline) : QT_DEFAULT.patient.qtc;
  const risk = q.has("risk") ? new Set((q.get("risk") ?? "").split(",").filter(Boolean)) : null;
  const flag = (key: keyof typeof RISK_KEYS) => (risk ? risk.has(key) : QT_DEFAULT.patient[RISK_KEYS[key]]);
  return { drug1, drug2, patient: { qtc, age68: flag("age"), female: flag("female"), loopDiuretic: flag("loop"), lowK: flag("lowk") } };
}

/** Writes the state into the current URL's query, keeping other parameters and the hash. */
export function qtToUrl(s: QtState, href: string): string {
  const url = new URL(href);
  url.searchParams.set("drug1", s.drug1);
  url.searchParams.set("drug2", s.drug2);
  url.searchParams.set("qtc", String(s.patient.qtc));
  const risk = (Object.keys(RISK_KEYS) as (keyof typeof RISK_KEYS)[]).filter((k) => s.patient[RISK_KEYS[k]]);
  url.searchParams.set("risk", risk.join(","));
  return url.toString();
}
