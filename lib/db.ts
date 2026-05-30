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

// Export sql for backward compatibility with lib/auth.ts
export const sql = getDb();
