import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        try {
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            return null;
          }
          const valid = await compare(credentials.password, user.passwordHash);
          if (!valid) {
            return null;
          }
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        } catch {
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET ?? "replace-this-secret-in-vercel"
};
