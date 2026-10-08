// Postgres access for leads, installs and usage events.
//
// Production: set DATABASE_URL (Vercel > Storage > Neon Postgres sets it for you).
// Local development: with no DATABASE_URL, an in-process Postgres (PGlite) is used
// and stored in web/.data, so the admin area works without any setup.

type Row = Record<string, unknown>;
type Run = (text: string, params?: unknown[]) => Promise<Row[]>;

export class DbNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set");
  }
}

const schema = [
  `create table if not exists installs (
     id text primary key,
     platform text not null,
     app_version text,
     created_at timestamptz not null default now(),
     last_seen_at timestamptz not null default now()
   )`,
  `create table if not exists leads (
     id bigserial primary key,
     name text not null,
     phone text not null,
     source text not null,
     property_slug text,
     interest text,
     note text,
     install_id text,
     created_at timestamptz not null default now()
   )`,
  `create table if not exists events (
     id bigserial primary key,
     install_id text,
     type text not null,
     property_slug text,
     created_at timestamptz not null default now()
   )`,
  `create index if not exists installs_created_at on installs (created_at)`,
  `create index if not exists leads_created_at on leads (created_at)`,
  `create index if not exists events_type_created_at on events (type, created_at)`,
];

async function connect(): Promise<Run> {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  let run: Run;

  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    run = (text, params = []) => sql.query(text, params) as Promise<Row[]>;
  } else if (process.env.NODE_ENV !== "production") {
    const { PGlite } = await import("@electric-sql/pglite");
    const { mkdirSync } = await import("node:fs");
    mkdirSync("./.data", { recursive: true });
    const db = new PGlite("./.data/pglite");
    run = async (text, params = []) => (await db.query<Row>(text, params)).rows;
  } else {
    throw new DbNotConfiguredError();
  }

  for (const statement of schema) await run(statement);
  return run;
}

// One connection (and one schema check) per server instance, surviving dev hot reloads.
const cache = globalThis as unknown as { __tstDb?: Promise<Run> };

export async function query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  cache.__tstDb ??= connect().catch((error) => {
    cache.__tstDb = undefined;
    throw error;
  });
  const run = await cache.__tstDb;
  return (await run(text, params)) as T[];
}
