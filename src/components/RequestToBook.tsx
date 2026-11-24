"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { benefits, confirmationPromise, pay, site } from "@/content/site";
import { EMAIL_RE, postJson } from "@/lib/api";
import { longDate, nightsBetween, todayIso, usd } from "@/lib/format";
import { ErrorSummary, Field } from "./Field";
import { Turnstile, TURNSTILE_SITE_KEY } from "./Turnstile";

export type RequestProperty = {
  slug: string;
  name: string;
  shortName: string;
  fromRate: { amount: number; currency: "USD" } | null;
  rooms: { id: string; name: string }[];
  groupNote: string;
  creditIdeas: string;
};

const INTERESTS = [
  "Airport transfers",
  "Surf lessons",
  "Guided wildlife",
  "A private chef",
  "Wellness and yoga",
  "Planning the wider trip",
];

const LABELS: Record<string, string> = {
  "rtb-room": "Room or villa",
  "rtb-checkin": "Check-in date",
  "rtb-checkout": "Check-out date",
  "rtb-first": "First name",
  "rtb-last": "Last name",
  "rtb-email": "Email address",
  "rtb-phone": "Phone number",
  "rtb-consent": "Privacy consent",
};

type Values = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  flexible: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  interests: string[];
  notes: string;
  consent: boolean;
  newsletter: boolean;
  website: string;
};

const EMPTY: Values = {
  roomId: "",
  checkIn: "",
  checkOut: "",
  adults: "2",
  children: "0",
  flexible: false,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  interests: [],
  notes: "",
  consent: false,
  newsletter: false,
  website: "",
};

function validate(v: Values): Record<string, string> {
  const e: Record<string, string> = {};
  const today = todayIso();
  if (!v.roomId) e["rtb-room"] = "Choose a room or villa, or choose no preference.";
  if (!v.checkIn) e["rtb-checkin"] = "Choose a check-in date.";
  else if (v.checkIn < today) e["rtb-checkin"] = "Check-in cannot be in the past.";
  if (!v.checkOut) e["rtb-checkout"] = "Choose a check-out date.";
  else if (v.checkIn && v.checkOut <= v.checkIn) e["rtb-checkout"] = "Check-out must be after check-in.";
  else if (v.checkIn && nightsBetween(v.checkIn, v.checkOut) > 60) e["rtb-checkout"] = "For stays longer than 60 nights, contact the concierge.";
  if (!v.firstName.trim()) e["rtb-first"] = "Enter your first name.";
  if (!v.lastName.trim()) e["rtb-last"] = "Enter your last name.";
  if (!v.email.trim()) e["rtb-email"] = "Enter your email address.";
  else if (!EMAIL_RE.test(v.email.trim())) e["rtb-email"] = "Enter an email address in the format name@example.com.";
  if (v.phone.trim() && !/^[+()\d\s.-]{6,24}$/.test(v.phone.trim())) e["rtb-phone"] = "Enter a phone number using digits, spaces and + only, or leave it empty.";
  if (!v.consent) e["rtb-consent"] = "Confirm that we may use your details to handle this request.";
  return e;
}

