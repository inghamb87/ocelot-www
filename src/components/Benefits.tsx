import { benefits } from "@/content/site";
import { BenefitsToggle } from "./BenefitsToggle";

/** "Why book through Onyx": the four reasons. On small screens the detail
 *  folds away behind a button, but the no-charge panel always stays open. */
export function Benefits({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <BenefitsToggle>
      {benefits.map((b, i) => (
        <div key={b.id} className={`benefit${i === 0 ? " benefit--lead" : ""}`}>
          <H>{b.title}</H>
          <p>{b.body}</p>
        </div>
      ))}
    </BenefitsToggle>
  );
}
