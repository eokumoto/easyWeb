"use client";

import type { CSSProperties } from "react";
import { useBookmarks } from "@/components/BookmarkProvider";
import type { DemoSiteId } from "@/lib/demoSites";

type BookmarkStyle = CSSProperties & { "--bookmark-color": string };

export function BookmarkGrid({
  onNavigate,
}: {
  onNavigate: (destination: DemoSiteId) => void;
}) {
  const { bookmarks } = useBookmarks();

  return (
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
  );
}
