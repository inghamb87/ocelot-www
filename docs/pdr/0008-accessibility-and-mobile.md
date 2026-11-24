# PDR 0008: WCAG 2.2 AAA and mobile-first standards

- Status: Accepted
- Date: 2026-11-24

## Context

Evan asked for a very accessible site with high contrast that follows the AAA guidelines, and for a mobile-friendly site that follows Apple and Google standards.

## Decision

Design and test against WCAG 2.2 Level AAA wherever a criterion applies, and against the Apple Human Interface Guidelines and Material Design for touch.

| Requirement | Standard | How it is met |
| --- | --- | --- |
| Text contrast 7:1 | WCAG 1.4.6 | Token pairs checked by `npm run check:contrast` |
| Touch targets | WCAG 2.5.5 (44 px), Apple (44 pt), Material (48 dp) | 48 px minimum on every button, link row and form control |
| No text over imagery | WCAG 1.4.6 | Hero text sits on a solid panel below the picture |
| Reflow at 320 px, zoom to 200% | WCAG 1.4.10, 1.4.4 | Fluid layout in `rem`, no horizontal scroll |
| Line length under 80 characters | WCAG 1.4.8 | `--measure: 68ch` |
| Visible focus | WCAG 2.4.13 | 3 px ring with a contrasting halo on every surface |
| Focus not hidden by sticky bars | WCAG 2.4.12 | `scroll-padding` for the header and the request bar |
| Motion | WCAG 2.2.2, 2.3.3 | Pause control on the hero. All motion off under reduced motion. |
| Error prevention | WCAG 3.3.6 | Review step before a request is sent. Inline errors with a linked summary. |
| Link purpose from the link alone | WCAG 2.4.9 | No "read more" or "click here" links |
| No time limits | WCAG 2.2.3 | Nothing on the site times out |
| Input zoom on iOS | Apple | Form text is 18 px, above the 16 px zoom threshold |
| Safe areas | Apple | `viewport-fit=cover` with `env(safe-area-inset-*)` padding |

## Consequences

- Brand colors that fail 7:1 are used for decoration only. See the [design system](../design-system.md).
- All-capitals styling is applied with CSS, so screen readers read normal words.
- Film, when added, needs captions and a transcript (WCAG 1.2).
- Automated tools cover only part of WCAG. The manual checklist is in [accessibility](../accessibility.md).
