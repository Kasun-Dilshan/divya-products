import { NextResponse } from "next/server";
import { getSessionFromCookies, readOrders, writeOrders, type StoredOrderStatus } from "@/lib/auth/auth";

const allowedStatuses: StoredOrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || typeof body.status !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const status = body.status as StoredOrderStatus;
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const orders = await readOrders();
  const orderIndex = orders.findIndex((order) => order.id === params.id);
  if (orderIndex === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const existing = orders[orderIndex];
  const updated = { ...existing, status };
  orders[orderIndex] = updated;
  await writeOrders(orders);

  return NextResponse.json({ order: updated }, { status: 200 });
}
