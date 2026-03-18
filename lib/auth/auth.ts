import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type AuthRole = "customer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Exclude<AuthRole, "admin">;
  createdAt: string;
};

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: AuthRole;
};

const COOKIE_NAME = "divya_session";

const ADMIN_EMAIL = "admin@divya.lk";
const ADMIN_PASSWORD = "admin123";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  // In production you MUST set JWT_SECRET; a default is only for local dev convenience.
  const effective = secret && secret.length >= 16 ? secret : "dev-only-change-me";
  return new TextEncoder().encode(effective);
}

export async function signToken(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "customer" && payload.role !== "admin")
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function getSafeUserFromSession(session: SessionPayload): AuthUser {
  return {
    id: session.sub,
    email: session.email,
    name: session.name,
    role: session.role,
  };
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function logoutUser() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function readUsers(): Promise<StoredUser[]> {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt.toISOString(),
  }));
}

async function writeUsers(users: StoredUser[]) {
  await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          role: "customer",
          createdAt: new Date(user.createdAt),
        },
        update: {
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
        },
      }),
    ),
  );
}

export async function listUsers(): Promise<PublicUser[]> {
  const users = await readUsers();
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
    role: "customer",
  }));
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!name) throw new Error("Name is required.");
  if (!email.includes("@")) throw new Error("Please enter a valid email.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");
  if (email === ADMIN_EMAIL) throw new Error("This email is reserved.");

  const users = await readUsers();
  const exists = users.some((u) => normalizeEmail(u.email) === email);
  if (exists) throw new Error("An account with this email already exists.");

  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: StoredUser = {
    id,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await writeUsers([...users, newUser]);

  return { id, name, email, role: "customer" };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; token: string }> {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!email || !password) throw new Error("Email and password are required.");

  if (email === ADMIN_EMAIL) {
    if (password !== ADMIN_PASSWORD) throw new Error("Invalid email or password.");
    const token = await signToken({
      sub: "admin",
      email: ADMIN_EMAIL,
      name: "Admin",
      role: "admin",
    });
    return {
      token,
      user: { id: "admin", email: ADMIN_EMAIL, name: "Admin", role: "admin" },
    };
  }

  const users = await readUsers();
  const user = users.find((u) => normalizeEmail(u.email) === email);
  if (!user) throw new Error("Invalid email or password.");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password.");

  const token = await signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: "customer",
  });

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: "customer" },
  };
}

export async function setAuthCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export type StoredOrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type StoredOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type StoredOrder = {
  id: string;
  userId: string;
  customerName: string;
  address: string;
  phone: string;
  items: StoredOrderItem[];
  subtotal: number;
  status: StoredOrderStatus;
  createdAt: string;
};

export async function readOrders(): Promise<StoredOrder[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    customerName: order.customerName,
    address: order.address,
    phone: order.phone,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: order.subtotal,
    status: order.status as StoredOrderStatus,
    createdAt: order.createdAt.toISOString(),
  }));
}

export async function writeOrders(orders: StoredOrder[]) {
  await prisma.order.deleteMany();
  await Promise.all(
    orders.map((order) =>
      prisma.order.create({
        data: {
          id: order.id,
          userId: order.userId,
          customerName: order.customerName,
          address: order.address,
          phone: order.phone,
          subtotal: order.subtotal,
          status: order.status,
          createdAt: new Date(order.createdAt),
          items: {
            create: order.items.map((item) => ({
              id: `${order.id}-${item.productId}`,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      }),
    ),
  );
}

