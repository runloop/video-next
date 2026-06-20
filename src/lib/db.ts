// Read-only Postgres access. The app connects as the `video_readonly` role and only
// ever issues SELECTs (see docs/adr/0001-video-data-fetching-and-caching.md).
//
// The pool is created lazily and memoised on `globalThis` so that Next.js dev HMR
// doesn't open a new pool on every reload. On Vercel each serverless instance gets
// its own pool; `max` is kept low because queries only run on cache miss / ISR
// revalidation, never per visitor.
import { Pool } from "pg";

declare global {
  var __videoPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    max: 5,
    // RDS requires TLS. `rejectUnauthorized: false` trusts the server cert without
    // pinning the RDS CA — fine for a read-only role, but to fully verify the chain
    // supply the RDS CA bundle here instead. Set DATABASE_SSL=disable for local
    // non-TLS Postgres.
    ssl: process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: false },
  });
}

function getPool(): Pool {
  const pool = globalThis.__videoPool ?? createPool();
  if (process.env.NODE_ENV !== "production") {
    globalThis.__videoPool = pool;
  }
  return pool;
}

/** Run a parameterised read query and return the rows. */
export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await getPool().query(text, params as unknown[]);
  return result.rows as T[];
}
