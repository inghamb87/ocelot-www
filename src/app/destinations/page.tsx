import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Art } from "@/components/Art";
import { CtaBand } from "@/components/CtaBand";
import { destinations } from "@/content/destinations";
import { properties } from "@/content/properties";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Where Onyx plans and books travel. We start in Nosara, Costa Rica, and add destinations as we find stays worth recommending.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "Destinations" }]}
        title="Destinations"
        lede="We add a destination only when we know its hotels, drivers and guides well enough to vouch for them. We start in Costa Rica."
      />
      <section className="section section--tight" aria-label="All destinations">
        <div className="wrap">
          {destinations.map((d) => {
            const count = properties.filter((p) => p.destinationSlug === d.slug).length;
            return (
              <article key={d.slug} className="stay-card">
                <div className="stay-card__media">
                  <Art art={d.heroArt} ratio="landscape" />
                </div>
                <div className="stay-card__body">
                  <p className="label">{d.country}</p>
                  <h2 className="card__title">
                    <Link href={`/destinations/${d.slug}`}>{d.name}</Link>
                  </h2>
                  <p>{d.intro}</p>
                  <ul className="meta-list" role="list">
                    <li>
                      {count} Onyx {count === 1 ? "stay" : "stays"}
                    </li>
                    <li>{d.guideSlugs.length} travel guides</li>
                  </ul>
                  <p>
                    <Link href={`/destinations/${d.slug}`} className="btn btn--ghost">
                      Read the {d.name} guide
                    </Link>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="section section--shell" aria-labelledby="elsewhere-title">
        <div className="wrap split">
          <h2 id="elsewhere-title" className="title-caps">
            Going somewhere else?
          </h2>
          <div className="split__body">
            <p className="lede">The Onyx concierge team plans trips beyond the destinations listed here. Tell us where you are headed and we will say plainly whether we can help.</p>
            <p>
              <Link href="/concierge#plan" className="btn btn--primary">
                Plan a trip
              </Link>
            </p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
