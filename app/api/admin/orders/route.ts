import { NextResponse } from "next/server";
import { getSessionFromCookies, readOrders } from "@/lib/auth/auth";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = (await readOrders()).map((order) => ({
    ...order,
    status: order.status ?? "pending",
  }));

  return NextResponse.json({ orders }, { status: 200 });
}

