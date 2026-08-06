import request from 'supertest';
import { createApp } from '../src/app';
import { getDb } from '../src/db';
import { chain, mockDb } from './mockDb';

jest.mock('../src/db', () => ({ getDb: jest.fn() }));

describe('GET /api/stories', () => {
  const app = createApp();

  it('filters by category', async () => {
    const db = mockDb();
    db.select.mockReturnValue(chain([{ title: 'Finding My Voice', category: 'Exchange Diary' }]));
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app).get('/api/stories?category=Exchange Diary');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /api/stories/:slug', () => {
  const app = createApp();

  it('returns a single published story', async () => {
    const db = mockDb();
    db.select.mockReturnValue(
      chain([{ title: "Finding My Voice: A Student\u2019s Journey in Rural HUYE", slug: 'finding-my-voice' }])
    );
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app).get('/api/stories/finding-my-voice');
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('finding-my-voice');
  });

  it('returns 404 for an unpublished or missing story', async () => {
    const db = mockDb();
    db.select.mockReturnValue(chain([]));
    (getDb as jest.Mock).mockReturnValue(db);

    const res = await request(app).get('/api/stories/does-not-exist');
    expect(res.status).toBe(404);
  });
});
