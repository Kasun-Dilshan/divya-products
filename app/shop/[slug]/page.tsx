import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductDetailsPage } from "@/components/ProductDetailsPage";

type Params = {
  slug: string;
};

type PageProps = {
  params: Params;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function Page({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return notFound();
  }

  const related = await getRelatedProducts(params.slug, 3);
  return <ProductDetailsPage product={product} related={related} />;
}

