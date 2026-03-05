"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { products, type ProductCategory } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const categories: { id: "all" | ProductCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "powder", label: "Powder" },
  { id: "whole", label: "Whole Spices" },
  { id: "mixed", label: "Mixed Spices" },
];

export function ShopPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "all" | ProductCategory
  >("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl dark:text-slate-50">
          Shop Sri Lankan Spices
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Explore our selection of pure, freshly ground and whole Sri Lankan
          spices. Filter by category or search to quickly find what you need.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:border-emerald-900/70 dark:bg-slate-950/80 dark:shadow-emerald-950/40 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-3 py-1 transition ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm shadow-emerald-400/40"
                  : "border border-emerald-100 bg-white text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-950 dark:text-emerald-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-950"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search spices..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs outline-none ring-emerald-400/60 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <motion.div
        layout
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredProducts.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-emerald-100 bg-white/70 p-8 text-center text-sm text-slate-500 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-slate-300">
            No products match your filters. Try adjusting the category or
            search term.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </motion.div>
    </div>
  );
}

