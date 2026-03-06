"use client";

import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string | null;
  children: React.ReactNode;
  hint?: string;
};

export function FormField({
  label,
  htmlFor,
  error,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold text-slate-700 dark:text-slate-100"
      >
        {label}
      </label>
      {children}
      {(hint || error) && (
        <p
          className={cn(
            "text-[0.72rem]",
            error ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400",
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

