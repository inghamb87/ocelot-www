# ADR 0001: Next.js static export on Cloudflare Pages

- Status: Accepted
- Date: 2026-11-24

## Context

The site is content-first: stay listings, destination guides and journal articles, plus three forms. It must be fast on mobile, fully crawlable and cheap to run. Evan chose Next.js as the framework and Cloudflare Pages (free tier) as the host.

Next.js can reach Cloudflare two ways:

1. **Static export** (`output: "export"`). `next build` writes plain HTML, CSS and JS to `out/`. Pages serves it as static assets.
2. **OpenNext adapter** (`@opennextjs/cloudflare`). Runs the full Next.js server on Cloudflare Workers. It targets Workers, not Pages, and adds a server bundle that must fit the Workers size limits.

Nothing in v1 needs per-request rendering.

## Decision

Use Next.js 16 (App Router, React 19) with `output: "export"`, deployed to Cloudflare Pages with `wrangler pages deploy out`.

## Consequences

- Every page is static HTML. No cold starts and no server to patch.
- Next.js features that need a server are unavailable: route handlers that read the request, server actions, middleware, ISR and the image optimizer. Server work lives in Pages Functions instead ([ADR 0002](0002-pages-functions-as-the-backend.md)).
- `next dev` does not run the Functions. Use `npm run preview` to exercise forms and security headers locally.
- Dynamic routes must list their pages in `generateStaticParams`.
- If logged-in features arrive later (guest accounts, a staff dashboard), move to the OpenNext adapter on Workers. The React code carries over unchanged. The three Functions become route handlers. Record that as a new ADR.
