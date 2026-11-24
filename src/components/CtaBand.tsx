import Link from "next/link";

export function CtaBand({
  title = "Tell us where you want to go",
  body = "Share your dates and who is traveling. The Onyx concierge team replies with stays that fit, and stays with you for the whole trip.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section section--navy" aria-labelledby="cta-band-title">
      <div className="wrap band">
        <div className="stack">
          <h2 id="cta-band-title">{title}</h2>
          <p className="lede">{body}</p>
        </div>
        <div className="cluster band__actions">
          <Link href="/concierge#plan" className="btn btn--light">
            Plan a trip
          </Link>
          <Link href="/stays" className="btn btn--outline-light">
            Explore stays
          </Link>
        </div>
      </div>
    </section>
  );
}
