import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function requireSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    redirect("/login");
  }

  const session = verifySessionToken(token);
  if (!session) {
    redirect("/login");
  }

  return session;
}
