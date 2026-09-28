import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "weekend_session";

export type AuthSession =
  | { role: "admin"; email: string }
  | { role: "parent"; parentId: string; name: string; phone: string };

const DUMMY_HASH = "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error("AUTH_SECRET должен быть задан и длиннее 16 символов");
  }
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function verifyLogin(password: string, hash?: string | null) {
  const ok = await verifyPassword(password, hash || DUMMY_HASH);
  return Boolean(hash) && ok;
}

export async function createSession(payload: AuthSession) {
  const admin = payload.role === "admin";
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(admin ? "12h" : "14d")
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: admin ? 60 * 60 * 12 : 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role === "admin" && typeof payload.email === "string") {
      return { role: "admin", email: payload.email };
    }
    if (
      payload.role === "parent" &&
      typeof payload.parentId === "string" &&
      typeof payload.name === "string" &&
      typeof payload.phone === "string"
    ) {
      return {
        role: "parent",
        parentId: payload.parentId,
        name: payload.name,
        phone: payload.phone,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function requireParent() {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return null;
  }
  const parent = await prisma.parent.findUnique({ where: { id: session.parentId } });
  if (!parent) return null;
  return { session, parent };
}
