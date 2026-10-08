// Admin sign-in: one username/password pair from environment variables and a
// signed, http-only session cookie. Nothing here is ever sent to the browser.
//
//   ADMIN_USER, ADMIN_PASSWORD   the sign-in (required in production)
//   SESSION_SECRET               signs the cookie (falls back to the password)
//
// In local development, with no variables set, the sign-in is admin / admin.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "tst_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

const isProd = process.env.NODE_ENV === "production";

function credentials(): { user: string; password: string } | null {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (user && password) return { user, password };
  return isProd ? null : { user: "admin", password: "admin" };
}

export const adminConfigured = () => credentials() !== null;

const secret = () => process.env.SESSION_SECRET ?? `fallback:${credentials()?.password ?? ""}`;

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function checkCredentials(user: string, password: string): boolean {
  const expected = credentials();
  if (!expected) return false;
  // Evaluate both so timing does not reveal which half was wrong.
  const userOk = safeEqual(user, expected.user);
  const passwordOk = safeEqual(password, expected.password);
  return userOk && passwordOk;
}

export async function startSession() {
  const expires = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now() / 1000;
}
