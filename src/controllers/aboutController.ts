import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { getDb } from '../db';
import { committeeMembers, localCommittees, historyMilestones, siteStats } from '../db/schema';

// GET /api/about — mission/vision/values are static copy (frontend-owned),
// everything else here is genuinely dynamic content an admin edits.
export const getAboutPage = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const [mcMembers, lcMembers, allLocalCommittees, history, networkStats] = await Promise.all([
    db
      .select()
      .from(committeeMembers)
      .where(and(eq(committeeMembers.committeeLevel, 'MC'), eq(committeeMembers.isActive, true)))
      .orderBy(committeeMembers.order),
    db
      .select()
      .from(committeeMembers)
      .where(and(eq(committeeMembers.committeeLevel, 'LC'), eq(committeeMembers.isActive, true)))
      .orderBy(committeeMembers.order),
    db.select().from(localCommittees).orderBy(localCommittees.order),
    db.select().from(historyMilestones).orderBy(historyMilestones.order),
    db.select().from(siteStats).where(eq(siteStats.page, 'about')).orderBy(siteStats.order),
  ]);

  res.status(200).json({
    success: true,
    data: { mcMembers, lcMembers, localCommittees: allLocalCommittees, history, networkStats },
  });
});
