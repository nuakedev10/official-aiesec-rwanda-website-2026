# AIESEC in Rwanda — Frontend

Next.js 14 (App Router) + TypeScript + Tailwind CSS frontend for the
official AIESEC in Rwanda website, built against the Express/Drizzle
backend in `../src`. See the root [README](../README.md) for the backend's
full endpoint reference.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your running backend
npm run dev                   # http://localhost:3000
```

If the backend isn't running or reachable, every page falls back to
realistic placeholder content (see `lib/fallback.ts`) instead of failing to
render — useful for frontend-only development.

## Structure

```
app/            One route per page (Home, About, For Youth, For Partners,
                Alumni, Stories, Get Involved, Contact) plus layout.tsx,
                sitemap.ts, robots.ts.
components/     Reusable UI: Header, Footer, forms, cards, icons.
lib/
  api.ts        Typed fetch wrappers for every backend endpoint, each
                falling back to lib/fallback.ts on failure.
  types.ts      Types mirroring the backend's Drizzle schema shapes.
  validation.ts Zod schemas mirroring the backend's validators, used for
                client-side validation before every form submit.
public/images/  Organized, descriptively-named folders for real photography
                (hero/, team/, alumni/, stories/, partners/, icons/) — drop
                files in and pass their path to <SiteImage src="..." />.
```

## Images

Every image-shaped section renders through `components/SiteImage.tsx`. With
no `src`, it renders a labeled placeholder so the layout looks right before
real photography exists. Once you have real photos, drop them in
`public/images/<section>/` and pass `src="/images/<section>/<file>.jpg"` —
no other code changes needed.

## Forms

All five forms (application, partner lead, donation, alumni registration,
contact) validate with Zod on the client before submitting, then POST
directly to the backend, which re-validates and persists to Postgres. The
backend has no dedicated `/contact` endpoint (see root README) — the
Contact page's message form submits through `/partner-leads` tagged
`source: "contact_page"`, the same way the original design's Partners tab
does.

## Known follow-ups

- **Next.js is pinned to 14.2.35**, the latest 14.x patch — a few
  advisories only have fixes in the Next 16 major, which is a larger
  migration than this task's scope. Revisit before a security-sensitive
  launch.
- **Donations don't touch a real payment gateway** — `DonationForm`
  creates a `pending` record via the backend, matching the backend's own
  documented trade-off (see root README's "Payments" section). Wire up
  Stripe Checkout (or Flutterwave/Paystack) before accepting real funds.
- **Alumni Connect/Follow buttons are UI-only** — the backend routes
  require an authenticated user (`POST /alumni/:id/connect|follow`), and
  there's no public sign-in flow yet for alumni themselves.
