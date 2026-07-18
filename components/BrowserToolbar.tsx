"use client";

import { type FormEvent, useState } from "react";

type BrowserToolbarProps = {
  address: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isHome: boolean;
  onBack: () => void;
  onForward: () => void;
  onHome: () => void;
  onRefresh: () => void;
  onSubmit: (value: string) => void;
};

export function BrowserToolbar({
  address,
  canGoBack,
  canGoForward,
  isHome,
  onBack,
  onForward,
  onHome,
  onRefresh,
  onSubmit,
}: BrowserToolbarProps) {
  const [value, setValue] = useState(address);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value.trim()) onSubmit(value);
  }

  return (
    <header className="browser-toolbar" aria-label="EasyWeb browser controls">
      <nav className="browser-nav" aria-label="Page navigation">
        <button
          aria-label="Go back"
          className="browser-control"
          disabled={!canGoBack}
          onClick={onBack}
          type="button"
        >
          ←
        </button>
        <button
          aria-label="Go forward"
          className="browser-control"
          disabled={!canGoForward}
          onClick={onForward}
          type="button"
        >
          →
        </button>
        <button
          aria-label="Refresh page"
          className="browser-control"
          onClick={onRefresh}
          type="button"
        >
          ↻
        </button>
        <button
          aria-label="Go to EasyWeb Home"
          className="browser-control browser-home-control"
          disabled={isHome}
          onClick={onHome}
          type="button"
        >
          <span aria-hidden="true">⌂</span>
          <span className="control-label">Home</span>
        </button>
      </nav>

      <form className="address-form" onSubmit={handleSubmit} role="search">
        <span className="address-lock" aria-hidden="true">
          {isHome ? "⌕" : "🔒"}
        </span>
        <label className="sr-only" htmlFor="easyweb-address">
          Search or enter an address
        </label>
        <input
          autoCapitalize="none"
          autoComplete="off"
          id="easyweb-address"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search or type an address"
          spellCheck={false}
          type="text"
          value={value}
        />
        <button className="address-go" type="submit">
          Go
        </button>
      </form>
    </header>
  );
}
