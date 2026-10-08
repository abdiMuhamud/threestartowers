import { query } from "@/lib/db";

// Days are bucketed in Kenyan time so "today" matches the sales team's day.
const TZ = "Africa/Nairobi";
const localDay = (column: string) => `(${column} at time zone '${TZ}')::date`;

export type Lead = {
  id: number;
  name: string;
  phone: string;
  source: string;
  property_slug: string | null;
  interest: string | null;
  note: string | null;
  created_at: string;
};

export type Daily = { day: string; installs: number; leads: number };
export type Count = { label: string; count: number };

export async function getReport(search: string) {
  const [totals] = await query<{
    installs: number;
    installs_7d: number;
    active_7d: number;
    leads: number;
    leads_7d: number;
  }>(
    `select
       (select count(*)::int from installs) as installs,
       (select count(*)::int from installs where created_at > now() - interval '7 days') as installs_7d,
       (select count(*)::int from installs where last_seen_at > now() - interval '7 days') as active_7d,
       (select count(*)::int from leads) as leads,
       (select count(*)::int from leads where created_at > now() - interval '7 days') as leads_7d`,
  );

  const daily = await query<Daily>(
    `select to_char(d, 'YYYY-MM-DD') as day,
            (select count(*)::int from installs where ${localDay("created_at")} = d::date) as installs,
            (select count(*)::int from leads where ${localDay("created_at")} = d::date) as leads
     from generate_series(
            (now() at time zone '${TZ}')::date - 29,
            (now() at time zone '${TZ}')::date,
            interval '1 day') as d
     order by d`,
  );

  const versions = await query<Count>(
    `select platform || ' ' || coalesce(app_version, '?') as label, count(*)::int as count
     from installs group by 1 order by count desc limit 8`,
  );

  const leadsByResidence = await query<Count>(
    `select coalesce(property_slug, 'general') as label, count(*)::int as count
     from leads group by 1 order by count desc`,
  );

  const leadsBySource = await query<Count>(
    `select source as label, count(*)::int as count from leads group by 1 order by count desc`,
  );

  const views = await query<Count>(
    `select property_slug as label, count(*)::int as count
     from events where type = 'property_view' and property_slug is not null
     group by 1 order by count desc`,
  );

  const leads = await query<Lead>(
    `select id, name, phone, source, property_slug, interest, note, created_at
     from leads
     where $1 = '' or name ilike '%' || $1 || '%' or phone ilike '%' || $1 || '%'
     order by created_at desc
     limit 200`,
    [search],
  );

  return { totals, daily, versions, leadsByResidence, leadsBySource, views, leads };
}

type Release = { tag_name: string; assets: { name: string; download_count: number }[] };

/** APK download counts straight from the GitHub Releases the app is published to. */
export async function getDownloads(): Promise<{ total: number; byVersion: Count[] } | null> {
  try {
    const response = await fetch("https://api.github.com/repos/abdiMuhamud/threestartowers/releases?per_page=30", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 900 },
    });
    if (!response.ok) return null;
    const releases = (await response.json()) as Release[];
    const byVersion = releases.map((r) => ({
      label: r.tag_name,
      count: r.assets.filter((a) => a.name.endsWith(".apk")).reduce((sum, a) => sum + a.download_count, 0),
    }));
    return { total: byVersion.reduce((sum, v) => sum + v.count, 0), byVersion };
  } catch {
    return null;
  }
}
