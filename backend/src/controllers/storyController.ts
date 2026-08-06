import { Request, Response } from 'express';
import { eq, and, count, desc, ilike, or } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/paginate';
import { getDb } from '../db';
import { stories } from '../db/schema';

// GET /api/stories — "Exchange Diaries & Leadership Stories" grid +
// "View All Stories" pagination. Optional category filter and free-text
// search (ILIKE across title/excerpt/content — same trade-off as the
// alumni search, see that controller's comment).
export const getStories = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { page, limit, skip } = getPagination(req, 9);

  const conditions = [eq(stories.isPublished, true)];
  if (req.query.category) conditions.push(eq(stories.category, req.query.category as any));
  if (req.query.q) {
    const term = `%${req.query.q}%`;
    conditions.push(
      or(ilike(stories.title, term), ilike(stories.excerpt, term), ilike(stories.content, term))!
    );
  }
  const where = and(...conditions);

  const [items, [{ value: total }]] = await Promise.all([
    db.select().from(stories).where(where).orderBy(desc(stories.publishedAt)).limit(limit).offset(skip),
    db.select({ value: count() }).from(stories).where(where),
  ]);
  res.status(200).json({ success: true, count: items.length, total: Number(total), page, data: items });
});

// GET /api/stories/:slug — "Read More" on an individual story.
export const getStoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [story] = await db
    .select()
    .from(stories)
    .where(and(eq(stories.slug, req.params.slug), eq(stories.isPublished, true)))
    .limit(1);
  if (!story) throw new ApiError(404, 'Story not found');
  res.status(200).json({ success: true, data: story });
});
