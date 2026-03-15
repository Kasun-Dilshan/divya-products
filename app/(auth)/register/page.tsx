"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { FiMail, FiLock, FiUser, FiUserPlus } from "react-icons/fi";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({ name, email, password });
      toast.success("Account created successfully!");
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-100/50 bg-white/80 p-8 shadow-xl shadow-emerald-500/10 backdrop-blur-xl dark:border-emerald-800/50 dark:bg-slate-900/80"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
            <FiUserPlus size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join Divya Products today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Full Name" htmlFor="name">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiUser />
              </div>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-emerald-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-900"
                placeholder="John Doe"
              />
            </div>
          </FormField>

          <FormField label="Email address" htmlFor="email">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiMail />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-emerald-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-900"
                placeholder="you@example.com"
              />
            </div>
          </FormField>

          <FormField label="Password" htmlFor="password" hint="Must be at least 6 characters.">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FiLock />
              </div>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-emerald-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-900"
                placeholder="••••••••"
              />
            </div>
          </FormField>

          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            className="mt-2 py-3"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Creating account...
              </span>
            ) : (
              <span>Create account</span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href={`/login${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Suspense fallback={<div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
