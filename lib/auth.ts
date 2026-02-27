import { compare } from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "charity_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  uid: string;
  role: string;
  exp: number;
};

function getSessionSecret() {
  return process.env.NEXTAUTH_SECRET ?? "replace-this-secret-in-vercel";
}

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payloadEncoded: string) {
  return createHmac("sha256", getSessionSecret()).update(payloadEncoded).digest("base64url");
}

export function createSessionToken(uid: string, role: string) {
  const payload: SessionPayload = {
    uid,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const payloadEncoded = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return null;

  const expected = signPayload(payloadEncoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  const payload = JSON.parse(decodeBase64Url(payloadEncoded)) as SessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export async function authenticateUser(email: string, password: string) {
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export { SESSION_COOKIE, SESSION_TTL_SECONDS };
