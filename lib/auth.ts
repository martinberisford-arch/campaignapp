import { createHmac, timingSafeEqual } from "crypto";
import { compare } from "bcryptjs";

const SESSION_COOKIE = "charity_session";

type Session = { uid: string; role: string; exp: number };

function secret() {
  return process.env.SESSION_SECRET ?? "replace-with-strong-random-string";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(uid: string, role: string) {
  const payload = Buffer.from(JSON.stringify({ uid, role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSession(token?: string): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
  if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return parsed;
}

export async function validateCredentials(email: string, password: string) {
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await compare(password, user.passwordHash);
  return ok ? user : null;
}

export { SESSION_COOKIE };
