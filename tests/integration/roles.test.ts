import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY };

describe('API - /roles', () => {
  describe('GET /roles', () => {
    it('returns paginated list', async () => {
      const res = await request(app).get('/roles').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pageSize');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeGreaterThan(0);
    });
  });

  describe('GET /roles/:id', () => {
    it('returns a single role', async () => {
      const res = await request(app).get('/roles/1').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(1);
      expect(res.body.Name).toBeDefined();
    });

    it('returns 404 when role not found', async () => {
      const res = await request(app).get('/roles/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ROLE_NOT_FOUND');
    });
  });
});
