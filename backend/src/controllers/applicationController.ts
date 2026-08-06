import { Request, Response } from 'express';
import { eq, and, count, desc } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/paginate';
import { getDb } from '../db';
import { applications } from '../db/schema';

// POST /api/applications — the "Apply Now" tab (Exchange Program /
// Membership Program toggle) on the Contact page. Public, no auth.
export const submitApplication = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [application] = await db.insert(applications).values(req.body).returning();
  res.status(201).json({
    success: true,
    message: 'Application received. We will be in touch soon.',
    data: application,
  });
});

// GET /api/admin/applications — admin dashboard list, filterable by type/status.
export const getApplications = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { page, limit, skip } = getPagination(req, 20);

  const conditions = [];
  if (req.query.type) conditions.push(eq(applications.applicationType, req.query.type as any));
  if (req.query.status) conditions.push(eq(applications.status, req.query.status as any));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(applications)
      .where(where)
      .orderBy(desc(applications.createdAt))
      .limit(limit)
      .offset(skip),
    db.select({ value: count() }).from(applications).where(where),
  ]);

  res.status(200).json({ success: true, count: items.length, total: Number(total), page, data: items });
});

// PATCH /api/admin/applications/:id/status — move an application through
// the review pipeline (new -> reviewing -> accepted/rejected).
export const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { status } = req.body;
  if (!['new', 'reviewing', 'accepted', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }
  const [application] = await db
    .update(applications)
    .set({ status, updatedAt: new Date() })
    .where(eq(applications.id, req.params.id))
    .returning();
  if (!application) throw new ApiError(404, 'Application not found');
  res.status(200).json({ success: true, data: application });
});
