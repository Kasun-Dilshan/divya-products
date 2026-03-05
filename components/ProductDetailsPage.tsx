"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Button } from "@/components/Button";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";

type ProductDetailsPageProps = {
  product: Product;
  related: Product[];
};

export function ProductDetailsPage({ product, related }: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const priceFormatted = product.price.toLocaleString("en-LK");

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/80 shadow-lg shadow-emerald-100/70 backdrop-blur-sm dark:border-emerald-900/70 dark:bg-slate-950/80 dark:shadow-emerald-950/40"
        >
          <div className="relative aspect-[4/5] cursor-zoom-in overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative h-full w-full"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 420px, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.4),_transparent_55%)] mix-blend-soft-light" />
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
              Divya Products · Sri Lankan Spices
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl dark:text-slate-50">
              {product.name}
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
              LKR {priceFormatted}
            </span>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            <p>{product.description}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Packed in eco-friendly, recyclable packaging to preserve freshness
              and support a greener Sri Lanka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-emerald-50/60 p-4 text-xs text-slate-700 dark:bg-emerald-950/40 dark:text-slate-200">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                Quantity
              </span>
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2 py-1 shadow-sm shadow-emerald-100/70 dark:border-emerald-800 dark:bg-slate-950 dark:shadow-emerald-950/40">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="h-6 w-6 rounded-full text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="mx-3 min-w-[1.5rem] text-center text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="h-6 w-6 rounded-full text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-3">
              <Button type="button" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Link
                href="/cart"
                className="text-xs font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-300"
              >
                View Cart
              </Link>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">
              Shipping & Storage
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Store in a cool, dry place away from direct sunlight.</li>
              <li>Best consumed within 12 months of purchase for full flavor.</li>
              <li>Island-wide delivery within 2–5 business days.</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 md:text-base dark:text-slate-50">
              Related Spices
            </h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

