export type Bookmark = {
  id: string;
  name: string;
  address: string;
};

export interface BookmarkStorage {
  getAll(): Bookmark[];
  saveAll(bookmarks: Bookmark[]): void;
  subscribe(onChange: (bookmarks: Bookmark[]) => void): () => void;
}

export const defaultBookmarks: Bookmark[] = [];

// Version 4 separates personal bookmarks from the controlled demo scenarios.
const STORAGE_KEY = "easyweb.bookmarks.v4";

function isBookmark(value: unknown): value is Bookmark {
  if (!value || typeof value !== "object") return false;

  const bookmark = value as Record<string, unknown>;
  return (
    typeof bookmark.id === "string" &&
    typeof bookmark.name === "string" &&
    typeof bookmark.address === "string"
  );
}

function isLegacyBookmark(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const bookmark = value as Record<string, unknown>;
  return (
    typeof bookmark.id === "string" &&
    typeof bookmark.label === "string" &&
    typeof bookmark.url === "string"
  );
}

function parseBookmarks(value: string | null): Bookmark[] | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    if (parsed.every(isBookmark)) return parsed;
    if (parsed.every(isLegacyBookmark)) {
      return parsed.map((bookmark) => ({
        id: bookmark.id,
        name: bookmark.label,
        address: bookmark.url,
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export function normalizeBookmarkAddress(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const address = new URL(candidate);
    if ((address.protocol !== "http:" && address.protocol !== "https:") || !address.hostname) {
      return null;
    }
    return address.toString();
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
