import { PageHead } from "./PageHead";

export function LegalPage({ title, lede, updated, children }: { title: string; lede: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHead crumbs={[{ label: title }]} title={title} lede={lede}>
        <p className="small soft mt-1">Last updated {updated}.</p>
      </PageHead>
      <section className="section" aria-label={title}>
        <div className="wrap">
          <div className="prose measure">{children}</div>
        </div>
      </section>
    </>
  );
}
