"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useHelperConnection } from "@/components/HelperConnectionProvider";
import {
  type HelpRequest,
  helperResponsePresets,
} from "@/lib/helperConnection";

export function HelperCompanion() {
  const { connectHelper, state } = useHelperConnection();
  const [pairingCode, setPairingCode] = useState("");
  const [helperName, setHelperName] = useState(state.helperDisplayName);
  const [error, setError] = useState("");

  function handleConnect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (connectHelper(pairingCode, helperName)) {
      setError("");
      return;
    }
    setError("That code does not match. Check the four digits in the senior’s EasyWeb browser and try again.");
  }

  return (
    <main className="companion-page">
      <header className="companion-header">
        <Link className="public-brand" href="/" aria-label="EasyWeb landing page">
          <span aria-hidden="true">e</span>
          EasyWeb
        </Link>
        <span className="prototype-badge">Local pairing demo</span>
      </header>

      {state.connectionStatus === "connected" ? (
        <ConnectedCompanion />
      ) : (
        <section className="companion-card" aria-labelledby="companion-title">
          <div className="companion-icon" aria-hidden="true">+</div>
          <p className="landing-eyebrow">EasyWeb Companion</p>
          <h1 id="companion-title">Connect to someone you trust.</h1>
          <p className="companion-intro">
            Enter the four-digit code shown in the senior’s EasyWeb browser. No
            account, email, or password is needed for this prototype.
          </p>
          <form className="pairing-form" onSubmit={handleConnect}>
            <label htmlFor="helper-name">Your display name</label>
            <input
              autoComplete="off"
              id="helper-name"
              onChange={(event) => setHelperName(event.target.value)}
              type="text"
              value={helperName}
            />
            <label htmlFor="pairing-code">Four-digit pairing code</label>
            <input
              aria-describedby={error ? "pairing-error" : "pairing-guidance"}
              autoComplete="one-time-code"
              id="pairing-code"
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => {
                setPairingCode(event.target.value.replace(/\D/g, "").slice(0, 4));
                setError("");
              }}
              placeholder="0000"
              type="text"
              value={pairingCode}
            />
            <span id="pairing-guidance">The code comes from EasyWeb Home in the senior’s browser.</span>
            {error && <p className="pairing-error" id="pairing-error" role="alert">{error}</p>}
            <button disabled={pairingCode.length !== 4 || !helperName.trim()} type="submit">Connect</button>
          </form>
          <Link className="companion-text-link" href="/">Return to EasyWeb</Link>
        </section>
      )}
    </main>
  );
}

function ConnectedCompanion() {
  const { state } = useHelperConnection();
  const activeRequests = state.helpRequests.filter((request) => request.status === "active");

  return (
    <div className="companion-dashboard">
      <section className="companion-connected-card" aria-labelledby="connected-title">
        <span aria-hidden="true">✓</span>
        <div>
          <p>Connected</p>
          <h1 id="connected-title">Connected to {state.seniorDisplayName}’s EasyWeb</h1>
          <p>
            You will only see pages that {state.seniorDisplayName} explicitly asks
            you to review. Normal browsing is not shared.
          </p>
        </div>
      </section>

      <section className="helper-requests" aria-labelledby="requests-title">
        <div className="helper-requests-heading">
          <div>
            <p className="landing-eyebrow">Help requests</p>
            <h2 id="requests-title">Active requests</h2>
          </div>
          <span>{activeRequests.length}</span>
        </div>

        {activeRequests.length === 0 ? (
          <div className="empty-requests">
            <strong>No active help requests</strong>
            <p>When {state.seniorDisplayName} asks for help on a warning page, it will appear here.</p>
          </div>
        ) : (
          <div className="helper-request-list">
            {activeRequests.map((request) => (
              <HelperRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </section>

      <Link className="companion-text-link dashboard-return" href="/">Return to EasyWeb site</Link>
    </div>
  );
}

function HelperRequestCard({ request }: { request: HelpRequest }) {
  const { markRequestReviewed, sendHelperResponse, state } = useHelperConnection();
  const defaultMessage = request.riskCategory === "password"
    ? "Do not enter your password."
    : "Do not enter your card information.";
  const [message, setMessage] = useState(defaultMessage);
  const [sentMessage, setSentMessage] = useState("");

  function sendWarning() {
    sendHelperResponse(request.id, message);
    setSentMessage(`Message sent: “${message}”`);
  }

  return (
    <article className="helper-request-card">
      <div className="helper-request-card-heading">
        <div>
          <span className={`risk-category risk-${request.riskCategory}`}>
            {request.riskCategory} warning
          </span>
          <h3>{request.websiteName}</h3>
          <code>{request.address}</code>
        </div>
        <time dateTime={request.createdAt}>{formatRequestTime(request.createdAt)}</time>
      </div>
      <div className="helper-request-reason">
        <strong>Why EasyWeb raised concern</strong>
        <p>{request.reason}</p>
      </div>
      <label htmlFor={`helper-message-${request.id}`}>Message to {state.seniorDisplayName}</label>
      <select
        id={`helper-message-${request.id}`}
        onChange={(event) => {
          setMessage(event.target.value);
          setSentMessage("");
        }}
        value={message}
      >
        {helperResponsePresets.map((preset) => <option key={preset}>{preset}</option>)}
      </select>
      <div className="helper-request-actions">
        <button className="send-warning-action" onClick={sendWarning} type="button">Send warning</button>
        <button className="mark-reviewed-action" onClick={() => markRequestReviewed(request.id)} type="button">Mark as reviewed</button>
      </div>
      {sentMessage && <p className="message-sent-confirmation" role="status">{sentMessage}</p>}
    </article>
  );
}

function formatRequestTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}
