"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-slate-950 dark:to-emerald-950">
            <Navbar />
            <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

