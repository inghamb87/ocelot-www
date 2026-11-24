# Launch checklist

From spec v7 section I, plus items found while building. **Do not run cold paid traffic until every item in "Gating" is resolved.**

## Gating

| No. | Input | Why it matters | Where it lands |
| --- | --- | --- | --- |
| 1 | Contracted net rate confirming parity with margin, per property | The model depends on it. Expected to clear at Sendero. | No site change |
| 2 | Payment mechanics and legally approved payment wording. For a card hold: amount, authorization expiry, re-authorization, release timing. | Payment copy must be exact. | `paymentCopy` and `paymentMode` in `src/content/site.ts` |
| 3 | Cancellation and refund policy | Shown before payment | `src/content/faq.ts`, `src/app/terms/page.tsx` |
| 4 | Confirmation-window promise, in hours | Replaces "as soon as the hotel replies" | `confirmationWindowHours` in `site.ts` |

## Before launch

| Input | Where it lands |
| --- | --- |
| Confirmation that the 3% trip credit and target contribution are funded | `tripCreditRate` in `site.ts` |
| Concierge delivery model (named or shared), to finalize concierge copy | `benefits` in `site.ts`, `src/app/concierge/page.tsx` |
| Hero film and editorial photography | `image` entries in `src/content`, then `showPlaceholderCaptions: false` |
| Real, verifiable press or recognition, with the right to display it | `proof.recognition` in `properties.ts` |
| Right to display third-party ratings | `ratings.display` in `properties.ts` |
| Sendero room category names, bed types and occupancy | `rooms` in `properties.ts` |
| Silvestre "from" rate and review of its listing | `properties.ts` |
| Public contact email | `NEXT_PUBLIC_CONTACT_EMAIL` |
| Domain | `NEXT_PUBLIC_SITE_URL`, Cloudflare Pages custom domain |
| Legal review of privacy policy and terms. Remove the draft notices. | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` |
| Sending domain verified in CloudMailin with SPF and DKIM | `MAIL_FROM` |
| Analytics choice (privacy-respecting), with CSP and privacy policy updates | `functions/_middleware.ts`, privacy page |
| Roxborough CF web license, if the Silvestre typeface is wanted | `src/app/layout.tsx` |

## Technical go-live

- [ ] Supabase migration applied (`supabase db push`).
- [ ] All secrets set in Cloudflare Pages. `DRY_RUN` not set in production.
- [ ] A real request sent end to end: row in Supabase, guest email, staff email, reply-to works.
- [ ] `npm run check` and `npm run check:a11y` pass.
- [ ] Manual accessibility checklist done. See [accessibility](accessibility.md).
- [ ] Security audit done. See [security](security.md).
- [ ] Pages preview deployments restricted or acceptable to be public.
