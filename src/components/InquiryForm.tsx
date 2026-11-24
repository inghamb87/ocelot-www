"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EMAIL_RE, postJson } from "@/lib/api";
import { site } from "@/content/site";
import { ErrorSummary, Field } from "./Field";

const LABELS: Record<string, string> = {
  "inq-name": "Your name",
  "inq-email": "Email address",
  "inq-message": "Your message",
  "inq-consent": "Privacy consent",
};

type Props = {
  /** "trip" asks about destination, dates and travelers. "general" is a plain message. */
  kind: "trip" | "general";
};

export function InquiryForm({ kind }: Props) {
  const [v, setV] = useState({ name: "", email: "", phone: "", destination: "", dates: "", travelers: "", message: "", consent: false, website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [reference, setReference] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (state === "sent") doneRef.current?.focus();
  }, [state]);

  const set = (k: keyof typeof v, val: string | boolean) => setV((p) => ({ ...p, [k]: val }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    const found: Record<string, string> = {};
    if (!v.name.trim()) found["inq-name"] = "Enter your name.";
    if (!v.email.trim()) found["inq-email"] = "Enter your email address.";
    else if (!EMAIL_RE.test(v.email.trim())) found["inq-email"] = "Enter an email address in the format name@example.com.";
    if (v.message.trim().length < 10) found["inq-message"] = kind === "trip" ? "Tell us a little about the trip, in a sentence or two." : "Enter your message, in a sentence or two.";
    if (!v.consent) found["inq-consent"] = "Confirm that we may use your details to reply.";
    setErrors(found);
    setServerError("");
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setState("sending");
    const res = await postJson<{ reference: string }>("/api/inquiry", {
      kind,
      name: v.name.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      destination: v.destination.trim(),
      dates: v.dates.trim(),
      travelers: v.travelers.trim(),
      message: v.message.trim(),
      consent: v.consent,
      website: v.website,
      elapsedMs: Date.now() - startedAt.current,
    });
    if (res.ok) {
      setReference(res.data.reference);
      setState("sent");
    } else {
      setState("idle");
      setServerError(res.message);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  if (state === "sent") {
    return (
      <div className="success" role="status">
        <h3 ref={doneRef} tabIndex={-1}>
          Message received
        </h3>
        <p className="lede">Thank you, {v.name.trim().split(" ")[0]}. A person on the Onyx concierge team will reply by email.</p>
        <p>
          Your reference is <strong>{reference}</strong>. We sent a copy to {v.email.trim()}.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <ErrorSummary errors={errors} labels={LABELS} message={serverError} innerRef={summaryRef} />
      <div className="form__row form__row--2">
        <Field id="inq-name" label="Your name" error={errors["inq-name"]}>
          {(a) => <input {...a} className="input" autoComplete="name" maxLength={120} value={v.name} onChange={(e) => set("name", e.target.value)} required />}
        </Field>
        <Field id="inq-email" label="Email address" error={errors["inq-email"]}>
          {(a) => (
            <input {...a} className="input" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} value={v.email} onChange={(e) => set("email", e.target.value)} required />
          )}
        </Field>
      </div>
      {kind === "trip" ? (
        <>
          <div className="form__row form__row--2">
            <Field id="inq-destination" label="Where would you like to go?" optional hint="A place, a region or just an idea.">
              {(a) => <input {...a} className="input" maxLength={160} value={v.destination} onChange={(e) => set("destination", e.target.value)} />}
            </Field>
            <Field id="inq-dates" label="When?" optional hint="Exact dates or a rough month.">
              {(a) => <input {...a} className="input" maxLength={120} value={v.dates} onChange={(e) => set("dates", e.target.value)} />}
            </Field>
          </div>
          <div className="form__row form__row--2">
            <Field id="inq-travelers" label="Who is traveling?" optional hint="For example: 2 adults, 2 children aged 6 and 9.">
              {(a) => <input {...a} className="input" maxLength={160} value={v.travelers} onChange={(e) => set("travelers", e.target.value)} />}
            </Field>
            <Field id="inq-phone" label="Phone number" optional hint="Include your country code.">
              {(a) => <input {...a} className="input" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} value={v.phone} onChange={(e) => set("phone", e.target.value)} />}
            </Field>
          </div>
        </>
      ) : null}
      <Field
        id="inq-message"
        label={kind === "trip" ? "Tell us about the trip" : "Your message"}
        hint={kind === "trip" ? "What matters most: the occasion, the pace, the budget, anything you want to avoid." : undefined}
        error={errors["inq-message"]}
      >
        {(a) => <textarea {...a} className="textarea" maxLength={4000} value={v.message} onChange={(e) => set("message", e.target.value)} required />}
      </Field>
      <div className="hp" aria-hidden="true">
        <label htmlFor="inq-website">Leave this field empty</label>
        <input id="inq-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
      </div>
      <div>
        <label className="check">
          <input
            id="inq-consent"
            type="checkbox"
            checked={v.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={errors["inq-consent"] ? true : undefined}
            aria-describedby={errors["inq-consent"] ? "inq-consent-err" : undefined}
            required
          />
          <span>
            I agree that Onyx may use these details to reply to me, as described in the <Link href="/privacy">privacy policy</Link>.
          </span>
        </label>
        {errors["inq-consent"] ? (
          <p id="inq-consent-err" className="error">
            Error: {errors["inq-consent"]}
          </p>
        ) : null}
      </div>
      <div>
        <button type="submit" className="btn btn--primary" aria-disabled={state === "sending"}>
          {state === "sending" ? "Sending message" : "Send message"}
        </button>
      </div>
      <noscript>
        <p className="alert">
          This form needs JavaScript. You can also email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
      </noscript>
    </form>
  );
}
