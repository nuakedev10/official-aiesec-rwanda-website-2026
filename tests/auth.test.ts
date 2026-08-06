import request from 'supertest';
import { createApp } from '../src/app';
import { getDb } from '../src/db';
import { chain, mockDb } from './mockDb';
import { hashPassword } from '../src/utils/password';
import { signToken } from '../src/utils/jwt';

jest.mock('../src/db', () => ({ getDb: jest.fn() }));

describe('POST /api/auth/login', () => {
  const app = createApp();

  it('returns a token for correct credentials', async () => {
    const db = mockDb();
    const hashed = await hashPassword('supersecure1');
    db.select.mockReturnValue(
      chain([{ id: 'u1', fullName: 'Collins Amabuo', email: 'collins@aiesec.rw', role: 'MCVP', password: hashed }])
    );
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'collins@aiesec.rw', password: 'supersecure1' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects wrong credentials with 401', async () => {
    const db = mockDb();
    db.select.mockReturnValue(chain([])); // no user found
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@aiesec.rw', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('rejects a malformed email before hitting the database', async () => {
    const db = mockDb();
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'whatever1' });

    expect(res.status).toBe(400);
    expect(db.select).not.toHaveBeenCalled();
  });
});

describe('Protected admin routes', () => {
  const app = createApp();

  it('rejects content creation with no token', async () => {
    const res = await request(app).post('/api/faqs').send({ question: 'Q', answer: 'A' });
    expect(res.status).toBe(401);
  });

  it('rejects a garbage token', async () => {
    const res = await request(app)
      .post('/api/faqs')
      .set('Authorization', 'Bearer not-a-real-token')
      .send({ question: 'Q', answer: 'A' });
    expect(res.status).toBe(401);
  });

  it('allows content creation with a valid token and correct role', async () => {
    const db = mockDb();
    // protect() middleware looks the user up by id from the token
    db.select.mockReturnValue(chain([{ id: 'u1', role: 'SUPER_ADMIN' }]));
    db.insert.mockReturnValue(chain([{ id: 'faq1', question: 'Q', answer: 'A' }]));
    (getDb as jest.Mock).mockReturnValue(db);

    const token = signToken({ id: 'u1', role: 'SUPER_ADMIN' });
    const res = await request(app)
      .post('/api/faqs')
      .set('Authorization', `Bearer ${token}`)
      .send({ question: 'Q', answer: 'A' });

    expect(res.status).toBe(201);
  });
});
