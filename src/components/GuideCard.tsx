import Link from "next/link";
import type { Guide } from "@/content/guides";
import { Art } from "./Art";

export function GuideCard({ guide, headingLevel = 3 }: { guide: Guide; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className="card">
      <Art art={guide.art} ratio="landscape" decorative />
      <div className="card__body">
        <p className="label">
          {guide.category}, {guide.minutes} minute read
        </p>
        <H className="card__title">
          <Link href={`/journal/${guide.slug}`}>{guide.title}</Link>
        </H>
        <p className="soft">{guide.summary}</p>
      </div>
    </article>
  );
}
