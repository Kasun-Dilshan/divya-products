"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Thank you for reaching out. We will get back to you soon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl dark:text-slate-50">
          Contact Divya Products
        </h1>
        <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
          Have a question about our spices, wholesale orders, or delivery
          options? Send us a message and we&apos;ll be happy to help.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-emerald-100 bg-white/80 p-5 text-sm shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-slate-200 dark:shadow-emerald-950/40"
        >
          <div className="space-y-1">
            <label
              htmlFor="contact-name"
              className="text-xs font-semibold text-slate-700 dark:text-slate-100"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none ring-emerald-400/60 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="contact-email"
              className="text-xs font-semibold text-slate-700 dark:text-slate-100"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none ring-emerald-400/60 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="contact-message"
              className="text-xs font-semibold text-slate-700 dark:text-slate-100"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="How can we help you?"
              rows={4}
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none ring-emerald-400/60 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
            />
          </div>

          <div className="pt-1">
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>

        <div className="space-y-5 text-sm">
          <div className="rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-slate-200 dark:shadow-emerald-950/40">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Company Details
            </h2>
            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                  Divya Products
                </span>
                <br />
                Colombo, Sri Lanka
              </p>
              <p>
                Phone: +94 XX XXX XXXX
                <br />
                Email: hello@divyaproducts.lk
              </p>
              <p>Business hours: Mon – Sat, 9.00 AM – 6.00 PM</p>
            </div>
          </div>

          <div className="space-y-2 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 text-xs shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950 dark:text-slate-200 dark:shadow-emerald-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Find Us
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Google Map placeholder – embed your location map here.
            </p>
            <div className="mt-2 h-40 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

