import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Pure & Fresh Sri Lankan Spices",
  description:
    "Discover pure and fresh Sri Lankan spices from Divya Products, crafted with care and delivered in eco-friendly packaging.",
};

export default function Home() {
  return <HomePage />;
}

