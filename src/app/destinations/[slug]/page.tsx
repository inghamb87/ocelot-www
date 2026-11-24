import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { StayCard } from "@/components/StayCard";
import { GuideCard } from "@/components/GuideCard";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { destinations, getDestination } from "@/content/destinations";
import { properties } from "@/content/properties";
import { guides } from "@/content/guides";
import { site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  return { title: d.seo.title, description: d.seo.description, alternates: { canonical: `/destinations/${d.slug}` } };
}

export default async function DestinationPage({ params }: Params) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();
  const stays = properties.filter((p) => p.destinationSlug === d.slug);
  const related = guides.filter((g) => d.guideSlugs.includes(g.slug));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: `${d.name}, ${d.country}`,
          description: d.intro,
          url: `${site.url}/destinations/${d.slug}`,
        }}
      />
      <Hero art={d.heroArt} place={d.country} title={`${d.name} travel guide`} lede={d.intro}>
        <a href="#stays" className="btn btn--light">
          See stays in {d.name}
        </a>
      </Hero>

      <section className="glance" aria-labelledby="dest-glance">
        <div className="wrap glance__grid">
          <h2 id="dest-glance" className="visually-hidden">
            {d.name} at a glance
          </h2>
          <dl className="facts">
            {d.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {d.sections.map((s, i) => (
        <section key={s.title} className={`section${i % 2 ? " section--shell" : ""}`} aria-labelledby={`dest-s-${i}`}>
          <div className="wrap split">
            <h2 id={`dest-s-${i}`} className="title-caps">
              {s.title}
            </h2>
            <div className="split__body">
              {s.body.map((b, j) => (
                <p key={j} className={j === 0 ? "lede" : undefined}>
                  {b}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section section--navy" aria-labelledby="todo-title">
        <div className="wrap stack stack--lg">
          <h2 id="todo-title" className="title-caps">
            Things to do in {d.name}
          </h2>
          <dl className="rows">
            {d.thingsToDo.map((t) => (
              <div key={t.title}>
                <dt>{t.title}</dt>
                <dd>{t.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" id="stays" aria-labelledby="dest-stays">
        <div className="wrap">
          <h2 id="dest-stays" className="title-caps">
            Where to stay in {d.name}
          </h2>
          <div className="mt-2">
            {stays.map((p) => (
              <StayCard key={p.slug} property={p} />
            ))}
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section section--stone" aria-labelledby="dest-guides">
          <div className="wrap stack stack--lg">
            <h2 id="dest-guides" className="title-caps">
              Plan your {d.name} trip
            </h2>
            <div className="grid-4">
              {related.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
