"use client";

import { useEffect, useRef, useState } from "react";
import { useHelperConnection } from "@/components/HelperConnectionProvider";
import { demoSites, type DemoSiteId } from "@/lib/demoSites";
import { healthPlusData } from "@/lib/healthPlusData";

export function MockWebsite({
  onLeaveSite,
  onNavigate,
  siteId,
}: {
  onLeaveSite: () => void;
  onNavigate: (siteId: DemoSiteId) => void;
  siteId: DemoSiteId;
}) {
  if (siteId === "healthplus") return <HealthPlusSite />;
  if (siteId === "pharmacy") return <PharmacySite />;
  if (siteId === "vitaglow") return <VitaGlowSite onLeaveSite={onLeaveSite} />;
  if (siteId === "robloxLookalike") {
    return <LookalikeSite onLeaveSite={onLeaveSite} onNavigate={onNavigate} />;
  }
  if (siteId === "robloxSafe") return <RobloxSafeDestination />;
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

function VitaGlowSite({ onLeaveSite }: { onLeaveSite: () => void }) {
  const { createHelpRequest, state } = useHelperConnection();
  const [secondsLeft, setSecondsLeft] = useState(9 * 60 + 47);
  const [showCheckoutWarning, setShowCheckoutWarning] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [helpRequestMessage, setHelpRequestMessage] = useState("");
  const checkoutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  function continueToCheckout() {
    setShowCheckout(true);
    setShowCheckoutWarning(false);
    window.setTimeout(() => checkoutRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }

  function askHelper() {
    const shared = createHelpRequest({
      websiteName: demoSites.vitaglow.name,
      address: demoSites.vitaglow.address,
      reason: "EasyWeb found exaggerated health claims, time pressure, unclear company details, and a request for payment information.",
      riskCategory: "payment",
    });
    setHelpRequestMessage(
      shared
        ? `Your request was shared with ${state.helperDisplayName}. EasyWeb shared this page’s name, address, and payment warning—not anything you typed.`
        : "No trusted helper is connected yet. Return to EasyWeb Home to connect someone you trust.",
    );
  }

  return (
    <article className="mock-site vitaglow-site">
      <DemoBanner siteId="vitaglow" />

      <aside className="safety-review" aria-labelledby="safety-review-title">
        <div className="safety-review-heading">
          <span aria-hidden="true">!</span>
          <div>
            <p>EasyWeb safety review</p>
            <h1 id="safety-review-title">Several warning signs found</h1>
          </div>
        </div>
        <p>
          This does not prove the website is a scam, but it is wise to slow down
          and review these concerns before buying.
        </p>
        <ul>
          <li>It promises unusually dramatic health and appearance results.</li>
          <li>A countdown and “today only” message pressure you to act quickly.</li>
          <li>It is not clear who owns the company or where it is located.</li>
          <li>Contact details are limited, and the refund rules are hard to find.</li>
        </ul>
      </aside>

      <header className="vitaglow-header">
        <a className="vitaglow-brand" href="#vitaglow-main">VitaGlow</a>
        <nav aria-label="VitaGlow sections">
          <a href="#benefits">Benefits</a>
          <a href="#stories">Success stories</a>
          <a href="#vitaglow-footer">Support</a>
        </nav>
        <button onClick={() => setShowCheckoutWarning(true)} type="button">Order now</button>
      </header>

      <main id="vitaglow-main">
        <section className="vitaglow-hero">
          <div className="vitaglow-copy">
            <p className="vitaglow-kicker">The wellness secret everyone is talking about</p>
            <h2>Look younger and feel years healthier in just 14 days</h2>
            <p className="vitaglow-claim">
              Our exclusive Renewal Drops claim to erase wrinkles, restore energy,
              ease joint discomfort, and support total-body renewal—all with one
              daily serving.
            </p>
            <div className="vitaglow-offer">
              <strong>Today only: 70% off your first bottle</strong>
              <span>Special price expires in</span>
              <time aria-label={`${minutes} minutes and ${seconds} seconds remaining`}>
                {minutes}:{seconds}
              </time>
            </div>
            <button className="vitaglow-order" onClick={() => setShowCheckoutWarning(true)} type="button">
              Claim today&apos;s offer — $29.95
            </button>
            <small>Regularly $99.95. Shipping added at checkout.</small>
          </div>
          <div className="vitaglow-product" aria-label="VitaGlow Renewal Drops bottle illustration">
            <span>VitaGlow</span>
            <strong>RENEWAL<br />DROPS</strong>
            <small>30 mL</small>
          </div>
        </section>

        <section className="vitaglow-benefits" id="benefits" aria-labelledby="benefits-title">
          <p>One bottle. Total transformation.</p>
          <h2 id="benefits-title">Results they say you can see and feel</h2>
          <div>
            <article><strong>14 days</strong><span>to visibly younger-looking skin</span></article>
            <article><strong>All day</strong><span>energy without changing your routine</span></article>
            <article><strong>One dropper</strong><span>for complete wellness support</span></article>
          </div>
          <p className="vitaglow-disclaimer">Product statements shown are fictional demo claims and have not been evaluated.</p>
        </section>

        <section className="vitaglow-stories" id="stories" aria-labelledby="stories-title">
          <h2 id="stories-title">“I finally feel like myself again.”</h2>
          <p>— “Martha, 68,” sample promotional story</p>
          <button onClick={() => setShowCheckoutWarning(true)} type="button">Get my bottle</button>
        </section>

        {showCheckout && (
          <section className="simulated-checkout" ref={checkoutRef} aria-labelledby="checkout-title">
            <p className="checkout-demo-label">Simulated checkout — no payment can be made</p>
            <h2 id="checkout-title">Card details</h2>
            <p>
              These fields are disabled. EasyWeb does not accept, store, validate,
              or transmit card information in this demo.
            </p>
            <div className="simulated-card-fields" aria-label="Disabled sample card fields">
              <label>Card number<input disabled placeholder="Card entry disabled" type="text" /></label>
              <label>Name on card<input disabled placeholder="Card entry disabled" type="text" /></label>
              <label>Expiration<input disabled placeholder="MM / YY" type="text" /></label>
              <label>Security code<input disabled placeholder="CVV" type="text" /></label>
            </div>
            <button disabled type="button">Place order — disabled demo</button>
          </section>
        )}
      </main>

      <footer className="vitaglow-footer" id="vitaglow-footer">
        <strong>VitaGlow Customer Care</strong>
        <span>Online support only. Company ownership and street address not listed.</span>
        <details>
          <summary>Legal information</summary>
          <p>Refund requests must be made within 7 days. Return shipping and handling fees are not refunded.</p>
        </details>
      </footer>

      {showCheckoutWarning && (
        <div className="checkout-warning-backdrop">
          <section className="checkout-warning-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-warning-title">
            <span className="checkout-warning-icon" aria-hidden="true">!</span>
            <p className="checkout-warning-eyebrow">Pause before continuing</p>
            <h2 id="checkout-warning-title">This website is asking for payment information</h2>
            <p>
              EasyWeb found several warning signs. Review the concerns above before
              deciding whether to continue. This does not prove the website is a scam.
            </p>
            <div className="checkout-warning-actions">
              <button className="warning-leave" onClick={onLeaveSite} type="button">Leave this website</button>
              <button className="warning-continue" onClick={continueToCheckout} type="button">Continue anyway</button>
              <button className="warning-helper" onClick={askHelper} type="button">Ask my helper</button>
            </div>
            {helpRequestMessage && (
              <p className="helper-request-confirmation" role="status">
                {helpRequestMessage}
              </p>
            )}
          </section>
        </div>
      )}
    </article>
  );
}

function LookalikeSite({
  onLeaveSite,
  onNavigate,
}: {
  onLeaveSite: () => void;
  onNavigate: (siteId: DemoSiteId) => void;
}) {
  const { createHelpRequest, state } = useHelperConnection();
  const [helpRequestMessage, setHelpRequestMessage] = useState("");

  function askHelper() {
    const shared = createHelpRequest({
      websiteName: demoSites.robloxLookalike.name,
      address: demoSites.robloxLookalike.address,
      reason: "EasyWeb found an address using the number 1 instead of the letter l on a page asking for a password.",
      riskCategory: "password",
    });
    setHelpRequestMessage(
      shared
        ? `Your request was shared with ${state.helperDisplayName}. EasyWeb shared this page’s name, address, and password warning—not anything you typed.`
        : "No trusted helper is connected yet. Return to EasyWeb Home to connect someone you trust.",
    );
  }

  return (
    <article className="mock-site lookalike-site">
      <DemoBanner siteId="robloxLookalike" />

      <section className="lookalike-warning" aria-labelledby="lookalike-warning-title">
        <div className="lookalike-warning-heading">
          <span aria-hidden="true">!</span>
          <div>
            <p>EasyWeb address warning</p>
            <h1 id="lookalike-warning-title">Several warning signs found</h1>
          </div>
        </div>
        <h2>This website address is very similar to a familiar website.</h2>
        <div className="address-comparison" aria-label="Comparison of rob1ox.com and roblox.com">
          <div>
            <span>Address you opened</span>
            <strong>rob<mark>1</mark>ox.com</strong>
          </div>
          <div>
            <span>Familiar address</span>
            <strong>rob<em>l</em>ox.com</strong>
          </div>
        </div>
        <p className="character-explanation">
          The address you opened uses the <strong>number 1</strong> instead of the
          <strong> letter l</strong>. Deceptive websites sometimes use similar-looking
          letters and numbers. This does not prove the page is malicious, but it is
          an important reason to stop and check.
        </p>
        <div className="lookalike-do-not-enter">
          <strong>Do not enter a password, payment information, or personal information on this page.</strong>
        </div>
        <div className="lookalike-actions">
          <button className="lookalike-safe-action" onClick={() => onNavigate("robloxSafe")} type="button">
            Did you mean roblox.com?
          </button>
          <button className="lookalike-leave-action" onClick={onLeaveSite} type="button">
            Leave this website
          </button>
          <button className="lookalike-helper-action" onClick={askHelper} type="button">
            Ask my helper
          </button>
        </div>
        {helpRequestMessage && (
          <p className="helper-request-confirmation" role="status">
            {helpRequestMessage}
          </p>
        )}
      </section>

      <section className="lookalike-login" aria-labelledby="lookalike-login-title">
        <div className="lookalike-login-card">
          <p>Account notice</p>
          <h2 id="lookalike-login-title">Verify your account now</h2>
          <span>Your access may be limited unless you sign in today.</span>
          <div className="lookalike-login-fields" aria-label="Disabled demo login fields">
            <label>
              Username or email
              <input disabled placeholder="Entry disabled by EasyWeb" type="text" />
            </label>
            <label>
              Password
              <input disabled placeholder="Entry disabled by EasyWeb" type="password" />
            </label>
          </div>
          <button disabled type="button">Sign in — disabled demo</button>
          <small>This controlled demonstration cannot collect or submit login information.</small>
        </div>
      </section>
    </article>
  );
}

function RobloxSafeDestination() {
  return (
    <article className="mock-site safe-destination-site">
      <DemoBanner siteId="robloxSafe" />
      <section className="safe-destination-content">
        <span className="safe-destination-icon" aria-hidden="true">✓</span>
        <p className="mock-eyebrow">Controlled safe destination</p>
        <h1>You chose the familiar address</h1>
        <strong>roblox.com</strong>
        <p>
          This EasyWeb demo stays inside the browser shell. It confirms the spelling
          difference without loading an external website or collecting information.
        </p>
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
