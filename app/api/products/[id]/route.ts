import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function GET(
  _: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> },
) {
  const params = await context.params;
  const product = await getProductById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product }, { status: 200 });
}
