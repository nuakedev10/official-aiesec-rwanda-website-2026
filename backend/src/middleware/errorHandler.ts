import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

// Last middleware in the chain. Every controller either throws an ApiError
// on purpose, or something unexpected blows up (a bad query, a constraint
// violation) — both land here so the frontend always gets the same JSON
// error shape.
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err.message || 'Something went wrong';

  // Postgres unique-constraint violation (e.g. email already registered,
  // duplicate alumni connection). Code 23505 is Postgres's own error code
  // for this, not something Drizzle invents.
  if (err.code === '23505') {
    statusCode = 409;
    message = 'That record already exists.';
  }

  // Foreign-key violation — e.g. trying to connect to an alumni_id that
  // doesn't exist.
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced record does not exist.';
  }

  // NOT NULL violation slipping past Zod (shouldn't normally happen, but
  // covered in case a route is ever called without validation middleware).
  if (err.code === '23502') {
    statusCode = 400;
    message = 'A required field is missing.';
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  // ApiError messages are always written for the client on purpose ("Not
  // found", "Incorrect email or password", etc.) and are safe to show. A
  // raw, unrecognized 500 is a different story — err.message on those can
  // be a driver's internal error text, which has leaked table/column names
  // and query fragments in plenty of real APIs. Past this point only
  // ApiErrors and the known Postgres codes above get their real message;
  // everything else gets genericized outside development.
  const isSafeToShow = err instanceof ApiError || statusCode !== 500;
  if (!isSafeToShow && process.env.NODE_ENV === 'production') {
    message = 'Something went wrong';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};
