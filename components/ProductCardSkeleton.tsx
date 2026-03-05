export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white/70 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:border-emerald-900/60 dark:bg-slate-950/80 dark:shadow-emerald-950/40">
      <div className="relative aspect-[4/3] bg-emerald-50/60 dark:bg-emerald-950/40" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3.5 w-28 rounded-full bg-emerald-100 dark:bg-emerald-900" />
          <div className="h-3 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-900" />
          <div className="h-2.5 w-3/4 rounded-full bg-emerald-100 dark:bg-emerald-900" />
        </div>
        <div className="mt-auto flex items-center justify-end gap-2 pt-2">
          <div className="h-8 w-24 rounded-full bg-emerald-100 dark:bg-emerald-900" />
        </div>
      </div>
    </div>
  );
}

