"use client";

import { useMemo, useState } from "react";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { BrowserToolbar } from "@/components/BrowserToolbar";
import { HelpAssistant } from "@/components/HelpAssistant";
import { MockWebsite, SearchResults } from "@/components/MockWebsite";
import { demoSites, findDemoSite, type DemoSiteId } from "@/lib/demoSites";

export type BrowserPage =
  | { kind: "home" }
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
    navigate(siteId ? { kind: "site", siteId } : { kind: "search", query: value.trim() });
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
        {currentPage.kind === "home" && <BrowserHome onNavigate={navigateToSite} />}
        {currentPage.kind === "site" && <MockWebsite siteId={currentPage.siteId} />}
        {currentPage.kind === "search" && (
          <SearchResults query={currentPage.query} onNavigate={navigateToSite} />
        )}
      </div>

      {currentPage.kind === "site" && currentPage.siteId === "healthplus" && (
        <HelpAssistant key="healthplus" />
      )}
    </main>
  );
}

function BrowserHome({ onNavigate }: { onNavigate: (siteId: DemoSiteId) => void }) {
  return (
    <div className="senior-home">
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="EasyWeb home">
          <span className="brand-mark" aria-hidden="true">e</span>
          <span>EasyWeb</span>
        </a>
        <div className="connection-status" role="status">
          <span className="status-dot" aria-hidden="true" />
          You&apos;re connected
        </div>
      </header>

      <section className="home-content" id="main-content">
        <BookmarkGrid onNavigate={onNavigate} />
      </section>
    </div>
  );
}
