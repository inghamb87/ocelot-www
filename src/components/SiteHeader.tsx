import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link href="/" className="brand">
          <span className="brand__name">Onyx</span>{" "}
          <span className="brand__sub">Travel</span>
          <span className="visually-hidden">, home</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <NavLinks />
          <Link href="/concierge#plan" className="btn btn--primary">
            Plan a trip
          </Link>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
