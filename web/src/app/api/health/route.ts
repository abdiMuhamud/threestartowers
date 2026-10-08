import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Reports whether the database is reachable, without revealing anything about it. */
export async function GET() {
  try {
    await query("select 1");
    return Response.json({ ok: true, database: "connected" });
  } catch {
    return Response.json({ ok: false, database: "unavailable" }, { status: 503 });
  }
}
