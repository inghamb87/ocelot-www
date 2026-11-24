# Onyx

Marketing and booking-request site for Onyx, a travel guide and booking concierge for design-led hotels and villas. Managed alongside [Silvestre Nosara Hotel & Residences](https://silvestre.cr/), whose visual style it follows.

- **Framework:** Next.js 16 (App Router, React 19), exported as a static site
- **Host:** Cloudflare Pages, with Pages Functions for the API and security headers
- **Data:** Supabase (Postgres), reached only from the Functions
- **Email:** CloudMailin outbound HTTP API
- **Standards:** WCAG 2.2 AAA, 48 px touch targets, strict Content-Security-Policy

Decisions and specifications are in [`docs/`](docs/README.md). Open business inputs are in the [launch checklist](docs/launch-checklist.md).

## Quick start

```bash
npm install
cp .dev.vars.example .dev.vars     # DRY_RUN=1 works with no accounts
cp .env.example .env.local
npm run preview                    # builds, then serves http://localhost:8788
```

`npm run preview` runs the real Cloudflare runtime: static pages, the API and the security headers. With `DRY_RUN=1` the forms validate and log to the terminal without touching Supabase or sending email.

`npm run dev` is faster for layout work but does not run the API or the headers.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server on port 3000 (pages only) |
| `npm run build` | Static export to `out/` |
| `npm run preview` | Build, then serve `out/` and `functions/` with Wrangler on port 8788 |
| `npm run deploy` | Build, then deploy to Cloudflare Pages |
| `npm run typecheck` | TypeScript for the site and for the Functions |
| `npm run check:contrast` | Every color pair against WCAG AAA |
| `npm run check:copy` | No em or en dashes. No rate-sourcing language in public copy. |
| `npm run check:a11y` | axe-core on every route, phone and desktop. Needs `npm run preview` running. |
| `npm run check` | Typecheck, contrast and copy checks together |

## Project layout

```
src/app/            Pages (App Router). One folder per route.
src/components/     UI components. "use client" only where state is needed.
src/content/        All content and settings, as typed data.
src/lib/            Small shared helpers.
src/fonts/          Self-hosted fonts and their licenses.
functions/          Cloudflare Pages Functions.
  _middleware.ts      Security headers and CSP nonce for every response.
  api/                booking-request, inquiry, newsletter.
  _lib/               Validation, guard, Supabase and mail helpers.
supabase/migrations/  Database schema.
public/             Static files, plus _headers and _routes.json for Pages.
scripts/            Contrast, copy and accessibility checks.
docs/               ADRs, PDRs, specifications and guides.
```

## Editing content

Everything a visitor reads lives in `src/content`.

| To change | Edit |
| --- | --- |
| A stay, its rooms, facts or questions | `properties.ts` |
| Destination hubs | `destinations.ts` |
| Journal guides | `guides.ts` |
| Booking questions shown on every listing | `faq.ts` |
| Navigation, the four benefits, payment wording, settings | `site.ts` |

To add a stay, add one object to `properties` in `properties.ts`. The page, sitemap entry, form options and API allowlist follow. See the [listing page specification](docs/specs/listing-page-spec.md).

### Pictures

Every picture is currently a generated illustration, captioned "Illustration. Photography to follow." To use a photograph, put the file in `public/images/` and add `image` to that art entry:

```ts
heroArt: {
  scene: "path",
  seed: 11,
  alt: "The jungle path at Sendero opening onto the surf at Playa Guiones",
  image: { src: "/images/sendero/hero.jpg", width: 2400, height: 1600 },
},
```

Add `/images/*` to the `exclude` list in `public/_routes.json` so images skip the Functions. When all photography is in, set `showPlaceholderCaptions: false` in `site.ts`.

### Fonts

Playfair Display stands in for Silvestre's Roxborough CF, which needs a commercial web license. To switch, add the licensed `.woff2` to `src/fonts/` and point the `playfair` font in `src/app/layout.tsx` at it.

## Backend setup

### 1. Supabase

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

This applies `supabase/migrations`. Row Level Security is on for every table with no public policies: only the Functions, using the secret key, can read or write.

Copy the project URL and the **secret** key (Project Settings, API) into `.dev.vars`.

### 2. CloudMailin

From Outbound, SMTP Accounts, copy the SMTP username and the API token into `.dev.vars`. Set `MAIL_FROM` to an address on a domain verified in CloudMailin and `MAIL_NOTIFY_TO` to the inbox that should receive requests.

Set `CLOUDMAILIN_TEST_MODE=1` to have CloudMailin validate messages without delivering them.

### 3. Go live locally

Remove `DRY_RUN=1` from `.dev.vars`, run `npm run preview` and send a request. Expect a row in `booking_requests`, an email to the guest address and an email to `MAIL_NOTIFY_TO`.

## Environment variables

Secrets, read by the Functions. Local: `.dev.vars`. Production: Pages secrets.

| Name | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | yes | Project URL |
| `SUPABASE_SECRET_KEY` | yes | Secret (or legacy service role) key |
| `CLOUDMAILIN_SMTP_USERNAME` | yes | SMTP username, used in the API URL |
| `CLOUDMAILIN_API_TOKEN` | yes | API token, sent as the Bearer token |
| `MAIL_FROM` | yes | Sender, for example `Onyx <concierge@yourdomain.com>` |
| `MAIL_NOTIFY_TO` | yes | Inbox for staff notifications |
| `IP_HASH_SALT` | yes | Random string for hashing caller addresses (`openssl rand -hex 32`) |
| `MAIL_REPLY_TO` | no | Reply address on guest emails. Defaults to `MAIL_NOTIFY_TO`. |
| `CLOUDMAILIN_TEST_MODE` | no | `1` validates without sending |
| `TURNSTILE_SECRET_KEY` | no | Turns on the Turnstile check |
| `ALLOWED_ORIGINS` | no | Extra origins allowed to post to `/api`, comma separated |
| `DRY_RUN` | no | `1` validates and logs only. Never set in production. |

Public, compiled into the site at build time. Local: `.env.local`.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and structured data |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact address shown on the site |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Turnstile site key |

## Deploy to Cloudflare Pages

First time:

```bash
npx wrangler login
npx wrangler pages project create onyx-www --production-branch main
npx wrangler pages secret bulk .dev.vars     # after removing DRY_RUN from it
npm run deploy
```

After that, `npm run deploy` builds and publishes. The site is served at `https://onyx-www.pages.dev` until a domain is attached.

To attach a domain: Cloudflare dashboard, Workers & Pages, onyx-www, Custom domains. Then set `NEXT_PUBLIC_SITE_URL` to the new origin and deploy again.

`NEXT_PUBLIC_` values are read at build time from `.env.local` on the machine that runs `npm run deploy`.

### Optional: Turnstile

Create a Turnstile widget in the Cloudflare dashboard. Put the site key in `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the secret in `TURNSTILE_SECRET_KEY`. The request form then shows the check on its review step and the server verifies it. The CSP adjusts automatically.

## API

All endpoints accept `POST` with a JSON body from the same origin and reply with JSON.

| Endpoint | Success | Notes |
| --- | --- | --- |
| `/api/booking-request` | `{ ok: true, reference: "ONX-..." }` | Validates stay and room against `properties.ts` |
| `/api/inquiry` | `{ ok: true, reference: "ONQ-..." }` | `kind` is `trip` or `general` |
| `/api/newsletter` | `{ ok: true }` | Duplicate emails are ignored silently |

Errors reply `{ ok: false, message, fields? }` with status 400, 403, 422, 429, 502 or 503.

## Accessibility and security

- Accessibility target, automated checks and the manual checklist: [docs/accessibility.md](docs/accessibility.md)
- Controls in place, mapped to the OWASP Top 10: [docs/security.md](docs/security.md)

Two rules protect both:

1. No inline styles (`style={{...}}`). The Content-Security-Policy blocks them.
2. No third-party scripts, fonts or embeds without updating the CSP in `functions/_middleware.ts`.

## Before launch

Payment wording, the cancellation policy, the confirmation window, photography and legal review are still open. The full list, and where each answer goes in the code, is in the [launch checklist](docs/launch-checklist.md).