export function RequestToBook({ property }: { property: RequestProperty }) {
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"form" | "review" | "sent">("form");
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");
  const [token, setToken] = useState("");
  const startedAt = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLHeadingElement>(null);
  const focusStage = useRef(false);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((prev) => ({ ...prev, [k]: val }));

  useEffect(() => {
    startedAt.current = Date.now();
    const pick = (id: string) => {
      if (property.rooms.some((r) => r.id === id)) setV((prev) => ({ ...prev, roomId: id }));
    };
    const fromUrl = new URLSearchParams(window.location.search).get("room");
    if (fromUrl) pick(fromUrl);
    const onSelect = (e: Event) => pick((e as CustomEvent<string>).detail);
    window.addEventListener("onyx:select-room", onSelect);
    return () => window.removeEventListener("onyx:select-room", onSelect);
  }, [property.rooms]);

  // Move focus to the new stage heading after the stage changes.
  useEffect(() => {
    if (focusStage.current) {
      focusStage.current = false;
      stageRef.current?.focus();
    }
  }, [stage]);

  const onToken = useCallback((t: string) => setToken(t), []);

  const nights = v.checkIn && v.checkOut ? Math.max(0, nightsBetween(v.checkIn, v.checkOut)) : 0;
  const roomName = useMemo(
    () => (v.roomId === "no-preference" ? "No preference" : (property.rooms.find((r) => r.id === v.roomId)?.name ?? "")),
    [v.roomId, property.rooms],
  );
  const estimate = property.fromRate && nights > 0 ? property.fromRate.amount * nights : 0;
  const credit = estimate ? Math.round(estimate * site.tripCreditRate) : 0;
  const today = todayIso();

  function toReview(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    setServerError("");
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    focusStage.current = true;
    setStage("review");
  }

  async function send() {
    if (sending) return;
    if (TURNSTILE_SITE_KEY && !token) {
      setServerError("Complete the security check above, then send your request.");
      return;
    }
    setSending(true);
    setServerError("");
    const res = await postJson<{ reference: string }>("/api/booking-request", {
      propertySlug: property.slug,
      roomId: v.roomId,
      checkIn: v.checkIn,
      checkOut: v.checkOut,
      adults: Number(v.adults),
      children: Number(v.children),
      flexibleDates: v.flexible,
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      country: v.country.trim(),
      interests: v.interests,
      notes: v.notes.trim(),
      consent: v.consent,
      newsletter: v.newsletter,
      website: v.website,
      elapsedMs: Date.now() - startedAt.current,
      turnstileToken: token,
    });
    setSending(false);
    if (res.ok) {
      setReference(res.data.reference);
      focusStage.current = true;
      setStage("sent");
    } else {
      setServerError(res.message);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  const aside = (
    <aside className="request__aside stack" aria-label="Your stay summary">
      <div className="summary">
        <p className="label">{property.name}</p>
        {property.fromRate ? (
          <div>
            <p className="summary__price">
              {estimate ? `About ${usd(estimate)}` : `From ${usd(property.fromRate.amount)} per night`}
            </p>
            <p className="small soft">
              {estimate
                ? `${nights} ${nights === 1 ? "night" : "nights"} at the public from rate of ${usd(property.fromRate.amount)}. `
                : ""}
              The same price you would pay booking direct. Your concierge confirms the exact rate for your dates before you pay.
            </p>
          </div>
        ) : (
          <div>
            <p className="summary__price">Rate confirmed with your request</p>
            <p className="small soft">The same price you would pay booking direct. Your concierge sends the exact rate for your dates before you pay.</p>
          </div>
        )}
        <div className="notice" aria-live="polite">
          <h4>Onyx trip credit</h4>
          <p>
            {credit
              ? `This stay earns about ${usd(credit)} in Onyx trip credit toward ${property.creditIdeas}.`
              : `This stay earns 3% of its value in Onyx trip credit toward ${property.creditIdeas}.`}
          </p>
        </div>
        <div>
          <h4>Included with every Onyx booking</h4>
          <ul className="ticks mt-1">
            {benefits.map((b) => (
              <li key={b.id}>{b.chip}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="small soft">{property.groupNote}</p>
    </aside>
  );

  if (stage === "sent") {
    return (
      <div className="request">
        <div className="success" role="status">
          <h3 ref={stageRef} tabIndex={-1}>
            Request received
          </h3>
          <p className="lede">
            We are confirming {roomName && v.roomId !== "no-preference" ? `your ${roomName.toLowerCase()}` : "your stay"} with {property.shortName} now. {confirmationPromise()}
          </p>
          <p>
            <strong>{pay.pending}</strong>
          </p>
          <p>{pay.confirmed}</p>
          <p>{pay.unavailable}</p>
          <p>
            Your reference is <strong>{reference}</strong>. We sent a copy to {v.email.trim()}.
          </p>
        </div>
        {aside}
      </div>
    );
  }

  if (stage === "review") {
    return (
      <div className="request">
        <div className="request__panel">
          <ol className="progress">
            <li>1. Your details</li>
            <li aria-current="step">2. Review and send</li>
          </ol>
          <h3 ref={stageRef} tabIndex={-1}>
            Check your request
          </h3>
          <p className="mt-1 soft">Nothing has been sent yet. Edit anything that is not right.</p>
          <div className="mt-2">
            <ErrorSummary errors={{}} labels={LABELS} message={serverError} innerRef={summaryRef} />
          </div>
          <dl className="review mt-2">
            <div>
              <dt>Stay</dt>
              <dd>{property.name}</dd>
            </div>
            <div>
              <dt>Room or villa</dt>
              <dd>{roomName}</dd>
            </div>
            <div>
              <dt>Dates</dt>
              <dd>
                {longDate(v.checkIn)} to {longDate(v.checkOut)} ({nights} {nights === 1 ? "night" : "nights"})
                {v.flexible ? ". Dates are flexible." : ""}
              </dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>
                {v.adults} {v.adults === "1" ? "adult" : "adults"}
                {v.children !== "0" ? `, ${v.children} ${v.children === "1" ? "child" : "children"}` : ""}
              </dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>
                {v.firstName.trim()} {v.lastName.trim()}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{v.email.trim()}</dd>
            </div>
            {v.phone.trim() ? (
              <div>
                <dt>Phone</dt>
                <dd>{v.phone.trim()}</dd>
              </div>
            ) : null}
            {v.country.trim() ? (
              <div>
                <dt>Country</dt>
                <dd>{v.country.trim()}</dd>
              </div>
            ) : null}
            {v.interests.length ? (
              <div>
                <dt>Concierge help</dt>
                <dd>{v.interests.join(", ")}</dd>
              </div>
            ) : null}
            {v.notes.trim() ? (
              <div>
                <dt>Notes</dt>
                <dd>{v.notes.trim()}</dd>
              </div>
            ) : null}
            <div>
              <dt>Upgrade</dt>
              <dd>Requested for you, subject to the hotel's availability and confirmation.</dd>
            </div>
          </dl>
          <div className="notice mt-2">
            <h4>{pay.panelTitle}</h4>
            <p>{pay.panelBody}</p>
          </div>
          {TURNSTILE_SITE_KEY ? (
            <div className="mt-2">
              <Turnstile onToken={onToken} />
            </div>
          ) : null}
          <div className="cluster mt-2">
            <button type="button" className="btn btn--primary" onClick={send} aria-disabled={sending}>
              {sending ? "Sending request" : pay.submit}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                focusStage.current = true;
                setStage("form");
              }}
            >
              Edit details
            </button>
          </div>
          <p className="small soft mt-1">{pay.submitNote}</p>
        </div>
        {aside}
      </div>
    );
  }

  return (
    <div className="request">
      <form className="request__panel form" onSubmit={toReview} noValidate>
        <ol className="progress">
          <li aria-current="step">1. Your details</li>
          <li>2. Review and send</li>
        </ol>
        <h3 ref={stageRef} tabIndex={-1} className="visually-hidden">
          Your details
        </h3>
        <ErrorSummary errors={errors} labels={LABELS} innerRef={summaryRef} />

        <fieldset className="form">
          <legend className="label">Your stay</legend>
          <Field id="rtb-room" label="Room or villa" error={errors["rtb-room"]}>
            {(a) => (
              <select {...a} className="select" value={v.roomId} onChange={(e) => set("roomId", e.target.value)} required>
                <option value="">Choose one</option>
                {property.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
                <option value="no-preference">No preference, advise me</option>
              </select>
            )}
          </Field>
          <div className="form__row form__row--2">
            <Field id="rtb-checkin" label="Check-in date" error={errors["rtb-checkin"]}>
              {(a) => (
                <input
                  {...a}
                  className="input"
                  type="date"
                  min={today}
                  value={v.checkIn}
                  onChange={(e) => set("checkIn", e.target.value)}
                  required
                />
              )}
            </Field>
            <Field id="rtb-checkout" label="Check-out date" error={errors["rtb-checkout"]}>
              {(a) => (
                <input
                  {...a}
                  className="input"
                  type="date"
                  min={v.checkIn || today}
                  value={v.checkOut}
                  onChange={(e) => set("checkOut", e.target.value)}
                  required
                />
              )}
            </Field>
          </div>
          <div className="form__row form__row--2">
            <Field id="rtb-adults" label="Adults" hint="18 or older.">
              {(a) => (
                <select {...a} className="select" value={v.adults} onChange={(e) => set("adults", e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              )}
            </Field>
            <Field id="rtb-children" label="Children" hint="Under 18 at the time of travel.">
              {(a) => (
                <select {...a} className="select" value={v.children} onChange={(e) => set("children", e.target.value)}>
                  {Array.from({ length: 9 }, (_, i) => String(i)).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          <label className="check">
            <input type="checkbox" checked={v.flexible} onChange={(e) => set("flexible", e.target.checked)} />
            <span>My dates are flexible by a few days</span>
          </label>
        </fieldset>

        <fieldset className="form">
          <legend className="label">Your details</legend>
          <div className="form__row form__row--2">
            <Field id="rtb-first" label="First name" error={errors["rtb-first"]}>
              {(a) => (
                <input {...a} className="input" autoComplete="given-name" maxLength={80} value={v.firstName} onChange={(e) => set("firstName", e.target.value)} required />
              )}
            </Field>
            <Field id="rtb-last" label="Last name" error={errors["rtb-last"]}>
              {(a) => (
                <input {...a} className="input" autoComplete="family-name" maxLength={80} value={v.lastName} onChange={(e) => set("lastName", e.target.value)} required />
              )}
            </Field>
          </div>
          <Field id="rtb-email" label="Email address" hint="We send your confirmation here." error={errors["rtb-email"]}>
            {(a) => (
              <input
                {...a}
                className="input"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={254}
                value={v.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            )}
          </Field>
          <div className="form__row form__row--2">
            <Field id="rtb-phone" label="Phone number" optional hint="Include your country code, for example +1." error={errors["rtb-phone"]}>
              {(a) => (
                <input {...a} className="input" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} value={v.phone} onChange={(e) => set("phone", e.target.value)} />
              )}
            </Field>
            <Field id="rtb-country" label="Country of residence" optional>
              {(a) => (
                <input {...a} className="input" autoComplete="country-name" maxLength={80} value={v.country} onChange={(e) => set("country", e.target.value)} />
              )}
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="legend">
            What can the concierge help with? <span className="optional">(optional)</span>
          </legend>
          <div className="check-grid mt-1">
            {INTERESTS.map((label) => (
              <label key={label} className="check">
                <input
                  type="checkbox"
                  checked={v.interests.includes(label)}
                  onChange={(e) =>
                    set("interests", e.target.checked ? [...v.interests, label] : v.interests.filter((x) => x !== label))
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field id="rtb-notes" label="Anything else we should know?" optional hint="Occasions, children's ages, bed preferences, arrival times.">
          {(a) => <textarea {...a} className="textarea" maxLength={2000} value={v.notes} onChange={(e) => set("notes", e.target.value)} />}
        </Field>

        <div className="hp" aria-hidden="true">
          <label htmlFor="rtb-website">Leave this field empty</label>
          <input id="rtb-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
        </div>

        <div>
          <label className="check">
            <input
              id="rtb-consent"
              type="checkbox"
              checked={v.consent}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={errors["rtb-consent"] ? true : undefined}
              aria-describedby={errors["rtb-consent"] ? "rtb-consent-err" : undefined}
              required
            />
            <span>
              I agree that Onyx may use these details to handle my request, as described in the <Link href="/privacy">privacy policy</Link>.
            </span>
          </label>
          {errors["rtb-consent"] ? (
            <p id="rtb-consent-err" className="error">
              Error: {errors["rtb-consent"]}
            </p>
          ) : null}
          <label className="check">
            <input type="checkbox" checked={v.newsletter} onChange={(e) => set("newsletter", e.target.checked)} />
            <span>Send me new stays and travel guides by email, a few times a year</span>
          </label>
        </div>

        <div className="notice">
          <h4>{pay.panelTitle}</h4>
          <p>{pay.panelBody}</p>
        </div>

        <div>
          <button type="submit" className="btn btn--primary btn--block">
            Review request
          </button>
          <p className="small soft mt-1">Next you check your details. Nothing is sent until you choose to send it.</p>
        </div>
        <noscript>
          <p className="alert">
            This form needs JavaScript. You can also email your dates to <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </noscript>
      </form>
      {aside}
    </div>
  );
}
