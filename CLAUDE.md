# CLAUDE.md

Guidance for Claude Code in this repository. Public brand: **Onyx**. "Ocelot" is only the repo and project name.

## What this is

Next.js 16 static export on Cloudflare Pages. Pages Functions provide three JSON endpoints and the security headers. Supabase stores requests. CloudMailin sends email. Read `README.md` first, then `docs/README.md` for the decision records.

## Commands

```bash
npm run preview         # build + real Cloudflare runtime on :8788 (use this to test forms)
npm run dev             # pages only, no API, no headers
npm run check           # typecheck + contrast + copy
npm run check:a11y      # axe on every route (needs preview running)
npm run deploy          # build + wrangler pages deploy
```

## Where things live

| Need | File |
| --- | --- |
| Any visitor-facing text or setting | `src/content/*.ts` |
| Payment-moment wording, both modes | `paymentCopy` in `src/content/site.ts` |
| Listing page template | `src/app/stays/[slug]/page.tsx` |
| Request form | `src/components/RequestToBook.tsx` |
| Design tokens and all CSS | `src/app/globals.css` |
| Placeholder illustrations | `src/components/Art.tsx` |
| API endpoints | `functions/api/*.ts` |
| Request guard, validation, Supabase, mail | `functions/_lib/*.ts` |
| CSP and security headers | `functions/_middleware.ts` |
| Schema | `supabase/migrations/` |
| Why something is the way it is | `docs/adr/`, `docs/pdr/` |
| Listing page blueprint | `docs/specs/listing-page-spec.md` |
| Open business inputs | `docs/launch-checklist.md` |

## Hard rules

1. **No inline styles.** `style={{...}}` breaks the CSP (`style-src 'self'`). Use classes in `globals.css`.
2. **No third-party scripts, fonts, images or embeds** without first updating the CSP in `functions/_middleware.ts` and noting it in an ADR.
3. **Secrets never reach the client.** Nothing secret in `NEXT_PUBLIC_*`. Supabase is called only from `functions/`.
4. **`src/content/properties.ts` is imported by the Functions.** Keep it free of React, `@/` aliases and browser APIs.
5. **WCAG 2.2 AAA.** New color pairs go in `scripts/check-contrast.mjs`. Targets are 48 px minimum. Text never sits on imagery. Every form field uses `Field`.
6. **Public copy rules** (PDR 0001, 0004, 0005): never imply a discount, never say an upgrade is granted, never imply instant confirmation, never mention rate sourcing or margin, never invent awards, scores or press.
7. **Validate twice.** Any new form field is validated with `Checker` (`functions/_lib/validate.ts`) in its endpoint and gets a `check` constraint in a new migration. Never edit an applied migration: add a new one.

## Conventions

- American English. No em dashes, en dashes or clause-joining hyphens in copy, comments or docs. `npm run check:copy` enforces the dashes.
- No filler phrases. Buttons say what happens. An action keeps its name through a flow.
- Do not hard-wrap prose mid-sentence in JSX, HTML or Markdown.
- Server components by default. Add `"use client"` only for state or browser APIs.
- Plain CSS with cascade layers in one file. No Tailwind, no CSS-in-JS.
- No new runtime dependencies without a reason recorded in an ADR.

## Working agreements

- **Propose before building** anything that touches core architecture: hosting, rendering mode, auth, payments, schema shape, CSP, content model. Write the proposal, wait for approval, then add an ADR or PDR.
- **Decision records are append-only.** To change a decision, add a new numbered record that supersedes the old one and update the table in `docs/README.md`.
- **After every change, update `CLAUDE.md` and `README.md`** if commands, layout, environment variables or rules changed, and remove anything in them that is no longer true.
- Single working checkout. No worktrees unless asked.
- Git: hand over one copy-pasteable shell block (`cd`, `git add`, `git commit`, `git push`). Commit messages are one plain subject line: no body, no trailers, no co-author lines.
- Before handing work back: `npm run check`, `npm run build`, and for UI changes `npm run check:a11y` against `npm run preview`.

## Current state

- Payment mode is `request-only`: no card is collected (PDR 0003).
- Pictures are generated illustrations (ADR 0007).
- Privacy and terms pages are labeled drafts.
- No analytics, no staff dashboard, no ESLint config yet.
