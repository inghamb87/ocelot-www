// House style and guardrail checks for everything a visitor can read.
// Run with: npm run check:copy
//
// 1. No em dashes or en dashes anywhere in source or docs.
// 2. Public copy never mentions how rates are sourced (spec section D).

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["node_modules", ".next", "out", ".git", ".wrangler", "package-lock.json", "fonts", "docs"]);
const TEXT_EXT = /\.(ts|tsx|css|md|mjs|json|sql|toml|svg|example)$/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (TEXT_EXT.test(name) || name.startsWith(".")) yield full;
  }
}

const DASH = /[–—]/;
const SOURCING = /\b(net rate|wholesale|margin|markup|commission|DMC)\b/i;
let problems = 0;

function scan(file, { sourcing }) {
  const rel = relative(root, file);
  if (rel === "scripts/check-copy.mjs") return;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (DASH.test(line)) {
        problems++;
        console.error(`${rel}:${i + 1}  em or en dash`);
      }
      if (sourcing && SOURCING.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line)) {
        problems++;
        console.error(`${rel}:${i + 1}  public copy mentions rate sourcing`);
      }
    });
}

for (const file of walk(root)) scan(file, { sourcing: /src\/(content|app|components)\/.*\.tsx?$/.test(file) });
// docs may discuss the commercial model, but still follow the dash rule
const docs = join(root, "docs");
if (existsSync(docs)) for (const file of walk(docs)) scan(file, { sourcing: false });

if (problems) {
  console.error(`\n${problems} copy problem(s).`);
  process.exit(1);
}
console.log("Copy checks passed.");
