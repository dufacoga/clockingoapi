import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY };

function uniqueCode(prefix = 'loc') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

async function createLocationFixture(overrides: Partial<any> = {}) {
  const payload = {
    Code: uniqueCode(),
    Address: 'Test Address',
    City: 'Test City',
    CreatedBy: 1,
    IsCompanyOffice: false,
    ...overrides,
  };

  const res = await request(app).post('/locations').set(apiKeyHeader).send(payload);
  expect(res.status).toBe(201);
  return res.body as { Id: number; Code: string };
}

describe('API - /locations', () => {
  describe('GET /locations', () => {
    it('returns paginated list', async () => {
      const res = await request(app).get('/locations').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pageSize');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('GET /locations/:id', () => {
    it('returns a single location', async () => {
      const location = await createLocationFixture();
      const res = await request(app).get(`/locations/${location.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(location.Id);
      expect(res.body.Code).toBe(location.Code);
    });

    it('returns 404 when location not found', async () => {
      const res = await request(app).get('/locations/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('LOCATION_NOT_FOUND');
    });
  });

  describe('GET /locations/code/:code', () => {
    it('returns a location by code', async () => {
      const location = await createLocationFixture();
      const res = await request(app).get(`/locations/code/${encodeURIComponent(location.Code)}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(location.Id);
      expect(res.body.Code).toBe(location.Code);
    });
  });

  describe('POST /locations', () => {
    it('creates a new location', async () => {
      const payload = {
        Code: uniqueCode('create'),
        Address: '100 Test Plaza',
        City: 'QA City',
        CreatedBy: 1,
        IsCompanyOffice: true,
      };

      const res = await request(app).post('/locations').set(apiKeyHeader).send(payload);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        Code: payload.Code,
        Address: payload.Address,
        City: payload.City,
        CreatedBy: payload.CreatedBy,
        IsCompanyOffice: true,
        IsDeleted: false,
      });
      expect(typeof res.body.Id).toBe('number');
    });

    it('returns 409 when code already exists', async () => {
      const existing = await createLocationFixture();
      const res = await request(app)
        .post('/locations')
        .set(apiKeyHeader)
        .send({
          Code: existing.Code,
          Address: 'Duplicate',
          City: 'Dup City',
          CreatedBy: 1,
        });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('LOCATION_CODE_ALREADY_EXISTS');
    });

    it('returns 404 when createdBy user does not exist', async () => {
      const res = await request(app)
        .post('/locations')
        .set(apiKeyHeader)
        .send({
          Code: uniqueCode('missing-user'),
          Address: 'No User St',
          City: 'Ghost Town',
          CreatedBy: 999999,
        });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('CREATED_BY_USER_NOT_FOUND');
    });

    it('returns 400 when payload invalid', async () => {
      const res = await request(app).post('/locations').set(apiKeyHeader).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /locations/:id', () => {
    it('updates fields of a location', async () => {
      const location = await createLocationFixture();
      const res = await request(app)
        .patch(`/locations/${location.Id}`)
        .set(apiKeyHeader)
        .send({ City: 'Updated City', IsCompanyOffice: true });
      expect(res.status).toBe(200);
      expect(res.body.City).toBe('Updated City');
      expect(res.body.IsCompanyOffice).toBe(true);
    });

    it('returns 409 when updating to an existing code', async () => {
      const first = await createLocationFixture();
      const second = await createLocationFixture({ Code: uniqueCode('second') });

      const res = await request(app)
        .patch(`/locations/${second.Id}`)
        .set(apiKeyHeader)
        .send({ Code: first.Code });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('LOCATION_CODE_ALREADY_EXISTS');
    });

    it('returns 404 when location does not exist', async () => {
      const res = await request(app)
        .patch('/locations/999999')
        .set(apiKeyHeader)
        .send({ City: 'Nope' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('LOCATION_NOT_FOUND');
    });

    it('returns 400 when no fields provided', async () => {
      const location = await createLocationFixture();
      const res = await request(app)
        .patch(`/locations/${location.Id}`)
        .set(apiKeyHeader)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /locations/:id', () => {
    it('soft deletes a location', async () => {
      const location = await createLocationFixture();
      const del = await request(app).delete(`/locations/${location.Id}`).set(apiKeyHeader);
      expect([200, 204]).toContain(del.status);

      const res = await request(app).get(`/locations/${location.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('LOCATION_NOT_FOUND');
    });

    it('returns 404 when deleting non-existing location', async () => {
      const res = await request(app).delete('/locations/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('LOCATION_NOT_FOUND');
    });
  });
});
