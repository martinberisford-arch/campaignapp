import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE } from "@/lib/auth";

export function requireSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = readSession(token);
  if (!session) redirect("/login");
  return session;
}
