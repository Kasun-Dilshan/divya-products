import type { Metadata } from "next";
import { ShopPage } from "@/components/ShopPage";

export const metadata: Metadata = {
  title: "Shop Sri Lankan Spices",
  description:
    "Browse pure and fresh Sri Lankan spices from Divya Products, including powders, whole spices, and mixed blends.",
};

export default function Page() {
  return <ShopPage />;
}

