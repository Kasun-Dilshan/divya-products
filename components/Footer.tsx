import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-emerald-100/60 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 py-8 text-sm text-slate-600 dark:border-emerald-900/70 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950 dark:text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-base font-semibold text-emerald-800 dark:text-emerald-100">
            Divya Products
          </p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Pure, fresh, and naturally sourced Sri Lankan spices delivered to
            your doorstep.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 text-xs sm:items-end">
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm shadow-emerald-200/60 transition hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-emerald-950"
            >
              <FiFacebook size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm shadow-emerald-200/60 transition hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-emerald-950"
            >
              <FiInstagram size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm shadow-emerald-200/60 transition hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-emerald-950"
            >
              <FiTwitter size={16} />
            </a>
          </div>

          <div className="flex flex-wrap gap-3 text-[0.7rem] text-slate-500 dark:text-slate-400">
            <span>© {new Date().getFullYear()} Divya Products.</span>
            <span>All rights reserved.</span>
            <Link href="/contact" className="hover:text-emerald-700 dark:hover:text-emerald-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

