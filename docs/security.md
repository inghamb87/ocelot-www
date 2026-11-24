# Security

What is in place today, mapped to the OWASP Top 10 (2021), as the starting point for the full audit.

## Architecture in one paragraph

Static HTML on Cloudflare Pages. Three JSON endpoints in Pages Functions. Supabase and CloudMailin are called only from those Functions with secrets held by Cloudflare. No user accounts, no sessions, no cookies, no card data.

## OWASP Top 10

| Risk | Controls in place | To review in the audit |
| --- | --- | --- |
| A01 Broken access control | No authenticated surface. RLS on with no policies. Default grants revoked. The secret key never leaves the Function. | Supabase dashboard access and MFA for staff. Pages preview deployment access. |
| A02 Cryptographic failures | HTTPS only, HSTS with preload. No sensitive data in the browser. IP addresses stored only as a salted SHA-256. | Rotate `IP_HASH_SALT` policy. Supabase encryption and backup settings. |
| A03 Injection | Input validated and length-capped in `functions/_lib/validate.ts`. PostgREST uses parameterized queries. Email HTML is escaped. Subjects are stripped of line breaks. React escapes output. JSON-LD is escaped. Strict CSP with a nonce. | Review any new `dangerouslySetInnerHTML`. Fuzz the three endpoints. |
| A04 Insecure design | Request, not purchase: no money moves on the site. Review step before sending. Rate limits. Honeypot replies look like success. Newsletter replies do not reveal who is subscribed. | Threat model the card authorization flow before it is built. |
| A05 Security misconfiguration | Headers set in one place (`functions/_middleware.ts`). `X-Powered-By` off. API responses are `no-store`. Secrets only in `.dev.vars` and Pages secrets, both ignored by git. | Confirm headers on the production domain. Confirm `DRY_RUN` is unset. Scan with securityheaders.com and Mozilla Observatory. |
| A06 Vulnerable components | Three direct runtime dependencies: Next.js, React and React DOM. No SDKs in the Functions. | `npm audit` in CI. Dependabot or Renovate. |
| A07 Identification and authentication failures | Not applicable yet: no logins. | Design review when accounts are added. |
| A08 Software and data integrity failures | No third-party scripts or CDNs. Fonts self-hosted. `package-lock.json` committed. | CI that builds from the lockfile. Branch protection on `main`. |
| A09 Logging and monitoring failures | Functions log failures without personal data. Rows record whether each email was accepted. | Cloudflare log retention or Logpush. Alert on 5xx from `/api/*`. |
| A10 Server-side request forgery | Functions call only fixed hosts (Supabase, CloudMailin, Turnstile). No user-supplied URLs are fetched. | Keep it that way. |

## Request handling

Every form request passes `functions/_lib/guard.ts`: same-origin check, JSON only, 16 KB limit, honeypot, minimum fill time, optional Turnstile, per-form rate limit. See [ADR 0008](adr/0008-abuse-controls.md).

CSRF: there are no cookies or sessions, so there is no ambient authority to abuse. The same-origin and JSON-only checks still block cross-site form posts.

## Privacy

- Data collected: what the guest types, a consent timestamp, a salted IP hash and the user agent on booking requests.
- No analytics, advertising or third-party requests.
- The privacy policy is a draft pending legal review.

## Secrets

| Name | Where | Notes |
| --- | --- | --- |
| `SUPABASE_SECRET_KEY` | Pages secret | Full database access. Rotate if exposed. |
| `CLOUDMAILIN_API_TOKEN` | Pages secret | Can send mail as Onyx |
| `IP_HASH_SALT` | Pages secret | Changing it resets rate-limit history |
| `TURNSTILE_SECRET_KEY` | Pages secret | Optional |

Never put a secret in a `NEXT_PUBLIC_` variable: those are compiled into the browser bundle.

## Reporting

Add a `security.txt` and a contact address once the domain and mailbox exist.
