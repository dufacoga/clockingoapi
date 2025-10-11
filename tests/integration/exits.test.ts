import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY };

const baseSelfie = Buffer.from('exit-entry-selfie').toString('base64');

function iso(offsetMs = 0) {
  return new Date(Date.now() + offsetMs).toISOString();
}

async function createUserFixture() {
  const payload = {
    Name: `Exit User ${Date.now()}`,
    Phone: `555-${Math.floor(Math.random() * 9000 + 1000)}`,
    Username: `exit_user_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
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
    EntryTime: overrides.EntryTime ?? iso(),
    Selfie: overrides.Selfie ?? baseSelfie,
    DeviceId: overrides.DeviceId ?? 'ExitDeviceEntry',
    ...overrides,
  };

  const res = await request(app).post('/entries').set(apiKeyHeader).send(payload);
  expect(res.status).toBe(201);
  return res.body as { Id: number; UserId: number; LocationId: number };
}

async function createExitFixture(overrides: Partial<any> = {}) {
  const entry = await createEntryFixture(overrides);
  const payload = {
    UserId: entry.UserId,
    LocationId: entry.LocationId,
    ExitTime: overrides.ExitTime ?? iso(1000),
    EntryId: entry.Id,
    Result: overrides.Result ?? 'Shift complete',
    IrregularBehavior: overrides.IrregularBehavior ?? false,
    DeviceId: overrides.DeviceId ?? 'ExitDevice',
    ...overrides,
  };

  const res = await request(app).post('/exits').set(apiKeyHeader).send(payload);
  expect(res.status).toBe(201);
  return { exit: res.body as { Id: number; EntryId: number; UserId: number; LocationId: number }, entry };
}

describe('API - /exits', () => {
  describe('GET /exits', () => {
    it('returns paginated list', async () => {
      const res = await request(app).get('/exits').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pageSize');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('GET /exits/:id', () => {
    it('returns a single exit', async () => {
      const { exit } = await createExitFixture();
      const res = await request(app).get(`/exits/${exit.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(exit.Id);
      expect(res.body.EntryId).toBe(exit.EntryId);
    });

    it('returns 404 when exit not found', async () => {
      const res = await request(app).get('/exits/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('EXIT_NOT_FOUND');
    });
  });

  describe('GET /exits/by-entry/:entryId', () => {
    it('returns exit by entry id', async () => {
      const { exit } = await createExitFixture();
      const res = await request(app).get(`/exits/by-entry/${exit.EntryId}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(exit.Id);
      expect(res.body.EntryId).toBe(exit.EntryId);
    });

    it('returns 404 when exit not linked to entry', async () => {
      const entry = await createEntryFixture();
      const res = await request(app).get(`/exits/by-entry/${entry.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('EXIT_NOT_FOUND_FOR_ENTRY');
    });
  });

  describe('POST /exits', () => {
    it('creates a new exit for the last entry', async () => {
      const entry = await createEntryFixture();
      const payload = {
        UserId: entry.UserId,
        LocationId: entry.LocationId,
        ExitTime: iso(2000),
        EntryId: entry.Id,
        Result: 'End of day',
        IrregularBehavior: false,
        DeviceId: 'ExitDeviceCreate',
      };

      const res = await request(app).post('/exits').set(apiKeyHeader).send(payload);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        UserId: payload.UserId,
        LocationId: payload.LocationId,
        EntryId: entry.Id,
        Result: payload.Result,
        IrregularBehavior: false,
        ReviewedByAdmin: false,
        IsDeleted: false,
      });
      expect(typeof res.body.Id).toBe('number');
    });

    it('returns 404 when user does not exist', async () => {
      const res = await request(app)
        .post('/exits')
        .set(apiKeyHeader)
        .send({
          UserId: 999999,
          LocationId: 1,
          ExitTime: iso(),
          EntryId: 1,
        });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('USER_NOT_FOUND');
    });

    it('returns 404 when location does not exist', async () => {
      const entry = await createEntryFixture({ LocationId: 1 });
      const res = await request(app)
        .post('/exits')
        .set(apiKeyHeader)
        .send({
          UserId: entry.UserId,
          LocationId: 999999,
          ExitTime: iso(),
          EntryId: entry.Id,
        });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('LOCATION_NOT_FOUND');
    });

    it('returns 409 when there is no open entry', async () => {
      const user = await createUserFixture();
      const res = await request(app)
        .post('/exits')
        .set(apiKeyHeader)
        .send({
          UserId: user.Id,
          LocationId: 1,
          ExitTime: iso(),
          EntryId: 999999,
        });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('NO_OPEN_ENTRY');
    });

    it('returns 409 when exit already registered for last entry', async () => {
      const { exit } = await createExitFixture();
      const res = await request(app)
        .post('/exits')
        .set(apiKeyHeader)
        .send({
          UserId: exit.UserId,
          LocationId: exit.LocationId,
          ExitTime: iso(5000),
          EntryId: exit.EntryId,
        });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('EXIT_ALREADY_REGISTERED');
    });

    it('returns 400 when payload invalid', async () => {
      const res = await request(app).post('/exits').set(apiKeyHeader).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /exits/:id', () => {
    it('updates fields of an exit', async () => {
      const { exit } = await createExitFixture();
      const res = await request(app)
        .patch(`/exits/${exit.Id}`)
        .set(apiKeyHeader)
        .send({ Result: 'Updated result', ReviewedByAdmin: true, IrregularBehavior: true, IsSynced: true });
      expect(res.status).toBe(200);
      expect(res.body.Result).toBe('Updated result');
      expect(res.body.ReviewedByAdmin).toBe(true);
      expect(res.body.IrregularBehavior).toBe(true);
      expect(res.body.IsSynced).toBe(true);
    });

    it('returns 404 when exit does not exist', async () => {
      const res = await request(app)
        .patch('/exits/999999')
        .set(apiKeyHeader)
        .send({ Result: 'Missing' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('EXIT_NOT_FOUND');
    });

    it('returns 400 when no fields provided', async () => {
      const { exit } = await createExitFixture();
      const res = await request(app).patch(`/exits/${exit.Id}`).set(apiKeyHeader).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /exits/:id', () => {
    it('soft deletes an exit', async () => {
      const { exit } = await createExitFixture();
      const del = await request(app).delete(`/exits/${exit.Id}`).set(apiKeyHeader);
      expect(del.status).toBe(204);

      const get = await request(app).get(`/exits/${exit.Id}`).set(apiKeyHeader);
      expect(get.status).toBe(404);
      expect(get.body.error).toBe('EXIT_NOT_FOUND');
    });

    it('returns 404 when deleting non-existing exit', async () => {
      const res = await request(app).delete('/exits/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('EXIT_NOT_FOUND');
    });
  });
});
