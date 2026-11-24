# Accessibility

Target: WCAG 2.2 Level AAA wherever a criterion applies. See [PDR 0008](pdr/0008-accessibility-and-mobile.md).

## Automated checks

| Command | What it checks |
| --- | --- |
| `npm run check:contrast` | Every design token pair against 7:1 (text) and 3:1 (controls) |
| `npm run check:a11y` | axe-core on every route at phone and desktop sizes, with the AAA rules on. Needs `npm run preview` running. |

Automated tools find well under half of real barriers. Run the manual checklist before each release that changes templates or components.

## Manual checklist

### Keyboard

- [ ] Tab through each template. Order follows the page. Nothing is skipped or trapped.
- [ ] The skip link appears on first Tab and moves focus to the main content.
- [ ] The focus ring is visible on white, cream, navy and the footer.
- [ ] The mobile menu opens, traps focus, closes on Escape and returns focus to the Menu button.
- [ ] The request bar and the sticky header never cover the focused element.
- [ ] The picture tour scrolls with the arrow keys when focused.

### Screen reader (VoiceOver on iOS and macOS, TalkBack, NVDA)

- [ ] Each page has one H1 and a sensible heading outline.
- [ ] Landmarks are announced: banner, main, navigation (Main, Footer, Company, Breadcrumb), contentinfo.
- [ ] Illustrations are announced with their description.
- [ ] Form errors: the summary is announced, each link moves to its field, each field announces its error.
- [ ] Moving from form to review to "Request received" moves focus to the new heading and announces it.

### Zoom and reflow

- [ ] 200% browser zoom at 1280 px wide: no clipped or overlapping text.
- [ ] 400% zoom (320 px equivalent): no horizontal scrolling except the picture tour.
- [ ] Text spacing override (WCAG 1.4.12): nothing is cut off.
- [ ] Largest Dynamic Type setting on iOS: the layout holds.

### Motion and color

- [ ] With "Reduce motion" on, nothing animates and the pause control is hidden.
- [ ] With motion on, "Pause motion" stops the hero.
- [ ] Windows High Contrast or forced colors: controls keep visible borders.
- [ ] Nothing relies on color alone: errors have text, the fit lists use plus and minus marks.

### Touch (real devices)

- [ ] Every target is comfortable to hit with a thumb. Nothing sits under the home indicator or notch.
- [ ] Date, email and phone fields open the right keyboards.
- [ ] Focusing a field does not zoom the page on iOS.

### Content

- [ ] Link text makes sense out of context.
- [ ] Plain language. Abbreviations are expanded on first use (for example "airport code LIR").
- [ ] New film has captions and a transcript before it ships.

## Known limits

- Pictures are illustrations until photography arrives. Each has a text alternative.
- Reading level (WCAG 3.1.5) is a goal, not a guarantee. Keep sentences short.
- Native date inputs vary by browser. They were chosen because they are the most reliable option with assistive technology on phones.
