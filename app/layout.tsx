import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BathroomChatbot } from "@/components/BathroomChatbot";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.operonbathrooms.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Operon Bathrooms | Sydney bathroom estimates and quote review",
    template: "%s | Operon Bathrooms"
  },
  description:
    "Plan a Sydney bathroom renovation with guidance-only estimate ranges, quote review prompts and site-measure preparation.",
  openGraph: {
    title: "Operon Bathrooms | Sydney bathroom estimates and quote review",
    description:
      "Planning estimates, quote review and site-measure preparation for Sydney bathroom renovation projects.",
    url: siteUrl,
    siteName: "Operon Bathrooms",
    locale: "en_AU",
    type: "website"
  },
  alternates: {
    canonical: "/"
  }
};

const navLinks = [
  ["Estimate", "/quote"],
  ["Review quote", "/quote/review"],
  ["Costs", "/bathroom-renovation-cost-sydney"],
  ["How it works", "/how-it-works"],
  ["Guides", "/guides"],
  ["Areas", "/areas"],
  ["FAQ", "/faq"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Operon Bathrooms",
    url: siteUrl,
    areaServed: "Sydney NSW",
    description:
      "Bathroom renovation planning, quote review and site-measure preparation with guidance-only estimate ranges."
  };

  return (
    <html lang="en-AU">
      <body>
        <Script
          id="operon-bathrooms-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <header className="site-header">
          <nav className="nav" aria-label="Main navigation">
            <Link className="brand" href="/">
              Operon Bathrooms
            </Link>
            <div className="nav-links desktop-nav">
              {navLinks.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
              <Link href="/request-review">Request review</Link>
              <Link href="/site-measure">Site measure</Link>
              <Link className="button" href="/quote">
                Start estimate
              </Link>
            </div>
            <details className="mobile-menu">
              <summary>Menu</summary>
              <div className="nav-links">
                {navLinks.map(([label, href]) => (
                  <Link href={href} key={href}>
                    {label}
                  </Link>
                ))}
                <Link href="/request-review">Request review</Link>
                <Link href="/site-measure">Site measure</Link>
                <Link className="button" href="/quote">
                  Start estimate
                </Link>
              </div>
            </details>
          </nav>
        </header>
        <main>{children}</main>
        <BathroomChatbot />
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div>
                <strong>Operon Bathrooms</strong>
                <p>
                  Sydney bathroom renovation planning, quote review and site-measure preparation.
                </p>
              </div>
              <div className="footer-group">
                <h3>Quote & review</h3>
                <Link href="/quote">Start bathroom estimate</Link>
                <Link href="/quote/review">Review existing bathroom quote</Link>
                <Link href="/request-review">Request review</Link>
                <Link href="/bathroom-renovation-cost-sydney">Bathroom renovation cost Sydney</Link>
              </div>
              <div className="footer-group">
                <h3>Services</h3>
                <Link href="/services/full-bathroom-renovation">Full bathroom renovation</Link>
                <Link href="/services/bathroom-refresh">Bathroom refresh</Link>
                <Link href="/services/apartment-bathroom-renovation-sydney">Apartment bathroom renovation Sydney</Link>
                <Link href="/services/ensuite-renovation">Ensuite renovation</Link>
                <Link href="/services/small-bathroom-renovation">Small bathroom renovation</Link>
                <Link href="/services/laundry-bathroom-renovation">Laundry bathroom renovation</Link>
                <Link href="/site-measure">Site measure</Link>
              </div>
              <div className="footer-group">
                <h3>Guides</h3>
                <Link href="/guides">Bathroom renovation process</Link>
                <Link href="/guides#allowances">PC sums and provisional sums</Link>
                <Link href="/guides#waterproofing">Waterproofing and bathroom quotes</Link>
                <Link href="/guides#strata">Apartment bathroom strata review</Link>
                <Link href="/faq">FAQ</Link>
              </div>
              <div className="footer-group">
                <h3>Areas & company</h3>
                <Link href="/areas">Sydney areas</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms</Link>
              </div>
            </div>
            <p className="footer-disclaimer">
              Operon Bathrooms is a separate customer-facing bathroom renovation planning brand.
              Planning guidance only. Site measure, licensed trade checks and written scope
              confirmation are required before contract pricing.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
