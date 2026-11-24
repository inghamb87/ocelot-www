"use client";

import { useId, useState } from "react";

export function BenefitsToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <div id={id} className={`benefits${open ? "" : " is-collapsed"}`}>
        {children}
      </div>
      <button
        type="button"
        className="btn btn--ghost benefits-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Hide the detail" : "Show the detail"}
      </button>
    </div>
  );
}
