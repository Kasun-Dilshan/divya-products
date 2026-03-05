"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const reviews = [
  {
    name: "Nirosha P.",
    text: "The aroma of the cinnamon and curry powder is incredible. You can really tell these are freshly sourced spices.",
  },
  {
    name: "Anuradha S.",
    text: "Beautiful eco-friendly packaging and fast delivery. Divya Products has become my go-to for Sri Lankan spices.",
  },
  {
    name: "Maneesha D.",
    text: "The turmeric powder is so vibrant and flavorful. It has elevated all my home-cooked curries.",
  },
];

export function HomePage() {
  const router = useRouter();
  const featured = products.slice(0, 3);

  return (
    <div className="flex w-full flex-col gap-16">
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 shadow-sm shadow-emerald-100 dark:border-emerald-900 dark:bg-slate-950/80 dark:text-emerald-300"
          >
            Pure & Fresh Sri Lankan Spices
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-50"
          >
            Bringing the essence of{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Sri Lankan spices
            </span>{" "}
            to your kitchen.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300"
          >
            Divya Products carefully sources spices from trusted Sri Lankan
            farmers, ensuring every batch is naturally grown, freshly processed,
            and packed in eco-friendly materials to preserve flavor and aroma.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button type="button" onClick={() => router.push("/shop")}>
              Shop Now
            </Button>
            <Link
              href="/contact"
              className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-300"
            >
              Talk to us
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="grid gap-4 pt-4 text-xs text-slate-700 sm:grid-cols-3 dark:text-slate-300"
          >
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm shadow-emerald-100/60 backdrop-blur-sm dark:bg-slate-950/80 dark:shadow-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                Pure Quality
              </p>
              <p className="mt-1 leading-relaxed">
                No additives or artificial colors – only handpicked, natural
                spices.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm shadow-emerald-100/60 backdrop-blur-sm dark:bg-slate-950/80 dark:shadow-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                Freshness Guaranteed
              </p>
              <p className="mt-1 leading-relaxed">
                Small batch grinding to lock in essential oils and aroma.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm shadow-emerald-100/60 backdrop-blur-sm dark:bg-slate-950/80 dark:shadow-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                Fast Delivery
              </p>
              <p className="mt-1 leading-relaxed">
                Island-wide delivery in eco-friendly, recyclable packaging.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative h-full"
        >
          <div className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/80 shadow-xl shadow-emerald-100/60 backdrop-blur-sm dark:border-emerald-900/60 dark:bg-slate-950/80 dark:shadow-emerald-950/40">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/hero-spices.svg"
                alt="Fresh Sri Lankan spices in bowls and wooden spoons"
                fill
                priority
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 320px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_50%)] mix-blend-soft-light" />
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 p-3 text-xs text-slate-700 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:bg-slate-950/90 dark:text-slate-200 dark:shadow-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                Naturally grown & hand-selected
              </p>
              <p className="mt-1 text-[0.7rem] leading-relaxed">
                Experience the true taste of Sri Lanka with every pinch.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 md:text-lg dark:text-slate-50">
              Featured Spices
            </h2>
            <p className="text-xs text-slate-600 md:text-sm dark:text-slate-300">
              A curated selection of our most loved Sri Lankan spices.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
          >
            View all products
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 md:text-lg dark:text-slate-50">
            Why Choose Divya Products?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">
            We partner with local farmers across Sri Lanka and follow
            small-batch processing methods to preserve the natural goodness in
            every spice. From harvest to packaging, we focus on sustainability
            and purity.
          </p>
          <div className="grid gap-4 text-xs text-slate-700 sm:grid-cols-3 dark:text-slate-200">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:bg-slate-950/80 dark:shadow-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                Farm-to-Table
              </p>
              <p className="mt-1 leading-relaxed">
                Direct relationships with growers to ensure traceability and
                fair trade.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:bg-slate-950/80 dark:shadow-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                Eco-Friendly
              </p>
              <p className="mt-1 leading-relaxed">
                Recyclable and minimal packaging to reduce environmental impact.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:bg-slate-950/80 dark:shadow-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                Consistent Quality
              </p>
              <p className="mt-1 leading-relaxed">
                Carefully tested batches for flavor, color, and purity.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            Customer Reviews
          </h3>
          <div className="grid gap-4 text-xs sm:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:bg-slate-950/80 dark:text-slate-200 dark:shadow-emerald-950/40"
              >
                <p className="leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                <p className="mt-1 text-[0.7rem] font-semibold text-emerald-800 dark:text-emerald-200">
                  {review.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

