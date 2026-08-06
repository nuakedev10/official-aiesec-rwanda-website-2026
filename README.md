# AIESEC in Rwanda — Backend API

This is the backend for the official AIESEC in Rwanda website. Every table,
route, and form-submission endpoint here maps directly to something in the
Figma design: Home, About, For Youth, For Partners, Contact/Get Involved,
Alumni, and Stories.

Built with Node.js, Express, TypeScript, and **Neon Postgres via Drizzle
ORM**. (This was originally built against MongoDB/Mongoose and migrated to
Postgres. If anything below reads like it's explaining a decision rather
than just describing the code, that's why.)

## Why Drizzle, and why it's structured this way

Neon is Postgres, and Drizzle is the ORM most commonly paired with it:
lightweight, fully typed against your actual schema, and it generates real
migration SQL you can read and review instead of a black box. The
`@neondatabase/serverless` driver is Neon's own client. It pools
connections per-query over HTTP/WebSockets rather than holding one long-lived
TCP connection open, which is the right model for Neon specifically since
it's built for exactly this.

Most of the site's content (committee members, local committees, FAQs,
testimonials, programs, partnership opportunities, success stories, impact
reports) is the same shape of problem: list it, read one, let an admin
create/edit/delete it. Instead of writing that logic eleven separate times,
there's one `crudFactory` that builds all four handlers for any given
Drizzle table. You'll see this pattern in `contentControllers.ts` and
`contentRoutes.ts`, a handful of lines per table instead of a full
controller file each. Worth knowing: Drizzle's query builder is fully typed
against a *specific* table, so a truly generic factory fights the type
system a little — the factory's internals use a few `as any` casts to
bridge that. Every call site stays completely type-safe, since it passes a
concrete table and concrete columns in; only the generic plumbing itself
needed the escape hatch.

The stuff that isn't generic gets its own hand-written controller instead:
alumni filtering, connect/follow, the donation flow, applications, partner
leads, story search.

## Getting started

