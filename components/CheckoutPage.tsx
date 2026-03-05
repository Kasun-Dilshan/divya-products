"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasItems = items.length > 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasItems) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!name || !address || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Simulate async order creation
      await new Promise((resolve) => setTimeout(resolve, 800));

      clearCart();
      toast.success("Order placed successfully! We will contact you soon.");
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl dark:text-slate-50">
          Checkout
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Provide your details and confirm your order. Payment is collected via
          Cash on Delivery.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-emerald-100 bg-white/80 p-5 text-sm shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-slate-200 dark:shadow-emerald-950/40"
        >
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-slate-700 dark:text-slate-100"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none ring-emerald-400/60 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="address"
              className="text-xs font-semibold text-slate-700 dark:text-slate-100"
            >
              Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Street, city, and any delivery instructions"
              rows={3}
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none ring-emerald-400/60 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="text-xs font-semibold text-slate-700 dark:text-slate-100"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="e.g. 07XXXXXXXX"
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs outline-none ring-emerald-400/60 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-100">
              Payment Method
            </p>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-800 shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:shadow-emerald-950/40">
              <p className="font-semibold">Cash on Delivery</p>
              <p className="mt-1 text-[0.7rem]">
                Pay in cash when your order is delivered to your doorstep.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>

        <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/80 p-5 text-sm shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-slate-200 dark:shadow-emerald-950/40">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Order Summary
          </h2>
          {!hasItems ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your cart is empty. Add some Sri Lankan spices before checking
              out.
            </p>
          ) : (
            <>
              <ul className="space-y-2 text-xs">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-[0.7rem] text-slate-500 dark:text-slate-400">
                        Qty {item.quantity} · LKR{" "}
                        {item.product.price.toLocaleString("en-LK")}
                      </p>
                    </div>
                    <p className="text-[0.8rem] font-semibold text-emerald-800 dark:text-emerald-300">
                      LKR{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-LK",
                      )}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-emerald-100 pt-3 text-xs dark:border-emerald-900">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">
                    Subtotal
                  </span>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    LKR {subtotal.toLocaleString("en-LK")}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">
                    Delivery
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Calculated on confirmation
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

