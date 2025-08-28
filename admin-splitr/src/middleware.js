import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const sessionId = request.cookies.get("sessionId")?.value;
  const method = request.method;

  console.log("Middleware - Checking access to:", pathname, method);
  console.log("Middleware - SessionId:", sessionId ? "exists" : "missing");

  // Allow API requests
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // If logged in and accessing "/", redirect to dashboard
  if (pathname === "/" && sessionId && method === "GET") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not logged in and accessing "/dashboard", redirect to "/"
  if (pathname.startsWith("/dashboard") && !sessionId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected paths
  const protectedPaths = ["/profile", "/transactions"];
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!sessionId) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
};
