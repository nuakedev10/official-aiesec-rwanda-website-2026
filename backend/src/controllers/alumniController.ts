import { Request, Response } from 'express';
import { eq, and, count, desc, ilike, or } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/paginate';
import { getDb } from '../db';
import { alumni, alumniConnections, alumniFollowers, alumniRegistrations } from '../db/schema';
import { AuthRequest } from '../middleware/auth';

// GET /api/alumni — the "Find Alumni" filter bar (Generation/Industry/
// Location/Role Level) + "1,247 alumni found" + "Load More Alumni".
// All filters are optional and combine with AND logic.
//
// Search uses ILIKE across name/company/bio rather than Postgres full-text
// search (tsvector). That's the honest MVP trade-off: ILIKE needs zero
// extra migration or index setup and is plenty fast at hundreds or a few
// thousand rows. If the alumni directory ever gets into the tens of
// thousands, that's the point to add a tsvector column + GIN index instead.
export const getAlumni = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { page, limit, skip } = getPagination(req, 10);

  const conditions = [eq(alumni.isPublished, true)];
  if (req.query.generation) conditions.push(eq(alumni.classYear, Number(req.query.generation)));
  if (req.query.industry) conditions.push(eq(alumni.industry, req.query.industry as string));
  if (req.query.location) conditions.push(eq(alumni.location, req.query.location as string));
  if (req.query.roleLevel) conditions.push(eq(alumni.roleLevel, req.query.roleLevel as any));
  if (req.query.q) {
    const term = `%${req.query.q}%`;
    conditions.push(
      or(ilike(alumni.fullName, term), ilike(alumni.company, term), ilike(alumni.bio, term))!
    );
  }
  const where = and(...conditions);

  const [items, [{ value: total }]] = await Promise.all([
    db.select().from(alumni).where(where).orderBy(desc(alumni.classYear)).limit(limit).offset(skip),
    db.select({ value: count() }).from(alumni).where(where),
  ]);

  res.status(200).json({ success: true, count: items.length, total: Number(total), page, data: items });
});

// GET /api/alumni/:id
export const getAlumniProfile = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [profile] = await db.select().from(alumni).where(eq(alumni.id, req.params.id)).limit(1);
  if (!profile) throw new ApiError(404, 'Alumni profile not found');
  res.status(200).json({ success: true, data: profile });
});

// POST /api/alumni/:id/connect — the "Connect" button on each card.
// The unique(alumniId, userId) constraint on alumni_connections is what
// actually stops a double-connect at the database level; the pre-check
// here just turns that into a clean 409 instead of a raw Postgres error.
export const connectWithAlumni = catchAsync(async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const [profile] = await db.select().from(alumni).where(eq(alumni.id, req.params.id)).limit(1);
  if (!profile) throw new ApiError(404, 'Alumni profile not found');

  const [existing] = await db
    .select()
    .from(alumniConnections)
    .where(and(eq(alumniConnections.alumniId, req.params.id), eq(alumniConnections.userId, req.user!.id)))
    .limit(1);
  if (existing) throw new ApiError(409, 'Already connected');

  await db.insert(alumniConnections).values({ alumniId: req.params.id, userId: req.user!.id });
  res.status(200).json({ success: true, message: 'Connection request sent' });
});

// POST /api/alumni/:id/follow — the "Follow" button on each card.
export const followAlumni = catchAsync(async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const [profile] = await db.select().from(alumni).where(eq(alumni.id, req.params.id)).limit(1);
  if (!profile) throw new ApiError(404, 'Alumni profile not found');

  const [existing] = await db
    .select()
    .from(alumniFollowers)
    .where(and(eq(alumniFollowers.alumniId, req.params.id), eq(alumniFollowers.userId, req.user!.id)))
    .limit(1);
  if (existing) throw new ApiError(409, 'Already following');

  await db.insert(alumniFollowers).values({ alumniId: req.params.id, userId: req.user!.id });
  res.status(200).json({ success: true, message: 'Now following' });
});

// POST /api/alumni/register — "New Alumni Registration" sidebar form.
// Creates a pending registration; an admin promotes it to a full Alumni
// profile (adding job title, bio, photo, etc.) from the dashboard.
export const registerAlumni = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [registration] = await db.insert(alumniRegistrations).values(req.body).returning();
  res.status(201).json({
    success: true,
    message: "Thanks for registering — we'll follow up by email.",
    data: registration,
  });
});

// GET /api/admin/alumni-registrations — pending sign-ups an admin reviews.
export const getAlumniRegistrations = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { page, limit, skip } = getPagination(req, 20);

  const where = req.query.status
    ? eq(alumniRegistrations.status, req.query.status as any)
    : undefined;

  const [items, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(alumniRegistrations)
      .where(where)
      .orderBy(desc(alumniRegistrations.createdAt))
      .limit(limit)
      .offset(skip),
    db.select({ value: count() }).from(alumniRegistrations).where(where),
  ]);
  res.status(200).json({ success: true, count: items.length, total: Number(total), page, data: items });
});
