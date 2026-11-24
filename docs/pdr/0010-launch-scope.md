# PDR 0010: Launch scope

- Status: Accepted
- Date: 2026-11-24

## Context

The spec covers one property, Sendero, and describes it as the best-fit property in the set. The business is connected to Silvestre. The site should also carry general travel information and work for travelers worldwide.

## Decision

Launch with:

- **Two stays**, both in Nosara: Sendero Hotel & Villas (from the spec) and Silvestre Nosara Hotel & Residences (from Silvestre's public site).
- **One destination hub**: Nosara, Costa Rica.
- **Six journal guides**: getting to Nosara, the Nosara surf guide, villa or room, when to visit Costa Rica, a week in Nosara, planning a multi-stop Costa Rica trip. These are the internal links the spec asks for.
- **Supporting pages**: stays index, destinations index, journal index, concierge (with a trip planning form), how it works, about, contact, accessibility, privacy and terms.

The site is structured for a worldwide catalog (destinations, stays and guides are lists), but it does not show destinations or stays that do not exist yet. The destinations page invites inquiries about other places.

## Consequences

- Sendero is transaction-strength "Strong" in the spec, on two assumptions: the net rate is contracted and the concierge is delivered on every booking.
- Privacy and terms pages are drafts and are labeled as such.
- No staff dashboard. Requests are managed in Supabase and by email. See [operations](../operations.md).
