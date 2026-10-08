import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { getProperty } from "@/content/properties";
import { isAdmin } from "@/lib/auth";
import { DbNotConfiguredError } from "@/lib/db";
import { logout } from "./actions";
import DailyBars from "./DailyBars";
import { getDownloads, getReport, type Count } from "./data";

export const dynamic = "force-dynamic";

const residence = (slug: string | null) => (slug ? (getProperty(slug)?.name.replace("Rosewood Residence ", "") ?? slug) : "General");

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Nairobi", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="tile-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}

function Breakdown({ title, rows, format = (s: string) => s }: { title: string; rows: Count[]; format?: (label: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="panel">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="empty">Nothing yet.</p>
      ) : (
        <ul className="breakdown">
          {rows.map((r) => (
            <li key={r.label}>
              <span>{format(r.label)}</span>
              <span className="breakdown__bar">
                <i style={{ width: `${(r.count / max) * 100}%` }} />
              </span>
              <b>{r.count}</b>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const search = ((await searchParams).q ?? "").trim().slice(0, 60);

  let report: Awaited<ReturnType<typeof getReport>>;
  try {
    report = await getReport(search);
  } catch (error) {
    if (!(error instanceof DbNotConfiguredError)) throw error;
    return (
      <div className="admin-login">
        <h1>Database needed</h1>
        <p className="admin-note">
          No database is connected yet. In Vercel, open the project, go to <b>Storage</b>, create a <b>Neon Postgres</b>{" "}
          database and connect it to this project, then redeploy.
        </p>
      </div>
    );
  }

  const downloads = await getDownloads();
  const { totals, daily, versions, leadsByResidence, leadsBySource, views, leads } = report;

  return (
    <>
      <header className="admin-bar">
        <div className="admin-bar__brand">
          <Logo className="admin-bar__mark" />
          <div>
            <strong>Three Star Towers</strong>
            <span>Admin</span>
          </div>
        </div>
        <form action={logout}>
          <button className="btn btn--ghost btn--sm">Sign out</button>
        </form>
      </header>

      <div className="admin-body">
        <div className="tiles">
          <Tile label="App installs" value={totals.installs} hint={`${totals.installs_7d} in the last 7 days`} />
          <Tile label="Active this week" value={totals.active_7d} hint="Opened the app in the last 7 days" />
          <Tile label="Leads" value={totals.leads} hint={`${totals.leads_7d} in the last 7 days`} />
          <Tile label="APK downloads" value={downloads ? downloads.total : "–"} hint={downloads ? "From GitHub Releases" : "GitHub unavailable right now"} />
        </div>

        <div className="charts">
          <DailyBars title="Installs per day" unit="installs" points={daily.map((d) => ({ day: d.day, value: d.installs }))} />
          <DailyBars title="Leads per day" unit="leads" points={daily.map((d) => ({ day: d.day, value: d.leads }))} />
        </div>

        <details className="panel">
          <summary>Daily figures as a table</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Installs</th>
                  <th>Leads</th>
                </tr>
              </thead>
              <tbody>
                {[...daily].reverse().map((d) => (
                  <tr key={d.day}>
                    <td>{d.day}</td>
                    <td>{d.installs}</td>
                    <td>{d.leads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div className="breakdowns">
          <Breakdown title="Leads by residence" rows={leadsByResidence} format={(l) => residence(l === "general" ? null : l)} />
          <Breakdown title="Leads by source" rows={leadsBySource} format={(l) => (l === "app" ? "Mobile app" : "Website")} />
          <Breakdown title="Most viewed in the app" rows={views} format={residence} />
          <Breakdown title="Installs by version" rows={versions} />
          {downloads && <Breakdown title="APK downloads by version" rows={downloads.byVersion} />}
        </div>

        <section className="panel">
          <div className="panel__head">
            <h2>Leads</h2>
            <form className="search" action="/admin">
              <input name="q" defaultValue={search} placeholder="Search name or phone" aria-label="Search leads" />
              <button className="btn btn--ghost btn--sm">Search</button>
            </form>
            <a className="btn btn--brown btn--sm" href="/admin/export">
              Download CSV
            </a>
          </div>
          {leads.length === 0 ? (
            <p className="empty">{search ? "No leads match that search." : "No leads yet. They appear here as people register in the app or enquire on the website."}</p>
          ) : (
            <div className="table-scroll">
              <table className="leads">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Residence</th>
                    <th>Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td>{when(l.created_at)}</td>
                      <td>{l.name}</td>
                      <td>
                        <a href={`tel:${l.phone}`}>{l.phone}</a>
                      </td>
                      <td>{l.source === "app" ? "App" : "Website"}</td>
                      <td>{residence(l.property_slug)}</td>
                      <td>
                        {l.interest ?? "–"}
                        {l.note && <small>{l.note}</small>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {leads.length === 200 && <p className="empty">Showing the latest 200. Download the CSV for the full list.</p>}
        </section>
      </div>
    </>
  );
}
