# ADR 0007: Self-hosted fonts and generated placeholder art

- Status: Accepted
- Date: 2026-11-24

## Context

The design follows silvestre.cr, which uses Roxborough CF (headings), Jost (text) and Engravers Gothic (labels). Roxborough CF and Engravers Gothic are commercial fonts that Onyx has no web license for. No photography or film exists yet for either stay, and using stock photographs on a specific hotel's page would misrepresent the property.

## Decision

**Fonts.** Self-host two open-license variable fonts in `src/fonts` through `next/font/local`:

- Playfair Display stands in for Roxborough CF.
- Jost is used for text, and in tracked capitals it stands in for Engravers Gothic.

No font is loaded from a third party.

**Pictures.** Every picture slot is filled by `src/components/Art.tsx`, which draws a banded "strata" illustration from a scene name and a seed. Each one is captioned "Illustration. Photography to follow." and has a text alternative that describes the photograph the slot is waiting for.

## Consequences

- No third-party requests, which keeps the CSP strict and avoids a privacy disclosure.
- To use licensed Roxborough CF, add the `.woff2` to `src/fonts` and change the `playfair` font in `src/app/layout.tsx`. Nothing else changes.
- To replace an illustration with a photograph, add `image: { src, width, height }` to that art entry in `src/content`. The illustration and its caption are replaced.
- When all photography is in, set `showPlaceholderCaptions` to `false` in `site.ts`.
- The hero is built for film: the picture sits above a solid panel, so the headline never overlaps imagery and a pause control already exists.
