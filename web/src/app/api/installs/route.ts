import { query } from "@/lib/db";
import { bad, handle, installId, readJson, text } from "@/lib/intake";

/**
 * Called by the app on every launch with a random id it generated on first run.
 * The first call counts as an install; later calls update "last seen".
 */
export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson(request);
    const id = installId(body.installId);
    const platform = body.platform === "android" || body.platform === "ios" ? body.platform : null;
    if (!id || !platform) return bad("installId and platform are required");

    await query(
      `insert into installs (id, platform, app_version) values ($1, $2, $3)
       on conflict (id) do update set last_seen_at = now(), app_version = excluded.app_version`,
      [id, platform, text(body.appVersion, 20)],
    );
    return Response.json({ ok: true });
  });
}
