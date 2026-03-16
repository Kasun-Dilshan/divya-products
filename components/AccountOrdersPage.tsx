"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

type Order = {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
};

function statusLabel(status: OrderStatus) {
  const map: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200" },
    shipped: { label: "Shipped", className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200" },
    delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" },
    cancelled: { label: "Cancelled", className: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200" },
  };
  return map[status] ?? map.pending;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/account/orders", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load orders.");
        }

        if (active) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">My Orders</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Track your order status and details for all placed orders.</p>
      </section>

      {isLoading ? (
        <div className="rounded-xl border border-emerald-100 bg-white p-6 text-center dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-sm text-slate-700 dark:text-slate-300">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-emerald-100 bg-white p-6 text-center dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">No orders found yet. Place an order from shop to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusLabel(order.status);
            return (
              <article key={order.id} className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Order #{order.id}</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-slate-700 dark:text-slate-200">Customer: {order.customerName}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">Phone: {order.phone}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">Address: {order.address}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">Total: ₹{order.subtotal.toFixed(2)}</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Items</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                    {order.items.map((item) => (
                      <li key={item.productId} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
