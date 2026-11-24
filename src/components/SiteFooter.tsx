import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import { nav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="stack">
            <p className="brand">
              <span className="brand__name">Onyx</span>
              <span className="brand__sub">Travel</span>
            </p>
            <p className="soft">
              A travel guide and booking concierge for design-led hotels and villas. Managed alongside{" "}
              <a href={site.partner.url} rel="noopener">
                {site.partner.name}
              </a>
              .
            </p>
          </div>
          <nav aria-label="Footer">
            <h2 className="label">Explore</h2>
            <ul className="footer__list mt-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="label">Onyx</h2>
            <ul className="footer__list mt-1">
              <li>
                <Link href="/about">About Onyx</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/accessibility">Accessibility</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of use</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="label">Get on the list</h2>
            <div className="mt-1">
              <NewsletterForm />
            </div>
          </div>
        </div>
        <div className="footer__legal">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Prices shown in US dollars.</p>
        </div>
      </div>
    </footer>
  );
}
