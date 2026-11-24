# Operations

How a request moves once it leaves the site. There is no staff dashboard in v1: use email and the Supabase table editor.

## Booking requests

1. A guest sends a request. A row is added to `booking_requests` with `status = 'pending'` and a reference such as `ONX-7K4M2QA`.
2. Staff receive "New booking request: ..." at `MAIL_NOTIFY_TO`. Replying to that email writes to the guest.
3. The guest receives "We received your request ..." with the same reference.
4. Staff confirm with the hotel, then reply to the guest with the confirmed rate, cancellation terms and how to pay.
5. Staff set `status` to `confirmed`, `unavailable` or `cancelled` and fill `confirmed_rate_usd` and `staff_notes`.

If `staff_email_sent` is `false`, the notification did not go out. Check the CloudMailin dashboard and contact the guest from the row.

## Inquiries

Rows land in `inquiries` with a reference such as `ONQ-...`. Reply to the notification email, then set `status` to `replied`.

## Newsletter

Signups land in `newsletter_subscribers`. To unsubscribe someone, set `unsubscribed_at`. Export active rows where `unsubscribed_at is null`.

## Housekeeping

- `request_log` holds only salted hashes for rate limiting. Delete rows older than a day when convenient:
  `delete from request_log where created_at < now() - interval '1 day';`
- Mark junk rows `status = 'spam'`. If spam becomes regular, turn on Turnstile (README, "Optional: Turnstile").

## Changing content

Edit the files in `src/content`, run `npm run check`, then `npm run deploy`. See [ADR 0006](adr/0006-content-as-typed-files.md).
