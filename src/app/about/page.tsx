import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Art } from "@/components/Art";
import { CtaBand } from "@/components/CtaBand";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About Onyx",
  description: "Onyx is a travel guide and booking concierge for design-led hotels and villas, managed alongside Silvestre Nosara Hotel & Residences.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { title: "Honest before flattering", body: "Every stay page says who the place suits and who it does not. The right guest in the right room is good for everyone." },
  { title: "People, not just software", body: "A person confirms each booking with the hotel. A person answers when plans change." },
  { title: "The same price", body: "We show the price you would pay booking direct. We earn our place with service, not with discounts." },
  { title: "Nothing invented", body: "No made-up awards, scores or press. If we cannot verify something, we leave it out." },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "About" }]}
        title="About Onyx"
        lede="Onyx is a travel guide and booking concierge. We recommend a short list of design-led hotels and villas, book them with care and plan the trip around them."
      />
      <section className="section" aria-labelledby="hotel-title">
        <div className="wrap split">
          <h2 id="hotel-title" className="title-caps">
            Run by hoteliers
          </h2>
          <div className="split__body">
            <Art art={{ scene: "canopy", seed: 95, alt: "Jungle canopy above Playa Guiones, Nosara" }} ratio="wide" />
            <p className="lede">
              Onyx is managed alongside{" "}
              <a href={site.partner.url} rel="noopener">
                {site.partner.name}
              </a>{" "}
              in Costa Rica.
            </p>
            <p>That is where our standards come from. We know what it takes to look after a guest from the first email to the last morning, and we hold the stays we recommend to the same measure.</p>
            <p>We start in Nosara, the town we know best, and we are building outward from there for travelers everywhere.</p>
          </div>
        </div>
      </section>
      <section className="section section--shell" aria-labelledby="principles-title">
        <div className="wrap stack stack--lg">
          <h2 id="principles-title" className="title-caps">
            How we work
          </h2>
          <div className="notes">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="note">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
          <p>
            <Link href="/how-it-works" className="btn btn--ghost">
              Read how request to book works
            </Link>
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
