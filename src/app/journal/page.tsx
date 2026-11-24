import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { GuideCard } from "@/components/GuideCard";
import { CtaBand } from "@/components/CtaBand";
import { guides } from "@/content/guides";

export const metadata: Metadata = {
  title: "Journal: travel guides",
  description: "Practical travel guides from Onyx: when to go, how to get there, where to stay and how to plan a trip with more than one stop.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <>
      <PageHead crumbs={[{ label: "Journal" }]} title="Journal" lede="Practical guides for planning well. Written plainly, updated when things change." />
      <section className="section" aria-label="All travel guides">
        <div className="wrap grid-3">
          {guides.map((g) => (
            <GuideCard key={g.slug} guide={g} headingLevel={2} />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
