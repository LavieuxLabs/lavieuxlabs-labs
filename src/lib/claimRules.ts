// Shield's example rule set, shared by the claim simulator (product page) and the home page figure.
// The rule set is fictional (rule IDs, weights) and labelled as such; it names no SUT article numbers,
// because invented legal references would read as real. ICD-10 codes are real and used with their real
// meaning. Score = Σ triggered rule weights (0–100), threshold 40.

export type ItemId = "angio" | "vent" | "ct";
export type RuleKey = "mismatch" | "preapproval" | "repeat" | "unsigned";
export type Rule = { id: string; weight: number };

export const ITEMS: { id: ItemId; icd: string[]; compatible: string[] }[] = [
  { id: "angio", icd: ["I20.9", "I21.9", "M54.5"], compatible: ["I20.9", "I21.9"] },
  { id: "vent", icd: ["J96.0", "J18.9", "R51"], compatible: ["J96.0", "J18.9"] },
  { id: "ct", icd: ["R07.4", "J18.9", "M54.5"], compatible: ["R07.4", "J18.9"] },
];

export const RULES: Record<RuleKey, Rule> = {
  mismatch: { id: "R-112", weight: 34 },
  preapproval: { id: "R-047", weight: 26 },
  repeat: { id: "R-203", weight: 18 },
  unsigned: { id: "R-019", weight: 10 },
};

export const THRESHOLD = 40;

export type Checks = { preapproval: boolean; repeat: boolean; signed: boolean };
export const DEFAULT_CHECKS: Checks = { preapproval: false, repeat: false, signed: true };

/** Rules a line item triggers, in a fixed order, and the capped score they add up to. */
export function scoreClaim(itemId: ItemId, icd: string, checks: Checks): { triggered: RuleKey[]; score: number } {
  const item = ITEMS.find((i) => i.id === itemId)!;
  const triggered = (
    [
      !item.compatible.includes(icd) && "mismatch",
      !checks.preapproval && "preapproval",
      checks.repeat && "repeat",
      !checks.signed && "unsigned",
    ] as const
  ).filter((k): k is RuleKey => Boolean(k));
  const score = Math.min(100, triggered.reduce((n, k) => n + RULES[k].weight, 0));
  return { triggered, score };
}
