"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EMAIL_RE, postJson } from "@/lib/api";

export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const input = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter an email address in the format name@example.com.");
      input.current?.focus();
      return;
    }
    setError("");
    setState("sending");
    const res = await postJson("/api/newsletter", { email: email.trim(), website, elapsedMs: Date.now() - startedAt.current });
    if (res.ok) {
      setState("done");
    } else {
      setState("idle");
      setError(res.message);
      input.current?.focus();
    }
  }

  if (state === "done") {
    return (
      <p role="status" tabIndex={-1}>
        You are on the list. We will write when there is something worth reading.
      </p>
    );
  }

  return (
    <form className="news" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor={`${id}-email`}>Email address</label>
        <div className="news__row">
          <input
            ref={input}
            id={`${id}-email`}
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-hint${error ? ` ${id}-err` : ""}`}
            required
          />
          <button type="submit" className="btn btn--light" aria-disabled={state === "sending"}>
            {state === "sending" ? "Joining" : "Join the list"}
          </button>
        </div>
        <p id={`${id}-hint`} className="hint">
          New stays and travel guides, a few times a year. Unsubscribe at any time.
        </p>
        {error ? (
          <p id={`${id}-err`} className="error" role="alert">
            Error: {error}
          </p>
        ) : null}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
    </form>
  );
}
