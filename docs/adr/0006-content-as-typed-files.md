# ADR 0006: Content lives in typed files in the repository

- Status: Accepted
- Date: 2026-11-24

## Context

At launch there are two stays, one destination and six guides. A CMS would add a service, a login surface and a build dependency for very little content.

## Decision

Content is TypeScript data in `src/content`:

| File | Holds |
| --- | --- |
| `site.ts` | Site settings, navigation, the four benefits, all payment-moment copy for both payment modes |
| `properties.ts` | Every stay listing |
| `destinations.ts` | Destination hubs |
| `guides.ts` | Journal guides |
| `faq.ts` | Booking questions shared by every listing |

Pages render from these files. Adding a stay is one object in `properties.ts`: the listing page, the sitemap entry, the request form options and the API allowlist all follow from it.

Copy that depends on unresolved business inputs (confirmation window, payment mode, contact email) is controlled by flags in `site.ts`.

## Consequences

- Types catch missing fields at build time.
- Content changes need a commit and a deploy.
- When the catalog outgrows this (roughly a dozen stays, or non-developers editing), move content to Supabase tables or a headless CMS and keep the same types. Record that as a new ADR.
