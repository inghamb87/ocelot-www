# Onyx documentation

Internal documentation for the Onyx site. Nothing in this folder is deployed.

Some records describe the commercial model (how rooms are sourced and what Onyx earns). That information must never appear in public copy. `npm run check:copy` enforces this for everything under `src/`. Keep this repository private.

## Decision records

A decision record captures one decision: the context, what was decided and what follows from it. Records are numbered and never rewritten. To change a decision, add a new record that supersedes the old one.

- **ADR**: architecture decision record. How the site is built.
- **PDR**: product decision record. What the product does and why.

### Architecture (ADR)

| No. | Decision | Status |
| --- | --- | --- |
| [0001](adr/0001-next-static-export-on-cloudflare-pages.md) | Next.js static export on Cloudflare Pages | Accepted |
| [0002](adr/0002-pages-functions-as-the-backend.md) | Pages Functions are the only backend | Accepted |
| [0003](adr/0003-supabase-server-only-access.md) | Supabase is reached only from the server | Accepted |
| [0004](adr/0004-cloudmailin-http-api.md) | Email goes through the CloudMailin HTTP API | Accepted |
| [0005](adr/0005-security-headers-and-csp-nonce.md) | Security headers and a nonce-based CSP in middleware | Accepted |
| [0006](adr/0006-content-as-typed-files.md) | Content lives in typed files in the repository | Accepted |
| [0007](adr/0007-fonts-and-placeholder-art.md) | Self-hosted fonts and generated placeholder art | Accepted |
| [0008](adr/0008-abuse-controls.md) | Layered abuse controls on every form | Accepted |

### Product (PDR)

| No. | Decision | Status |
| --- | --- | --- |
| [0001](pdr/0001-parity-pricing.md) | Price at parity with booking direct | Accepted |
| [0002](pdr/0002-request-to-book.md) | Request to book with human confirmation | Accepted |
| [0003](pdr/0003-request-only-payment-in-v1.md) | No card collection in v1 | Accepted |
| [0004](pdr/0004-the-onyx-bundle.md) | The Onyx bundle: concierge, trip credit, upgrade request | Accepted |
| [0005](pdr/0005-honest-content.md) | Honest content, nothing fabricated | Accepted |
| [0006](pdr/0006-competitive-position.md) | Compete with direct and Booking.com, not on price | Accepted |
| [0007](pdr/0007-brand-and-silvestre.md) | Brand name, and the relationship with Silvestre | Accepted |
| [0008](pdr/0008-accessibility-and-mobile.md) | WCAG 2.2 AAA and mobile-first standards | Accepted |
| [0009](pdr/0009-conversion-goal-and-metrics.md) | The room is the primary conversion goal | Accepted |
| [0010](pdr/0010-launch-scope.md) | Launch scope: two Nosara stays, one destination | Accepted |

## Specifications

- [Listing page specification](specs/listing-page-spec.md): the reusable blueprint every stay page follows.
- [Sendero Hotel & Villas](specs/sendero-nosara.md): the property brief the first listing was built from.
- [Silvestre Nosara](specs/silvestre-nosara.md): source notes for the second listing.

## Guides

- [Launch checklist](launch-checklist.md): what must be resolved before paid traffic.
- [Design system](design-system.md): tokens, type, components and rules.
- [Accessibility](accessibility.md): what is automated and the manual checklist.
- [Security](security.md): controls in place, mapped to the OWASP Top 10, for the audit.
- [Experiments](experiments.md): metrics and the test backlog.
- [Operations](operations.md): handling requests day to day.
