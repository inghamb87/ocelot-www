import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { InquiryForm } from "@/components/InquiryForm";
import { Art } from "@/components/Art";

export const metadata: Metadata = {
  title: "Concierge: plan a trip",
  description: "Tell the Onyx concierge team where you want to go. A person replies with stays that fit and plans transfers, guides and tables around them.",
  alternates: { canonical: "/concierge" },
};

const HELP = [
  { title: "The right room", body: "We match the room, villa or residence to your group, then confirm it with the hotel in person." },
  { title: "Transfers", body: "Airport pickups and drives between stops, timed to your flights." },
  { title: "Experiences", body: "Surf coaches, wildlife guides, boat trips and private chefs we know by name." },
  { title: "The wider trip", body: "More than one stop? We put the stays in a sensible order and connect them." },
];

export default function ConciergePage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "Concierge" }]}
        title="A concierge for the whole trip"
        lede="Booking the room is the easy part. The Onyx concierge team plans the days around it, and it comes with every booking at no extra cost."
      />
      <section className="section" aria-labelledby="help-title">
        <div className="wrap stack stack--lg">
          <div className="split">
            <h2 id="help-title" className="title-caps">
              What we take care of
            </h2>
            <div className="split__body">
              <Art art={{ scene: "terrace", seed: 91, alt: "A terrace table set for two above the treetops" }} ratio="wide" />
            </div>
          </div>
          <div className="notes">
            {HELP.map((h) => (
              <div key={h.title} className="note">
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--shell" id="plan" aria-labelledby="plan-title">
        <div className="wrap split">
          <div className="stack">
            <h2 id="plan-title" className="title-caps">
              Plan a trip
            </h2>
            <p className="soft">Share what you know so far. Rough ideas are fine. A person reads every message and replies by email.</p>
          </div>
          <div className="request__panel">
            <InquiryForm kind="trip" />
          </div>
        </div>
      </section>
    </>
  );
}
