import data from "@/data/projectMetrics.json";
import pkg from "../../package.json";
import type { EngineStatus, ProjectMetrics } from "@/types/metrics";
import { groupDigits, type Locale } from "@/i18n/config";

// JSON imports widen string literals, so the status is narrowed here; an unknown value fails the build.
const STATUSES: readonly EngineStatus[] = ["active", "paused", "maintenance"];
if (!STATUSES.includes(data.engineStatus as EngineStatus)) {
  throw new Error(`projectMetrics.json: unknown engineStatus "${data.engineStatus}"`);
}

// The release label lives in package.json; the JSON copy must match it.
if (data.version !== `v${pkg.version}`) {
  throw new Error(`projectMetrics.json: version ${data.version} does not match package.json v${pkg.version}`);
}

export const metrics: ProjectMetrics = { ...data, engineStatus: data.engineStatus as EngineStatus };

/** "2.480+" / "2,480+": tests are a lower bound, grouped per locale. */
export const testsLabel = (locale: Locale) => `${groupDigits(locale, metrics.automatedTests)}+`;

/** What the test count is: shown next to it wherever the number is a headline. */
export const testsNote = (locale: Locale) =>
  locale === "tr"
    ? "Birim ve entegrasyon testleri · her sürümde CI hattında çalıştırılır"
    : "Unit and integration tests · run in CI on every release";

/** "THS 4" / "TRL 4". */
export const trlLabel = (locale: Locale) => `${locale === "tr" ? "THS" : "TRL"} ${metrics.trl}`;
