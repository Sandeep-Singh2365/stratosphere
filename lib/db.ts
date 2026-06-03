import { neon } from '@neondatabase/serverless';

let dbClient: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!dbClient) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    dbClient = neon(url);
  }
  return dbClient;
}

/**
 * IMPORTANT:
 * Do NOT eagerly call getDb() at module import time.
 *
 * Our migration/seed scripts load env vars at runtime (via @next/env),
 * and ESM import hoisting can cause this module to be evaluated before
 * env loading runs, resulting in "DATABASE_URL environment variable is not set".
 *
 * Always call `getDb()` inside the runtime code path that needs it.
 */
