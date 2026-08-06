import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// The Neon serverless driver needs a WebSocket implementation when running
// outside a browser/edge runtime — this is that one line of glue Node needs.
neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

// Lazily creates the pool + drizzle instance on first use rather than at
// import time, so tests can import from this module without needing
// DATABASE_URL to be set (see tests/setup.ts).
export const getDb = () => {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
    }
    pool = new Pool({ connectionString });
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
};

export const closeDb = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    dbInstance = null;
  }
};

export { schema };
