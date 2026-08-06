import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Behind any reverse proxy (Render, Railway, Fly, nginx, an ALB — pretty
  // much every real hosting setup), Express sees the proxy's IP on every
  // request unless told to trust the X-Forwarded-For header. Without this,
  // express-rate-limit below silently rate-limits the proxy instead of
  // individual clients, which in practice means it does nothing useful.
  app.set('trust proxy', 1);

  app.use(helmet());

  // No wildcard fallback. '*' combined with credentials: true is both an
  // invalid CORS combination (browsers reject it) and, more importantly,
  // the kind of permissive default that's easy to forget is still there
  // once a frontend URL is added. If CLIENT_URL isn't set, the app should
  // fail closed — no browser origin can call it — not fail open.
  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl && process.env.NODE_ENV === 'production') {
    throw new Error('CLIENT_URL must be set in production — refusing to default to a wildcard CORS origin.');
  }
  app.use(
    cors({
      origin: clientUrl || 'http://localhost:3000',
      credentials: true,
    })
  );

  // 10kb was too tight for real content here — a Story's `content` field
  // (a full exchange diary or leadership story) can genuinely exceed that,
  // and an admin submitting one would just get an opaque request failure.
  // 200kb comfortably covers long-form article content while still being
  // nowhere near large enough to be a meaningful DoS vector on its own.
  app.use(express.json({ limit: '200kb' }));
  app.use(express.urlencoded({ extended: true, limit: '200kb' }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // A light limiter on every route, since read endpoints with no limit at
  // all are an open invitation to scraping and are the cheapest possible
  // thing to bound.
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use('/api', globalLimiter);

  // Public form-submission endpoints get a tighter rate limit on top of
  // that, since those are the ones spam bots and abuse actually target.
  const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use('/api/applications', formLimiter);
  app.use('/api/partner-leads', formLimiter);
  app.use('/api/donations', formLimiter);
  app.use('/api/alumni/register', formLimiter);

  // No express.static('/uploads', ...) here — it's dead weight now that
  // uploads go straight to Vercel Blob (see uploadController.ts), and it
  // wouldn't serve anything on Vercel even if it were still needed:
  // express.static() is explicitly unsupported on Vercel's serverless
  // runtime. Static assets there only come from the public/** directory,
  // which is for build-time files, not runtime admin uploads.

  app.get('/api/health', (req, res) => res.status(200).json({ success: true, message: 'OK' }));

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
