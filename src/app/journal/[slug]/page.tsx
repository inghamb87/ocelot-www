import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { Art } from "@/components/Art";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { getGuide, guides } from "@/content/guides";
import { site } from "@/content/site";
import { longDate } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.summary,
    alternates: { canonical: `/journal/${g.slug}` },
    openGraph: { type: "article", title: g.title, description: g.summary, url: `/journal/${g.slug}`, modifiedTime: g.updated },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.summary,
          dateModified: g.updated,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
          mainEntityOfPage: `${site.url}/journal/${g.slug}`,
        }}
      />
      <PageHead crumbs={[{ href: "/journal", label: "Journal" }, { label: g.title }]} label={g.category} title={g.title} lede={g.summary}>
        <p className="small soft mt-1">
          {g.minutes} minute read. Updated <time dateTime={g.updated}>{longDate(g.updated)}</time>.
        </p>
      </PageHead>
      <article className="section">
        <div className="wrap article">
          <div className="stack stack--lg">
            <Art art={g.art} ratio="wide" />
            <div className="prose">
              {g.sections.map((s) => (
                <section key={s.title} className="prose" aria-label={s.title}>
                  <h2>{s.title}</h2>
                  {s.body.map((b, i) => (
                    <p key={i}>{b}</p>
                  ))}
                  {s.list ? (
                    <ul>
                      {s.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
          <aside className="article__aside stack" aria-label="Related">
            <div className="aside-box">
              <h2 className="label">Keep reading</h2>
              <ul className="link-list" role="list">
                {g.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>{r.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aside-box">
              <h2 className="label">Want this planned for you?</h2>
              <p>The Onyx concierge team books the stay, the transfers and the days in between.</p>
              <p>
                <Link href="/concierge#plan" className="btn btn--primary btn--block">
                  Plan a trip
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
