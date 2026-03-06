import { NextResponse } from "next/server";
import { loginUser, setAuthCookie } from "@/lib/auth/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { user, token } = await loginUser({
      email: body.email ?? "",
      password: body.password ?? "",
    });

    await setAuthCookie(token);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

