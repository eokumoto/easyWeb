"use client";

import { useState } from "react";
import { useHelperConnection } from "@/components/HelperConnectionProvider";

export function SeniorConnectionPanel() {
  const { regeneratePairingCode, state } = useHelperConnection();
  const [isHidden, setIsHidden] = useState(false);

  if (state.connectionStatus === "connected") {
    return (
      <aside className="senior-connection-panel connected-helper-panel" aria-label="Trusted helper connection">
        <div className="senior-connection-heading">
          <span aria-hidden="true">✓</span>
          <div>
            <p>Trusted helper connected</p>
            <h2>{state.helperDisplayName} is connected</h2>
          </div>
        </div>
        <p>
          EasyWeb only shares pages when you choose “Ask my helper.” Your normal
          browsing is not shared.
        </p>
      </aside>
    );
  }

  if (isHidden) {
    return (
      <button className="senior-connect-reopen" onClick={() => setIsHidden(false)} type="button">
        Connect someone you trust
      </button>
    );
  }

  return (
    <aside className="senior-connection-panel" aria-labelledby="senior-connection-title">
      <div className="senior-connection-heading">
        <span aria-hidden="true">+</span>
        <div>
          <p>Optional trusted support</p>
          <h2 id="senior-connection-title">Connect someone you trust</h2>
        </div>
      </div>
      <p>
        Share this code with someone you trust. They can enter it in EasyWeb Companion.
      </p>
      <div className="pairing-code-display" aria-label={`Pairing code ${state.pairingCode.split("").join(" ")}`}>
        {state.pairingCode}
      </div>
      <div className="senior-connection-actions">
        <button onClick={() => setIsHidden(true)} type="button">Continue without a helper</button>
        <button onClick={regeneratePairingCode} type="button">Regenerate code</button>
      </div>
    </aside>
  );
}

export function HelperMessageNotice({ onLeaveWebsite }: { onLeaveWebsite: () => void }) {
  const { dismissResponse, state } = useHelperConnection();
  const response = [...state.helperResponses].reverse().find((item) => !item.dismissed);

  if (!response) return null;
  const responseId = response.id;

  function leaveWebsite() {
    dismissResponse(responseId);
    onLeaveWebsite();
  }

  return (
    <aside className="helper-message-notice" role="alert" aria-labelledby="helper-message-title">
      <p>Trusted helper message</p>
      <h2 id="helper-message-title">{state.helperDisplayName} sent you a message</h2>
      <blockquote>{response.message}</blockquote>
      <div>
        <button className="helper-message-leave" onClick={leaveWebsite} type="button">Leave website</button>
        <button className="helper-message-dismiss" onClick={() => dismissResponse(response.id)} type="button">Dismiss</button>
      </div>
    </aside>
  );
}
