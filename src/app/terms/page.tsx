import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use the Onyx site and send a booking request.",
  alternates: { canonical: "/terms" },
};

// DRAFT. Have counsel review before launch (README "Before launch").
export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" lede="The terms that apply when you use this site and send a booking request." updated="November 24, 2026">
      <div className="notice">
        <p>These terms are a working draft and are under legal review.</p>
      </div>
      <h2>A request is not a booking</h2>
      <p>Sending a request asks Onyx to check availability with the hotel. Your stay is booked only when we confirm it to you in writing and you have paid.</p>
      <h2>Prices</h2>
      <p>Prices on this site are indicative public rates in US dollars. The rate for your dates is the one in your written confirmation.</p>
      <h2>Payment and cancellation</h2>
      <p>You pay nothing to send a request. Payment and cancellation terms for your stay are sent with your confirmation, before you pay.</p>
      <h2>Trip credit and upgrades</h2>
      <p>Onyx trip credit can be used toward experiences arranged by Onyx. It has no cash value. Upgrades are requested for you and depend on the hotel's availability.</p>
      <h2>Information on this site</h2>
      <p>We work to keep descriptions accurate, but hotels change. Illustrations stand in for photographs where marked. Tell us if you find something wrong.</p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
