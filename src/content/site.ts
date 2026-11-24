// Site-wide settings and the copy that depends on unresolved business inputs.
// Everything marked LAUNCH INPUT maps to an item in README.md "Before launch".

export const site = {
  name: "Onyx",
  tagline: "Travel guide and booking concierge",
  description:
    "Onyx is a travel guide and booking concierge for design-led hotels and villas. The same price as booking direct, with a person who confirms your room before you pay.",
  // Set NEXT_PUBLIC_SITE_URL at build time once the domain is connected.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://onyx-www.pages.dev").replace(/\/$/, ""),
  locale: "en-US",
  // LAUNCH INPUT: public contact address shown on the site and in emails.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "concierge@example.com",
  partner: {
    name: "Silvestre Nosara Hotel & Residences",
    url: "https://silvestre.cr/",
  },
  // When false, the "Illustration, photography to follow" caption is hidden.
  showPlaceholderCaptions: true,
  // LAUNCH INPUT: confirmation window in hours. null hides the promise.
  confirmationWindowHours: null as number | null,
  // Trip credit as a share of booking value.
  tripCreditRate: 0.03,
  // "request-only": no card is collected on the site (current build).
  // "authorize": a card hold is placed at request time (needs a processor).
  paymentMode: "request-only" as PaymentMode,
} as const;

export type PaymentMode = "request-only" | "authorize";

export const nav = [
  { href: "/stays", label: "Stays" },
  { href: "/destinations", label: "Destinations" },
  { href: "/journal", label: "Journal" },
  { href: "/concierge", label: "Concierge" },
  { href: "/how-it-works", label: "How it works" },
] as const;

/** Copy for every payment moment. Switch modes in one place: site.paymentMode. */
export const paymentCopy = {
  "request-only": {
    ribbon: "No card needed to request. No charge until a person confirms your room.",
    promiseTitle: "A person secures your room before you pay",
    promiseBody:
      "Send your request without a card. A real person at Onyx confirms availability with the hotel first. Only then do we arrange payment.",
    panelTitle: "No card needed, no charge until confirmed",
    panelBody:
      "Sending this request costs nothing and takes no card details. A real person at Onyx confirms availability with the hotel. If we cannot confirm your dates, you pay nothing.",
    submit: "Send request",
    submitNote: "No card needed. No charge until confirmed.",
    pending: "No card has been taken and you have not been charged.",
    confirmed:
      "When the hotel confirms, we email you the confirmed rate, the cancellation terms and a secure way to pay.",
    unavailable:
      "If your dates are not available, you owe nothing. Your concierge suggests comparable stays for the same dates.",
    steps: [
      {
        title: "Send your request",
        body: "Choose your dates and room or villa. No card is needed and nothing is charged.",
      },
      {
        title: "A person confirms with the hotel",
        body: "Someone at Onyx checks availability with the hotel directly and asks for your upgrade.",
      },
      {
        title: "Pay once it is confirmed",
        body: "You receive the confirmed rate and cancellation terms in writing, then pay securely. Your concierge starts on the rest of the trip.",
      },
    ],
  },
  authorize: {
    ribbon: "Your card is authorized, never charged, until a person confirms your room.",
    promiseTitle: "A person secures your room before you pay",
    promiseBody:
      "Your card is authorized, never charged, until a real person confirms with the hotel.",
    panelTitle: "Authorized, not charged",
    panelBody:
      "We place a hold on your card to request this room, an authorization only. You are not charged until a real person at Onyx confirms availability with the hotel. If we cannot confirm, the authorization is released and you pay nothing.",
    submit: "Request to book",
    submitNote: "No charge until confirmed.",
    pending: "Your card has been authorized, not charged.",
    confirmed:
      "When the hotel confirms, your card is charged and your stay is secured.",
    unavailable:
      "If your dates are not available, we release the authorization and you are not charged. Your concierge suggests comparable stays for the same dates.",
    steps: [
      {
        title: "Request your stay",
        body: "Choose your dates and room or villa. We place a hold on your card. It is an authorization only.",
      },
      {
        title: "A person confirms with the hotel",
        body: "Someone at Onyx checks availability with the hotel directly and asks for your upgrade.",
      },
      {
        title: "Charged once it is confirmed",
        body: "Only after confirmation is your card charged. Your concierge starts on the rest of the trip.",
      },
    ],
  },
} as const;

export const pay = paymentCopy[site.paymentMode];

/** The four reasons to book through Onyx. Never implies a discount. */
export const benefits = [
  {
    id: "human",
    chip: "A person confirms before you pay",
    title: pay.promiseTitle,
    body: pay.promiseBody,
  },
  {
    id: "concierge",
    chip: "Concierge for the whole trip",
    title: "Concierge support for the whole trip",
    body: "The Onyx concierge team plans around your stay: transfers, guides, tables and the right room for your group. Not just the booking.",
  },
  {
    id: "credit",
    chip: "3% trip credit",
    title: "Trip credit toward experiences",
    body: "3% of your booking comes back as Onyx trip credit, shown as a dollar figure, to spend on lessons, guides and activities.",
  },
  {
    id: "upgrade",
    chip: "Upgrade requested for you",
    title: "An upgrade requested on your behalf",
    body: "We ask the hotel for an upgrade with every booking. It is subject to the hotel's availability and confirmation.",
  },
] as const;

export function confirmationPromise(): string {
  const h = site.confirmationWindowHours;
  return h
    ? `You will hear from us within ${h} hours.`
    : "You will hear from us by email as soon as the hotel replies.";
}
