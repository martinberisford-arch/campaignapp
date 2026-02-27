import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE, validateCredentials } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const user = await validateCredentials(email, password);
  if (!user) redirect("/login?error=1");
  cookies().set(SESSION_COOKIE, createSessionToken(user.id, user.role), { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  redirect("/");
}

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return <div className="min-h-screen grid place-items-center p-4"><form action={login} className="bg-white border rounded p-6 w-full max-w-md space-y-3"><h1 className="text-xl font-semibold">Sign in</h1><input name="email" type="email" placeholder="Email" required /><input name="password" type="password" placeholder="Password" required />{searchParams?.error && <p className="text-red-600 text-sm">Invalid login.</p>}<button className="w-full bg-teal-700 text-white">Sign in</button></form></div>;
}
