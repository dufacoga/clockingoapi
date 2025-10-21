import { describe, it, expect, beforeEach } from 'vitest';
import { authenticator } from 'otplib';
import request from 'supertest';
import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY};

function uniqueUsername(prefix = 'user') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random()*1e6)}`;
}

async function createUserFixture(overrides: Partial<any> = {}) {
  const payload = {
    Name: 'New User Test',
    Phone: '555-3010',
    Username: uniqueUsername(),
    AuthToken: 'auth-new-user-test',
    RoleId: 1,
    ...overrides,
  };
  const res = await request(app).post('/users').set(apiKeyHeader).send(payload);
  expect(res.status).toBe(201);
  return res.body as { Id: number; Username: string };
}

async function updateTotp(userId: number, patch: Record<string, unknown>) {
  const res = await request(app)
    .patch(`/users/${userId}/totp`)
    .set(apiKeyHeader)
    .send(patch);
  expect(res.status).toBe(200);
  return res.body as Record<string, unknown>;
}

describe('API - /users', () => {
  let baseUser: { Id: number; Username: string };

  beforeEach(async () => {
    baseUser = await createUserFixture();
  });

  describe('POST /users', () => {
    it('creates a new user and returns it', async () => {
      const res = await request(app)
        .post('/users')
        .set(apiKeyHeader)
        .send({
          Name: 'Another',
          Phone: '555-9999',
          Username: uniqueUsername('another'),
          AuthToken: 'auth-xyz',
          RoleId: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        Name: 'Another',
        Phone: '555-9999',
        RoleId: 1,
        IsDeleted: false,
      });
      expect(typeof res.body.Id).toBe('number');
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/users')
        .set(apiKeyHeader)
        .send({ RoleId: 1 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /users', () => {
    it('returns a paginated list', async () => {
      const res = await request(app).get('/users').set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pageSize');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('returns a single user', async () => {
      const res = await request(app).get(`/users/${baseUser.Id}`).set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Id).toBe(baseUser.Id);
      expect(res.body.Username).toBe(baseUser.Username);
    });

    it('returns 404 for a non-existing id', async () => {
      const res = await request(app).get('/users/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('USER_NOT_FOUND');
    });
  });

  describe('GET /users/username/:username', () => {
    it('returns by username', async () => {
      const res = await request(app)
        .get(`/users/username/${baseUser.Username}`)
        .set(apiKeyHeader);
      expect(res.status).toBe(200);
      expect(res.body.Username).toBe(baseUser.Username);
      expect(res.body.Id).toBe(baseUser.Id);
    });
  });

  describe('PATCH /users/:id', () => {
    it('updates the username', async () => {
      const updated = uniqueUsername('updated');
      const res = await request(app)
        .patch(`/users/${baseUser.Id}`)
        .set(apiKeyHeader)
        .send({ Username: updated });
      expect(res.status).toBe(200);
      expect(res.body.Username).toBe(updated);
    });

    it('returns 404 when updating non-existing user', async () => {
      const res = await request(app)
        .patch('/users/999999')
        .set(apiKeyHeader)
        .send({ Username: 'any' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('USER_NOT_FOUND');
    });
  });

  describe('PATCH /users/:id/totp', () => {
    it('updates totp fields for a user', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const response = await request(app)
        .patch(`/users/${baseUser.Id}/totp`)
        .set(apiKeyHeader)
        .send({
          TotpSecret: secret,
          TwoFactorEnabled: true,
          RecoveryCodes: 'code1,code2',
        });

      expect(response.status).toBe(200);
      expect(response.body.TotpSecret).toBe(secret);
      expect(response.body.TwoFactorEnabled).toBe(true);
      expect(response.body.RecoveryCodes).toBe('code1,code2');
    });

    it('returns 400 when body is empty', async () => {
      const res = await request(app)
        .patch(`/users/${baseUser.Id}/totp`)
        .set(apiKeyHeader)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /users/:id/totp/verify', () => {
    it('returns valid when the token matches the stored secret', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      await updateTotp(baseUser.Id, {
        TotpSecret: secret,
        TwoFactorEnabled: true,
      });

      const token = authenticator.generate(secret);

      const res = await request(app)
        .post(`/users/${baseUser.Id}/totp/verify`)
        .set(apiKeyHeader)
        .send({ code: token });

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
    });

    it('returns invalid for wrong codes', async () => {
      await updateTotp(baseUser.Id, {
        TotpSecret: 'JBSWY3DPEHPK3PXP',
        TwoFactorEnabled: true,
      });

      const res = await request(app)
        .post(`/users/${baseUser.Id}/totp/verify`)
        .set(apiKeyHeader)
        .send({ code: '000000' });

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(false);
    });
  });

  describe('DELETE /users/:id', () => {
    it('soft deletes and then 404 on GET', async () => {
      const tmp = await createUserFixture();
      const del = await request(app).delete(`/users/${tmp.Id}`).set(apiKeyHeader);
      expect([200, 204]).toContain(del.status);

      const get = await request(app).get(`/users/${tmp.Id}`).set(apiKeyHeader);
      expect(get.status).toBe(404);
      expect(get.body.error).toBe('USER_NOT_FOUND');
    });

    it('returns 404 when deleting non-existing user', async () => {
      const res = await request(app).delete('/users/999999').set(apiKeyHeader);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('USER_NOT_FOUND');
    });
  });
});