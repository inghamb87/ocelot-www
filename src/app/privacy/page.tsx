import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal information Onyx collects, why, and the choices you have.",
  alternates: { canonical: "/privacy" },
};

// DRAFT. Have counsel review before launch (README "Before launch").
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" lede="What we collect, why we collect it and the choices you have." updated="November 24, 2026">
      <div className="notice">
        <p>This policy is a working draft and is under legal review.</p>
      </div>
      <h2>What we collect</h2>
      <p>When you send a booking request or a message, we collect the details you type into the form: your name, email address, optional phone number and country, your travel dates, the number of guests and any notes you add.</p>
      <p>When you join our list, we collect your email address.</p>
      <p>To protect the forms from abuse we keep a one-way hash of the network address a request came from. We cannot turn it back into the address.</p>
      <h2>What we do not collect</h2>
      <ul>
        <li>We do not take card details on this site.</li>
        <li>We do not use advertising trackers or sell personal information.</li>
        <li>We do not load fonts or scripts from third parties that could track you.</li>
      </ul>
      <h2>How we use it</h2>
      <p>We use your details to check availability with the hotel you asked about, to reply to you and to plan the trip you asked for. We share only what the hotel or a local provider needs to deliver your stay.</p>
      <p>We send marketing email only if you asked for it. Every such email has an unsubscribe link.</p>
      <h2>Who processes it for us</h2>
      <ul>
        <li>Cloudflare hosts this site.</li>
        <li>Supabase stores requests and messages.</li>
        <li>CloudMailin delivers our email.</li>
      </ul>
      <h2>How long we keep it</h2>
      <p>We keep booking records for as long as the law requires for tax and accounting. We delete other messages when they are no longer needed.</p>
      <h2>Your choices</h2>
      <p>
        You can ask for a copy of your information, ask us to correct it or ask us to delete it. Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
