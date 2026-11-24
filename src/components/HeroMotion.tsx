"use client";

import { useState } from "react";

/** Wraps the hero and adds a pause control for its slow drift (WCAG 2.2.2).
 *  The control is hidden when the visitor prefers reduced motion, because
 *  nothing moves in that case. */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  return (
    <section className={`hero hero--motion on-dark${paused ? " is-paused" : ""}`}>
      {children}
      <button type="button" className="hero__pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? "Play motion" : "Pause motion"}
      </button>
    </section>
  );
}
