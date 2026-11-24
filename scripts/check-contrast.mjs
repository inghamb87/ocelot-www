// Verifies every color pair the design system uses against WCAG 2.2 AAA.
// Run with: npm run check:contrast
// Reads the tokens straight from src/app/globals.css, so it cannot drift.

import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
// First definition wins: that is the :root value, not a scoped override.
const tokens = {};
for (const m of css.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)) tokens[m[1]] ??= m[2].toLowerCase();

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const t = (name) => {
  if (name.startsWith("#")) return name;
  if (!tokens[name]) throw new Error(`Unknown token --${name}`);
  return tokens[name];
};

// [foreground, background, minimum ratio, what it is]
const TEXT = 7; // AAA normal text
const UI = 3; // control boundaries and focus indicators
const pairs = [
  ["text", "paper", TEXT, "body text on white"],
  ["text", "shell", TEXT, "body text on cream"],
  ["text", "stone", TEXT, "body text on stone"],
  ["text", "mist", TEXT, "body text on mist"],
  ["text-soft", "paper", TEXT, "secondary text on white"],
  ["text-soft", "shell", TEXT, "secondary text on cream"],
  ["text-soft", "stone", TEXT, "secondary text on stone"],
  ["on-dark", "navy", TEXT, "white text on navy"],
  ["on-dark-soft", "navy", TEXT, "secondary text on navy"],
  ["on-dark-accent", "navy", TEXT, "accent text on navy"],
  ["on-dark", "ink", TEXT, "white text on footer"],
  ["#d5d0ca", "ink", TEXT, "secondary text on footer"],
  ["on-dark-accent", "ink", TEXT, "link hover on footer"],
  ["#ffc9c2", "ink", TEXT, "error text on footer"],
  ["on-dark", "clay-deep", TEXT, "primary button label"],
  ["on-dark", "clay-deeper", TEXT, "primary button label, hover"],
  ["clay-deep", "paper", TEXT, "link on white"],
  ["clay-deep", "shell", TEXT, "link on cream"],
  ["clay-deep", "stone", TEXT, "link on stone"],
  ["clay-deeper", "paper", TEXT, "link hover on white"],
  ["navy", "paper", TEXT, "light button label"],
  ["navy", "shell", TEXT, "light button label, hover"],
  ["on-dark", "text-soft", TEXT, "busy button label"],
  ["error", "paper", TEXT, "error text on white"],
  ["error", "shell", TEXT, "error text on cream"],
  ["success", "paper", TEXT, "success mark on white"],
  ["line-strong", "paper", UI, "input border on white"],
  ["line-strong", "shell", UI, "input border on cream"],
  ["clay", "paper", UI, "accent rule on white"],
  ["clay", "navy", UI, "accent rule on navy"],
  ["navy", "paper", UI, "focus ring on white"],
  ["navy", "shell", UI, "focus ring on cream"],
  ["paper", "navy", UI, "focus ring on navy"],
  ["paper", "ink", UI, "focus ring on footer"],
];

let failed = 0;
for (const [fg, bg, min, what] of pairs) {
  const r = ratio(t(fg), t(bg));
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)} (min ${min})  ${what}`);
}
if (failed) {
  console.error(`\n${failed} color pair(s) below the AAA minimum.`);
  process.exit(1);
}
console.log(`\nAll ${pairs.length} color pairs meet WCAG 2.2 AAA.`);
