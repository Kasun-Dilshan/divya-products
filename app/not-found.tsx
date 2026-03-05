import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center">
      <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm shadow-emerald-100/70 dark:border-emerald-900 dark:bg-slate-950/80 dark:shadow-emerald-950/40">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          Divya Products
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Page not found
        </h1>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          The page you are looking for doesn&apos;t exist or may have been
          moved. Explore our range of Sri Lankan spices instead.
        </p>
        <div className="pt-2">
          <Button type="button">
            <Link href="/shop">Browse Spices</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

