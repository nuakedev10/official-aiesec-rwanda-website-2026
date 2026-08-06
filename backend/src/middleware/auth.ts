import { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import { getDb } from '../db';
import { users } from '../db/schema';
import type { User } from '../db/schema';

export interface AuthRequest extends Request {
  user?: { id: string; role: User['role'] };
}

// Verifies the Bearer token on protected routes (everything under /admin,
// plus a few write actions like alumni connect/follow).
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authenticated. Include a Bearer token.');
    }
    const token = header.split(' ')[1];
    const payload = verifyToken(token);

    const db = getDb();
    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) throw new ApiError(401, 'User no longer exists');

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

// Role gate for admin-only content management routes.
export const restrictTo =
  (...roles: User['role'][]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
