import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", "http://localhost"));
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
