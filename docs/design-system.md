# Design system

The visual language follows silvestre.cr. The source of truth is `src/app/globals.css`.

## Principles

1. **Quiet structure.** Title on the left, text on the right, a hairline between sections. Square corners. No shadows, no gradients as decoration.
2. **Text never sits on imagery.** Pictures and text occupy separate blocks, so contrast holds whatever the photograph.
3. **One accent.** Clay marks the thing that matters most in a block: the lead benefit, the reassurance panel, the active step.
4. **Words do one job each.** A button says what happens. An action keeps its name through the flow.

## Color

Every pair below is checked by `npm run check:contrast` (7:1 for text, 3:1 for control boundaries).

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#ffffff` | Default surface |
| `--shell` | `#f9f3ef` | Warm alternate surface |
| `--stone` | `#f4f3f1` | Cool alternate surface |
| `--navy` | `#15355c` | Header, hero panel, dark sections |
| `--ink` | `#25211f` | Text, footer |
| `--text-soft` | `#4a443e` | Secondary text |
| `--on-dark-soft` | `#d9e2ea` | Secondary text on navy |
| `--on-dark-accent` | `#f0b9a3` | Accent text on navy |
| `--clay-deep` | `#7d3b23` | Links and primary buttons |
| `--clay` | `#c77558` | Decoration only: rules, markers. Never text. |
| `--sage` | `#a5a58d` | Decoration only |
| `--line` | `#c5c0b9` | Decorative hairlines |
| `--line-strong` | `#6f6860` | Input and checkbox borders |
| `--error` | `#8c1c13` | Error text and borders |
| `--success` | `#1e5631` | Success border and marks |

Silvestre's clay (`#c77558`) with white text is 3.4:1, which fails. Onyx buttons use `--clay-deep` (8.3:1).

When adding a color pair, add it to `scripts/check-contrast.mjs`.

## Type

| Role | Family | Treatment |
| --- | --- | --- |
| Display | Playfair Display (stands in for Roxborough CF) | Weight 400. Page titles in sentence case. |
| Section titles | Playfair Display | `.title-caps`: capitals, 0.06em tracking |
| Text | Jost | 18 px, line height 1.6, measure 68 characters |
| Labels | Jost | `.label`: capitals, 0.14em tracking, 15 px |

Scale: `--step--1` (15 px) to `--step-4` (fluid, up to 68 px). Capitals are applied with CSS so assistive technology reads ordinary words. Do not type headings in capitals.

## Layout

- `.wrap`: centered, 90rem maximum, fluid gutters that respect safe areas.
- `.section`: vertical rhythm. Variants `--shell`, `--stone`, `--navy`.
- `.split`: the 4/8 title and text grid. Stacks on small screens.
- `.grid-2`, `.grid-3`, `.grid-4`, `.stack`, `.cluster`: general layout helpers.
- Breakpoints are content-led: 48rem, 56rem, 64rem, 72rem.

## Components

| Component | File | Notes |
| --- | --- | --- |
| Header and mobile menu | `SiteHeader`, `NavLinks`, `MobileMenu` | Menu is a native `dialog`: focus trap and Escape are built in |
| Hero | `Hero`, `HeroMotion` | Picture above a navy panel. Pause control for motion. |
| Art | `Art` | Generated illustration or a real image. See ADR 0007. |
| Benefits | `Benefits`, `BenefitsToggle` | Detail folds on small screens. The lead panel stays open. |
| Stay card, guide card | `StayCard`, `GuideCard` | Heading link is the only link target in the card body |
| Request module | `RequestToBook` | Form, review, sent. Error summary with links. |
| Inquiry form | `InquiryForm` | Trip planning and general contact |
| Field | `Field` | Label, hint, control and error wired with `aria-describedby` |
| FAQ | `Faq` | Native `details` |
| Request bar | `StickyCta` | Fixed to the bottom after the hero |
| Buttons | `.btn` | `--primary`, `--ink`, `--ghost`, `--light`, `--outline-light`. 48 px minimum. |

## Rules

- No inline styles (`style={{...}}`). The Content-Security-Policy forbids them. Use classes.
- No new third-party scripts, fonts or embeds without a CSP change ([ADR 0005](adr/0005-security-headers-and-csp-nonce.md)).
- Every interactive element is at least 48 by 48 px, except links inside a sentence.
- Links say where they go. No "read more".
- No em dashes, en dashes or clause-joining hyphens in copy. `npm run check:copy` enforces the first two.
- American English.
- In HTML and JSX source, do not hard-wrap prose mid-sentence.
