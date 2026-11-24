"use client";

import type { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: (aria: { id: string; "aria-describedby"?: string; "aria-invalid"?: true }) => ReactNode;
};

/** Label, hint, control and error wired together for assistive technology. */
export function Field({ id, label, optional, hint, error, children }: Props) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional ? <span className="optional"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="hint">
          {hint}
        </p>
      ) : null}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? (
        <p id={`${id}-err`} className="error">
          Error: {error}
        </p>
      ) : null}
    </div>
  );
}

export function ErrorSummary({
  errors,
  labels,
  message,
  innerRef,
}: {
  errors: Record<string, string>;
  labels: Record<string, string>;
  message?: string;
  innerRef: React.Ref<HTMLDivElement>;
}) {
  const keys = Object.keys(errors);
  if (!keys.length && !message) return null;
  return (
    <div className="alert" role="alert" tabIndex={-1} ref={innerRef}>
      <h3>{keys.length ? `Check ${keys.length === 1 ? "this field" : `these ${keys.length} fields`}` : "Your request was not sent"}</h3>
      {message ? <p>{message}</p> : null}
      {keys.length ? (
        <ul>
          {keys.map((k) => (
            <li key={k}>
              <a href={`#${k}`}>
                {labels[k] ?? k}: {errors[k]}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
