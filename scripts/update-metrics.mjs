#!/usr/bin/env node
// Updates src/data/projectMetrics.json (and the package version) from the command line.
//
//   node scripts/update-metrics.mjs --phase 14 --rules 48
//   node scripts/update-metrics.mjs --version 0.5.0 --tests 2600 --dry-run
//
// Options (all optional, at least one value is required):
//   --phase <n>     currentPhase (development step, 1 … totalPhases)
//   --total <n>     totalPhases
//   --rules <n>     verifiedRules
//   --tests <n>     automatedTests
//   --version <x>   semver "0.5.0" or "v0.5.0"; also written to package.json and package-lock.json
//   --date <iso>    lastUpdated (YYYY-MM-DD); defaults to today (UTC)
//   --root <dir>    project root (default: the repository this script lives in); used by tests
//   --dry-run       print the result without writing
//
// safetyPlanes and trl are deliberately not settable here: the plane count must match the plane list
// drawn on the PharmaDeux page (the build checks it), and the readiness level is a regulatory claim.
// Change those by hand, together with the content they describe.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const INT_FIELDS = { phase: "currentPhase", total: "totalPhases", rules: "verifiedRules", tests: "automatedTests" };
const SEMVER = /^v?(\d+\.\d+\.\d+)$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message) {
  console.error(`update-metrics: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      out.dryRun = true;
      continue;
    }
    if (!arg.startsWith("--")) fail(`unexpected argument "${arg}"`);
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) fail(`missing value for --${key}`);
    out[key] = value;
    i++;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const known = new Set([...Object.keys(INT_FIELDS), "version", "date", "root", "dryRun"]);
for (const key of Object.keys(args)) if (!known.has(key)) fail(`unknown option --${key}`);

const root = resolve(args.root ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
const paths = {
  metrics: join(root, "src/data/projectMetrics.json"),
  pkg: join(root, "package.json"),
  lock: join(root, "package-lock.json"),
};

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
// Keep each file's line endings (CRLF on Windows checkouts with core.autocrlf, LF in CI), so a run only
// changes the values, never every line of the file.
const writeJson = (p, value) => {
  const eol = readFileSync(p, "utf8").includes("\r\n") ? "\r\n" : "\n";
  writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`.replace(/\n/g, eol));
};
const metrics = readJson(paths.metrics);
const next = { ...metrics };
let changed = false;

for (const [flag, field] of Object.entries(INT_FIELDS)) {
  if (args[flag] === undefined) continue;
  if (!/^\d+$/.test(args[flag])) fail(`--${flag} must be a non-negative integer, got "${args[flag]}"`);
  next[field] = Number(args[flag]);
  changed = true;
}

let version = null;
if (args.version !== undefined) {
  const m = SEMVER.exec(args.version);
  if (!m) fail(`--version must look like 0.5.0 or v0.5.0, got "${args.version}"`);
  version = m[1];
  next.version = `v${version}`;
  changed = true;
}

if (!changed) fail("nothing to update; pass at least one of --phase --total --rules --tests --version");

if (next.currentPhase < 1 || next.currentPhase > next.totalPhases) {
  fail(`currentPhase ${next.currentPhase} must be between 1 and totalPhases ${next.totalPhases}`);
}

const date = args.date ?? new Date().toISOString().slice(0, 10);
if (!ISO_DATE.test(date) || Number.isNaN(Date.parse(date))) fail(`--date must be YYYY-MM-DD, got "${date}"`);
next.lastUpdated = date;

const diff = Object.keys(next).filter((k) => next[k] !== metrics[k]);
console.log(diff.length ? diff.map((k) => `${k}: ${metrics[k]} → ${next[k]}`).join("\n") : "no change");
if (args.dryRun) process.exit(0);

writeJson(paths.metrics, next);

if (version) {
  // Only the root package's own version fields are touched; dependency versions are left alone.
  const pkg = readJson(paths.pkg);
  pkg.version = version;
  writeJson(paths.pkg, pkg);
  try {
    const lock = readJson(paths.lock);
    lock.version = version;
    if (lock.packages?.[""]) lock.packages[""].version = version;
    writeJson(paths.lock, lock);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
