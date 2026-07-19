import type { Metadata } from "next";
import { HelperCompanion } from "@/components/HelperCompanion";

export const metadata: Metadata = {
  title: "EasyWeb Companion — Prototype",
  description: "A preview of trusted family support for EasyWeb.",
};

export default function HelperPage() {
  return <HelperCompanion />;
}
