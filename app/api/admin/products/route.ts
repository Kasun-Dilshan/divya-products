import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/auth";
import { readProducts, writeProducts } from "@/lib/data";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await readProducts();
  return NextResponse.json({ products }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { name, price, category, shortDescription, description, image, slug } = body as {
    name?: string;
    price?: number;
    category?: string;
    shortDescription?: string;
    description?: string;
    image?: string;
    slug?: string;
  };

  if (!name || !slug || !price || !category || !shortDescription || !description || !image) {
    return NextResponse.json({ error: "Missing product fields." }, { status: 400 });
  }

  const products = await readProducts();
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

  const existsBySlug = products.some((product) => product.slug === slug);
  if (existsBySlug) {
    return NextResponse.json({ error: "Product slug already exists." }, { status: 409 });
  }

  const newProduct = {
    id,
    slug,
    name,
    price,
    category,
    shortDescription,
    description,
    image,
  };

  await writeProducts([...products, newProduct]);
  return NextResponse.json({ product: newProduct }, { status: 201 });
}
