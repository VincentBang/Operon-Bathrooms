import Link from "next/link";
import React from "react";

type SeoPageProps = {
  title: string;
  intro: string;
  bullets: string[];
  children?: React.ReactNode;
};

export function SeoPage({ title, intro, bullets, children }: SeoPageProps) {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="pill">Sydney bathroom planning</p>
            <h1>{title}</h1>
            <p className="lead">{intro}</p>
            <Link className="button" href="/quote">
              Start planning estimate
            </Link>
          </div>
          <div className="panel">
            <h2>Planning guide only</h2>
            <p>
              The wizard provides an indicative range and confidence score. It is not a final quote,
              contract, compliance certificate or legal advice.
            </p>
            <ul>
              <li>NSW licence prompt for work over $5k.</li>
              <li>NSW deposit prompt: generally limited to 10%.</li>
              <li>NSW HBCF prompt for residential work over $20k.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container two-col">
          <div>
            <h2>What this page covers</h2>
            <ul>
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div>{children}</div>
        </div>
      </section>
    </>
  );
}
