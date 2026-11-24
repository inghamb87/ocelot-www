import type { Env } from "../_lib/env";
import { guard } from "../_lib/guard";
import { fail, json, methodNotAllowed, newReference } from "../_lib/http";
import { emailShell, sendMail } from "../_lib/mail";
import { insert, update } from "../_lib/supabase";
import { Checker, Invalid } from "../_lib/validate";

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const g = await guard(request, env, "inquiry", 5);
  if (g instanceof Response) return g;

  let v;
  try {
    const c = new Checker(g.body);
    v = {
      kind: c.oneOf("kind", ["trip", "general"] as const, "message type"),
      name: c.line("name", { max: 120, required: true, label: "Name" }),
      email: c.email("email"),
      phone: c.phone("phone"),
      destination: c.line("destination", { max: 160, label: "Destination" }),
      dates: c.line("dates", { max: 120, label: "Dates" }),
      travelers: c.line("travelers", { max: 160, label: "Travelers" }),
      message: c.text("message", { max: 4000, min: 10, label: "Message" }),
    };
    if (!c.bool("consent")) c.errors.consent = "Consent is required to reply.";
    c.done();
  } catch (err) {
    if (err instanceof Invalid) return fail(422, "Some details need another look. Check the form and send again.", err.fields);
    throw err;
  }

  const reference = newReference("ONQ");
  if (g.dryRun) {
    console.log("DRY_RUN inquiry", JSON.stringify({ reference, kind: v.kind, length: v.message.length }));
    return json({ ok: true, reference });
  }

  const saved = await insert(env, "inquiries", {
    reference,
    kind: v.kind,
    name: v.name,
    email: v.email,
    phone: v.phone || null,
    destination: v.destination || null,
    dates: v.dates || null,
    travelers: v.travelers || null,
    message: v.message,
    consent_at: new Date().toISOString(),
    ip_hash: g.ipHash,
  });
  if (!saved.ok) return fail(502, "We could not save your message. Try again in a moment, or email us.");

  const rows: [string, string][] = [
    ["Reference", reference],
    ["Where", v.destination],
    ["When", v.dates],
    ["Who", v.travelers],
    ["Message", v.message],
  ];
  const guestMail = emailShell({
    heading: "Message received",
    intro: [`Hello ${v.name.split(" ")[0]},`, "Thank you for writing to Onyx. A person on the concierge team will reply by email."],
    rows,
    outro: ["Reply to this email if you want to add anything.", "The Onyx concierge team"],
  });
  const staffMail = emailShell({
    heading: v.kind === "trip" ? "New trip inquiry" : "New contact message",
    intro: [`From ${v.name}. Reply directly to this email to answer.`],
    rows: [...rows, ["Name", v.name], ["Email", v.email], ["Phone", v.phone]],
  });

  waitUntil(
    (async () => {
      const [guestSent, staffSent] = await Promise.all([
        sendMail(env, { to: v.email, subject: `We received your message (${reference})`, ...guestMail, replyTo: env.MAIL_REPLY_TO || env.MAIL_NOTIFY_TO, tags: ["inquiry", "guest"] }),
        sendMail(env, { to: env.MAIL_NOTIFY_TO!, subject: `${v.kind === "trip" ? "Trip inquiry" : "Contact message"} from ${v.name} (${reference})`, ...staffMail, replyTo: v.email, tags: ["inquiry", "staff"] }),
      ]);
      await update(env, "inquiries", `reference=eq.${reference}`, { guest_email_sent: guestSent, staff_email_sent: staffSent });
    })(),
  );

  return json({ ok: true, reference });
};

export const onRequest: PagesFunction<Env> = async () => methodNotAllowed();
