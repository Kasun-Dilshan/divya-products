import type { Metadata } from "next";
import { CartPage } from "@/components/CartPage";

export const metadata: Metadata = {
  title: "Your Cart",
  description:
    "Review the Sri Lankan spices in your cart before placing your order with Divya Products.",
};

export default function Page() {
  return <CartPage />;
}

