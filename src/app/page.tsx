import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { StayCard } from "@/components/StayCard";
import { GuideCard } from "@/components/GuideCard";
import { CtaBand } from "@/components/CtaBand";
import { Art } from "@/components/Art";
import { JsonLd } from "@/components/JsonLd";
import { properties } from "@/content/properties";
import { guides } from "@/content/guides";
import { destinations } from "@/content/destinations";
import { pay, site } from "@/content/site";

export default function HomePage() {
  const nosara = destinations[0]!;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: site.name,
          url: site.url,
          description: site.description,
        }}
      />
      <Hero
        art={{ scene: "coast", seed: 7, alt: "A long Pacific beach with jungle behind it" }}
        title="Stays worth the journey, confirmed by a person"
        lede="Onyx is a travel guide and booking concierge for design-led hotels and villas. You pay the same price as booking direct. A real person confirms your room before you pay anything."
      >
        <Link href="/stays" className="btn btn--light">
          Explore stays
        </Link>
        <Link href="/concierge#plan" className="btn btn--outline-light">
          Plan a trip
        </Link>
      </Hero>
      <div className="ribbon">
        <div className="wrap">
          <p>
            <strong>{pay.ribbon}</strong>
          </p>
        </div>
      </div>

      <section className="section" aria-labelledby="why-title">
        <div className="wrap stack stack--xl">
          <div className="split">
            <h2 id="why-title" className="title-caps">
              Why book through Onyx
            </h2>
            <div className="split__body">
              <p className="lede">The same price you would pay anyway, with more.</p>
              <p className="soft">
                We do not compete on price. We add the things a booking engine cannot: a person who checks with the hotel, a concierge who plans the days around your stay, credit toward experiences and an upgrade request made for you.
              </p>
            </div>
          </div>
          <Benefits />
        </div>
      </section>

      <section className="section section--shell" aria-labelledby="stays-title">
        <div className="wrap">
          <div className="split">
            <h2 id="stays-title" className="title-caps">
              Stays
            </h2>
            <div className="split__body">
              <p className="lede">A short list, chosen with care. We would sooner tell you who a place does not suit than fill a page with every option.</p>
            </div>
          </div>
          <div className="mt-3">
            {properties.map((p) => (
              <StayCard key={p.slug} property={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--navy" aria-labelledby="how-title">
        <div className="wrap stack stack--xl">
          <div className="split">
            <h2 id="how-title" className="title-caps">
              How it works
            </h2>
            <div className="split__body">
              <p className="lede">Request to book is slower than an instant confirmation by design. A person checks before any money moves.</p>
            </div>
          </div>
          <ol className="steps">
            {pay.steps.map((s) => (
              <li key={s.title} className="step">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <p>
            <Link href="/how-it-works" className="btn btn--outline-light">
              Read how request to book works
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="dest-title">
        <div className="wrap split">
          <div className="stack">
            <h2 id="dest-title" className="title-caps">
              {nosara.name}, {nosara.country}
            </h2>
            <p className="label">Our first destination</p>
          </div>
          <div className="split__body">
            <Art art={nosara.heroArt} ratio="wide" />
            <p className="lede">{nosara.intro}</p>
            <p className="soft">Onyx begins on the Nicoya Peninsula, where we know the hotels, the drivers and the surf coaches by name. More destinations follow as we find stays we would send our own families to.</p>
            <p>
              <Link href={`/destinations/${nosara.slug}`} className="btn btn--ghost">
                Read the Nosara guide
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--stone" aria-labelledby="journal-title">
        <div className="wrap stack stack--lg">
          <div className="split">
            <h2 id="journal-title" className="title-caps">
              Journal
            </h2>
            <div className="split__body">
              <p className="lede">Practical guides for planning well: when to go, how to get there and how to choose where to stay.</p>
            </div>
          </div>
          <div className="grid-3">
            {guides.slice(0, 3).map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
          <p>
            <Link href="/journal" className="btn btn--ghost">
              Read all travel guides
            </Link>
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
