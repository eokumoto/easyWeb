"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useBookmarks } from "@/components/BookmarkProvider";
import { useHelperConnection } from "@/components/HelperConnectionProvider";
import { normalizeBookmarkAddress, type Bookmark } from "@/lib/bookmarks";
import {
  type HelpRequest,
  helperResponsePresets,
} from "@/lib/helperConnection";

export function HelperCompanion() {
  const { connectHelper, disconnectHelper, state } = useHelperConnection();
  const [pairingCode, setPairingCode] = useState("");
  const [pairingAccepted, setPairingAccepted] = useState(false);
  const [helperName, setHelperName] = useState("");
  const [seniorName, setSeniorName] = useState("");
  const [error, setError] = useState("");

  function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedHelperName = helperName.trim();
    if (!trimmedHelperName) {
      setError("Enter your name before connecting.");
      return;
    }
    if (pairingCode === state.pairingCode) {
      setHelperName(trimmedHelperName);
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
    const activeHelperName = helperName || state.helperDisplayName;
    if (connectHelper(activeCode, activeHelperName, seniorName)) {
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
    setHelperName("");
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
            Enter your personal label for this person. This name is used only in
            your helper dashboard and is never shown to the senior.
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
            <span>Examples: Grandma, Mom, or Jeff.</span>
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
            Enter the four-digit code shown in the senior’s EasyWeb browser and
            your name. No account, email, or password is needed for this prototype.
          </p>
          <form className="pairing-form" onSubmit={handleCodeSubmit}>
            <label id="pairing-code-label">Pairing code</label>
            <div
              className="pairing-code-inputs"
              aria-describedby="pairing-guidance"
              aria-labelledby="pairing-code-label"
            >
              {[0, 1, 2, 3].map((index) => (
                <input
                  aria-label={`Pairing code digit ${index + 1}`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  inputMode="numeric"
                  key={index}
                  maxLength={1}
                  onChange={(event) => {
                    const digit = event.target.value.replace(/\D/g, "").slice(-1);
                    const nextCode = pairingCode.padEnd(4, " ").split("");
                    nextCode[index] = digit || " ";
                    setPairingCode(nextCode.join("").trimEnd());
                    setError("");
                    const nextInput = event.currentTarget.nextElementSibling;
                    if (digit && nextInput instanceof HTMLInputElement) {
                      nextInput.focus();
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !event.currentTarget.value) {
                      const previous = event.currentTarget.previousElementSibling;
                      if (previous instanceof HTMLInputElement) previous.focus();
                    }
                  }}
                  type="text"
                  value={pairingCode[index] === " " ? "" : pairingCode[index] ?? ""}
                />
              ))}
            </div>
            <span id="pairing-guidance">The code comes from EasyWeb Home in the senior’s browser.</span>
            <label htmlFor="helper-name">Your name</label>
            <input
              autoComplete="name"
              id="helper-name"
              onChange={(event) => {
                setHelperName(event.target.value);
                setError("");
              }}
              placeholder="Enter your name"
              type="text"
              value={helperName}
            />
            {error && <p className="pairing-error" id="pairing-error" role="alert">{error}</p>}
            <button disabled={!/^\d{4}$/.test(pairingCode) || !helperName.trim()} type="submit">Connect</button>
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
            You will only see pages that {seniorName} explicitly asks
            you to review. Normal browsing is not shared.
          </p>
        </div>
      </section>

      <HelperBookmarks seniorName={seniorName} />

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
            <p>When {seniorName} asks for help on a warning page, it will appear here.</p>
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

type BookmarkEditor = {
  id: string | null;
  name: string;
  address: string;
};

function HelperBookmarks({ seniorName }: { seniorName: string }) {
  const { bookmarks, saveBookmarks } = useBookmarks();
  const [editor, setEditor] = useState<BookmarkEditor | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function openAddForm() {
    setEditor({ id: null, name: "", address: "" });
    setError("");
    setStatus("");
  }

  function openEditForm(bookmark: Bookmark) {
    setEditor({ ...bookmark });
    setError("");
    setStatus("");
  }

  function closeForm() {
    setEditor(null);
    setError("");
  }

  function saveBookmark(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;

    const name = editor.name.trim();
    const address = normalizeBookmarkAddress(editor.address);
    if (!name && !editor.address.trim()) {
      setError("Enter a name and website address.");
      return;
    }
    if (!name) {
      setError("Enter a name for this bookmark.");
      return;
    }
    if (!editor.address.trim()) {
      setError("Enter a website address.");
      return;
    }
    if (!address) {
      setError("Enter a website address such as example.com.");
      return;
    }

    if (editor.id) {
      saveBookmarks(bookmarks.map((bookmark) => (
        bookmark.id === editor.id ? { id: editor.id, name, address } : bookmark
      )));
      setStatus(`${name} was updated for ${seniorName}.`);
    } else {
      saveBookmarks([...bookmarks, { id: makeBookmarkId(), name, address }]);
      setStatus(`${name} was added for ${seniorName}.`);
    }
    setEditor(null);
    setError("");
  }

  function removeBookmark(bookmark: Bookmark) {
    saveBookmarks(bookmarks.filter((current) => current.id !== bookmark.id));
    if (editor?.id === bookmark.id) closeForm();
    setStatus(`${bookmark.name} was removed from ${seniorName}’s bookmarks.`);
  }

  return (
    <section className="helper-bookmarks" aria-labelledby="bookmarks-title">
      <div className="helper-bookmarks-heading">
        <div>
          <p className="landing-eyebrow">Shared with {seniorName}</p>
          <h2 id="bookmarks-title">Bookmarks for {seniorName}</h2>
        </div>
        {!editor && <button onClick={openAddForm} type="button">Add bookmark</button>}
      </div>

      {editor && (
        <form className="bookmark-editor" onSubmit={saveBookmark} noValidate>
          <h3>{editor.id ? "Edit bookmark" : "Add bookmark"}</h3>
          <label htmlFor="bookmark-name">Name</label>
          <input
            autoComplete="off"
            id="bookmark-name"
            onChange={(event) => {
              setEditor({ ...editor, name: event.target.value });
              setError("");
            }}
            placeholder="My Doctor"
            required
            type="text"
            value={editor.name}
          />
          <label htmlFor="bookmark-address">Website address</label>
          <input
            autoCapitalize="none"
            autoComplete="url"
            id="bookmark-address"
            onChange={(event) => {
              setEditor({ ...editor, address: event.target.value });
              setError("");
            }}
            placeholder="example.com"
            required
            type="text"
            value={editor.address}
          />
          {error && <p className="pairing-error" role="alert">{error}</p>}
          <div className="bookmark-editor-actions">
            <button type="submit">Save</button>
            <button onClick={closeForm} type="button">Cancel</button>
          </div>
        </form>
      )}

      {bookmarks.length === 0 ? (
        <div className="empty-helper-bookmarks">
          <strong>No bookmarks yet</strong>
          <p>Add a useful website and it will appear on {seniorName}’s EasyWeb Home screen.</p>
        </div>
      ) : (
        <div className="helper-bookmark-list">
          {bookmarks.map((bookmark) => (
            <article className="helper-bookmark-card" key={bookmark.id}>
              <div>
                <strong>{bookmark.name}</strong>
                <span>{bookmark.address}</span>
              </div>
              <div>
                <button onClick={() => openEditForm(bookmark)} type="button">Edit</button>
                <button onClick={() => removeBookmark(bookmark)} type="button">Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {status && <p className="bookmark-save-status" role="status">{status}</p>}
    </section>
  );
}

function makeBookmarkId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `bookmark-${crypto.randomUUID()}`;
  }
  return `bookmark-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
        Message to {state.seniorDisplayName.trim()}
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
