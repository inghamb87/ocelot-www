import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Benefits } from "@/components/Benefits";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { bookingFaq } from "@/content/faq";
import { confirmationPromise, pay } from "@/content/site";

export const metadata: Metadata = {
  title: "How request to book works",
  description: "How booking through Onyx works: send a request, a person confirms with the hotel, and you pay only once your room is confirmed.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: bookingFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHead crumbs={[{ label: "How it works" }]} title="How request to book works" lede={pay.ribbon} />
      <section className="section section--navy" aria-labelledby="steps-title">
        <div className="wrap stack stack--xl">
          <h2 id="steps-title" className="title-caps">
            Three steps
          </h2>
          <ol className="steps">
            {pay.steps.map((s) => (
              <li key={s.title} className="step">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section" aria-labelledby="states-title">
        <div className="wrap split">
          <h2 id="states-title" className="title-caps">
            What you will hear from us
          </h2>
          <div className="split__body">
            <dl className="rows">
              <div>
                <dt>Request received</dt>
                <dd>
                  We email you a copy of your request right away. {confirmationPromise()} {pay.pending}
                </dd>
              </div>
              <div>
                <dt>Confirmed</dt>
                <dd>{pay.confirmed}</dd>
              </div>
              <div>
                <dt>Not available</dt>
                <dd>{pay.unavailable}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section className="section section--shell" aria-labelledby="hiw-why">
        <div className="wrap stack stack--lg">
          <div className="split">
            <h2 id="hiw-why" className="title-caps">
              What you get
            </h2>
            <div className="split__body">
              <p className="lede">The same price you would pay anyway, with more.</p>
            </div>
          </div>
          <Benefits />
        </div>
      </section>
      <section className="section" aria-labelledby="hiw-faq">
        <div className="wrap split">
          <h2 id="hiw-faq" className="title-caps">
            Questions
          </h2>
          <div className="split__body">
            <Faq items={bookingFaq} />
            <p className="mt-2">
              <Link href="/stays" className="btn btn--primary">
                Explore stays
              </Link>
            </p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
