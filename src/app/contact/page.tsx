import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { InquiryForm } from "@/components/InquiryForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Onyx concierge team with a question about a stay, a booking or the site.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHead crumbs={[{ label: "Contact" }]} title="Contact Onyx" lede="Questions about a stay, a booking or this site. A person reads every message." />
      <section className="section" aria-labelledby="contact-title">
        <div className="wrap split">
          <div className="stack">
            <h2 id="contact-title" className="title-caps">
              Send a message
            </h2>
            <p>
              Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </p>
            <p className="soft">
              Planning a trip? The <Link href="/concierge#plan">trip planning form</Link> asks the questions that help us most.
            </p>
          </div>
          <div className="request__panel">
            <InquiryForm kind="general" />
          </div>
        </div>
      </section>
    </>
  );
}
