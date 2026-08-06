import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { getDb } from '../db';
import { users } from '../db/schema';
import { AuthRequest } from '../middleware/auth';

// POST /api/auth/register — creates a committee/admin account.
// In practice this stays locked down (only a SUPER_ADMIN creates new
// accounts) rather than being open to the public.
export const register = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const hashed = await hashPassword(req.body.password);

  const [user] = await db
    .insert(users)
    .values({ ...req.body, password: hashed })
    .returning();

  const token = signToken({ id: user.id, role: user.role });
  res.status(201).json({
    success: true,
    data: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    token,
  });
});

// POST /api/auth/login
export const login = catchAsync(async (req: Request, res: Response) => {
  const db = getDb();
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  const token = signToken({ id: user.id, role: user.role });
  res.status(200).json({
    success: true,
    data: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    token,
  });
});

// GET /api/auth/me — returns the logged-in admin's own profile
export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
  if (!user) throw new ApiError(404, 'User not found');
  const { password, ...safeUser } = user;
  res.status(200).json({ success: true, data: safeUser });
});
