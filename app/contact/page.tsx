import type { Metadata } from "next";
import { ContactPage } from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Divya Products for questions about Sri Lankan spices, wholesale orders, or delivery information.",
};

export default function Page() {
  return <ContactPage />;
}

