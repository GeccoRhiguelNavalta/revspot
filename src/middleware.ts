import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const isPublic = publicPaths.includes(request.nextUrl.pathname);
  const token = request.cookies.get("sb-access-token");

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/auth/:path*"],
};
