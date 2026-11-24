# PDR 0004: The Onyx bundle

- Status: Accepted
- Date: 2026-11-24
- Source: Onyx listing page spec v7, sections A and B3

## Context

At parity pricing, Onyx must give a reason to book through it. The conversion thesis: at the same public price, Onyx offers a more considered booking path and more trip value, wrapped in richer and more honest content than the property shows of itself.

## Decision

Every booking includes four things, always presented together and in this order:

1. **A person secures your room before you pay.** A real person confirms with the hotel first.
2. **Concierge support for the whole trip.** Transfers, lessons, wildlife, the right room for the group. Not just the booking.
3. **Trip credit toward experiences.** 3% of the booking value, shown as a dollar figure, redeemable on lessons, guides and activities.
4. **An upgrade requested on your behalf.** Subject to the hotel's availability and confirmation.

Copy rules:

- Calm and specific. No superlatives.
- Never imply a discount or a price advantage.
- Never claim the upgrade is granted. It is requested.
- Concierge wording stays conservative ("the Onyx concierge team") until the delivery model (named or shared) is confirmed.
- Trip credit is computed live from the booking value and shown near the total as "about US$X". It is added value, never a discount.

## Consequences

- The four benefits are defined once, in `benefits` in `src/content/site.ts`, and reused as chips, panels and the included list.
- Trip credit rate is `tripCreditRate` in `site.ts`. The server recomputes the estimate. The client figure is never trusted.
- Where a stay has no public from rate on file (Silvestre today), the module says "3% of its value" instead of a dollar figure.
- Open inputs: confirmation that the credit and target contribution are funded, and the concierge delivery model. See the [launch checklist](../launch-checklist.md).
