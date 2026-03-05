import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProviders } from "@/components/RootProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Divya Products | Pure Sri Lankan Spices",
    template: "%s | Divya Products",
  },
  description:
    "Divya Products offers pure and fresh Sri Lankan spices with a focus on quality, freshness, and eco-friendly packaging.",
  keywords: [
    "Sri Lankan spices",
    "Ceylon cinnamon",
    "turmeric powder",
    "black pepper",
    "curry powder",
    "Divya Products",
  ],
  openGraph: {
    title: "Divya Products | Pure & Fresh Sri Lankan Spices",
    description:
      "Shop premium, eco-friendly Sri Lankan spices from Divya Products. Pure, fresh, and naturally sourced.",
    url: "https://divya-products.example.com",
    siteName: "Divya Products",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}

