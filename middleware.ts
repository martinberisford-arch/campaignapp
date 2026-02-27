import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p === "/login" || p.startsWith("/_next") || p === "/favicon.ico") return NextResponse.next();
  if (!req.cookies.get("charity_session")?.value) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
