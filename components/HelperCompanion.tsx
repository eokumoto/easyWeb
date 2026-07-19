"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useHelperConnection } from "@/components/HelperConnectionProvider";
import {
  type HelpRequest,
  helperResponsePresets,
} from "@/lib/helperConnection";

export function HelperCompanion() {
  const { connectHelper, disconnectHelper, state } = useHelperConnection();
  const [pairingCode, setPairingCode] = useState("");
  const [pairingAccepted, setPairingAccepted] = useState(false);
  const [seniorName, setSeniorName] = useState("");
  const [error, setError] = useState("");

  function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pairingCode === state.pairingCode) {
      setPairingAccepted(true);
      setError("");
      return;
    }
    setError("That code does not match. Check the four digits in the senior’s EasyWeb browser and try again.");
  }

  function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const activeCode = state.connectionStatus === "connected"
      ? state.pairingCode
      : pairingCode;
    if (connectHelper(activeCode, seniorName)) {
      setError("");
      return;
    }
    setPairingAccepted(false);
    setError("The pairing code changed. Enter the current four-digit code and try again.");
  }

  const hasSeniorName = Boolean(state.seniorDisplayName.trim());
  const showNameStep = pairingAccepted ||
    (state.connectionStatus === "connected" && !hasSeniorName);

  function handleDisconnect() {
    disconnectHelper();
    setPairingCode("");
    setPairingAccepted(false);
    setSeniorName("");
    setError("");
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

      {state.connectionStatus === "connected" && hasSeniorName ? (
        <ConnectedCompanion onDisconnect={handleDisconnect} />
      ) : showNameStep ? (
        <section className="companion-card" aria-labelledby="senior-name-title">
          <div className="companion-icon" aria-hidden="true">+</div>
          <p className="landing-eyebrow">EasyWeb Companion</p>
          <h1 id="senior-name-title">Who are you helping?</h1>
          <p className="companion-intro">
            Enter their name so EasyWeb Companion can keep help requests clear and personal.
          </p>
          <form className="pairing-form" onSubmit={handleNameSubmit}>
            <label htmlFor="senior-name">Name</label>
            <input
              autoComplete="off"
              id="senior-name"
              onChange={(event) => {
                setSeniorName(event.target.value);
                setError("");
              }}
              placeholder="Enter name"
              type="text"
              value={seniorName}
            />
            {error && <p className="pairing-error" role="alert">{error}</p>}
            <button disabled={!seniorName.trim()} type="submit">Complete connection</button>
          </form>
          <Link className="companion-text-link" href="/">Return to EasyWeb</Link>
        </section>
      ) : (
        <section className="companion-card" aria-labelledby="companion-title">
          <div className="companion-icon" aria-hidden="true">+</div>
          <p className="landing-eyebrow">EasyWeb Companion</p>
          <h1 id="companion-title">Connect to someone you trust.</h1>
          <p className="companion-intro">
            Enter the four-digit code shown in the senior’s EasyWeb browser. No
            account, email, or password is needed for this prototype.
          </p>
          <form className="pairing-form" onSubmit={handleCodeSubmit}>
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
            <button disabled={pairingCode.length !== 4} type="submit">Continue</button>
          </form>
          <Link className="companion-text-link" href="/">Return to EasyWeb</Link>
        </section>
      )}
    </main>
  );
}

function ConnectedCompanion({ onDisconnect }: { onDisconnect: () => void }) {
  const { state } = useHelperConnection();
  const seniorName = state.seniorDisplayName.trim();
  const activeRequests = state.helpRequests.filter((request) => request.status === "active");
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false);

  return (
    <div className="companion-dashboard">
      <section className="companion-connected-card" aria-labelledby="connected-title">
        <span aria-hidden="true">✓</span>
        <div>
          <p>Connected</p>
          <h1 id="connected-title">
            {seniorName ? `Connected to ${seniorName}’s EasyWeb` : "Connected EasyWeb"}
          </h1>
          <p>
            You will only see pages that {seniorName || "this person"} explicitly asks
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
            <p>When {seniorName || "this person"} asks for help on a warning page, it will appear here.</p>
          </div>
        ) : (
          <div className="helper-request-list">
            {activeRequests.map((request) => (
              <HelperRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </section>

      <div className="companion-dashboard-footer">
        <Link className="companion-text-link" href="/">Return to EasyWeb site</Link>
        <button
          className="disconnect-helper-action"
          onClick={() => setConfirmingDisconnect(true)}
          type="button"
        >
          Disconnect from {seniorName}
        </button>
      </div>

      {confirmingDisconnect && (
        <section
          className="disconnect-confirmation"
          aria-labelledby="disconnect-title"
          role="alertdialog"
        >
          <h2 id="disconnect-title">Disconnect from {seniorName}’s EasyWeb?</h2>
          <p>
            This will end the local pairing and return EasyWeb Companion to the
            pairing-code screen. Shared help requests and messages will be cleared
            so they are not shown to the next person you pair with.
          </p>
          <div>
            <button onClick={() => setConfirmingDisconnect(false)} type="button">Cancel</button>
            <button onClick={onDisconnect} type="button">Disconnect</button>
          </div>
        </section>
      )}
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
      <label htmlFor={`helper-message-${request.id}`}>
        Message to {state.seniorDisplayName.trim() || "this person"}
      </label>
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
