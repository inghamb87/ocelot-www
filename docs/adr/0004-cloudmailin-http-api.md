# ADR 0004: Email goes through the CloudMailin HTTP API

- Status: Accepted
- Date: 2026-11-24

## Context

Each booking request and inquiry sends two emails: a copy to the guest and a notification to Onyx staff. Evan has a CloudMailin account with SMTP credentials. Cloudflare Workers cannot use ordinary SMTP libraries, and CloudMailin offers an HTTP API that uses the same credentials.

## Decision

Send mail with `POST https://api.cloudmailin.com/api/v0.1/{SMTP_USERNAME}/messages`, authenticated with `Authorization: Bearer {API_TOKEN}`. The code is in `functions/_lib/mail.ts`.

- Each email has a plain text part and a simple HTML part built by `emailShell`.
- Every interpolated value is HTML-escaped. Subjects have line breaks removed.
- Staff notifications set `Reply-To` to the guest, so staff can reply from their inbox.
- The database row is written first. Email is sent after the response with `waitUntil`, and the row records whether each email was accepted (`guest_email_sent`, `staff_email_sent`).

## Consequences

- A CloudMailin outage never loses a request. Staff can find rows with `staff_email_sent = false` in Supabase.
- `MAIL_FROM` must be on a domain verified in CloudMailin, with SPF and DKIM set up, or guest emails will land in spam.
- `CLOUDMAILIN_TEST_MODE=1` validates messages without delivering them.
