import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

export function getDb() {
  return sql;
}
