import request from 'supertest';
import { createApp } from '../src/app';
import { getDb } from '../src/db';
import { chain, mockDb } from './mockDb';

jest.mock('../src/db', () => ({ getDb: jest.fn() }));

describe('POST /api/applications', () => {
  const app = createApp();
  const validPayload = {
    applicationType: 'exchange',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    countryOfOrigin: 'France',
    programOfInterest: 'Cultural Exchange',
    preferredStartDate: '2026-09-01',
    motivation: 'I want to build leadership skills through this exchange.',
  };

  it('creates an application with valid data and returns 201', async () => {
    const db = mockDb();
    db.insert.mockReturnValue(chain([{ id: 'abc123', ...validPayload }]));
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app).post('/api/applications').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(db.insert).toHaveBeenCalled();
  });

  it('rejects an invalid email with 400 before touching the database', async () => {
    const db = mockDb();
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app)
      .post('/api/applications')
      .send({ ...validPayload, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('rejects a motivation that is too short', async () => {
    const res = await request(app)
      .post('/api/applications')
      .send({ ...validPayload, motivation: 'short' });

    expect(res.status).toBe(400);
  });

  it('rejects an invalid applicationType', async () => {
    const res = await request(app)
      .post('/api/applications')
      .send({ ...validPayload, applicationType: 'internship' });

    expect(res.status).toBe(400);
  });
});
