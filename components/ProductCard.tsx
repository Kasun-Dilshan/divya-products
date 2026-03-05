import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { Button } from "@/components/Button";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 shadow-sm shadow-emerald-100/70 backdrop-blur-sm dark:border-emerald-900/60 dark:bg-slate-950/80 dark:shadow-emerald-950/40"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-slate-900"
      >
        <div className="relative aspect-[4/3]">
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 300px, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)] opacity-60 mix-blend-soft-light" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {product.name}
          </h3>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
            LKR {product.price.toLocaleString("en-LK")}
          </span>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Link
            href={`/shop/${product.slug}`}
            className="text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
          >
            View details
          </Link>
          <Button
            type="button"
            className="h-8 px-4 text-xs"
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