1. Create a Neon project at [neon.tech](https://neon.tech) if you don't have one.
2. Copy the connection strings from your Neon dashboard's "Connection Details":
   - The **pooled** one (hostname contains `-pooler`) → `DATABASE_URL`
   - The **direct** one → `DATABASE_URL_DIRECT` (migrations need this one)

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL, DATABASE_URL_DIRECT, JWT_SECRET
npm run db:generate         # generates SQL migration files from the schema (already done once — rerun after any schema change)
npm run db:migrate          # applies migrations to your Neon database
npm run seed                 # populates real content pulled from the Figma screens
npm run dev                   # starts the API on http://localhost:5000
```

Run the test suite with `npm test`. All 29 tests pass against a mocked
Drizzle query layer (see "Testing" below for exactly what that does and
doesn't cover).

Default admin login after seeding: `admin@aiesec.rw` / `ChangeThisPassword123`
— change that password immediately, it's only there so you have something
to log in with on day one.

`npm run db:studio` opens Drizzle Studio, a browser GUI for browsing and
editing your Neon data directly — handy for checking the seed worked
without writing SQL by hand.

## Deploying to Vercel

Vercel now supports Express with genuinely zero configuration, as long as
the app is structured the way it expects — which took a real restructure
from the original build, not just a settings change. Worth knowing before
you deploy:

**Two separate entry points, on purpose:**
- `src/index.ts` — what Vercel actually runs. A plain `export default app`
  with no `app.listen()` call, per [Vercel's documented pattern](https://vercel.com/docs/frameworks/backend/express).
  Vercel builds this file's TypeScript directly with its own toolchain —
  your local `npm run build` / `dist/` output isn't involved in the Vercel
  deployment at all.
- `src/dev-server.ts` — what `npm run dev` / `npm start` use locally (or on
  any traditional always-on host like Railway or a VPS). Has the DB
  connectivity check and `app.listen()` that make sense for a persistent
  process but add nothing on Vercel, where each request may hit a fresh
  instance anyway.

**File uploads go to Vercel Blob, not local disk.** This isn't a style
choice — `express.static()` doesn't serve anything on Vercel's serverless
runtime, full stop, and the filesystem is ephemeral outside `/tmp` anyway.
`POST /api/admin/upload` now streams the file straight to Vercel Blob and
returns a public URL. You'll need to set `BLOB_READ_WRITE_TOKEN` (steps
below) for that one endpoint to work; every other endpoint in the API
works fine without it.

### Steps

1. **Push this repo to GitHub** (or GitLab/Bitbucket) if it isn't already.
2. **Import the project in Vercel** — [vercel.com/new](https://vercel.com/new), select the repo. Framework Preset: leave as "Other" — Vercel auto-detects the Express entry point, no build command override needed.
3. **Add environment variables** — Project Settings → Environment Variables. Add every variable from `.env.example`:
   - `DATABASE_URL` (pooled Neon connection string)
   - `DATABASE_URL_DIRECT` (direct string — only used when you run migrations, but harmless to set)
   - `JWT_SECRET` (the app refuses to boot without this — see "Security hardening pass")
   - `CLIENT_URL` (your frontend's real URL — the app refuses to boot in production without this either)
   - `NODE_ENV` = `production`
4. **Set up Vercel Blob for uploads** — Project → Storage tab → Create Database → Blob. Once created, Vercel adds `BLOB_READ_WRITE_TOKEN` to your project's environment variables automatically — you don't need to copy it in by hand.
5. **Deploy.** Vercel builds and deploys on push automatically after this; the first deploy happens as soon as you finish step 2.
6. **Run migrations against your Neon database once**, from your own machine (Vercel doesn't run this for you): `npm run db:migrate`, then `npm run seed` if you want the Figma-sourced sample content in place.
7. **Check the region.** Vercel Functions default to `iad1` (Washington, D.C.), which is a reasonable match for a Neon database in `us-east-2` (Ohio). If your Neon project is somewhere else, Project Settings → Functions → Function Region and pick whatever's actually closest to your database — that matters more for latency than almost anything else here.

Your API will be live at `https://your-project.vercel.app/api/...`.

## Postman collection

`postman/AIN-Rwanda-Backend.postman_collection.json` covers all 79 requests
across every endpoint in this API, organized into folders that match the
site's actual pages. Two environment files ship alongside it —
`AIN-Rwanda-Local.postman_environment.json` (points at `localhost:5000`)
and `AIN-Rwanda-Production.postman_environment.json` (edit the URL in it
to your real Vercel deployment once you have one).

**To use it:**
1. Postman → **Import** → drag in all three files from `postman/`.
2. Select the **AIN Rwanda — Local** (or Production) environment from the dropdown, top right.
3. Open **Auth → Login**, hit Send. It's pre-filled with the seeded admin credentials, and its Tests tab automatically saves the returned JWT into the `token` variable — every admin-only request in the collection already references `{{token}}`, so there's nothing to copy-paste manually.
4. Everything else is ready to explore — public GET endpoints work immediately with no auth, admin-only writes work as soon as step 3 is done.

If your frontend dev only needs to see request/response shapes rather than
actually run calls, they can also just open the collection JSON directly —
every request has a description explaining what it does and any
constraints (allowed enum values, which fields are optional, etc.).

## Endpoint reference

Every endpoint below is prefixed with `/api`. Routes marked **admin**
require an `Authorization: Bearer <token>` header from a user with role
`SUPER_ADMIN`, `MCP`, or `MCVP`. Site-wide stats are locked to
`SUPER_ADMIN` only, since those numbers show up across multiple pages and
shouldn't drift out of sync.

### Auth

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register` | Create a committee/admin account |
| POST | `/auth/login` | Log in, returns a JWT |
| GET | `/auth/me` | Get the logged-in admin's own profile |

### Home page

| Method | Route | Purpose |
|---|---|---|
| GET | `/home` | Impact stats + featured testimonials, one call |

### About page

| Method | Route | Purpose |
|---|---|---|
| GET | `/about` | MC members, LC members, local committees, history timeline, network stats — one call |
| GET/POST/PATCH/DELETE | `/committee-members` | Member Committee grid |
| GET/POST/PATCH/DELETE | `/local-committees` | AIESEC Kigali / HUYE / Musanze cards |
| GET/POST/PATCH/DELETE | `/history` | The 2007 → present timeline |
| GET/POST/PATCH/DELETE | `/stats` **(SUPER_ADMIN only)** | Every stat block on the site |

### For Youth page

| Method | Route | Purpose |
|---|---|---|
| GET/POST/PATCH/DELETE | `/programs` | Incoming/Outgoing Global Volunteer cards |
| GET/POST/PATCH/DELETE | `/faqs` | The FAQ accordion |

### For Partners page

| Method | Route | Purpose |
|---|---|---|
| GET/POST/PATCH/DELETE | `/partnership-opportunities` | Technology Partners / Reseller Partners |
| GET/POST/PATCH/DELETE | `/partner-success-stories` | TechFlow Solutions / Digital Dynamics / Enterprise Pro |
| POST | `/partner-leads` | The "Get in Touch" form (also used by Contact page's Partner With Us tab, see note below) |
| GET | `/partner-leads/admin` **(admin)** | List submitted leads, filter by `status` or `source` |
| PATCH | `/partner-leads/admin/:id/status` **(admin)** | Move a lead through new → contacted → in_discussion → closed |

### Contact / Get Involved page

This page has three tabs, and each one hits a different endpoint:

**Apply Now tab** (toggles between Exchange Program and Membership Program)

| Method | Route | Purpose |
|---|---|---|
| POST | `/applications` | Submit an application |
| GET | `/applications/admin` **(admin)** | List, filter by `type` or `status` |
| PATCH | `/applications/admin/:id/status` **(admin)** | new → reviewing → accepted/rejected |

**Partner With Us tab** is the same form shape as the For Partners page's
"Get in Touch" form, so it posts to the same `/partner-leads` endpoint with
`"source": "contact_page"` instead of `"for_partners_page"`. One table, one
validation schema, one admin list to check.

**Support and Donate tab**

| Method | Route | Purpose |
|---|---|---|
| POST | `/donations` | Creates a pending donation record |
| PATCH | `/donations/:id/confirm` | Marks it completed once payment clears (see Payments note) |
| GET | `/donations/admin` **(admin)** | List, filter by `status` or `frequency` |

### Alumni page

| Method | Route | Purpose |
|---|---|---|
| GET | `/alumni` | Directory with filters: `?generation=`, `?industry=`, `?location=`, `?roleLevel=`, `?q=` (search), plus `page`/`limit` for "Load More" |
| GET | `/alumni/:id` | Single profile |
| POST | `/alumni/:id/connect` **(auth required)** | The Connect button |
| POST | `/alumni/:id/follow` **(auth required)** | The Follow button |
| POST | `/alumni/register` | New Alumni Registration sidebar form |
| GET | `/alumni/admin/registrations` **(admin)** | Pending sign-ups to review and promote to full profiles |
| GET/POST/PATCH/DELETE | `/alumni-success-stories` | "From Student to CEO" etc. |

Mongoose modeled Connect/Follow as arrays embedded on the Alumni document.
Postgres doesn't have a natural equivalent, so each is now its own join
table (`alumni_connections`, `alumni_followers`) with a foreign key back to
`alumni` and `users`, and a unique constraint on the pair so the database
itself — not just application code — stops a duplicate connection.

### Stories page

| Method | Route | Purpose |
|---|---|---|
| GET | `/stories` | Exchange Diaries & Leadership Stories, filter with `?category=` or `?q=` |
| GET | `/stories/:slug` | Single story, "Read More" |
| GET/POST/PATCH/DELETE | `/impact-reports` | Downloadable PDF reports |

### Files

| Method | Route | Purpose |
|---|---|---|
| POST | `/admin/upload` **(admin)** | Upload a committee photo, story cover image, or report PDF; returns a `fileUrl` to paste into the relevant create/update call |

## Search — an honest trade-off

Alumni and Stories search (`?q=`) uses Postgres `ILIKE` across the relevant
text columns, not full-text search (`tsvector`). That's a real trade-off,
not an oversight: `ILIKE` needs zero extra migration or index setup and is
plenty fast at hundreds or a few thousand rows. If either the alumni
directory or the stories archive gets into the tens of thousands of rows,
that's the point to add a `tsvector` column with a GIN index instead —
Drizzle supports that fine, it just wasn't worth the extra migration
complexity for a launch-scale dataset.

## Payments — the one thing that isn't fully wired up

The donation flow creates a `pending` record and gives you an ID back. It
does **not** move any money. That's deliberate: which payment gateway you
use depends on decisions above my pay grade (Flutterwave and Paystack both
handle Rwandan mobile money and cards well; Stripe is the better call if
you expect a lot of international donors). The integration point is
`donationController.confirmDonation` — once you pick a gateway, that's
where its webhook handler calls in to mark the donation `completed` with
the transaction reference. Budget real time for this; it's the one part of
the backend that touches actual money and deserves its own testing pass
against the gateway's sandbox before it goes live.

## Testing

All 29 tests mock the Drizzle query layer (`jest.mock('../src/db', ...)`
with a chainable mock that mimics `db.select().from().where()...`) rather
than hitting a real database. That means they genuinely test the full
Express request cycle: routing, auth middleware, Zod validation, controller
logic, error handling. It does **not** catch a bad SQL query, a schema
mismatch, or a constraint violation that only shows up against a real
Postgres instance.

Separately from the Jest suite, the schema itself has been validated for
real: `npm run db:generate` successfully produced actual migration SQL for
all 20 tables (`src/db/migrations/0000_square_titania.sql`) — every column
type, enum, foreign key, and cascade rule in there is real Postgres DDL
that Drizzle generated from the schema files, not something I wrote by
hand and hoped was correct.

For true integration tests against a real (throwaway) database, Neon
supports **database branching** — you can spin up an ephemeral branch of
your dev database per CI run, migrate it, run tests against it, and delete
it after. That's the natural next step here and fits Neon specifically
better than something like `mongodb-memory-server` would have fit MongoDB.

## Security hardening pass

After the initial build, I went back through this specifically for security
and found five real issues, not hypothetical ones — each was either a
concrete misconfiguration in this codebase or a disclosed CVE in a
dependency. Fixed all five:

1. **No fallback secret for JWTs.** The original code had `process.env.JWT_SECRET
   || 'dev-secret-change-me'` — if the env var was ever missing in
   production, tokens would silently get signed with a hardcoded string
   that's now sitting in this chat log and this README. `jwt.ts` now throws
   at boot if `JWT_SECRET` isn't set, so a missing secret fails loudly
   before the server ever starts, instead of quietly failing open.
2. **CORS defaulted to `'*'` combined with `credentials: true`.** Browsers
   actually reject that combination outright, but the bigger issue was the
   *intent* — defaulting to permissive instead of restrictive. It now
   refuses to boot in production without `CLIENT_URL` explicitly set,
   and falls back to `localhost:3000` only outside production.
3. **No `trust proxy` setting.** Behind any real reverse proxy (Render,
   Railway, Fly, nginx, an ALB), Express saw the proxy's IP on every
   request instead of the real client's, which meant `express-rate-limit`
   was rate-limiting the proxy instead of individual users — in practice,
   doing nothing. Added `app.set('trust proxy', 1)`.
4. **JSON body limit was too tight for real content.** 10kb sounds
   reasonable until you remember a Story's `content` field is a full
   article — a genuine Exchange Diary or Leadership Story post could
   exceed that and fail with an opaque error. Raised to 200kb, still nowhere
   near large enough to be a meaningful DoS vector on its own.
5. **Unhandled errors could leak internal details.** Any 500 that wasn't
   one of the specific Postgres codes I check for fell through to
   `err.message` from the raw error, which for a database driver can mean
   query fragments or internal state in the response. Now genericized to
   "Something went wrong" outside development; `ApiError`s (the ones I
   write on purpose, like "Incorrect email or password") still show their
   real message since those were always meant to be seen.

Also ran `npm audit` against the full dependency tree, not just the one
package I already had my eye on. It turned up something more serious than
the multer version I'd flagged before: **drizzle-orm below 0.45.2 has a
high-severity SQL injection vulnerability** via improperly escaped SQL
identifiers ([GHSA-gpj5-g38j-94v9](https://github.com/advisories/GHSA-gpj5-g38j-94v9)).
For a SQL-backed API, that's not a "known follow-up," that's a "fix it now"
— upgraded to 0.45.2, upgraded `drizzle-kit` alongside it for compatibility,
regenerated the schema migration to confirm nothing broke, all tests still
pass. Also upgraded `multer` to 2.x while in there.

Everything in this section has a matching test in `tests/security.test.ts`
that actually exercises the new behavior (throws without `JWT_SECRET`,
refuses to boot in production without `CLIENT_URL`) rather than just
asserting it in prose.

**One remaining `npm audit` finding, left as-is on purpose:** a moderate
`esbuild` vulnerability reachable only through `drizzle-kit`'s local dev
tooling (`db:generate`/`db:studio`), not the running server. `npm audit
fix --force` would resolve it by *downgrading* drizzle-kit below what the
now-patched drizzle-orm needs — trading a real fix for a version conflict.
Worth revisiting when drizzle-kit ships a release that clears it without
the downgrade, but not worth forcing today.

## Other known follow-ups

- **Rate limiting is in-memory** — fine for a single server, but if this
  ever runs on more than one instance behind a load balancer, swap
  `express-rate-limit`'s store for a Redis-backed one or the limits reset
  per-instance instead of globally.
- **No refresh tokens** — JWTs are long-lived (7 days) instead. Fine for an
  admin dashboard with a handful of committee members; would need
  revisiting if this ever has more than a few dozen admin users.
- **Search is ILIKE, not tsvector** — see the Search section above.
- **Password policy is length-only** (8 char minimum via Zod), no
  complexity requirement. Reasonable baseline for a small admin team;
  worth tightening if this ever has self-service public registration.

## Project structure

```
src/
  db/
    index.ts                  Neon connection (lazy pool, via drizzle-orm/neon-serverless)
    migrate.ts                 Applies migrations from src/db/migrations
    migrations/                 Generated SQL migration files (npm run db:generate)
    schema/                      20 tables across 9 files, grouped by page
  validators/schemas.ts       Zod schemas for every public form
  middleware/
    auth.ts                    JWT verification + role gating
    validate.ts                  Zod request validation
    upload.ts                     Multer file upload config
    errorHandler.ts                 Central error formatting (incl. Postgres error codes)
  controllers/
    crudFactory.ts               Generic list/read/create/update/delete for Drizzle tables
    contentControllers.ts         crudFactory wired to the 11 simple content tables
    homeController.ts / aboutController.ts    Page aggregators
    applicationController.ts, partnerLeadController.ts,
    donationController.ts, alumniController.ts,
    storyController.ts, uploadController.ts, authController.ts
  routes/                     One file per resource, assembled in index.ts
  scripts/seed.ts               Populates the DB with real content from the Figma screens
  utils/password.ts             Explicit bcrypt hash/compare (Drizzle has no Mongoose-style save hooks)
  app.ts                        Express app factory (middleware, routes, error handling) — used by tests, index.ts, and dev-server.ts
  index.ts                      Vercel entry point — plain default export, no app.listen()
  dev-server.ts                 Local/traditional-hosting entry point — DB check + app.listen()
tests/                         29 tests across 7 suites
postman/                       Postman collection + Local/Production environments (see "Postman collection" above)
drizzle.config.ts               drizzle-kit config (schema location, migration output, DB credentials)
```
