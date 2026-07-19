import type { Metadata } from "next";
import Link from "next/link";
import { SeniorBrowserExperience } from "@/components/SeniorBrowserExperience";

export const metadata: Metadata = {
  title: "EasyWeb Browser",
  description: "The EasyWeb senior browsing experience.",
};

export default function BrowserPage() {
  return (
    <>
      <SeniorBrowserExperience />
      <Link className="browser-public-link" href="/" aria-label="Return to the EasyWeb landing page">
        EasyWeb site
      </Link>
    </>
  );
}
