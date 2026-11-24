# PDR 0007: Brand name, and the relationship with Silvestre

- Status: Accepted
- Date: 2026-11-24

## Context

The project and repository are named Ocelot. The spec calls the company Onyx. The business is managed by, and connected to, Silvestre Nosara Hotel & Residences (silvestre.cr). The site will serve travelers worldwide, starting in Costa Rica.

## Decision

- The public brand is **Onyx**. "Ocelot" is the internal project and repository name only.
- The visual design follows silvestre.cr: navy bar, white and cream surfaces, a high-contrast serif in tracked capitals, Jost for text, square corners, hairline rules and clay accents. Details are in the [design system](../design-system.md).
- The site states the relationship plainly: "Managed alongside Silvestre Nosara Hotel & Residences", in the footer and on the About page.
- Silvestre has its own Onyx listing, built on the same template as every other stay.
- Copy is American English, written for an international reader: plain words, short sentences, prices in US dollars written as "US$".

## Consequences

- Silvestre's own claims (recognition, guest rating, amenities) are shown with attribution to Silvestre.
- Where Silvestre's colors fail AAA contrast as text (white on clay buttons, for example), Onyx uses a darker value from the same family.
- A domain has not been connected. `NEXT_PUBLIC_SITE_URL` sets canonical URLs, the sitemap and structured data at build time.
