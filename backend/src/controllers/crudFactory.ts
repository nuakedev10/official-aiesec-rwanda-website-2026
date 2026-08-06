import { Request, Response } from 'express';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import { asc, desc, eq, sql, count } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/paginate';
import { getDb } from '../db';

// Most content on this site (committee members, FAQs, testimonials,
// programs, local committees, history milestones, partnership
// opportunities, success stories, impact reports) is the same shape of
// problem: list it, read one, create/update/delete it as an admin.
//
// Drizzle's query builder is fully typed against a *specific* table, which
// makes a truly generic factory fight the type system a bit — the internals
// below use a few `as any` casts to bridge that, but every call site
// (contentControllers.ts) stays completely type-safe, since it passes a
// concrete table and concrete columns in. The alternative was writing this
// same five-method block eleven times by hand; this seemed like the better
// trade.
export function crudFactory<T extends PgTable>(
  table: T,
  idColumn: PgColumn,
  options: { orderColumn?: PgColumn; orderDirection?: 'asc' | 'desc' } = {}
) {
  const getAll = catchAsync(async (req: Request, res: Response) => {
    const db = getDb();
    const { page, limit, skip } = getPagination(req, 100);

    let query = db.select().from(table as any).$dynamic();
    if (options.orderColumn) {
      query = query.orderBy(
        options.orderDirection === 'desc' ? desc(options.orderColumn) : asc(options.orderColumn)
      );
    }
    const [items, [{ value: total }]] = await Promise.all([
      query.limit(limit).offset(skip),
      db.select({ value: count() }).from(table as any),
    ]);

    res.status(200).json({ success: true, count: items.length, total: Number(total), page, data: items });
  });

  const getOne = catchAsync(async (req: Request, res: Response) => {
    const db = getDb();
    const [item] = await db.select().from(table as any).where(eq(idColumn, req.params.id)).limit(1);
    if (!item) throw new ApiError(404, 'Not found');
    res.status(200).json({ success: true, data: item });
  });

  const createOne = catchAsync(async (req: Request, res: Response) => {
    const db = getDb();
    const result = (await db.insert(table as any).values(req.body).returning()) as any[];
    res.status(201).json({ success: true, data: result[0] });
  });

  const updateOne = catchAsync(async (req: Request, res: Response) => {
    const db = getDb();
    const result = (await db
      .update(table as any)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(idColumn, req.params.id))
      .returning()) as any[];
    if (!result[0]) throw new ApiError(404, 'Not found');
    res.status(200).json({ success: true, data: result[0] });
  });

  const deleteOne = catchAsync(async (req: Request, res: Response) => {
    const db = getDb();
    const result = (await db.delete(table as any).where(eq(idColumn, req.params.id)).returning()) as any[];
    if (!result[0]) throw new ApiError(404, 'Not found');
    res.status(204).json({ success: true, data: null });
  });

  return { getAll, getOne, createOne, updateOne, deleteOne };
}
