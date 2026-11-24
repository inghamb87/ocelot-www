import Link from "next/link";
import { PageHead } from "@/components/PageHead";

export default function NotFound() {
  return (
    <>
      <PageHead title="This page is not here" lede="The address may be mistyped, or the page may have moved." />
      <section className="section" aria-label="Where to go next">
        <div className="wrap cluster">
          <Link href="/" className="btn btn--primary">
            Go to the home page
          </Link>
          <Link href="/stays" className="btn btn--ghost">
            Explore stays
          </Link>
        </div>
      </section>
    </>
  );
}
