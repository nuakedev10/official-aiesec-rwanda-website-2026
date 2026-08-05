import request from 'supertest';
import { createApp } from '../src/app';
import { getDb } from '../src/db';
import { chain, mockDb } from './mockDb';
import { signToken } from '../src/utils/jwt';

jest.mock('../src/db', () => ({ getDb: jest.fn() }));

describe('GET /api/alumni', () => {
  const app = createApp();

  it('returns a filtered list', async () => {
    const db = mockDb();
    db.select.mockReturnValue(chain([{ fullName: 'Sarah Johnson', industry: 'Technology' }]));
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app).get('/api/alumni?industry=Technology&page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('POST /api/alumni/:id/connect', () => {
  const app = createApp();

  it('requires authentication', async () => {
    const res = await request(app).post('/api/alumni/abc123/connect');
    expect(res.status).toBe(401);
  });

  it('adds the connection when token is valid and alumni exists', async () => {
    const db = mockDb();
    // Call order: protect() looks up the user, controller looks up the
    // alumni profile, then checks for an existing connection.
    db.select
      .mockReturnValueOnce(chain([{ id: 'user1', role: 'LC_ADMIN' }])) // auth middleware
      .mockReturnValueOnce(chain([{ id: 'alum1' }])) // alumni exists
      .mockReturnValueOnce(chain([])); // no existing connection
    db.insert.mockReturnValue(chain([{ alumniId: 'alum1', userId: 'user1' }]));
    (getDb as jest.Mock).mockReturnValue(db);

    const token = signToken({ id: 'user1', role: 'LC_ADMIN' });
    const res = await request(app)
      .post('/api/alumni/alum1/connect')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

describe('POST /api/alumni/register', () => {
  const app = createApp();

  it('creates a pending registration with valid data', async () => {
    const db = mockDb();
    db.insert.mockReturnValue(
      chain([{ fullName: 'New Grad', email: 'grad@example.com', graduationYear: 2024, status: 'pending' }])
    );
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app)
      .post('/api/alumni/register')
      .send({ fullName: 'New Grad', email: 'grad@example.com', graduationYear: 2024 });

    expect(res.status).toBe(201);
  });

  it('rejects a graduation year in the future', async () => {
    const res = await request(app)
      .post('/api/alumni/register')
      .send({ fullName: 'New Grad', email: 'grad@example.com', graduationYear: 2099 });

    expect(res.status).toBe(400);
  });
});
