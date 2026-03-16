"use client";

import { useEffect, useMemo, useState } from "react";

type AdminOrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type AdminOrder = {
  id: string;
  userId: string;
  customerName: string;
  address: string;
  phone: string;
  items: AdminOrderItem[];
  subtotal: number;
  createdAt: string;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "customer";
  createdAt: string;
};

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const [usersRes, ordersRes] = await Promise.all([
          fetch("/api/admin/users", { cache: "no-store" }),
          fetch("/api/admin/orders", { cache: "no-store" }),
        ]);

        if (!usersRes.ok || !ordersRes.ok) {
          const userJson = await usersRes.json().catch(() => ({}));
          const orderJson = await ordersRes.json().catch(() => ({}));
          throw new Error(
            userJson.error || orderJson.error || "Failed to load admin data.",
          );
        }

        const userData = await usersRes.json();
        const orderData = await ordersRes.json();

        if (!isActive) return;

        setUsers(Array.isArray(userData.users) ? userData.users : []);
        setOrders(Array.isArray(orderData.orders) ? orderData.orders : []);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((acc, order) => acc + order.subtotal, 0),
    [orders],
  );

  const totalItems = useMemo(
    () => orders.reduce((acc, order) => acc + order.items.reduce((sum, item) => sum + item.quantity, 0), 0),
    [orders],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Overview of users and orders. Only admin accounts can access this page.
        </p>
      </section>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <section className="mb-8 grid gap-4 sm:grid-cols-4">
        <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total users</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-200">{users.length}</p>
        </article>
        <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total orders</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-200">{orders.length}</p>
        </article>
        <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total items</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-200">{totalItems}</p>
        </article>
        <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total revenue</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-200">₹{totalRevenue.toFixed(2)}</p>
        </article>
      </section>

      {isLoading ? (
        <div className="rounded-xl border border-emerald-100 bg-white p-6 text-center dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-sm text-slate-700 dark:text-slate-300">Loading admin data…</p>
        </div>
      ) : (
        <>
          <section className="mb-8 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
            <div className="px-6 py-4 border-b border-emerald-100 dark:border-emerald-800/60">
              <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">Latest Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold">Items</th>
                    <th className="px-4 py-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-slate-500 dark:text-slate-300">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-t border-emerald-100 dark:border-emerald-800/60">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100" aria-label="Order ID">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{order.customerName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDateTime(order.createdAt)}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{order.items.length}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">₹{order.subtotal.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
            <div className="px-6 py-4 border-b border-emerald-100 dark:border-emerald-800/60">
              <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">Registered Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-slate-500 dark:text-slate-300">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-t border-emerald-100 dark:border-emerald-800/60">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 capitalize">{user.role}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDateTime(user.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
