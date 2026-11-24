# PDR 0003: No card collection in v1

- Status: Accepted
- Date: 2026-11-24
- Supersedes for v1: the card authorization hold in spec v7, section C

## Context

The spec describes a card authorization at request time: a hold is placed, and the card is charged only after a person confirms. The spec also lists the mechanics as unresolved: hold amount, authorization expiry, re-authorization if confirmation runs long, release timing on failure and legally approved payment wording. No payment processor has been chosen.

## Decision

v1 collects no card details. A request is saved, the guest and staff are emailed, and payment is arranged after confirmation.

Both sets of copy exist in `src/content/site.ts` under `paymentCopy`:

| Moment | `request-only` (live) | `authorize` (spec wording, ready) |
| --- | --- | --- |
| Trust ribbon | No card needed to request. No charge until a person confirms your room. | Your card is authorized, never charged, until a person confirms your room. |
| Panel above the action | No card needed, no charge until confirmed. | We place a hold on your card to request this room, an authorization only. You are not charged until a real person at Onyx confirms availability with the hotel. If we cannot confirm, the authorization is released and you pay nothing. |
| Pending | No card has been taken and you have not been charged. | Your card has been authorized, not charged. |
| Unavailable | You owe nothing. | We release the authorization and you are not charged. |

## Consequences

- Lower commitment at request time. Expect more requests and a lower request-to-confirmed rate than with a hold. Track both.
- To switch on the hold: choose a processor that supports authorize-then-capture (Stripe manual capture is the default candidate), resolve the open mechanics, get the wording approved, add a payment step to `RequestToBook.tsx`, add a Function that creates the authorization, then set `paymentMode` to `"authorize"`. Record it as a new PDR and ADR.
- Card data must never touch Onyx code or the database. Use the processor's hosted fields.
