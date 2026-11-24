# Experiments and metrics

From spec v7 section F.

## Metrics

- **Primary:** request to book submission rate.
- **Secondary:** request-to-confirmation rate, confirmed booking rate, villa attach rate and resulting order value, film play and completion, ancillary attach rate and margin per booking (a lift, not the headline), trip credit redemption, concierge engagement.

`booking_requests` already records what is needed for the funnel after submission: `status`, `room_id`, `nights`, `estimated_total_usd`, `confirmed_rate_usd`, `interests`.

## Test backlog, in order

1. **"Why Onyx" framing.** Lead with no charge until confirmed, or lead with the concierge. Hold the parity price constant.
2. **Villa prominence and placement.** Does surfacing villas earlier lift order value without hurting room conversion?
3. **Hero opening shot.** The jungle path, a villa plunge pool, or the tree through the dining room.
4. **Bundle as lever.** If conversion lags, spend part of the rate spread on the bundle (a larger trip credit, a guaranteed upgrade, an included transfer) and measure the lift. The visible price stays at parity by design.

## Highest-leverage element

The reassurance panel directly above the request action. Change it only as a deliberate test.

## Prerequisites

No analytics or experiment tooling is installed. Choose tools before test 1, and update the CSP ([ADR 0005](adr/0005-security-headers-and-csp-nonce.md)) and the privacy policy.
