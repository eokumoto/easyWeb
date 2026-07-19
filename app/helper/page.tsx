import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EasyWeb Companion — Prototype",
  description: "A preview of trusted family support for EasyWeb.",
};

export default function HelperPage() {
  return (
    <main className="companion-page">
      <header className="companion-header">
        <Link className="public-brand" href="/" aria-label="EasyWeb landing page">
          <span aria-hidden="true">e</span>
          EasyWeb
        </Link>
        <span className="prototype-badge">Prototype placeholder</span>
      </header>

      <section className="companion-card" aria-labelledby="companion-title">
        <div className="companion-icon" aria-hidden="true">+</div>
        <p className="landing-eyebrow">EasyWeb Companion</p>
        <h1 id="companion-title">Trusted family support is coming next.</h1>
        <p className="companion-intro">
          Helpers will eventually connect to an EasyWeb browser using a simple
          four-digit pairing code. Pairing is not active in this prototype.
        </p>
        <div className="pairing-preview">
          <label htmlFor="pairing-code-preview">Four-digit pairing code preview</label>
          <input
            aria-describedby="pairing-preview-note"
            disabled
            id="pairing-code-preview"
            inputMode="numeric"
            maxLength={4}
            placeholder="0000"
            type="text"
          />
          <span id="pairing-preview-note">Preview only — no code can be entered or submitted.</span>
        </div>
        <Link className="companion-return" href="/">Return to EasyWeb</Link>
      </section>
    </main>
  );
}
