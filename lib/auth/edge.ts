import { jwtVerify } from "jose";

export type EdgeSessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: "customer" | "admin";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  const effective = secret && secret.length >= 16 ? secret : "dev-only-change-me";
  return new TextEncoder().encode(effective);
}

export async function verifyTokenEdge(
  token: string,
): Promise<EdgeSessionPayload | null> {
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

