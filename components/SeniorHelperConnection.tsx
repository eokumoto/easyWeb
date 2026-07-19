"use client";

import { useState } from "react";
import { useHelperConnection } from "@/components/HelperConnectionProvider";

export function SeniorConnectionPanel() {
  const { regeneratePairingCode, state } = useHelperConnection();
  const [isExpanded, setIsExpanded] = useState(false);

  if (state.connectionStatus === "connected") {
    return null;
  }

  if (!isExpanded) {
    return (
      <button className="senior-connect-reopen" onClick={() => setIsExpanded(true)} type="button">
        Connect a trusted helper
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
        <button onClick={() => setIsExpanded(false)} type="button">Not now</button>
        <button onClick={regeneratePairingCode} type="button">Regenerate code</button>
      </div>
    </aside>
  );
}

export function HelperMessageNotice({
  currentAddress,
  onLeaveWebsite,
}: {
  currentAddress: string;
  onLeaveWebsite: () => void;
}) {
  const { dismissResponse, state } = useHelperConnection();
  const response = [...state.helperResponses].reverse().find((item) => {
    if (item.dismissed) return false;
    const request = state.helpRequests.find((candidate) => candidate.id === item.requestId);
    return request?.address === currentAddress;
  });

  if (!response) return null;
  const request = state.helpRequests.find((item) => item.id === response.requestId);
  if (!request) return null;

  function leaveWebsite() {
    onLeaveWebsite();
  }

  return (
    <aside className="helper-message-notice" role="alert" aria-labelledby="helper-message-title">
      <p>Trusted helper message</p>
      <h2 id="helper-message-title">{state.helperDisplayName} sent you a message about:</h2>
      <section className="helper-message-context" aria-label="Website this message is about">
        <strong>{request.websiteName}</strong>
        <code>{request.address}</code>
      </section>
      <blockquote>{response.message}</blockquote>
      <div>
        <button className="helper-message-leave" onClick={leaveWebsite} type="button">Leave website</button>
        <button className="helper-message-dismiss" onClick={() => dismissResponse(response.id)} type="button">Dismiss</button>
      </div>
    </aside>
  );
}
