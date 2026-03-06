import { NextResponse } from "next/server";
import { getSessionFromCookies, listUsers } from "@/lib/auth/auth";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listUsers();
  return NextResponse.json({ users }, { status: 200 });
}

