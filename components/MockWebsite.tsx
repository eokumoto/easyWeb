"use client";

import { demoSites, type DemoSiteId } from "@/lib/demoSites";
import { healthPlusData } from "@/lib/healthPlusData";

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
        <div className="healthplus-brand-group">
          <div className="mock-logo healthplus-logo" aria-hidden="true">+</div>
          <div>
            <strong>HealthPlus Clinic</strong>
            <span>Compassionate care, close to home</span>
          </div>
        </div>
        <span className="mock-phone">Call: {healthPlusData.phone}</span>
      </header>
      <nav className="healthplus-nav" aria-label="HealthPlus page sections">
        <a href="#healthplus-appointments">Appointments</a>
        <a href="#healthplus-hours">Office hours</a>
        <a href="#healthplus-insurance">Insurance</a>
        <a href="#healthplus-services">Services</a>
        <a href="#healthplus-resources">Patient resources</a>
        <a href="#healthplus-contact">Contact</a>
      </nav>
      <section className="mock-hero healthplus-hero">
        <p className="mock-eyebrow">Welcome to HealthPlus</p>
        <h1>Care for every stage of life.</h1>
        <p>Primary care, preventive services, and patient resources from a team that knows your health history.</p>
        <div className="healthplus-hero-actions">
          <a className="healthplus-primary-link" href="#healthplus-appointments">Make an appointment</a>
          <a className="healthplus-secondary-link" href="#healthplus-contact">Find our clinic</a>
        </div>
      </section>

      <aside className="clinic-notice" aria-label="Clinic notice">
        <strong>Seasonal update:</strong> Flu shots are available during regular appointments. Call ahead for availability.
      </aside>

      <div className="healthplus-page-content">
        <section aria-labelledby="appointments-title" className="healthplus-content-section" id={healthPlusData.appointment.sectionId}>
          <SectionHeading eyebrow="Appointments" id="appointments-title" title="Plan your visit">
            New and returning patients can schedule by phone with our care team.
          </SectionHeading>
          <div className="appointment-panel">
            <div>
              <h3>Call to schedule</h3>
              <span className="large-phone-link">{healthPlusData.appointment.phone}</span>
              <p>{healthPlusData.appointment.note}</p>
            </div>
            <ul className="visit-list">
              <li>New patient visits</li><li>Annual wellness visits</li>
              <li>Follow-up appointments</li><li>Same-day sick visits when available</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="hours-title" className="healthplus-content-section section-tinted" id="healthplus-hours">
          <SectionHeading eyebrow="Before you visit" id="hours-title" title="Office hours" />
          <div className="hours-layout">
            <dl className="hours-list">
              <div><dt>Monday–Friday</dt><dd>8:00 AM–5:00 PM</dd></div>
              <div><dt>Saturday</dt><dd>9:00 AM–12:00 PM</dd></div>
              <div><dt>Sunday</dt><dd>Closed</dd></div>
            </dl>
            <div className="after-hours-note">
              <h3>Need care after hours?</h3>
              <p>Call 911 for a life-threatening emergency. For other urgent concerns, call the clinic and follow the recorded instructions.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="insurance-title" className="healthplus-content-section" id={healthPlusData.insurance.sectionId}>
          <SectionHeading eyebrow="Billing and coverage" id="insurance-title" title="Insurance information">
            We work with Medicare and many major insurance providers.
          </SectionHeading>
          <div className="insurance-layout">
            <div className="insurance-list" aria-label="Commonly accepted insurance plans">
              {healthPlusData.insurance.plans.map((plan) => <span key={plan}>✓ {plan}</span>)}
            </div>
            <p className="coverage-note"><strong>Before your visit:</strong> {healthPlusData.insurance.note}</p>
          </div>
        </section>

        <section aria-labelledby="services-title" className="healthplus-content-section section-tinted" id={healthPlusData.services.sectionId}>
          <SectionHeading eyebrow="What we offer" id="services-title" title="Primary care services" />
          <div className="clinic-service-grid">
            {healthPlusData.services.items.map((service) => (
              <div className="clinic-service" key={service}><span aria-hidden="true">+</span><h3>{service}</h3></div>
            ))}
          </div>
        </section>

        <section aria-labelledby="resources-title" className="healthplus-content-section" id={healthPlusData.resources.sectionId}>
          <SectionHeading eyebrow="Patient resources" id="resources-title" title="Information for your care" />
          <div className="resource-grid">
            <ResourceCard title="Prepare for your visit">Bring a photo ID, insurance card, medicine list, and any questions for your doctor.</ResourceCard>
            <ResourceCard title="Prescription renewals">Contact your pharmacy first. Please allow up to two business days for routine renewals.</ResourceCard>
            <ResourceCard title="Medical records">Call the clinic to ask for the records request form and processing information.</ResourceCard>
          </div>
        </section>

        <section aria-labelledby="contact-title" className="healthplus-content-section healthplus-contact" id={healthPlusData.contact.sectionId}>
          <SectionHeading eyebrow="Contact us" id="contact-title" title="HealthPlus Clinic" />
          <div className="contact-grid">
            <div><strong>Phone</strong><span>{healthPlusData.phone}</span></div>
            <div><strong>Address</strong><span>{healthPlusData.address}</span></div>
            <div><strong>Fax</strong><span>(555) 014-2299</span></div>
            <div><strong>Parking</strong><span>Free patient parking behind the clinic</span></div>
          </div>
        </section>
      </div>
    </article>
  );
}

function SectionHeading({ children, eyebrow, id, title }: { children?: React.ReactNode; eyebrow: string; id: string; title: string }) {
  return (
    <div className="section-heading">
      <p className="mock-eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function ResourceCard({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="resource-card"><h3>{title}</h3><p>{children}</p></div>
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
