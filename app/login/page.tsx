import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser, createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await authenticateUser(email, password);
  if (!user) {
    redirect("/login?error=1");
  }

  const token = createSessionToken(user.id, user.role);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });

  redirect("/");
}

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form className="bg-white p-8 rounded-xl border border-slate-200 w-full max-w-md space-y-4" action={loginAction}>
        <h1 className="text-2xl font-semibold text-primary">Charity Dashboard Login</h1>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        {searchParams?.error && <p className="text-red-600 text-sm">Login failed. Please try again.</p>}
        <button className="w-full bg-primary text-white text-lg">Sign in</button>
      </form>
    </div>
  );
}
