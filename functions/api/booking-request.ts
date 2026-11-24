import type { Env } from "../_lib/env";
import { guard } from "../_lib/guard";
import { fail, json, methodNotAllowed, newReference } from "../_lib/http";
import { emailShell, sendMail } from "../_lib/mail";
import { insert, update } from "../_lib/supabase";
import { Checker, Invalid, nights } from "../_lib/validate";
import { properties } from "../../src/content/properties";

const INTERESTS = ["Airport transfers", "Surf lessons", "Guided wildlife", "A private chef", "Wellness and yoga", "Planning the wider trip"];
const TRIP_CREDIT_RATE = 0.03;

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const g = await guard(request, env, "booking", 5);
  if (g instanceof Response) return g;
  const { body } = g;

  let v;
  try {
    const c = new Checker(body);
    const propertySlug = c.oneOf("propertySlug", properties.map((p) => p.slug), "stay");
    const property = properties.find((p) => p.slug === propertySlug) ?? properties[0]!;
    const roomId = c.oneOf("roomId", [...property.rooms.map((r) => r.id), "no-preference"], "room or villa");
    const checkIn = c.date("checkIn", "check-in date");
    const checkOut = c.date("checkOut", "check-out date");
    if (checkIn && checkOut) {
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      if (checkIn < yesterday) c.errors.checkIn = "Check-in cannot be in the past.";
      const n = nights(checkIn, checkOut);
      if (n < 1) c.errors.checkOut = "Check-out must be after check-in.";
      else if (n > 60) c.errors.checkOut = "For stays longer than 60 nights, contact the concierge.";
    }
    v = {
      property,
      roomId,
      checkIn,
      checkOut,
      adults: c.int("adults", 1, 12, "Adults"),
      children: c.int("children", 0, 8, "Children"),
      flexibleDates: c.bool("flexibleDates"),
      firstName: c.line("firstName", { max: 80, required: true, label: "First name" }),
      lastName: c.line("lastName", { max: 80, required: true, label: "Last name" }),
      email: c.email("email"),
      phone: c.phone("phone"),
      country: c.line("country", { max: 80, label: "Country" }),
      interests: c.subset("interests", INTERESTS),
      notes: c.text("notes", { max: 2000, label: "Notes" }),
      newsletter: c.bool("newsletter"),
    };
    if (!c.bool("consent")) c.errors.consent = "Consent is required to handle the request.";
    c.done();
  } catch (err) {
    if (err instanceof Invalid) return fail(422, "Some details need another look. Check the form and send again.", err.fields);
    throw err;
  }

  const { property } = v;
  const roomName = v.roomId === "no-preference" ? "No preference" : (property.rooms.find((r) => r.id === v.roomId)?.name ?? v.roomId);
  const n = nights(v.checkIn, v.checkOut);
  const estimate = property.fromRate ? property.fromRate.amount * n : null;
  const credit = estimate ? Math.round(estimate * TRIP_CREDIT_RATE) : null;
  let reference = newReference("ONX");

  const row = () => ({
    reference,
    status: "pending",
    property_slug: property.slug,
    property_name: property.name,
    room_id: v.roomId,
    room_name: roomName,
    check_in: v.checkIn,
    check_out: v.checkOut,
    nights: n,
    adults: v.adults,
    children: v.children,
    flexible_dates: v.flexibleDates,
    first_name: v.firstName,
    last_name: v.lastName,
    email: v.email,
    phone: v.phone || null,
    country: v.country || null,
    interests: v.interests,
    notes: v.notes || null,
    upgrade_requested: true,
    from_rate_usd: property.fromRate?.amount ?? null,
    estimated_total_usd: estimate,
    estimated_credit_usd: credit,
    newsletter_opt_in: v.newsletter,
    consent_at: new Date().toISOString(),
    ip_hash: g.ipHash,
    user_agent: (request.headers.get("user-agent") ?? "").slice(0, 300),
  });

  if (g.dryRun) {
    console.log("DRY_RUN booking request", JSON.stringify({ ...row(), email: "[redacted]", phone: "[redacted]" }));
    return json({ ok: true, reference });
  }

  let saved = await insert(env, "booking_requests", row());
  if (!saved.ok && saved.conflict) {
    reference = newReference("ONX");
    saved = await insert(env, "booking_requests", row());
  }
  if (!saved.ok) return fail(502, "We could not save your request. Try again in a moment, or email us.");

  if (v.newsletter) {
    waitUntil(insert(env, "newsletter_subscribers", { email: v.email, source: "booking-request", ip_hash: g.ipHash }, { ignoreDuplicates: "email" }));
  }

  const guests = `${v.adults} ${v.adults === 1 ? "adult" : "adults"}${v.children ? `, ${v.children} ${v.children === 1 ? "child" : "children"}` : ""}`;
  const dates = `${fmtDate(v.checkIn)} to ${fmtDate(v.checkOut)} (${n} ${n === 1 ? "night" : "nights"})${v.flexibleDates ? ", flexible" : ""}`;
  const shared: [string, string][] = [
    ["Reference", reference],
    ["Stay", property.name],
    ["Room or villa", roomName],
    ["Dates", dates],
    ["Guests", guests],
  ];

  const guestMail = emailShell({
    heading: "Request received",
    intro: [
      `Hello ${v.firstName},`,
      `We are confirming your stay with ${property.shortName} now. A person at Onyx contacts the hotel directly, and we will email you as soon as it replies.`,
      "No card has been taken and you have not been charged.",
    ],
    rows: [
      ...shared,
      ["Upgrade", "Requested for you, subject to the hotel's availability and confirmation"],
      ["Onyx trip credit", credit ? `About US$${credit}, confirmed with your booking` : "3% of your booking value"],
    ],
    outro: [
      "When the hotel confirms, we send the confirmed rate, the cancellation terms and a secure way to pay.",
      "If your dates are not available, you owe nothing. We will suggest comparable stays for the same dates.",
      "Reply to this email if anything changes.",
      "The Onyx concierge team",
    ],
  });
  const staffMail = emailShell({
    heading: `New booking request: ${property.shortName}`,
    intro: [`${v.firstName} ${v.lastName} sent a request. Confirm with the hotel, then reply to the guest.`],
    rows: [
      ...shared,
      ["Name", `${v.firstName} ${v.lastName}`],
      ["Email", v.email],
      ["Phone", v.phone],
      ["Country", v.country],
      ["Concierge help", v.interests.join(", ")],
      ["Notes", v.notes],
      ["Estimate", estimate ? `US$${estimate} at the from rate. Trip credit about US$${credit}.` : "No public from rate on file"],
      ["Newsletter", v.newsletter ? "Opted in" : "No"],
    ],
  });

  waitUntil(
    (async () => {
      const [guestSent, staffSent] = await Promise.all([
        sendMail(env, {
          to: v.email,
          subject: `We received your request for ${property.name} (${reference})`,
          ...guestMail,
          replyTo: env.MAIL_REPLY_TO || env.MAIL_NOTIFY_TO,
          tags: ["booking-request", "guest"],
        }),
        sendMail(env, {
          to: env.MAIL_NOTIFY_TO!,
          subject: `New booking request: ${property.shortName}, ${dates}, ${guests} (${reference})`,
          ...staffMail,
          replyTo: v.email,
          tags: ["booking-request", "staff"],
        }),
      ]);
      await update(env, "booking_requests", `reference=eq.${reference}`, { guest_email_sent: guestSent, staff_email_sent: staffSent });
    })(),
  );

  return json({ ok: true, reference });
};

export const onRequest: PagesFunction<Env> = async () => methodNotAllowed();
