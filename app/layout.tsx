import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.operonbathrooms.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Operon Bathrooms | Sydney Bathroom Renovation Planning",
    template: "%s | Operon Bathrooms"
  },
  description:
    "Plan a Sydney bathroom renovation with guidance-only estimate ranges, compliance prompts and next-step support.",
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <header className="site-header">
          <nav className="nav" aria-label="Main navigation">
            <Link className="brand" href="/">
              Operon Bathrooms
            </Link>
            <div className="nav-links">
              <Link href="/bathroom-renovation-cost-sydney">Cost guide</Link>
              <Link href="/services/full-bathroom-renovation">Services</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link className="button" href="/quote">
                Plan estimate
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <strong>Operon Bathrooms</strong>
            <div className="nav-links">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/quote">Planning estimate</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
