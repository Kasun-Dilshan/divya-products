import path from "node:path";
import { promises as fs } from "node:fs";
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

const productsFilePath = path.join(process.cwd(), "data", "products.json");

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, value: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export async function readProducts(): Promise<Product[]> {
  const fileProducts = await readJsonFile<Product[]>(productsFilePath, []);
  if (Array.isArray(fileProducts) && fileProducts.length > 0) {
    return fileProducts;
  }

  await writeJsonFile(productsFilePath, defaultProducts as Product[]);
  return defaultProducts as Product[];
}

export async function writeProducts(products: Product[]): Promise<void> {
  await writeJsonFile(productsFilePath, products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((product) => product.id === id || product.slug === id);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((product) => product.slug === slug);
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const products = await readProducts();
  return products.filter((product) => product.slug !== slug).slice(0, limit);
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const products = await readProducts();
  const finalSlug = product.slug.trim().toLowerCase();
  const id = finalSlug;

  if (!product.name.trim() || !finalSlug) {
    throw new Error("Product name and slug are required.");
  }

  const exists = products.some((item) => item.id === id || item.slug === finalSlug);
  if (exists) {
    throw new Error("Product with this slug already exists.");
  }

  const newProduct: Product = {
    ...product,
    id,
    slug: finalSlug,
  };

  const updated = [...products, newProduct];
  await writeProducts(updated);
  return newProduct;
}

export async function updateProduct(id: string, product: Partial<Omit<Product, "id">>): Promise<Product> {
  const products = await readProducts();
  const index = products.findIndex((item) => item.id === id || item.slug === id);
  if (index < 0) {
    throw new Error("Product not found.");
  }

  const updated = {
    ...products[index],
    ...product,
  };

  if (product.slug && product.slug.trim() !== products[index].slug) {
    updated.slug = product.slug.trim().toLowerCase();
    updated.id = updated.slug;
  }

  const duplicates = products.some(
    (item, idx) =>
      idx !== index &&
      (item.id === updated.id || item.slug === updated.slug)
  );

  if (duplicates) {
    throw new Error("Another product already uses that slug.");
  }

  const updatedProducts = [...products];
  updatedProducts[index] = updated;

  await writeProducts(updatedProducts);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await readProducts();
  const filtered = products.filter((item) => item.id !== id && item.slug !== id);
  if (filtered.length === products.length) {
    throw new Error("Product not found.");
  }
  await writeProducts(filtered);
}

