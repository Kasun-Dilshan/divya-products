import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/auth";
import { getProductById, readProducts, writeProducts } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await getProductById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product }, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await request.json().catch(() => null);
  if (!updates || typeof updates !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const products = await readProducts();
  const productIndex = products.findIndex((p) => p.id === params.id);
  if (productIndex === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = products[productIndex];
  const updated: typeof existing = {
    ...existing,
    ...updates,
  };

  if (!updated.name || !updated.slug || !updated.price || !updated.category || !updated.shortDescription || !updated.description || !updated.image) {
    return NextResponse.json({ error: "Missing product fields." }, { status: 400 });
  }

  const duplicateSlug = products.some((p) => p.slug === updated.slug && p.id !== params.id);
  if (duplicateSlug) {
    return NextResponse.json({ error: "Product slug already exists." }, { status: 409 });
  }

  products[productIndex] = updated;
  await writeProducts(products);
  return NextResponse.json({ product: updated }, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await readProducts();
  const remaining = products.filter((item) => item.id !== params.id);

  if (remaining.length === products.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writeProducts(remaining);
  return NextResponse.json({ success: true }, { status: 200 });
}
