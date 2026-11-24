# PDR 0002: Request to book with human confirmation

- Status: Accepted
- Date: 2026-11-24
- Source: Onyx listing page spec v7, sections A, C and D

## Context

Onyx does not hold live inventory. A person at Onyx confirms each stay with the hotel. The primary objection the page must answer is: "Why request this through a brand I have never heard of, with no instant confirmation, when I can book on Booking.com or direct in two minutes?"

## Decision

Booking is a request, confirmed by a person, in these states:

| State | What the guest is told |
| --- | --- |
| Form | Dates, guests, room or villa. Reassurance panel directly above the action. |
| Review | A summary to check. Nothing is sent until the guest chooses to send. |
| Request received (pending) | We are confirming with the hotel. When they will hear back. What has and has not been charged. |
| Confirmed | The stay is secured. Payment is taken or arranged. The concierge follows up about the trip and the trip credit. |
| Unavailable | Nothing is owed. The concierge offers comparable stays for the same dates. |

Rules for the flow:

- The human confirmation is framed as a benefit ("a person secures your room before you pay"), not as a delay.
- Every payment moment leads with the risk reversal.
- Transactional answers (what is charged, when, what happens on failure) appear inside the module, not only in the FAQ.
- Copy never implies instant confirmation.
- The reassurance panel above the action is the highest-leverage element on the page. It never collapses on mobile.
- The primary action is named "Request to book" everywhere it appears.

## Consequences

- The site needs a confirmation-window promise. Until Onyx sets one, `confirmationWindowHours` in `src/content/site.ts` is `null` and copy says "as soon as the hotel replies".
- Confirmed and unavailable outcomes are handled by staff over email in v1. The `status` column on `booking_requests` tracks them.
- The review step also satisfies WCAG 3.3.6 (error prevention for all submissions).
