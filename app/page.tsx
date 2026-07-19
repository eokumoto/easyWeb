import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EasyWeb — Browse with more confidence",
  description: "A calmer, clearer browsing experience for older adults and anyone who wants extra guidance online.",
};

export default function LandingPage() {
  return (
    <main className="public-landing">
      <header className="public-header">
        <Link className="public-brand" href="/" aria-label="EasyWeb landing page">
          <span aria-hidden="true">e</span>
          EasyWeb
        </Link>
        <span className="prototype-badge">Hackathon prototype</span>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">A calmer way to browse</p>
          <h1 id="landing-title">The internet, with a little more clarity.</h1>
          <p className="landing-lead">
            EasyWeb helps older adults and less-confident technology users understand
            websites, notice warning signs, and decide what to do next.
          </p>
          <div className="landing-actions">
            <Link className="landing-primary-action" href="/browser">Launch EasyWeb</Link>
            <Link className="landing-secondary-action" href="/helper">Open Helper Companion</Link>
          </div>
        </div>

        <div className="landing-preview" aria-label="Example EasyWeb guidance">
          <div className="landing-preview-bar">
            <span aria-hidden="true">e</span>
            <strong>EasyWeb guidance</strong>
          </div>
          <div className="landing-preview-message">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Plain-language help</strong>
              <p>Understand what a page is asking before you continue.</p>
            </div>
          </div>
          <div className="landing-preview-message warning-preview">
            <span aria-hidden="true">!</span>
            <div>
              <strong>Clear safety explanations</strong>
              <p>See why something deserves a closer look.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <p className="landing-eyebrow">How it works</p>
        <h2 id="how-it-works-title">Support when it is useful. Independence always.</h2>
        <div className="how-it-works-grid">
          <article>
            <span aria-hidden="true">1</span>
            <h3>Understand</h3>
            <p>Get confusing websites explained in clear, familiar language.</p>
          </article>
          <article>
            <span aria-hidden="true">2</span>
            <h3>Recognize</h3>
            <p>Notice warning signs before sharing passwords or payment information.</p>
          </article>
          <article>
            <span aria-hidden="true">3</span>
            <h3>Ask someone trusted</h3>
            <p>Reach out for family support when a second opinion would help.</p>
          </article>
        </div>
      </section>

      <aside className="landing-prototype-note">
        <strong>Built as a hackathon prototype.</strong>
        <span>EasyWeb currently uses controlled demo websites and scripted guidance.</span>
      </aside>

      <footer className="public-footer">
        <span className="public-brand footer-brand"><span aria-hidden="true">e</span>EasyWeb</span>
        <p>Browse with more confidence.</p>
      </footer>
    </main>
  );
}
