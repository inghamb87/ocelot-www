import { confirmationPromise, pay, site } from "./site";

/** Booking questions shown on every listing and on How it works. */
export const bookingFaq: { q: string; a: string }[] = [
  site.paymentMode === "request-only"
    ? {
        q: "Do I need a card to send a request?",
        a: "No. Sending a request takes no card details and costs nothing. We arrange payment only after a person at Onyx has confirmed your room with the hotel.",
      }
    : {
        q: "How do the card hold and the charge work?",
        a: pay.panelBody,
      },
  {
    q: "When do I pay?",
    a: "Only after your room is confirmed. We email you the confirmed rate and the cancellation terms in writing first.",
  },
  {
    q: "How long does confirmation take?",
    a: `A person at Onyx contacts the hotel directly, so it is not instant. ${confirmationPromise()}`,
  },
  {
    q: "What happens if my dates are not available?",
    a: pay.unavailable,
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellation terms depend on the hotel, the season and the rate. We send them to you in writing with your confirmation, before you pay.",
  },
  {
    q: "Does booking through Onyx cost more than booking direct?",
    a: "No. Onyx shows the same public price you would pay booking direct. What you gain is a person who confirms your room, a concierge for the trip, trip credit and an upgrade request.",
  },
  {
    q: "How does Onyx trip credit work?",
    a: "3% of your booking value comes back as Onyx trip credit, shown as a dollar figure. Your concierge applies it to experiences such as lessons, guides and activities. It is added value for your trip, not a reduction in the room price.",
  },
  {
    q: "Is the upgrade guaranteed?",
    a: "No. We request an upgrade with every booking. The hotel decides, based on availability when you arrive.",
  },
  {
    q: "Who is the concierge?",
    a: "The Onyx concierge team is a small group of people, not a chatbot. They confirm your room with the hotel and help plan the rest of your trip.",
  },
];
