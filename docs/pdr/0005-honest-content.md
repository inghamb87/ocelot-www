# PDR 0005: Honest content, nothing fabricated

- Status: Accepted
- Date: 2026-11-24
- Source: Onyx listing page spec v7, sections B5 and D

## Context

Candor converts the right guest, routes groups to higher-value villas and heads off the few complaints that recur in reviews. Trust is the scarce resource for a new brand.

## Decision

- Every listing has an "honest read": who the stay is for, who it is not for, and the expectations to set.
- No invented awards, scores, press or reviews. Recognition is shown only when it is verifiable and Onyx has the right to display it.
- Guest sentiment is paraphrased as themes, never presented as quotations.
- Third-party ratings are shown with their source and a note that they change. They are not added to structured data unless real and licensed.
- Prices are labeled as indicative until confirmed for the guest's dates.
- Illustrations that stand in for photographs are labeled as illustrations. No stock photograph is ever shown as if it were the property.
- Unverified facts are kept out of the page or flagged in the launch checklist.

## Consequences

- `properties.ts` has an `honest` block for every stay. A listing without one is not complete.
- `ratings.display` can turn third-party ratings off per property if the right to display them is in doubt.
- The Silvestre honest read was drafted from Silvestre's own website. Silvestre should review it before launch.
