# ADR 0008: Layered abuse controls on every form

- Status: Accepted
- Date: 2026-11-24

## Context

Public forms that write to a database and send email attract bots. A solved-by-humans challenge on every form would add friction for high-intent guests and has accessibility costs.

## Decision

Every form endpoint goes through `functions/_lib/guard.ts`, which applies, in order:

1. **Same-origin check.** The `Origin` header must match the site (or `ALLOWED_ORIGINS`). `Sec-Fetch-Site`, when present, must be `same-origin`.
2. **JSON only, 16 KB limit.** Blocks plain HTML form posts from other sites.
3. **Honeypot.** A hidden `website` field. If filled, the reply looks like success and nothing is stored or sent.
4. **Minimum fill time.** The client reports elapsed time. Under 1.5 seconds is rejected with a visible message.
5. **Turnstile (optional).** Verified server side when `TURNSTILE_SECRET_KEY` is set.
6. **Rate limit.** Per salted IP hash, per form, per hour, counted in the `request_log` table. Limits: 5 booking requests, 5 inquiries, 10 newsletter signups.

## Consequences

- No challenge is shown by default. Turn Turnstile on if spam gets through.
- The rate limit fails open: if Supabase cannot be reached for the lookup, the request proceeds.
- `request_log` rows are safe to purge after a day.
- For stronger limits, add a Cloudflare WAF rate limiting rule on `/api/*`.
