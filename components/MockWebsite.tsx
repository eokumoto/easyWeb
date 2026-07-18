"use client";

import { demoSites, type DemoSiteId } from "@/lib/demoSites";

export function MockWebsite({ siteId }: { siteId: DemoSiteId }) {
  if (siteId === "healthplus") return <HealthPlusSite />;
  if (siteId === "pharmacy") return <PharmacySite />;
  return <UtilitySite />;
}

function DemoBanner({ siteId }: { siteId: DemoSiteId }) {
  return (
    <div className="demo-banner" role="status">
      <strong>Demo website</strong>
      <span>
        This controlled page represents {demoSites[siteId].name}. No personal
        information is collected.
      </span>
    </div>
  );
}

function HealthPlusSite() {
  return (
    <article className="mock-site healthplus-site">
      <DemoBanner siteId="healthplus" />
      <header className="mock-site-header">
        <div className="mock-logo healthplus-logo" aria-hidden="true">+</div>
        <div>
          <strong>HealthPlus Clinic</strong>
          <span>Compassionate care, close to home</span>
        </div>
        <span className="mock-phone">Call: (555) 014-2200</span>
      </header>
      <section className="mock-hero healthplus-hero">
        <p className="mock-eyebrow">Welcome to HealthPlus</p>
        <h1>We&apos;re here to help you feel your best.</h1>
        <p>Primary care and helpful guidance from a team that knows you.</p>
        <div className="information-pill">
          To make an appointment, call <strong>(555) 014-2200</strong>.
        </div>
      </section>
      <section className="mock-section" aria-labelledby="health-services">
        <h2 id="health-services">How can we help?</h2>
        <div className="service-grid">
          <InfoCard icon="🩺" title="Primary care">Regular visits and wellness checks</InfoCard>
          <InfoCard icon="🕘" title="Office hours">Monday–Friday, 8:00 AM–5:00 PM</InfoCard>
          <InfoCard icon="📍" title="Our location">125 Garden Avenue, Springfield</InfoCard>
        </div>
      </section>
    </article>
  );
}

function PharmacySite() {
  return (
    <article className="mock-site pharmacy-site">
      <DemoBanner siteId="pharmacy" />
      <header className="mock-site-header">
        <div className="mock-logo pharmacy-logo" aria-hidden="true">Rx</div>
        <div>
          <strong>Neighborhood Pharmacy</strong>
          <span>Friendly care from people you know</span>
        </div>
        <span className="mock-phone">Call: (555) 018-4400</span>
      </header>
      <section className="mock-hero pharmacy-hero">
        <p className="mock-eyebrow">Your local pharmacy</p>
        <h1>Medicine support made simple.</h1>
        <p>Speak with a pharmacist or check today&apos;s store information.</p>
        <div className="information-pill">
          For refills, call <strong>(555) 018-4400</strong>. Have your prescription
          bottle nearby.
        </div>
      </section>
      <section className="mock-section" aria-labelledby="pharmacy-services">
        <h2 id="pharmacy-services">Pharmacy information</h2>
        <div className="service-grid">
          <InfoCard icon="💊" title="Prescription refills">Call us and a pharmacist will guide you</InfoCard>
          <InfoCard icon="🕘" title="Open today">8:00 AM–7:00 PM</InfoCard>
          <InfoCard icon="🚗" title="Free delivery">Available within five miles</InfoCard>
        </div>
      </section>
    </article>
  );
}

function UtilitySite() {
  return (
    <article className="mock-site utility-site">
      <DemoBanner siteId="utility" />
      <header className="mock-site-header">
        <div className="mock-logo utility-logo" aria-hidden="true">⚡</div>
        <div>
          <strong>City Electric Utility</strong>
          <span>Reliable service for our community</span>
        </div>
        <span className="mock-phone">Call: (555) 012-1000</span>
      </header>
      <section className="mock-hero utility-hero">
        <p className="mock-eyebrow">Sample monthly statement</p>
        <h1>Your electric bill</h1>
        <p>This sample shows how EasyWeb can explain a utility statement.</p>
        <div className="bill-summary">
          <div><span>Sample balance</span><strong>$84.20</strong></div>
          <div><span>Sample due date</span><strong>August 5</strong></div>
        </div>
        <div className="payment-warning">
          <strong>Payments are disabled in this demo.</strong>
          EasyWeb will never pay a bill or submit financial information for you.
        </div>
      </section>
      <section className="mock-section" aria-labelledby="utility-help">
        <h2 id="utility-help">Need billing help?</h2>
        <div className="service-grid">
          <InfoCard icon="☎️" title="Call billing support">(555) 012-1000</InfoCard>
          <InfoCard icon="🕘" title="Support hours">Monday–Friday, 7:30 AM–6:00 PM</InfoCard>
          <InfoCard icon="🧾" title="Have your bill nearby">A representative may ask for the sample account number</InfoCard>
        </div>
      </section>
    </article>
  );
}

function InfoCard({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: string;
  title: string;
}) {
  return (
    <div className="info-card">
      <span className="info-card-icon" aria-hidden="true">{icon}</span>
      <div><h3>{title}</h3><p>{children}</p></div>
    </div>
  );
}

export function SearchResults({
  onNavigate,
  query,
}: {
  onNavigate: (siteId: DemoSiteId) => void;
  query: string;
}) {
  return (
    <article className="search-page">
      <div className="demo-banner" role="status">
        <strong>Safe demo search</strong>
        <span>Results are selected by EasyWeb for this prototype.</span>
      </div>
      <div className="search-content">
        <p className="mock-eyebrow">Search results</p>
        <h1>Results for “{query}”</h1>
        <p className="search-explanation">
          These controlled results stay inside EasyWeb. Choose one to continue.
        </p>
        <div className="search-results-list">
          {(Object.keys(demoSites) as DemoSiteId[]).map((siteId) => {
            const site = demoSites[siteId];
            return (
              <button key={site.id} onClick={() => onNavigate(siteId)} type="button">
                <span className="result-address">🔒 {site.address}</span>
                <strong>{site.name}</strong>
                <span>Open this controlled demo website inside EasyWeb.</span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
