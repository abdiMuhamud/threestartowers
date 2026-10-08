import { query } from "@/lib/db";
import { bad, handle, installId, phone, readJson, slug, text } from "@/lib/intake";

/** Saves a name + phone number from the app's welcome screen or the website enquiry form. */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson(request);
    const name = text(body.name, 80);
    const number = phone(body.phone);
    const source = body.source === "app" || body.source === "web" ? body.source : null;
    if (!name || !number || !source) return bad("Name, phone and source are required");

    await query(
      `insert into leads (name, phone, source, property_slug, interest, note, install_id)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [name, number, source, slug(body.propertySlug), text(body.interest, 60), text(body.note, 500), installId(body.installId)],
    );
    return Response.json({ ok: true });
  });
}
