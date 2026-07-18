"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  bookmarkStorage,
  defaultBookmarks,
  type Bookmark,
} from "@/lib/bookmarks";

type BookmarkContextValue = {
  bookmarks: Bookmark[];
  saveBookmarks: (bookmarks: Bookmark[]) => void;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(defaultBookmarks);

  useEffect(() => {
    setBookmarks(bookmarkStorage.getAll());
    return bookmarkStorage.subscribe(setBookmarks);
  }, []);

  const saveBookmarks = useCallback((nextBookmarks: Bookmark[]) => {
    setBookmarks(nextBookmarks);
    bookmarkStorage.saveAll(nextBookmarks);
  }, []);

  const value = useMemo(
    () => ({ bookmarks, saveBookmarks }),
    [bookmarks, saveBookmarks],
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within BookmarkProvider");
  }
  return context;
}
