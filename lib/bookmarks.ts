import type { DemoSiteId } from "@/lib/demoSites";

export type Bookmark = {
  id: string;
  label: string;
  url: string;
  destination: DemoSiteId;
  icon: string;
  color: string;
};

export interface BookmarkStorage {
  getAll(): Bookmark[];
  saveAll(bookmarks: Bookmark[]): void;
  subscribe(onChange: (bookmarks: Bookmark[]) => void): () => void;
}

export const defaultBookmarks: Bookmark[] = [];

// Version 4 separates personal bookmarks from the controlled demo scenarios.
const STORAGE_KEY = "easyweb.bookmarks.v4";
const demoSiteIds: DemoSiteId[] = ["healthplus", "pharmacy", "utility", "vitaglow"];

function isBookmark(value: unknown): value is Bookmark {
  if (!value || typeof value !== "object") return false;

  const bookmark = value as Record<string, unknown>;
  return (
    typeof bookmark.id === "string" &&
    typeof bookmark.label === "string" &&
    typeof bookmark.url === "string" &&
    typeof bookmark.destination === "string" &&
    demoSiteIds.includes(bookmark.destination as DemoSiteId) &&
    typeof bookmark.icon === "string" &&
    typeof bookmark.color === "string"
  );
}

function parseBookmarks(value: string | null): Bookmark[] | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every(isBookmark) ? parsed : null;
  } catch {
    return null;
  }
}

class LocalBookmarkStorage implements BookmarkStorage {
  getAll(): Bookmark[] {
    if (typeof window === "undefined") return defaultBookmarks;
    return parseBookmarks(window.localStorage.getItem(STORAGE_KEY)) ?? defaultBookmarks;
  }

  saveAll(bookmarks: Bookmark[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }

  subscribe(onChange: (bookmarks: Bookmark[]) => void): () => void {
    if (typeof window === "undefined") return () => undefined;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      onChange(parseBookmarks(event.newValue) ?? defaultBookmarks);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }
}

// Swap this adapter for a Supabase-backed implementation when remote sync is added.
export const bookmarkStorage: BookmarkStorage = new LocalBookmarkStorage();
