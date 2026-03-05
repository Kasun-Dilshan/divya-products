"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useCart } from "@/context/CartContext";

export function CartPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  const hasItems = items.length > 0;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl dark:text-slate-50">
          Shopping Cart
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Review your selected spices, adjust quantities, or proceed to secure
          checkout.
        </p>
      </div>

      {!hasItems ? (
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-emerald-100 bg-white/80 p-6 text-sm text-slate-600 shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-slate-300 dark:shadow-emerald-950/40">
          <p>Your cart is currently empty.</p>
          <Button type="button" onClick={() => router.push("/shop")}>
            Browse Spices
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:shadow-emerald-950/40 sm:p-5">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col gap-3 border-b border-emerald-50 pb-4 last:border-b-0 last:pb-0 dark:border-emerald-900/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {item.product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      LKR{" "}
                      {item.product.price.toLocaleString("en-LK")} per pack
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2 py-1 shadow-sm shadow-emerald-100/70 dark:border-emerald-800 dark:bg-slate-950 dark:shadow-emerald-950/40">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      className="h-6 w-6 rounded-full text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="mx-3 min-w-[1.5rem] text-center text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="h-6 w-6 rounded-full text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200">
                    Line total:{" "}
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      LKR{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-LK",
                      )}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/80 p-5 text-sm shadow-sm shadow-emerald-100/60 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-slate-200 dark:shadow-emerald-950/40">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Order Summary
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Subtotal
                </span>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  LKR {subtotal.toLocaleString("en-LK")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Delivery
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Calculated at checkout
                </span>
              </div>
            </div>
            <div className="border-t border-emerald-100 pt-3 text-xs dark:border-emerald-900">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  Estimated Total
                </span>
                <span className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
                  LKR {subtotal.toLocaleString("en-LK")}
                </span>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <Button
                type="button"
                fullWidth
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => router.push("/shop")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

