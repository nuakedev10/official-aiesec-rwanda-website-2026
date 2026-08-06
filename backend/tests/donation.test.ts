import request from 'supertest';
import { createApp } from '../src/app';
import { getDb } from '../src/db';
import { chain, mockDb } from './mockDb';

jest.mock('../src/db', () => ({ getDb: jest.fn() }));

describe('POST /api/donations', () => {
  const app = createApp();
  const validPayload = {
    fullName: 'John Smith',
    email: 'john@example.com',
    amount: 50,
    frequency: 'one-time',
    dedicateGift: false,
  };

  it('creates a pending donation and returns 201', async () => {
    const db = mockDb();
    db.insert.mockReturnValue(chain([{ id: 'd1', ...validPayload, status: 'pending' }]));
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app).post('/api/donations').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });

  it('rejects a zero or negative amount', async () => {
    const res = await request(app).post('/api/donations').send({ ...validPayload, amount: 0 });
    expect(res.status).toBe(400);
  });

  it('rejects an invalid frequency', async () => {
    const res = await request(app).post('/api/donations').send({ ...validPayload, frequency: 'weekly' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/donations/:id/confirm', () => {
  const app = createApp();

  it('marks a donation completed with a payment reference', async () => {
    const db = mockDb();
    db.update.mockReturnValue(
      chain([{ id: 'd1', status: 'completed', paymentReference: 'ref_123' }])
    );
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app)
      .patch('/api/donations/d1/confirm')
      .send({ paymentReference: 'ref_123' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('returns 404 when the donation does not exist', async () => {
    const db = mockDb();
    db.update.mockReturnValue(chain([]));
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app)
      .patch('/api/donations/does-not-exist/confirm')
      .send({ paymentReference: 'ref_999' });

    expect(res.status).toBe(404);
  });
});
