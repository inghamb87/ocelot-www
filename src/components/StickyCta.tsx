"use client";

import { useEffect, useState } from "react";

/** Slim request bar that appears once the hero has scrolled away and hides
 *  again while the request module itself is on screen. */
export function StickyCta({ label, note }: { label: string; note: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    const request = document.getElementById("request");
    const footer = document.querySelector(".site-footer");
    let heroOn = true;
    let requestOn = false;
    let footerOn = false;
    const update = () => setVisible(!heroOn && !requestOn && !footerOn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroOn = e.isIntersecting;
        if (e.target === request) requestOn = e.isIntersecting;
        if (e.target === footer) footerOn = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (request) io.observe(request);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-cta on-dark${visible ? " is-visible" : ""}`}>
      <p>{note}</p>
      <a href="#request" className="btn btn--light">
        {label}
      </a>
    </div>
  );
}
