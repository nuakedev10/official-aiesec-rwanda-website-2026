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

Run the test suite with `npm test`. All 25 tests pass against a mocked
Drizzle query layer (see "Testing" below for exactly what that does and
doesn't cover).

Default admin login after seeding: `admin@aiesec.rw` / `ChangeThisPassword123`
— change that password immediately, it's only there so you have something
to log in with on day one.

`npm run db:studio` opens Drizzle Studio, a browser GUI for browsing and
editing your Neon data directly — handy for checking the seed worked
without writing SQL by hand.

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

All 25 tests mock the Drizzle query layer (`jest.mock('../src/db', ...)`
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

## Known follow-ups

- **multer is on 1.x** — it works fine and is what's installed, but 2.x
  exists with security fixes. Given your background, you'll probably want
  to check this before going live rather than take my word for it.
- **Rate limiting is in-memory** — fine for a single server, but if this
  ever runs on more than one instance behind a load balancer, swap
  `express-rate-limit`'s store for a Redis-backed one or the limits reset
  per-instance instead of globally.
- **No refresh tokens** — JWTs are long-lived (7 days) instead. Fine for an
  admin dashboard with a handful of committee members; would need
  revisiting if this ever has more than a few dozen admin users.
- **Search is ILIKE, not tsvector** — see the Search section above.

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
  app.ts                        Express app (middleware, routes, error handling)
  server.ts                     Entry point — verifies DB connectivity, starts listening
tests/                         25 tests across 6 suites
drizzle.config.ts               drizzle-kit config (schema location, migration output, DB credentials)
```
