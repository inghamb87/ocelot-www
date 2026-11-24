import Link from "next/link";
import type { Property } from "@/content/properties";
import { usd } from "@/lib/format";
import { Art } from "./Art";

export function StayCard({ property, headingLevel = 3 }: { property: Property; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className="stay-card">
      <div className="stay-card__media">
        <Art art={property.heroArt} ratio="landscape" />
      </div>
      <div className="stay-card__body">
        <p className="label">
          {property.place}, {property.country}
        </p>
        <H className="card__title">
          <Link href={`/stays/${property.slug}`}>{property.name}</Link>
        </H>
        <p>{property.cardSummary}</p>
        <ul className="meta-list">
          <li>{property.kindLabel}</li>
          <li>{property.fromRate ? `From ${usd(property.fromRate.amount)} per night` : "Rate confirmed with your request"}</li>
        </ul>
        <p>
          <Link href={`/stays/${property.slug}`} className="btn btn--ghost">
            View {property.shortName}
          </Link>
        </p>
      </div>
    </article>
  );
}
