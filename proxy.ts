import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/auth/edge";

// Define paths
const PROTECTED_ROUTES = ["/account", "/checkout"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute && !isAdminRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get("divya_session")?.value;
  let session = null;

  if (token) {
    session = await verifyTokenEdge(token);
  }

  // Handle protected and admin routes logic
  if (isProtectedRoute || isAdminRoute) {
    if (!session) {
      // User is not logged in
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && session.role !== "admin") {
      // User is logged in but not an admin
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Handle auth routes logic (e.g., redirect away from /login if already logged in)
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
