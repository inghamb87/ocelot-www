# ADR 0005: Security headers and a nonce-based CSP in middleware

- Status: Accepted
- Date: 2026-11-24

## Context

A static Next.js export contains a few inline `<script>` tags (the React Server Components payload). A strict Content-Security-Policy must allow those without allowing all inline script. Static hosting cannot add a per-request nonce, and hashing every inline script would exceed the header size limits of the Pages `_headers` file.

## Decision

`functions/_middleware.ts` runs on every page and API response and:

1. Generates a random nonce per request.
2. Stamps it on every `<script>` tag with `HTMLRewriter`.
3. Sends `Content-Security-Policy` with `script-src 'self' 'nonce-...'`, `style-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` and `form-action 'self'`.
4. Sends HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`.
5. Removes validators (`ETag`, `Last-Modified`) from HTML and sends `Cache-Control: private, no-cache`, so a cached body can never be paired with a new nonce.

The site uses no inline styles, so `style-src` needs no exception. Do not add `style={{...}}` props in components.

## Consequences

- Injected script cannot run even if an XSS hole appears elsewhere.
- HTML is not cached by the browser between visits. Assets under `/_next/static` are immutable and cached for a year, so the cost is one small HTML request per navigation.
- Turning on Turnstile adds `https://challenges.cloudflare.com` to `script-src` and `frame-src` automatically when `TURNSTILE_SECRET_KEY` is set.
- Any new third-party script, font, image host or embed needs a CSP change here first.
