"use client";

import type { CSSProperties } from "react";
import { useBookmarks } from "@/components/BookmarkProvider";

type BookmarkStyle = CSSProperties & { "--bookmark-color": string };

export function BookmarkGrid({
  onNavigate,
}: {
  onNavigate: (address: string) => void;
}) {
  const { bookmarks } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <section className="empty-bookmarks" aria-labelledby="empty-bookmarks-title">
        <span className="empty-bookmarks-icon" aria-hidden="true">☆</span>
        <h2 id="empty-bookmarks-title">No bookmarks yet</h2>
        <p>Your helper can add websites here.</p>
      </section>
    );
  }

  return (
      <div className="bookmark-grid" aria-label="Your bookmarks">
        {bookmarks.map((bookmark) => (
          <button
            className="bookmark-card"
            key={bookmark.id}
            onClick={() => onNavigate(bookmark.address)}
            style={{ "--bookmark-color": "#e5f6f0" } as BookmarkStyle}
            type="button"
          >
            <span className="bookmark-icon" aria-hidden="true">
              {bookmark.name.charAt(0).toUpperCase()}
            </span>
            <span className="bookmark-label">
              <span>
                {bookmark.name}
                <span className="bookmark-address">{bookmark.address}</span>
              </span>
              <span className="bookmark-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </button>
        ))}
      </div>
  );
}
