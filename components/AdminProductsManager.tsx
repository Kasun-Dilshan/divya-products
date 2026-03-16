"use client";

import { useEffect, useMemo, useState } from "react";

type ProductCategory = "powder" | "whole" | "pieces" | "tea" | "mixed";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  image: string;
};

const categories: ProductCategory[] = ["powder", "whole", "pieces", "tea", "mixed"];

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminProductsManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selected, setSelected] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialForm = {
    slug: "",
    name: "",
    price: 0,
    category: "powder" as ProductCategory,
    shortDescription: "",
    description: "",
    image: "",
  };

  const [form, setForm] = useState(initialForm);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load products");
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const resetForm = () => {
    setSelected(null);
    setForm(initialForm);
    setError(null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...form,
      slug: sanitizeSlug(form.slug || form.name),
      price: Number(form.price),
    };

    if (!payload.name || !payload.slug || !payload.price || !payload.shortDescription || !payload.description || !payload.image) {
      setError("All fields are required.");
      setIsSaving(false);
      return;
    }

    try {
      const method = selected ? "PATCH" : "POST";
      const url = selected ? `/api/admin/products/${selected.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      await loadProducts();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  };

  const onEdit = (product: AdminProduct) => {
    setSelected(product);
    setForm({
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      image: product.image,
    });
    setError(null);
  };

  const onDelete = async (product: AdminProduct) => {
    if (!confirm(`Delete product “${product.name}”?`)) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");
      await loadProducts();
      if (selected?.id === product.id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  };

  const totalProducts = products.length;

  const summary = useMemo(
    () => ({
      powder: products.filter((p) => p.category === "powder").length,
      whole: products.filter((p) => p.category === "whole").length,
      pieces: products.filter((p) => p.category === "pieces").length,
      tea: products.filter((p) => p.category === "tea").length,
      mixed: products.filter((p) => p.category === "mixed").length,
    }),
    [products],
  );

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">Product Management</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Add, edit, or delete products. Changes persist in <code>data/products.json</code>.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">Inventory</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Total products: {totalProducts}</div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Powder: {summary.powder}</div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Whole: {summary.whole}</div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Pieces: {summary.pieces}</div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Tea: {summary.tea}</div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Mixed: {summary.mixed}</div>
          </div>
        </article>

        <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
          <form onSubmit={onSubmit} className="space-y-3">
            <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">{selected ? "Edit product" : "Add product"}</h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Slug
                <input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: sanitizeSlug(e.target.value) }))}
                  className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="auto-generated if empty"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Price
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as ProductCategory }))}
                  className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Short Description
              <input
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
                rows={3}
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Image URL
              <input
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full rounded-md border border-emerald-100 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {selected ? "Update product" : "Create product"}
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-emerald-200 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm dark:border-emerald-800/60 dark:bg-slate-900">
        <div className="px-6 py-4 border-b border-emerald-100 dark:border-emerald-800/60">
          <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">Product list</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-slate-500 dark:text-slate-300">
                    No products available.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t border-emerald-100 dark:border-emerald-800/60">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{product.name}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{product.slug}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{product.category}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">₹{product.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="mr-2 rounded-md bg-emerald-600 px-2 py-1 text-white transition hover:bg-emerald-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="rounded-md bg-rose-500 px-2 py-1 text-white transition hover:bg-rose-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
