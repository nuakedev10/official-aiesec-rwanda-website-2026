import { Request } from 'express';

// Shared query-param -> pagination options parsing, used by every list
// endpoint (Alumni directory, Stories, etc.) so paging works the same way
// across the whole API.
export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (req: Request, defaultLimit = 12): PaginationResult => {
  const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || String(defaultLimit), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
