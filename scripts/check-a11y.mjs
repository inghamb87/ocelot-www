// Runs axe-core against every route at phone and desktop sizes, including the
// WCAG 2.2 AAA rules (enhanced contrast, target size and so on).
//
//   npm run preview            (in one terminal)
//   npm run check:a11y         (in another)
//
// Uses your installed Chrome by default. Options:
//   BASE_URL=https://...       test a deployed site
//   PW_CHANNEL=chromium        use Playwright's own browser (npx playwright install chromium)
//   CHROME_PATH=/path/to/chrome

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const base = (process.env.BASE_URL ?? "http://localhost:8788").replace(/\/$/, "");

const routes = [
  "/",
  "/stays",
  "/stays/sendero-nosara",
  "/stays/silvestre-nosara",
  "/destinations",
  "/destinations/nosara",
  "/journal",
  "/journal/getting-to-nosara",
  "/concierge",
  "/how-it-works",
  "/about",
  "/contact",
  "/accessibility",
  "/privacy",
  "/terms",
  "/this-page-does-not-exist",
];
const sizes = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch({
  channel: process.env.CHROME_PATH ? undefined : (process.env.PW_CHANNEL ?? "chrome"),
  executablePath: process.env.CHROME_PATH,
  args: process.env.CI || process.env.CHROME_PATH ? ["--no-sandbox"] : [],
});

let total = 0;
for (const size of sizes) {
  // bypassCSP lets the test inject axe; it does not change what is tested.
  const context = await browser.newContext({ viewport: size, bypassCSP: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    // Open every FAQ item so hidden content is checked too.
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(() =>
      // eslint-disable-next-line no-undef
      axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag2aaa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
        rules: { "target-size": { enabled: true } },
      }),
    );
    for (const v of result.violations) {
      total += v.nodes.length;
      console.error(`\n[${size.name}] ${route}  ${v.id} (${v.impact}): ${v.help}`);
      for (const n of v.nodes.slice(0, 5)) console.error(`   ${n.target.join(" ")}\n     ${n.failureSummary?.split("\n").slice(1, 3).join(" ").trim()}`);
    }
    process.stdout.write(result.violations.length ? "" : `ok  [${size.name}] ${route}\n`);
  }
  await context.close();
}
await browser.close();

if (total) {
  console.error(`\n${total} accessibility issue(s) found.`);
  process.exit(1);
}
console.log("\nNo accessibility issues found by axe-core. Automated checks cover only part of WCAG: see docs/accessibility.md for the manual checklist.");
