import { NextResponse } from "next/server";
import {
  getSessionFromCookies,
  readOrders,
  writeOrders,
  type StoredOrder,
  type StoredOrderItem,
} from "@/lib/auth/auth";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await readOrders();
  const userOrders = orders
    .filter((o) => o.userId === session.sub)
    .map((o) => ({ ...o, status: o.status ?? "pending" }));

  return NextResponse.json({ orders: userOrders }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      customerName?: string;
      address?: string;
      phone?: string;
      items?: StoredOrderItem[];
      subtotal?: number;
    };

    const customerName = (body.customerName ?? "").trim();
    const address = (body.address ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;

    if (!customerName || !address || !phone) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (subtotal <= 0) {
      return NextResponse.json({ error: "Invalid subtotal." }, { status: 400 });
    }

    const orders = await readOrders();
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

    const order: StoredOrder = {
      id,
      userId: session.sub,
      customerName,
      address,
      phone,
      items: items.map((item) => ({
        productId: String(item.productId),
        name: String(item.name),
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      subtotal,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await writeOrders([order, ...orders]);

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order creation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

