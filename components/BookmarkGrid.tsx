"use client";

import type { CSSProperties } from "react";
import { useBookmarks } from "@/components/BookmarkProvider";
import type { DemoSiteId } from "@/lib/demoSites";

type BookmarkStyle = CSSProperties & { "--bookmark-color": string };

export function BookmarkGrid({
  onNavigate,
  onOpenDemos,
}: {
  onNavigate: (destination: DemoSiteId) => void;
  onOpenDemos: () => void;
}) {
  const { bookmarks } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <section className="empty-bookmarks" aria-labelledby="empty-bookmarks-title">
        <span className="empty-bookmarks-icon" aria-hidden="true">☆</span>
        <h2 id="empty-bookmarks-title">Your bookmarks will appear here</h2>
        <p>Your trusted helper can add useful websites here.</p>
        <button onClick={onOpenDemos} type="button">Try demo scenarios</button>
      </section>
    );
  }

  return (
    <>
      <div className="bookmark-grid" aria-label="Your bookmarks">
        {bookmarks.map((bookmark) => (
          <button
            className="bookmark-card"
            key={bookmark.id}
            onClick={() => onNavigate(bookmark.destination)}
            style={{ "--bookmark-color": bookmark.color } as BookmarkStyle}
            type="button"
          >
            <span className="bookmark-icon" aria-hidden="true">
              {bookmark.icon}
            </span>
            <span className="bookmark-label">
              <span>
                {bookmark.label}
                <span className="bookmark-address">{bookmark.url}</span>
              </span>
              <span className="bookmark-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </button>
        ))}
      </div>
      <button className="demo-access-button" onClick={onOpenDemos} type="button">
        Try demo scenarios
      </button>
    </>
  );
}
