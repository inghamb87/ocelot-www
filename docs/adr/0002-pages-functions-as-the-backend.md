# ADR 0002: Pages Functions are the only backend

- Status: Accepted
- Date: 2026-11-24

## Context

The static site needs three server actions: save a booking request, save an inquiry and save a newsletter signup. Each must validate input, write to Supabase and, for the first two, send email. Secrets must stay off the client.

## Decision

Implement the backend as Cloudflare Pages Functions in `/functions`:

| Route | File | Purpose |
| --- | --- | --- |
| `POST /api/booking-request` | `functions/api/booking-request.ts` | Request to book |
| `POST /api/inquiry` | `functions/api/inquiry.ts` | Concierge and contact forms |
| `POST /api/newsletter` | `functions/api/newsletter.ts` | Newsletter signup |
| all requests | `functions/_middleware.ts` | Security headers and CSP |

Shared code is in `functions/_lib`. Functions use `fetch` only: no Supabase SDK and no mail SDK. Secrets come from `.dev.vars` locally and from Pages secrets in production.

The Functions import `src/content/properties.ts` so the list of valid stays and rooms has one source of truth.

## Consequences

- No extra service to deploy. `wrangler pages deploy` ships the site and the API together.
- `src/content/properties.ts` must stay free of React, path aliases and browser APIs because the Workers runtime bundles it.
- Every HTML request passes through the middleware, which counts toward the free tier's daily Functions quota (100,000 requests). Static assets under `/_next/static` are excluded in `public/_routes.json`.
- Functions are typed with `@cloudflare/workers-types` and checked by `npm run typecheck`.
