"use client";

import { type CSSProperties, useMemo, useState } from "react";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { BrowserToolbar } from "@/components/BrowserToolbar";
import { HelpAssistant } from "@/components/HelpAssistant";
import { useHelperConnection } from "@/components/HelperConnectionProvider";
import { MockWebsite, SearchResults } from "@/components/MockWebsite";
import {
  HelperMessageNotice,
  SeniorConnectionPanel,
} from "@/components/SeniorHelperConnection";
import { demoSites, findDemoSite, type DemoSiteId } from "@/lib/demoSites";

export type BrowserPage =
  | { kind: "home" }
  | { kind: "demo" }
  | { kind: "external"; url: string }
  | { kind: "site"; siteId: DemoSiteId }
  | { kind: "search"; query: string };

const homePage: BrowserPage = { kind: "home" };

export function BrowserShell() {
  const [history, setHistory] = useState<BrowserPage[]>([homePage]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const currentPage = history[historyIndex];

  const address = useMemo(() => {
    if (currentPage.kind === "site") return demoSites[currentPage.siteId].address;
    if (currentPage.kind === "external") return currentPage.url;
    if (currentPage.kind === "search") return currentPage.query;
    return "";
  }, [currentPage]);

  function navigate(page: BrowserPage) {
    setHistory((current) => [...current.slice(0, historyIndex + 1), page]);
    setHistoryIndex((current) => current + 1);
  }

  function navigateToSite(siteId: DemoSiteId) {
    navigate({ kind: "site", siteId });
  }

  function submitAddress(value: string) {
    const siteId = findDemoSite(value);
    if (siteId) {
      navigate({ kind: "site", siteId });
      return;
    }

    const trimmed = value.trim();
    const externalUrl = normalizeExternalUrl(trimmed);
    navigate(externalUrl
      ? { kind: "external", url: externalUrl }
      : { kind: "search", query: trimmed });
  }

  return (
    <main className="browser-shell">
      <BrowserToolbar
        address={address}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        isHome={currentPage.kind === "home"}
        onBack={() => setHistoryIndex((current) => Math.max(0, current - 1))}
        onForward={() =>
          setHistoryIndex((current) => Math.min(history.length - 1, current + 1))
        }
        onHome={() => navigate(homePage)}
        onRefresh={() => setRefreshKey((current) => current + 1)}
        onSubmit={submitAddress}
        key={`${historyIndex}-${address}`}
      />

      <div className="browser-viewport" key={refreshKey}>
        {currentPage.kind === "home" && (
          <BrowserHome
            onNavigate={submitAddress}
            onOpenDemos={() => navigate({ kind: "demo" })}
          />
        )}
        {currentPage.kind === "demo" && <DemoScenarioMenu onNavigate={navigateToSite} />}
        {currentPage.kind === "site" && (
          <MockWebsite
            onLeaveSite={() => navigate(homePage)}
            onNavigate={navigateToSite}
            siteId={currentPage.siteId}
          />
        )}
        {currentPage.kind === "external" && (
          <ExternalWebsite
            key={currentPage.url}
            onReturnHome={() => navigate(homePage)}
            url={currentPage.url}
          />
        )}
        {currentPage.kind === "search" && (
          <SearchResults query={currentPage.query} onNavigate={navigateToSite} />
        )}
      </div>

      <HelpAssistant
        currentPage={currentPage}
        key={`${currentPage.kind}-${address}`}
      />
      <HelperMessageNotice
        currentAddress={address}
        onLeaveWebsite={() => navigate(homePage)}
      />
    </main>
  );
}

function BrowserHome({
  onNavigate,
  onOpenDemos,
}: {
  onNavigate: (address: string) => void;
  onOpenDemos: () => void;
}) {
  const { state } = useHelperConnection();
  const helperConnected = state.connectionStatus === "connected";

  return (
    <div className="senior-home">
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="EasyWeb home">
          <span className="brand-mark" aria-hidden="true">e</span>
          <span>EasyWeb</span>
        </a>
        <div className={`connection-status ${helperConnected ? "" : "independent-status"}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          {helperConnected ? `Connected to ${state.helperDisplayName}` : "Browsing independently"}
        </div>
      </header>

      <section className="home-content" id="main-content">
        <SeniorConnectionPanel />
        <BookmarkGrid onNavigate={onNavigate} onOpenDemos={onOpenDemos} />
      </section>
    </div>
  );
}

function normalizeExternalUrl(value: string) {
  if (!value) return null;

  const protocolMatch = value.match(/^([a-z][a-z\d+.-]*):/i);
  if (protocolMatch && protocolMatch[1].toLowerCase() !== "http" && protocolMatch[1].toLowerCase() !== "https") {
    return null;
  }

  const candidate = protocolMatch ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password || !resemblesDomain(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function resemblesDomain(hostname: string) {
  const labels = hostname.split(".");
  return labels.length >= 2 && labels.every((label) => (
    Boolean(label) &&
    label.length <= 63 &&
    /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(label)
  ));
}

function ExternalWebsite({
  onReturnHome,
  url,
}: {
  onReturnHome: () => void;
  url: string;
}) {
  const [displayState, setDisplayState] = useState<"loading" | "loaded" | "fallback">("loading");
  const [copyStatus, setCopyStatus] = useState("");

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("Address copied.");
    } catch {
      setCopyStatus("Copying was unavailable. You can select the address above instead.");
    }
  }

  if (displayState === "fallback") {
    return (
      <section className="external-fallback" aria-labelledby="external-fallback-title">
        <span className="external-site-label">External website</span>
        <h1 id="external-fallback-title">This website cannot be displayed inside EasyWeb</h1>
        <p>Some websites only allow themselves to open directly in a browser tab.</p>
        <code>{url}</code>
        <div className="external-fallback-actions">
          <a href={url} rel="noopener noreferrer" target="_blank">Open website in a new tab</a>
          <button onClick={onReturnHome} type="button">Return home</button>
          <button onClick={copyAddress} type="button">Copy address</button>
        </div>
        {copyStatus && <p className="external-copy-status" role="status">{copyStatus}</p>}
      </section>
    );
  }

  return (
    <section className="external-website" aria-label={`External website: ${url}`}>
      <div className="external-view-notice">
        <span><strong>External website</strong> EasyWeb has not reviewed this page.</span>
        <button onClick={() => setDisplayState("fallback")} type="button">
          Having trouble viewing this page? Open it in a new tab.
        </button>
      </div>
      <div className="external-frame-wrap">
        {displayState === "loading" && (
          <div className="external-loading" role="status">
            <span aria-hidden="true" />
            Loading website…
          </div>
        )}
        <iframe
          onError={() => setDisplayState("fallback")}
          onLoad={() => setDisplayState("loaded")}
          referrerPolicy="no-referrer"
          sandbox="allow-forms allow-same-origin allow-scripts"
          src={url}
          title={`External website at ${url}`}
        />
      </div>
    </section>
  );
}

const demoScenarios: Array<{
  color: string;
  description: string;
  icon: string;
  siteId: DemoSiteId;
}> = [
  { siteId: "healthplus", icon: "+", color: "#e5f6f0", description: "Clinic information and page help" },
  { siteId: "pharmacy", icon: "Rx", color: "#e8f1ff", description: "A controlled neighborhood pharmacy" },
  { siteId: "utility", icon: "⚡", color: "#fff4d9", description: "A sample electric bill" },
  { siteId: "vitaglow", icon: "VG", color: "#f7e8f1", description: "Suspicious shopping warning signs" },
  { siteId: "robloxLookalike", icon: "1/l", color: "#ffe8df", description: "A lookalike website address warning" },
];

function DemoScenarioMenu({ onNavigate }: { onNavigate: (siteId: DemoSiteId) => void }) {
  return (
    <div className="demo-menu-page">
      <header className="site-header">
        <a className="brand" href="#demo-scenarios" aria-label="EasyWeb demo scenarios">
          <span className="brand-mark" aria-hidden="true">e</span>
          <span>EasyWeb</span>
        </a>
        <span className="demo-menu-label">Controlled demos</span>
      </header>
      <section className="demo-menu-content" id="demo-scenarios">
        <p className="eyebrow">Hackathon demonstrations</p>
        <h1>Try demo scenarios</h1>
        <p className="demo-menu-intro">
          These controlled pages demonstrate EasyWeb guidance and safety warnings.
          They are separate from your personal bookmarks.
        </p>
        <div className="demo-scenario-grid">
          {demoScenarios.map((scenario) => {
            const site = demoSites[scenario.siteId];
            return (
              <button
                key={scenario.siteId}
                onClick={() => onNavigate(scenario.siteId)}
                style={{ "--demo-color": scenario.color } as CSSProperties}
                type="button"
              >
                <span className="demo-scenario-icon" aria-hidden="true">{scenario.icon}</span>
                <strong>{site.shortName}</strong>
                <span>{scenario.description}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
