import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-3">
        <div className="h-5 w-48 rounded-full bg-emerald-100 dark:bg-emerald-900" />
        <div className="h-3 w-64 rounded-full bg-emerald-100 dark:bg-emerald-900" />
      </div>

      <div className="h-16 rounded-3xl border border-emerald-100 bg-white/70 shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:shadow-emerald-950/40" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

