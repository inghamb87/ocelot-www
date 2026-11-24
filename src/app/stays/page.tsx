import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { StayCard } from "@/components/StayCard";
import { Benefits } from "@/components/Benefits";
import { CtaBand } from "@/components/CtaBand";
import { properties } from "@/content/properties";

export const metadata: Metadata = {
  title: "Stays",
  description: "Design-led hotels, villas and residences chosen by Onyx. The same price as booking direct, with a person who confirms your room before you pay.",
  alternates: { canonical: "/stays" },
};

export default function StaysPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "Stays" }]}
        title="Stays"
        lede="A short list of hotels, villas and residences we know well. Each page says who the place suits and who it does not."
      />
      <section className="section section--tight" aria-label="All stays">
        <div className="wrap">
          {properties.map((p) => (
            <StayCard key={p.slug} property={p} headingLevel={2} />
          ))}
        </div>
      </section>
      <section className="section section--shell" aria-labelledby="stays-why">
        <div className="wrap stack stack--lg">
          <h2 id="stays-why" className="title-caps">
            Included with every stay
          </h2>
          <Benefits />
        </div>
      </section>
      <CtaBand title="Not sure which stay fits?" body="Tell us who is traveling and what matters. The Onyx concierge team will suggest the right room, villa or residence." />
    </>
  );
}
