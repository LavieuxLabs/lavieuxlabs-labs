/** Shape of src/data/projectMetrics.json, the single source of the project's progress and clinical metrics. */
export type EngineStatus = "active" | "paused" | "maintenance";

export interface ProjectMetrics {
  /** Current development step of the PharmaDeux roadmap (not the clinical validation phases 0–4). */
  currentPhase: number;
  /** Total development steps in the roadmap. */
  totalPhases: number;
  /** Rules that passed review and their test scenarios. */
  verifiedRules: number;
  /** ISO date (YYYY-MM-DD) of the last metrics update. */
  lastUpdated: string;
  /**
   * Internal development status. Never rendered: the site makes no "active/live" claim about a
   * product that is not in clinical use (see CLAUDE.md, clinical stamp and verification imprint).
   */
  engineStatus: EngineStatus;
  /** Release label, "v" + package.json version. */
  version: string;
  /** PharmaDeux safety planes (checks grouped under four headings). */
  safetyPlanes: number;
  /** Automated tests; shown as a lower bound ("2.480+"). */
  automatedTests: number;
  /** Technology readiness level (THS in Turkish, TRL in English). */
  trl: number;
}
