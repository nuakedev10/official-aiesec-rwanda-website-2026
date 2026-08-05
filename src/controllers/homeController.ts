import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { getDb } from '../db';
import { siteStats, testimonials } from '../db/schema';

// GET /api/home — one call that returns everything the home page needs
// (impact numbers + testimonials) instead of the frontend firing off three
// separate requests just to render one screen.
export const getHomePage = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [stats, featuredTestimonials] = await Promise.all([
    db.select().from(siteStats).where(eq(siteStats.page, 'home')).orderBy(siteStats.order),
    db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isFeatured, true))
      .orderBy(testimonials.order)
      .limit(3),
  ]);

  res.status(200).json({
    success: true,
    data: { stats, testimonials: featuredTestimonials },
  });
});
