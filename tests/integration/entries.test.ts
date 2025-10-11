import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY };
const baseSelfie = Buffer.from('entry-selfie').toString('base64');

function uniqueIsoDate(offsetMs = 0) {
  return new Date(Date.now() + offsetMs).toISOString();
}

async function createUserFixture() {
  const payload = {
    Name: `Entry User ${Date.now()}`,
    Phone: `555-${Math.floor(Math.random() * 9000 + 1000)}`,
    Username: `entry_user_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
    AuthToken: `token_${Date.now()}`,
    RoleId: 2,
  };

  const res = await request(app).post('/users').set(apiKeyHeader).send(payload);
  expect(res.status).toBe(201);
  return res.body as { Id: number };
}

async function createEntryFixture(overrides: Partial<any> = {}) {
  const userId = overrides.UserId ?? (await createUserFixture()).Id;
  const payload = {
    UserId: userId,
    LocationId: overrides.LocationId ?? 1,
    EntryTime: overrides.EntryTime ?? uniqueIsoDate(),
    Selfie: overrides.Selfie ?? baseSelfie,
    DeviceId: overrides.DeviceId ?? 'DeviceFixture',
    ...overrides,
  };

  const res = await request(app).post('/entries').set(apiKeyHeader).send(payload);
  expect(res.status).toBe(201);
  return res.body as { Id: number; UserId: number; LocationId: number };
}

describe('API - /entries', () => {
  describe('GET /entries', () => {
    it('returns paginated list', async () => {
      const res = await request(app).get('/entries').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pageSize');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('GET /entries/:id', () => {
    it('returns a single entry', async () => {
      const entry = await createEntryFixture();
      const res = await request(app).get(`/entries/${entry.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(entry.Id);
      expect(res.body.UserId).toBe(entry.UserId);
    });

    it('returns 404 when entry not found', async () => {
      const res = await request(app).get('/entries/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ENTRY_NOT_FOUND');
    });
  });

  describe('GET /entries/last/:userId', () => {
    it('returns last entry and open status', async () => {
      const entry = await createEntryFixture();
      const res = await request(app).get(`/entries/last/${entry.UserId}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('entry');
      expect(res.body.entry.Id).toBe(entry.Id);
      expect(res.body.isOpen).toBe(true);
    });

    it('returns null entry when user has none', async () => {
      const newUser = await createUserFixture();
      const res = await request(app).get(`/entries/last/${newUser.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.entry).toBeNull();
      expect(res.body.isOpen).toBe(false);
    });
  });

  describe('POST /entries', () => {
    it('creates a new entry', async () => {
      const user = await createUserFixture();
      const payload = {
        UserId: user.Id,
        LocationId: 1,
        EntryTime: uniqueIsoDate(),
        Selfie: baseSelfie,
        DeviceId: 'DeviceCreate',
      };

      const res = await request(app).post('/entries').set(apiKeyHeader).send(payload);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        UserId: payload.UserId,
        LocationId: payload.LocationId,
        DeviceId: payload.DeviceId,
        IsDeleted: false,
      });
      expect(typeof res.body.Id).toBe('number');
    });

    it('returns 404 when user does not exist', async () => {
      const res = await request(app)
        .post('/entries')
        .set(apiKeyHeader)
        .send({
          UserId: 999999,
          LocationId: 1,
          EntryTime: uniqueIsoDate(),
        });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('USER_NOT_FOUND');
    });

    it('returns 404 when location does not exist', async () => {
      const user = await createUserFixture();
      const res = await request(app)
        .post('/entries')
        .set(apiKeyHeader)
        .send({
          UserId: user.Id,
          LocationId: 999999,
          EntryTime: uniqueIsoDate(),
        });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('LOCATION_NOT_FOUND');
    });

    it('returns 409 when an open entry exists for the user', async () => {
      const entry = await createEntryFixture();
      const res = await request(app)
        .post('/entries')
        .set(apiKeyHeader)
        .send({
          UserId: entry.UserId,
          LocationId: entry.LocationId,
          EntryTime: uniqueIsoDate(1000),
        });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('OPEN_ENTRY_EXISTS');
    });

    it('returns 400 when payload invalid', async () => {
      const res = await request(app).post('/entries').set(apiKeyHeader).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /entries/:id', () => {
    it('updates fields of an entry', async () => {
      const entry = await createEntryFixture();
      const newTime = uniqueIsoDate(5000);
      const res = await request(app)
        .patch(`/entries/${entry.Id}`)
        .set(apiKeyHeader)
        .send({ EntryTime: newTime, DeviceId: 'DeviceUpdated', IsSynced: true });
      expect(res.status).toBe(200);
      expect(res.body.DeviceId).toBe('DeviceUpdated');
      expect(res.body.IsSynced).toBe(true);
      const toSec = (iso: string) => new Date(Math.floor(new Date(iso).getTime() / 1000) * 1000).toISOString();
      expect(toSec(res.body.EntryTime)).toBe(toSec(newTime));

    });

    it('returns 404 when entry does not exist', async () => {
      const res = await request(app)
        .patch('/entries/999999')
        .set(apiKeyHeader)
        .send({ DeviceId: 'Missing' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ENTRY_NOT_FOUND');
    });

    it('returns 400 when no fields provided', async () => {
      const entry = await createEntryFixture();
      const res = await request(app).patch(`/entries/${entry.Id}`).set(apiKeyHeader).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /entries/:id', () => {
    it('soft deletes an entry', async () => {
      const entry = await createEntryFixture();
      const del = await request(app).delete(`/entries/${entry.Id}`).set(apiKeyHeader);
      expect(del.status).toBe(204);

      const get = await request(app).get(`/entries/${entry.Id}`).set(apiKeyHeader);
      expect(get.status).toBe(404);
      expect(get.body.error).toBe('ENTRY_NOT_FOUND');
    });

    it('returns 404 when deleting non-existing entry', async () => {
      const res = await request(app).delete('/entries/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ENTRY_NOT_FOUND');
    });
  });
});
