import type { Metadata } from "next";
import { CheckoutPage } from "@/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Divya Products order with your details and Cash on Delivery payment method.",
};

export default function Page() {
  return <CheckoutPage />;
}

