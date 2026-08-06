// Vercel's entry point for this Express app — see
// https://vercel.com/docs/frameworks/backend/express ("Using a default
// export"). Vercel auto-detects this exact file/export shape and wraps it
// as a single Vercel Function; no vercel.json routing config needed.
//
// Deliberately just this. No app.listen() (Vercel handles invocation
// itself), no async startup work like the DB ping in dev-server.ts —
// that kind of pre-flight check adds latency to every cold start for a
// guarantee that's much less useful in serverless than it is for a
// traditional always-on process anyway. If Neon is unreachable, a request
// fails with a clear 500 from the error handler instead of the whole
// function failing to boot.
import { createApp } from './app';

const app = createApp();

export default app;
