import type { Metadata } from "next";
import { BookmarkProvider } from "@/components/BookmarkProvider";
import { HelperConnectionProvider } from "@/components/HelperConnectionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasyWeb — Your simple, safer internet",
  description: "A calm and accessible way to visit the places you use online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HelperConnectionProvider>
          <BookmarkProvider>{children}</BookmarkProvider>
        </HelperConnectionProvider>
      </body>
    </html>
  );
}
