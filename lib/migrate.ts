import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import * as fs from 'fs';
import * as path from 'path';
import { sql } from './db';

async function migrate() {
  try {
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

    // Split statements, avoiding empty ones or comments
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`Starting migration with ${statements.length} statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      // Execute each statement directly on the neon SQL client
      await (sql as any).query(statement);
    }

    console.log("Migration complete");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
