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
        <div className="public-header-actions">
          <nav className="public-nav" aria-label="Landing page sections">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#download">Download</a>
          </nav>
          <span className="prototype-badge">Hackathon prototype</span>
        </div>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">A calmer way to browse</p>
          <h1 id="landing-title">Browse the web with more confidence.</h1>
          <p className="landing-lead">
            EasyWeb is a browser that explains confusing websites, points out warning
            signs, and lets a trusted family member help when needed.
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
              <p>Ask a question and find the useful part of the page.</p>
            </div>
          </div>
          <div className="landing-preview-message warning-preview">
            <span aria-hidden="true">!</span>
            <div>
              <strong>Clear safety explanations</strong>
              <p>Understand why EasyWeb suggests slowing down.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="features" aria-labelledby="features-title">
        <p className="landing-eyebrow">Features</p>
        <h2 id="features-title">Support when it is useful. Independence always.</h2>
        <div className="how-it-works-grid">
          <article>
            <span aria-hidden="true">1</span>
            <h3>Understand</h3>
            <p>Get confusing websites explained in clear, familiar language.</p>
          </article>
          <article>
            <span aria-hidden="true">2</span>
            <h3>Stay Safe</h3>
            <p>Notice suspicious addresses, pressure tactics, and risky requests before continuing.</p>
          </article>
          <article>
            <span aria-hidden="true">3</span>
            <h3>Stay Independent</h3>
            <p>Ask a trusted family member for help only when you choose to.</p>
          </article>
        </div>
      </section>

      <section className="landing-demo-section" id="how-it-works" aria-labelledby="demo-section-title">
        <p className="landing-eyebrow">How it works</p>
        <h2 id="demo-section-title">See EasyWeb in action</h2>
        <div className="landing-demo-grid">
          <article>
            <div className="demo-preview-window healthcare-preview" aria-hidden="true">
              <div><span /><span /><span /><code>patient.healthplus.demo</code></div>
              <strong>HealthPlus Clinic</strong>
              <small>Show me on the page</small>
            </div>
            <h3>Understand a healthcare website</h3>
            <p>Ask a question and use “Show me on the page” to find the relevant information.</p>
          </article>
          <article>
            <div className="demo-preview-window store-preview" aria-hidden="true">
              <div><span /><span /><span /><code>shop.vitaglow.demo</code></div>
              <strong>Several warning signs found</strong>
              <small>Review before entering card details</small>
            </div>
            <h3>Recognize a suspicious online store</h3>
            <p>See clear explanations for urgency, vague refund terms, and risky payment requests.</p>
          </article>
          <article>
            <div className="demo-preview-window phishing-preview" aria-hidden="true">
              <div><span /><span /><span /><code>rob1ox.com</code></div>
              <strong>Notice the number 1</strong>
              <small>Did you mean roblox.com?</small>
            </div>
            <h3>Avoid a lookalike phishing page</h3>
            <p>EasyWeb points out a lookalike address before the user enters a password.</p>
          </article>
        </div>
      </section>

      <section className="landing-download" id="download" aria-labelledby="download-title">
        <div>
          <p className="landing-eyebrow">Available now in your browser</p>
          <h2 id="download-title">Download EasyWeb</h2>
          <p>
            EasyWeb is currently available as a browser-based hackathon prototype.
            A future version is planned as a downloadable desktop app for Windows and macOS.
          </p>
          <span className="desktop-planned-badge">Desktop app planned for Windows and macOS</span>
        </div>
        <div className="landing-actions">
          <Link className="landing-primary-action" href="/browser">Launch Browser Prototype</Link>
          <Link className="landing-secondary-action" href="/helper">Open Helper Companion</Link>
        </div>
      </section>

      <aside className="landing-prototype-note">
        <strong>Prototype notice</strong>
        <span>
          This prototype demonstrates EasyWeb using carefully designed demo websites
          and deterministic guidance. Future versions are planned to support live
          websites with AI-powered assistance.
        </span>
      </aside>

      <footer className="public-footer">
        <div>
          <span className="public-brand footer-brand"><span aria-hidden="true">e</span>EasyWeb</span>
          <p>Browse with more confidence.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#download">Download</a>
        </nav>
      </footer>
    </main>
  );
}
