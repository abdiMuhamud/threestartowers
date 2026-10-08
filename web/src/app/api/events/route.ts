import { query } from "@/lib/db";
import { bad, handle, installId, readJson, slug } from "@/lib/intake";

const types = new Set(["property_view"]);

/** Lightweight usage events from the app, e.g. which residences people open. */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson(request);
    const type = typeof body.type === "string" && types.has(body.type) ? body.type : null;
    if (!type) return bad("Unknown event type");

    await query(`insert into events (install_id, type, property_slug) values ($1, $2, $3)`, [
      installId(body.installId),
      type,
      slug(body.propertySlug),
    ]);
    return Response.json({ ok: true });
  });
}
