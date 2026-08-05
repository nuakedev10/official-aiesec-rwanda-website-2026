import { Request, Response } from 'express';
import { eq, and, count, desc } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/paginate';
import { getDb } from '../db';
import { donations } from '../db/schema';

// POST /api/donations — "Support Our Mission" tab on the Contact page.
// This creates a pending record; actual money movement is a payment
// gateway concern (Flutterwave/Paystack for local cards, Stripe for
// international) that isn't wired up here. See README for the exact
// integration point.
export const createDonation = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [donation] = await db
    .insert(donations)
    .values({ ...req.body, amount: String(req.body.amount), status: 'pending' })
    .returning();
  res.status(201).json({
    success: true,
    message: 'Donation initiated. Redirect the donor to the payment step next.',
    data: donation,
  });
});

// PATCH /api/donations/:id/confirm — called by the payment gateway
// webhook (or manually by an admin for offline gifts) once money has
// actually moved.
export const confirmDonation = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { paymentReference } = req.body;
  const [donation] = await db
    .update(donations)
    .set({ status: 'completed', paymentReference, updatedAt: new Date() })
    .where(eq(donations.id, req.params.id))
    .returning();
  if (!donation) throw new ApiError(404, 'Donation not found');
  res.status(200).json({ success: true, data: donation });
});

// GET /api/admin/donations
export const getDonations = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { page, limit, skip } = getPagination(req, 20);

  const conditions = [];
  if (req.query.status) conditions.push(eq(donations.status, req.query.status as any));
  if (req.query.frequency) conditions.push(eq(donations.frequency, req.query.frequency as any));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, [{ value: total }]] = await Promise.all([
    db.select().from(donations).where(where).orderBy(desc(donations.createdAt)).limit(limit).offset(skip),
    db.select({ value: count() }).from(donations).where(where),
  ]);
  res.status(200).json({ success: true, count: items.length, total: Number(total), page, data: items });
});
