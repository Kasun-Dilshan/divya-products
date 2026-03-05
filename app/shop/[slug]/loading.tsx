export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <div className="animate-pulse overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/80 shadow-lg shadow-emerald-100/70 dark:border-emerald-900/70 dark:bg-slate-950/80 dark:shadow-emerald-950/40">
          <div className="aspect-[4/5] bg-emerald-50/70 dark:bg-emerald-950/40" />
        </div>
        <div className="space-y-4">
          <div className="h-3 w-44 rounded-full bg-emerald-100 dark:bg-emerald-900" />
          <div className="h-6 w-64 rounded-full bg-emerald-100 dark:bg-emerald-900" />
          <div className="space-y-2">
            <div className="h-3 w-72 rounded-full bg-emerald-100 dark:bg-emerald-900" />
            <div className="h-3 w-56 rounded-full bg-emerald-100 dark:bg-emerald-900" />
          </div>
          <div className="h-8 w-40 rounded-full bg-emerald-100 dark:bg-emerald-900" />
          <div className="h-20 w-full rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 w-40 rounded-full bg-emerald-100 dark:bg-emerald-900" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm shadow-emerald-100/70 dark:border-emerald-900 dark:bg-slate-950/80 dark:shadow-emerald-950/40"
            >
              <div className="aspect-[4/3] rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

