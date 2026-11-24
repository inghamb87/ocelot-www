# Listing page specification

The reusable blueprint for every stay page. Derived from the Onyx Property Listing Page Strategist (v7) output for Sendero. Implemented in `src/app/stays/[slug]/page.tsx` and driven by `src/content/properties.ts`.

## The job of the page

- **Searcher intent:** property-branded searches ("Sendero Nosara") or qualified luxury searches ("Nosara design hotel", "Nosara villa private pool").
- **Primary objection:** "Why request this through a brand I have never heard of, with no instant confirmation, when I can book direct in two minutes?"
- **Alternatives to beat:** booking direct, Booking.com, and abandoning to keep researching.
- **Conversion goal:** a submitted request to book.

## Sections, in page order

| No. | Section | Purpose | Data in `properties.ts` | Component |
| --- | --- | --- | --- | --- |
| 1 | Hero | Land the content edge in three seconds. Property and place in the H1, the real hook in the lede, primary action, trust ribbon. | `h1`, `hook`, `heroArt`, `place` | `Hero` |
| 2 | At a glance | Fast filtering and crawlable facts: location, beach distance, style, size, the parity "from" price, the four benefit chips, rating summary. | `facts`, `fromRate`, `ratings` | inline |
| 3 | Why book this stay through Onyx | Mandatory. Answers the objection at parity. Lead line, then the four panels. | `benefits` in `site.ts` | `Benefits` |
| 4 | A look around (tour) | The design story in pictures and film, with concrete captions. Where Onyx shows more than the property's own site. | `tour` | `Art` |
| 5 | The honest read | Who the stay is for, who it is not for, expectations to set. | `honest` | inline |
| 6 | Rooms and villas | Turns browsing into a specific request. High-value options are prominent. Each card has a "Request this ..." action. | `rooms`, `roomsIntro`, `groupNote` | `RoomRequestButton` |
| 7 | Location and the wider trip | Makes the concierge tangible: logistics, a sample week, how the stay fits a longer trip. Internal-link hub. | `location`, `experiences` | inline |
| 8 | Proof and reassurance | Paraphrased guest themes, verifiable recognition, and the flow restated. | `proof` | inline |
| 9 | Request to book | The module. See below. | `rooms`, `fromRate` | `RequestToBook` |
| 10 | Questions | Property questions, then the shared booking questions. | `faq`, plus `faq.ts` | `Faq` |

A slim request bar (`StickyCta`) appears after the hero scrolls away and hides while the module or footer is on screen.

## Copy direction

- H1 names the property and the place, plainly.
- The lede states the real hook in one sentence.
- Tour captions are concrete (teak, repurposed brick, named features), not adjective-led.
- Never imply a discount, a granted upgrade or instant confirmation.
- Never mention rate sourcing or margin.
- Concierge wording stays conservative until the delivery model is confirmed.

## Request to book module

Flow: dates and guests, room or villa (carried from section 6), the parity "from" price and what is included, the reassurance panel above the action, review, send, pending. Confirmed and unavailable outcomes follow by email.

Must be visible inside the module, not only in the FAQ:

- What is and is not charged at request time.
- What happens if the hotel cannot confirm.
- The trip credit as a dollar figure near the total, computed from the booking value.
- The group note for villas and residences.

Exact wording for every state is in `paymentCopy` in `src/content/site.ts`. See [PDR 0002](../pdr/0002-request-to-book.md) and [PDR 0003](../pdr/0003-request-only-payment-in-v1.md).

## Mobile order

1. Hero (picture first), H1, hook, primary action before the first scroll.
2. Slim request bar on scroll.
3. Four benefit chips. "Why Onyx" detail expands on tap. The no-charge panel never collapses.
4. At-a-glance facts.
5. Tour, swipeable.
6. Honest read.
7. Rooms and villas.
8. Location and the wider trip.
9. Request to book module, reassurance panel above the action.
10. Questions, as crawlable accordions.

Before the first scroll on mobile: property and place, the primary action and "no charge until confirmed".

## Trust architecture

| The guest's question | Where it is answered |
| --- | --- |
| Who is Onyx? | Trust ribbon, How it works, About |
| What if it does not confirm? | Reassurance panel, pending and unavailable copy |
| Why not direct or Booking.com? | Section 3 |
| Is it really this good, and right for me? | Section 5, plus real and unstaged film when it exists |

## SEO

- **Title:** property, place and one differentiator, within about 60 characters.
- **Meta description:** the hook and the Onyx booking benefit, about 150 characters.
- **Structured data:** `Hotel`, `FAQPage`, `BreadcrumbList`. `aggregateRating` only if the rating is real and licensed.
- **Long-tail targets:** set per property in the property brief.
- **Internal links:** destination hub, journal guides (getting there, surf, villa or room), sibling stays.
- **Crawlable editorial:** honest read, wider trip and questions are server-rendered HTML.
- **Media:** descriptive file names, alt text, captions and transcripts for film.
- **Performance:** picture-first hero, lazy film, compressed imagery. Protect LCP and CLS.

## Adding a stay

1. Write a property brief in `docs/specs/` (confirmed facts, assumptions, required inputs).
2. Add one object to `properties` in `src/content/properties.ts`. TypeScript lists any missing fields.
3. Run `npm run check` and `npm run build`.
4. Review the page against this specification and the [launch checklist](../launch-checklist.md).
