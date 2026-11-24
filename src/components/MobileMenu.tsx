"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";

/** Full-screen menu for small screens, built on the native dialog element so
 *  focus trapping, Escape to close and the inert background come for free. */
export function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Close after navigation.
  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="menu-btn"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        <span>Menu</span>
        <span className="menu-btn__icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <dialog ref={ref} className="drawer" aria-label="Menu">
        <div className="wrap drawer__inner">
          <div className="site-header__bar">
            <Link href="/" className="brand" onClick={() => ref.current?.close()}>
              <span className="brand__name">Onyx</span>{" "}
          <span className="brand__sub">Travel</span>
          <span className="visually-hidden">, home</span>
            </Link>
            <button type="button" className="menu-btn" onClick={() => ref.current?.close()}>
              Close
            </button>
          </div>
          <nav aria-label="Main">
            <ul className="drawer__list">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => ref.current?.close()}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/concierge#plan" className="btn btn--light btn--block" onClick={() => ref.current?.close()}>
            Plan a trip
          </Link>
        </div>
      </dialog>
    </>
  );
}
