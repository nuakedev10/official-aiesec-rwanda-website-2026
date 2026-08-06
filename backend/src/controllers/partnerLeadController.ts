import { Request, Response } from 'express';
import { eq, and, count, desc } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/paginate';
import { getDb } from '../db';
import { partnerLeads } from '../db/schema';

// POST /api/partner-leads — handles BOTH the For Partners "Get in Touch"
// form and the Contact page "Partner With Us" tab. req.body.source tells
// the frontend which page it's calling from.
export const submitPartnerLead = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [lead] = await db.insert(partnerLeads).values(req.body).returning();
  res.status(201).json({
    success: true,
    message: "Thanks for reaching out — we'll be in touch shortly.",
    data: lead,
  });
});

// GET /api/admin/partner-leads
export const getPartnerLeads = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { page, limit, skip } = getPagination(req, 20);

  const conditions = [];
  if (req.query.status) conditions.push(eq(partnerLeads.status, req.query.status as any));
  if (req.query.source) conditions.push(eq(partnerLeads.source, req.query.source as any));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, [{ value: total }]] = await Promise.all([
    db.select().from(partnerLeads).where(where).orderBy(desc(partnerLeads.createdAt)).limit(limit).offset(skip),
    db.select({ value: count() }).from(partnerLeads).where(where),
  ]);
  res.status(200).json({ success: true, count: items.length, total: Number(total), page, data: items });
});

// PATCH /api/admin/partner-leads/:id/status
export const updatePartnerLeadStatus = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { status } = req.body;
  if (!['new', 'contacted', 'in_discussion', 'closed'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }
  const [lead] = await db
    .update(partnerLeads)
    .set({ status, updatedAt: new Date() })
    .where(eq(partnerLeads.id, req.params.id))
    .returning();
  if (!lead) throw new ApiError(404, 'Partner lead not found');
  res.status(200).json({ success: true, data: lead });
});
