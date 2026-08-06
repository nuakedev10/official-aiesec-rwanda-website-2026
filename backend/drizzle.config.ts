import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

// drizzle-kit (generate/studio) talks to Postgres directly rather than
// through the app's pooled connection, so it uses the direct URL if you've
// set one, falling back to DATABASE_URL for a quick local setup.
export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL || '',
  },
});
