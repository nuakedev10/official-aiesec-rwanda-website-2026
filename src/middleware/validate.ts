import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

// Runs a Zod schema against req.body and rejects with a clear 400 before
// the request ever reaches a controller/DB call.
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new ApiError(400, message));
    }
    req.body = result.data;
    next();
  };
