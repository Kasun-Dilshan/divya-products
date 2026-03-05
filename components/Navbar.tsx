"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-emerald-100/60 bg-white/80 backdrop-blur-xl dark:border-emerald-800/60 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-emerald-800 dark:text-emerald-100"
        >
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/40" />
          <span>Divya Products</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative transition-colors",
                    active
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-slate-700 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-300",
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-950"
            >
              {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            <Link
              href="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/40 transition hover:from-emerald-500 hover:to-emerald-400"
            >
              <FiShoppingCart size={16} />
              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1.1rem] items-center justify-center rounded-full bg-white px-1 text-[0.65rem] font-semibold text-emerald-700 shadow-sm shadow-emerald-500/40 dark:bg-emerald-100">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-100 dark:hover:border-emerald-500 dark:hover:bg-emerald-950 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-emerald-100/70 bg-white/95 shadow-sm shadow-emerald-100/60 backdrop-blur-xl dark:border-emerald-800/70 dark:bg-slate-950/95"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-2 text-sm font-medium">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-full px-3 py-2 transition-colors",
                        active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                          : "text-slate-700 hover:bg-emerald-50 dark:text-slate-100 dark:hover:bg-emerald-900/40",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-100 dark:hover:border-emerald-500 dark:hover:bg-emerald-950"
                >
                  {theme === "dark" ? (
                    <>
                      <FiSun size={14} /> <span>Light mode</span>
                    </>
                  ) : (
                    <>
                      <FiMoon size={14} /> <span>Dark mode</span>
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/40"
                >
                  <FiShoppingCart size={14} />
                  <span>Cart</span>
                  {totalQuantity > 0 && (
                    <span className="inline-flex h-4 min-w-[1.1rem] items-center justify-center rounded-full bg-white px-1 text-[0.65rem] font-semibold text-emerald-700">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

