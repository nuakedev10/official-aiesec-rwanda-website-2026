// Local development / traditional-hosting entry point (npm run dev, npm
// start). This is NOT what Vercel uses — Vercel's Express integration
// wants a plain default-exported app with no app.listen() call, which is
// what src/index.ts provides instead. This file is intentionally named
// away from Vercel's auto-detected entry filenames (app/index/server.ts)
// so there's no ambiguity between the two.
import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { getDb } from './db';
import { sql } from 'drizzle-orm';

const PORT = process.env.PORT || 5000;

const start = async () => {
  // Neon's serverless driver pools connections per-query rather than
  // holding one open connection the way a traditional pg client does —
  // there's no persistent "connect" step to await. This one query just
  // confirms DATABASE_URL is actually reachable before the server starts
  // accepting traffic, so a bad connection string fails loudly at boot
  // instead of on the first real request.
  const db = getDb();
  await db.execute(sql`SELECT 1`);
  console.log('Connected to Neon Postgres');

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`AIN Rwanda API running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
