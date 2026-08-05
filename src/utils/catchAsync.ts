import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wraps an async route handler so any thrown/rejected error gets forwarded
// to Express's error middleware instead of crashing the process or hanging
// the request. Avoids repeating try/catch in every controller.
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
