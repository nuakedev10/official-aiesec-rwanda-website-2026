import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Public form-submission endpoints get a tighter rate limit than the
  // read-only content endpoints, since those are the ones spam bots go for.
  const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use('/api/applications', formLimiter);
  app.use('/api/partner-leads', formLimiter);
  app.use('/api/donations', formLimiter);
  app.use('/api/alumni/register', formLimiter);

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  app.get('/api/health', (req, res) => res.status(200).json({ success: true, message: 'OK' }));

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
