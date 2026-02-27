"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        className="bg-white p-8 rounded-xl border border-slate-200 w-full max-w-md space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const result = await signIn("credentials", {
            email: form.get("email"),
            password: form.get("password"),
            callbackUrl: "/"
          });
          if (result?.error) setError("Login failed. Please try again.");
        }}
      >
        <h1 className="text-2xl font-semibold text-primary">Charity Dashboard Login</h1>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        {error && <p className="text-red-600 text-sm">Login failed. Please try again.</p>}
        <button className="w-full bg-primary text-white text-lg">Sign in</button>
      </form>
    </div>
  );
}
