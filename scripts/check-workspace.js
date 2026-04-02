#!/usr/bin/env node
/**
 * Detects multiple package-lock.* files above the project directory and warns.
 * Run as predev/prebuild to prevent workspace root inference issues.
 */
const path = require("path");
const fs = require("fs");

const lockNames = [
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
];

const projectRoot = path.resolve(__dirname, "..");
const locksFound = [];

for (let dir = path.dirname(projectRoot); dir !== path.parse(dir).root; dir = path.dirname(dir)) {
  for (const name of lockNames) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) {
      locksFound.push(p);
    }
  }
}

if (locksFound.length > 1) {
  console.warn("\n⚠ Workspace root warning:");
  console.warn(
    "  Multiple lockfiles detected above the project directory. Next.js may infer the wrong root."
  );
  console.warn("  Lockfiles found:");
  locksFound.forEach((p) => console.warn(`    - ${p}`));
  console.warn(
    "  This project sets turbopack.root explicitly to avoid resolution issues."
  );
  console.warn(
    "  Consider removing unused lockfiles from parent dirs if not needed.\n"
  );
}
