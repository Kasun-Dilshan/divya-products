import { prisma } from "@/lib/prisma";
import { products as defaultProducts } from "@/data/products";

export type ProductCategory = "powder" | "whole" | "pieces" | "tea" | "mixed";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  image: string;
};

function mapPrismaProduct(product: import("@prisma/client").Product): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    category: product.category as ProductCategory,
    shortDescription: product.shortDescription,
    description: product.description,
    image: product.image,
  };
}

export async function readProducts(): Promise<Product[]> {
  let products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  if (!products || products.length === 0) {
    const created = await Promise.all(
      defaultProducts.map((item) =>
        prisma.product.upsert({
          where: { slug: item.slug },
          create: {
            id: item.id,
            slug: item.slug,
            name: item.name,
            price: item.price,
            category: item.category,
            shortDescription: item.shortDescription,
            description: item.description,
            image: item.image,
          },
          update: {},
        }),
      ),
    );
    products = created;
  }
  return products.map(mapPrismaProduct);
}

export async function writeProducts(_products: Product[]): Promise<void> {
  // If you need bulk write, implement with prisma.product.createMany / updateMany.
  // Current app writes via specific routes that use create/update/delete functions.
  throw new Error("use create/update/delete functions directly");
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? mapPrismaProduct(product) : undefined;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? mapPrismaProduct(product) : undefined;
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { slug: { not: slug } },
    take: limit,
  });
  return products.map(mapPrismaProduct);
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const created = await prisma.product.create({
    data: {
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      image: product.image,
    },
  });
  return mapPrismaProduct(created);
}

export async function updateProduct(id: string, update: Partial<Omit<Product, "id">>): Promise<Product> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new Error("Product not found.");

  const updated = await prisma.product.update({
    where: { id },
    data: {
      slug: update.slug ?? existing.slug,
      name: update.name ?? existing.name,
      price: update.price ?? existing.price,
      category: update.category ?? existing.category,
      shortDescription: update.shortDescription ?? existing.shortDescription,
      description: update.description ?? existing.description,
      image: update.image ?? existing.image,
    },
  });

  return mapPrismaProduct(updated);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

