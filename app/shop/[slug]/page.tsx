import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { ProductDetailsPage } from "@/components/ProductDetailsPage";

type Params = {
  slug: string;
};

type PageProps = {
  params: Params;
};

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default function Page({ params }: PageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  const related = getRelatedProducts(params.slug, 3);

  return <ProductDetailsPage product={product} related={related} />;
}

