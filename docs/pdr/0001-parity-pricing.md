# PDR 0001: Price at parity with booking direct

- Status: Accepted (commercial model locked by Onyx)
- Date: 2026-11-24
- Source: Onyx listing page spec v7, section 0 "Commercial model"

**Internal. The sourcing and margin details below must never appear in public copy.**

## Context

Onyx is an unknown brand asking travelers to request a stay instead of booking instantly. Undercutting the hotel's public rate would strain hotel relationships, and price-led shoppers are not the Onyx guest.

## Decision

- Onyx displays the same rate the traveler would pay on Booking.com or direct. It never shows a lower public rate.
- Onyx sources the room at a net rate through its destination management company (DMC). The difference between net and public rate is Onyx's margin. Part of it funds the bundle ([PDR 0004](0004-the-onyx-bundle.md)).
- The room is the primary margin. Concierge-arranged activities, transfers and experiences add a secondary lift of roughly 20 to 50% of contribution, at roughly 20 to 30% activity margin. Attach is upside, not the engine.
- At Sendero, Onyx's read is an achievable net discount of around 20% off the public rate.

## Consequences

- Public copy says "the same price you would pay booking direct" and "the same price you would pay anyway, with more". It never implies a discount or a price advantage.
- Public copy never mentions rate sourcing, the DMC, spread or margin. `npm run check:copy` fails the build check if those words appear under `src/`.
- Trip credit is presented as added value, never as a reduction in the room price.
- A logged-in Booking.com Genius rate may sit slightly below parity. The page does not chase that shopper.
- If conversion lags, spend part of the spread on the bundle (larger credit, a guaranteed upgrade, an included transfer), not on the visible price. See [experiments](../experiments.md).
- Open input: the net rate must be confirmed in contract per property before launch. See the [launch checklist](../launch-checklist.md).
