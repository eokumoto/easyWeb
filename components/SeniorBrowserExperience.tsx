"use client";

import { BrowserShell } from "@/components/BrowserShell";
import { useHelperConnection } from "@/components/HelperConnectionProvider";

export function SeniorBrowserExperience() {
  const {
    completeOnboardingWithoutHelper,
    isReady,
    regeneratePairingCode,
    state,
  } = useHelperConnection();

  if (!isReady) {
    return (
      <main className="senior-onboarding onboarding-loading" aria-label="Loading EasyWeb">
        <div className="onboarding-brand"><span aria-hidden="true">e</span>EasyWeb</div>
      </main>
    );
  }

  if (!state.onboardingComplete) {
    return (
      <main className="senior-onboarding">
        <section className="onboarding-card" aria-labelledby="onboarding-title">
          <div className="onboarding-brand"><span aria-hidden="true">e</span>EasyWeb</div>
          <p className="onboarding-eyebrow">Optional trusted support</p>
          <h1 id="onboarding-title">Connect someone you trust</h1>
          <p className="onboarding-intro">
            Share this code with your helper.
          </p>
          <div
            className="onboarding-code"
            aria-label={`Pairing code ${state.pairingCode.split("").join(" ")}`}
          >
            {state.pairingCode}
          </div>
          <p className="onboarding-privacy">
            Pages are shared only when you ask.
          </p>
          <div className="onboarding-actions">
            <button onClick={completeOnboardingWithoutHelper} type="button">
              Open without a helper
            </button>
            <button onClick={regeneratePairingCode} type="button">
              Regenerate code
            </button>
          </div>
        </section>
      </main>
    );
  }

  return <BrowserShell />;
}
