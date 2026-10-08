import { isAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

type Lead = { created_at: string; name: string; phone: string; source: string; property_slug: string | null; interest: string | null; note: string | null };

const cell = (value: unknown) => `"${(value == null ? "" : String(value)).replace(/"/g, '""')}"`;

// Free text typed by visitors: neutralise anything a spreadsheet would run as a formula.
const typed = (value: string | null) => (value && /^[=+\-@]/.test(value) ? `'${value}` : value);

export async function GET() {
  if (!(await isAdmin())) return new Response("Not found", { status: 404 });

  const leads = await query<Lead>(
    `select created_at, name, phone, source, property_slug, interest, note from leads order by created_at desc`,
  );
  const header = ["Date", "Name", "Phone", "Source", "Residence", "Interest", "Note"];
  const rows = leads.map((l) =>
    [new Date(l.created_at).toISOString(), typed(l.name), l.phone, l.source, l.property_slug, typed(l.interest), typed(l.note)].map(cell).join(","),
  );

  return new Response([header.map(cell).join(","), ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="three-star-towers-leads.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
