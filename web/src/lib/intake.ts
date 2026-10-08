// Shared validation for the public endpoints the app and website post to.

import { properties } from "@/content/properties";
import { DbNotConfiguredError } from "./db";

const slugs = new Set(properties.map((p) => p.slug));

export const text = (value: unknown, max: number): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed && trimmed.length <= max ? trimmed : null;
};

/** Accepts local or international formats; stores digits with an optional leading +. */
export const phone = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\s\-().]/g, "");
  return /^\+?\d{7,15}$/.test(cleaned) ? cleaned : null;
};

export const slug = (value: unknown): string | null => (typeof value === "string" && slugs.has(value) ? value : null);

export const installId = (value: unknown): string | null =>
  typeof value === "string" && /^[A-Za-z0-9-]{16,64}$/.test(value) ? value : null;

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export const bad = (message: string) => Response.json({ ok: false, error: message }, { status: 400 });

/** Runs a handler, turning a missing database into a clear 503 instead of a crash. */
export async function handle(work: () => Promise<Response>): Promise<Response> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof DbNotConfiguredError) {
      return Response.json({ ok: false, error: "Database is not configured" }, { status: 503 });
    }
    console.error(error);
    return Response.json({ ok: false, error: "Something went wrong" }, { status: 500 });
  }
}
