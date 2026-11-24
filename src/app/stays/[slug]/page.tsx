import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Art } from "@/components/Art";
import { Benefits } from "@/components/Benefits";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RequestToBook } from "@/components/RequestToBook";
import { RoomRequestButton } from "@/components/RoomRequestButton";
import { StickyCta } from "@/components/StickyCta";
import { StayCard } from "@/components/StayCard";
import { getProperty, properties } from "@/content/properties";
import { getDestination } from "@/content/destinations";
import { bookingFaq } from "@/content/faq";
import { benefits, pay, site } from "@/content/site";
import { usd } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) return {};
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: `/stays/${p.slug}` },
    openGraph: { title: p.seo.title, description: p.seo.description, url: `/stays/${p.slug}` },
  };
}

const KIND_NOUN = { room: "room", suite: "suite", villa: "villa", residence: "residence" } as const;

export default async function StayPage({ params }: Params) {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) notFound();

  const destination = getDestination(p.destinationSlug);
  const others = properties.filter((o) => o.slug !== p.slug);
  const faq = [...p.faq, ...bookingFaq];
  const hasVillas = p.rooms.some((r) => r.kind === "villa");
  const roomsTitle = hasVillas ? "Rooms and villas" : p.rooms.every((r) => r.kind === "residence") ? "Residences" : "Rooms";
  const creditIdeas = hasVillas ? "surf lessons, guided wildlife or a private chef" : "surf lessons, boat trips or a private chef";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: p.name,
          description: p.hook,
          url: `${site.url}/stays/${p.slug}`,
          address: { "@type": "PostalAddress", addressLocality: "Nosara", addressRegion: p.region, addressCountry: "CR" },
          ...(p.fromRate ? { priceRange: `From ${usd(p.fromRate.amount)} per night` } : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Stays", item: `${site.url}/stays` },
            { "@type": "ListItem", position: 2, name: p.name, item: `${site.url}/stays/${p.slug}` },
          ],
        }}
      />

      {/* 1. Hero */}
      <Hero art={p.heroArt} place={`${p.place}, ${p.country}`} title={p.h1} lede={p.hook}>
        <a href="#request" className="btn btn--light">
          Request to book
        </a>
        <a href="#rooms" className="btn btn--outline-light">
          See {roomsTitle.toLowerCase()}
        </a>
      </Hero>
      <div className="ribbon">
        <div className="wrap">
          <p>
            <strong>{pay.ribbon}</strong>
          </p>
        </div>
      </div>

      {/* 2. At a glance */}
      <section className="glance" aria-labelledby="glance-title">
        <div className="wrap glance__grid">
          <h2 id="glance-title" className="visually-hidden">
            {p.shortName} at a glance
          </h2>
          <dl className="facts">
            {p.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
            <div>
              <dt>Price</dt>
              <dd className="price">{p.fromRate ? `From ${usd(p.fromRate.amount)}` : "On request"}</dd>
              <dd className="small soft">{p.fromRate ? "per night, same as booking direct" : "same as booking direct"}</dd>
            </div>
          </dl>
          <div className="glance__chips">
            <h3 className="visually-hidden">Included when you book through Onyx</h3>
            <ul className="chips">
              {benefits.map((b) => (
                <li key={b.id} className="chip">
                  {b.chip}
                </li>
              ))}
            </ul>
          </div>
          {p.ratings.display ? (
            <p className="small soft">
              Guest ratings: {p.ratings.items.map((r) => `${r.score} on ${r.source}`).join(", ")}. {p.ratings.note}
            </p>
          ) : null}
        </div>
      </section>

      {/* 3. Why book this stay through Onyx */}
      <section className="section" id="why-onyx" aria-labelledby="why-title">
        <div className="wrap stack stack--lg">
          <div className="split">
            <h2 id="why-title" className="title-caps">
              Why book {p.shortName} through Onyx
            </h2>
            <div className="split__body">
              <p className="lede">The same price you would pay anyway, with more.</p>
            </div>
          </div>
          <Benefits />
        </div>
      </section>

      {/* 4. Tour */}
      <section className="section section--shell" aria-labelledby="tour-title">
        <div className="stack stack--lg">
          <div className="wrap split">
            <h2 id="tour-title" className="title-caps">
              A look around
            </h2>
            <div className="split__body">
              <p className="lede">{p.tour.intro}</p>
            </div>
          </div>
          <div className="tour" role="region" aria-label={`${p.shortName} picture tour. Scroll sideways for more.`} tabIndex={0}>
            {p.tour.scenes.map((s) => (
              <div key={s.title}>
                <Art art={s} ratio="landscape" />
                <div className="tour__cap">
                  <h3>{s.title}</h3>
                  <p>{s.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The honest read */}
      <section className="section" aria-labelledby="honest-title">
        <div className="wrap stack stack--lg">
          <div className="split">
            <h2 id="honest-title" className="title-caps">
              The honest read
            </h2>
            <div className="split__body">
              <p className="lede">{p.honest.intro}</p>
            </div>
          </div>
          <div className="fit">
            <div className="fit--yes">
              <h3>{p.shortName} suits</h3>
              <ul role="list">
                {p.honest.goodFor.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="fit--no">
              <h3>Look elsewhere for</h3>
              <ul role="list">
                {p.honest.notFor.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="notes">
            {p.honest.expectations.map((x) => (
              <div key={x.title} className="note">
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Rooms and villas */}
      <section className="section section--stone" id="rooms" aria-labelledby="rooms-title">
        <div className="wrap">
          <div className="split">
            <h2 id="rooms-title" className="title-caps">
              {roomsTitle}
            </h2>
            <div className="split__body">
              <p className="lede">{p.roomsIntro}</p>
            </div>
          </div>
          <div className="mt-3">
            {p.rooms.map((r) => (
              <article key={r.id} className={`room${r.featured ? " room--featured" : ""}`}>
                <Art art={r.art} ratio="landscape" />
                <div className="room__body">
                  <h3>{r.name}</h3>
                  <ul className="meta-list" role="list">
                    {r.specs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <p>{r.blurb}</p>
                  <ul className="ticks" role="list">
                    {r.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="room__cta">
                  <RoomRequestButton roomId={r.id} label={`Request this ${KIND_NOUN[r.kind]}`} primary={r.featured} />
                </div>
              </article>
            ))}
          </div>
          <div className="notice mt-2">
            <p>{p.groupNote}</p>
          </div>
        </div>
      </section>

      {/* 7. Location and the wider trip */}
      <section className="section" aria-labelledby="location-title">
        <div className="wrap stack stack--lg">
          <div className="split">
            <h2 id="location-title" className="title-caps">
              Location and the wider trip
            </h2>
            <div className="split__body">
              <p className="lede">{p.location.intro}</p>
            </div>
          </div>
          <div className="grid-2">
            <div className="stack">
              <h3>Getting there</h3>
              <dl className="rows">
                {p.location.logistics.map((l) => (
                  <div key={l.label}>
                    <dt>{l.label}</dt>
                    <dd>{l.value}</dd>
                  </div>
                ))}
              </dl>
              <p>
                <Link href="/journal/getting-to-nosara">Getting to Nosara: flights, transfers and roads</Link>
              </p>
            </div>
            <div className="stack">
              <h3>A sample week</h3>
              <ol className="days rows" role="list">
                {p.location.week.map((d) => (
                  <li key={d.day}>
                    <span>{d.day}</span>
                    <span>{d.plan}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="split">
            <h3>Beyond {destination?.name ?? "the hotel"}</h3>
            <div className="split__body">
              <p>{p.location.widerTrip}</p>
              <p className="soft">Your concierge can arrange: {p.experiences.join(", ").toLowerCase()}.</p>
              <div className="cluster">
                {destination ? (
                  <Link href={`/destinations/${destination.slug}`} className="btn btn--ghost">
                    Read the {destination.name} guide
                  </Link>
                ) : null}
                <Link href="/journal/planning-a-multi-stop-costa-rica-trip" className="text-link">
                  Planning a multi-stop Costa Rica trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Proof and reassurance */}
      <section className="section section--navy" aria-labelledby="proof-title">
        <div className="wrap stack stack--xl">
          <div className="split">
            <h2 id="proof-title" className="title-caps">
              What guests say
            </h2>
            <div className="split__body">
              <dl className="rows">
                {p.proof.themes.map((t) => (
                  <div key={t.title}>
                    <dt>{t.title}</dt>
                    <dd>{t.body}</dd>
                  </div>
                ))}
              </dl>
              <p className="small soft">Themes summarized by Onyx from public guest reviews.</p>
              {p.proof.recognition.length ? (
                <>
                  <h3 className="mt-2">Recognition</h3>
                  <ul className="ticks" role="list">
                    {p.proof.recognition.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  {p.proof.recognitionNote ? <p className="small soft">{p.proof.recognitionNote}</p> : null}
                </>
              ) : null}
            </div>
          </div>
          <div className="stack stack--lg">
            <h3>How booking through Onyx works</h3>
            <ol className="steps">
              {pay.steps.map((s) => (
                <li key={s.title} className="step">
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 9. Request to book */}
      <section className="section section--shell" id="request" aria-labelledby="request-title">
        <div className="wrap stack stack--lg">
          <div className="split">
            <h2 id="request-title" className="title-caps" tabIndex={-1}>
              Request to book
            </h2>
            <div className="split__body">
              <p className="lede">{pay.ribbon}</p>
            </div>
          </div>
          <RequestToBook
            property={{
              slug: p.slug,
              name: p.name,
              shortName: p.shortName,
              fromRate: p.fromRate,
              rooms: p.rooms.map((r) => ({ id: r.id, name: r.name })),
              groupNote: p.groupNote,
              creditIdeas,
            }}
          />
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="section" aria-labelledby="faq-title">
        <div className="wrap split">
          <h2 id="faq-title" className="title-caps">
            Questions
          </h2>
          <div className="split__body">
            <Faq items={faq} />
            <p className="mt-2">
              Something else? <Link href="/contact">Contact the Onyx concierge team</Link>.
            </p>
          </div>
        </div>
      </section>

      {others.length ? (
        <section className="section section--stone" aria-labelledby="others-title">
          <div className="wrap">
            <h2 id="others-title" className="title-caps">
              Also in {destination?.name ?? p.country}
            </h2>
            <div className="mt-2">
              {others.map((o) => (
                <StayCard key={o.slug} property={o} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <StickyCta label="Request to book" note={pay.submitNote} />
    </>
  );
}
