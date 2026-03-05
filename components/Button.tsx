import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
};

const baseClasses =
  "relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "text-white shadow-lg shadow-emerald-500/30 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 dark:from-emerald-500 dark:via-emerald-400 dark:to-emerald-300",
  outline:
    "border border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-400 dark:hover:bg-emerald-900/30",
  ghost:
    "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/30",
};

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        baseClasses,
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

