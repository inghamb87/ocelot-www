import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How Onyx works to make this site usable for everyone, and how to tell us about a barrier.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility" lede="We want everyone to be able to plan and request a trip here." updated="November 24, 2026">
      <h2>Our target</h2>
      <p>We design and test this site against the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AAA wherever it applies.</p>
      <h2>What that means in practice</h2>
      <ul>
        <li>Text meets a contrast ratio of at least 7 to 1 against its background.</li>
        <li>Every page works with a keyboard alone, with a clear focus ring.</li>
        <li>Buttons and links are at least 48 by 48 pixels.</li>
        <li>Text can be enlarged to 200% without loss of content.</li>
        <li>Motion stops if your device asks for reduced motion, and can be paused.</li>
        <li>Forms have visible labels, plain error messages and a review step before anything is sent.</li>
        <li>No part of the site has a time limit.</li>
      </ul>
      <h2>Known limits</h2>
      <p>Pictures on this site are currently illustrations that stand in for photographs. Each has a text description. Some hotel pages will gain film later. It will have captions and a transcript.</p>
      <h2>Tell us about a barrier</h2>
      <p>
        If something does not work for you, email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Tell us the page and what happened. We can also take a booking request by email.
      </p>
    </LegalPage>
  );
}
