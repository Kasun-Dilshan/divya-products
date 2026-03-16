import { promises as fs } from "node:fs";
import path from "node:path";
import { products as defaultProducts } from "@/data/products";

type ProductCategory = "powder" | "whole" | "pieces" | "tea" | "mixed";

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

const fileName = "products.json";

function dataPath() {
  return path.join(process.cwd(), "data", fileName);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, value: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export async function readProducts(): Promise<Product[]> {
  const pathName = dataPath();
  const products = await readJsonFile<Product[]>(pathName, []);

  if (!Array.isArray(products) || products.length === 0) {
    await writeProducts(defaultProducts as Product[]);
    return defaultProducts as Product[];
  }

  return products;
}

export async function writeProducts(products: Product[]): Promise<void> {
  await writeJsonFile(dataPath(), products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((item) => item.id === id);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((item) => item.slug === slug);
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const products = await readProducts();
  return products.filter((item) => item.slug !== slug).slice(0, limit);
}
