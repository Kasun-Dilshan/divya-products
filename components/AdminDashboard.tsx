"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AdminOrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type AdminOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

type AdminOrder = {
  id: string;
  userId: string;
  customerName: string;
  address: string;
  phone: string;
  items: AdminOrderItem[];
  subtotal: number;
  status: AdminOrderStatus;
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

  const statusOptions: AdminOrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});
  const [orderFilter, setOrderFilter] = useState<"all" | AdminOrderStatus>("all");
  const [selectedOrders, setSelectedOrders] = useState<Record<string, boolean>>({});

  const filteredOrders = useMemo(() => {
    if (orderFilter === "all") return orders;
    return orders.filter((order) => order.status === orderFilter);
  }, [orders, orderFilter]);

  const selectedCount = useMemo(
    () => Object.values(selectedOrders).filter(Boolean).length,
    [selectedOrders],
  );

  const clearSelection = () => setSelectedOrders({});

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const updateMultipleStatus = async (newStatus: AdminOrderStatus) => {
    const idsToUpdate = Object.keys(selectedOrders).filter((id) => selectedOrders[id]);
    if (idsToUpdate.length === 0) return;

    setStatusUpdating((prev) => {
      const next = { ...prev };
      for (const id of idsToUpdate) next[id] = true;
      return next;
    });

    let errorText: string | null = null;
    for (const id of idsToUpdate) {
      try {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update status.");
        }
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order)));
      } catch (err) {
        errorText = err instanceof Error ? err.message : "Unable to update some order statuses.";
      }
    }

    if (errorText) setError(errorText);

    setStatusUpdating((prev) => {
      const next = { ...prev };
      for (const id of idsToUpdate) next[id] = false;
      return next;
    });
    clearSelection();
  };

  async function updateOrderStatus(orderId: string, status: AdminOrderStatus) {
    setStatusUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order status.");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Overview of users and orders. Only admin accounts can access this page.
        </p>
        <div className="mt-4">
          <a
            href="/admin/products"
            className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Manage Products
          </a>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-lg border border-emerald-300 bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-500 hover:to-emerald-400"
        >
          Manage Products
        </Link>
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
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected orders</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-200">{selectedCount}</p>
        </article>
        <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Filter</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOrderFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${orderFilter === "all" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 border border-emerald-100"}`}
            >
              All
            </button>
            {statusOptions.map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setOrderFilter(status)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${orderFilter === status ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 border border-emerald-100"}`}
              >
                {status}
              </button>
            ))}
          </div>
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
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-emerald-100 dark:border-emerald-800/60">
              <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">Latest Orders</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => updateMultipleStatus("processing")}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Set processing
                </button>
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => updateMultipleStatus("shipped")}
                  className="rounded-lg bg-cyan-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Set shipped
                </button>
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => updateMultipleStatus("delivered")}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Set delivered
                </button>
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => updateMultipleStatus("cancelled")}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Set cancelled
                </button>
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={clearSelection}
                  className="rounded-lg border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-700 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                      <tr>
                    <th className="px-4 py-3 font-semibold">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCount > 0 && selectedCount === filteredOrders.length && filteredOrders.length > 0}
                          onChange={(event) => {
                            if (event.target.checked) {
                              const allSelection: Record<string, boolean> = {};
                              filteredOrders.forEach((order) => { allSelection[order.id] = true; });
                              setSelectedOrders(allSelection);
                            } else {
                              clearSelection();
                            }
                          }}
                        />
                      </label>
                    </th>
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold">Items</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 text-center text-slate-500 dark:text-slate-300">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t border-emerald-100 dark:border-emerald-800/60">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedOrders[order.id])}
                            onChange={() => toggleOrderSelection(order.id)}
                            className="h-4 w-4 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100" aria-label="Order ID">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{order.customerName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDateTime(order.createdAt)}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{order.items.length}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(event) => updateOrderStatus(order.id, event.target.value as AdminOrderStatus)}
                            disabled={statusUpdating[order.id] ?? false}
                            className="rounded border border-emerald-200 px-2 py-1 text-xs text-slate-700 dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-100"
                          >
                            {statusOptions.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {statusOption}
                              </option>
                            ))}
                          </select>
                        </td>
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
