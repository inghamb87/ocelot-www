# ADR 0003: Supabase is reached only from the server

- Status: Accepted
- Date: 2026-11-24

## Context

Supabase is the system of record for booking requests, inquiries and newsletter signups. Supabase supports direct browser access with a publishable key plus Row Level Security policies. That model puts the access rules in SQL policies, where a mistake exposes guest data.

## Decision

- The browser never talks to Supabase. No Supabase key of any kind ships to the client.
- Pages Functions call the Supabase REST API (PostgREST) with the secret key.
- Row Level Security is enabled on every table with **no policies** for the `anon` and `authenticated` roles, and default grants to those roles are revoked. The secret key bypasses RLS.
- The schema lives in `supabase/migrations` and is applied with the Supabase CLI.
- Staff manage records in the Supabase dashboard until a staff tool exists.

Tables: `booking_requests`, `inquiries`, `newsletter_subscribers`, `request_log`.

## Consequences

- A leaked publishable key or a missing policy cannot expose data, because there is nothing for those roles to read.
- All validation happens twice: in the Function (`functions/_lib/validate.ts`) and as `check` constraints in the database.
- Caller IP addresses are never stored. `ip_hash` is a salted SHA-256 used for rate limiting only.
- Adding guest accounts later means adding policies deliberately, table by table. Record that as a new ADR.
