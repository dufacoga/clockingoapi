import { describe, it, expect } from 'vitest';
import request from 'supertest';

import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY ?? 'test-key' };

describe('API - /users', () => {
  describe('POST /users', () => {
    it('should create a new user with valid data and return it', async () => {
      const newUser = {
        Name: 'New User Test',
        Phone: '555-3010',
        Username: 'newuser-test',
        AuthToken: 'auth-new-user-test',
        RoleId: 1,
      };

      const response = await request(app)
        .post('/users')
        .set(apiKeyHeader)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        Name: newUser.Name,
        Phone: newUser.Phone,
        Username: newUser.Username,
        AuthToken: newUser.AuthToken,
        RoleId: newUser.RoleId,
        IsDeleted: false,
      });
      expect(typeof response.body.Id).toBe('number');
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      const response = await request(app)
        .post('/users')
        .set(apiKeyHeader)
        .send({ RoleId: 1 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /users', () => {
    it('should return a paginated list of users', async () => {
      const response = await request(app)
        .get('/users')
        .set(apiKeyHeader);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        page: 1,
        pageSize: 50,
      });
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(typeof response.body.total).toBe('number');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user if the ID exists', async () => {
      const response = await request(app)
        .get('/users/1')
        .set(apiKeyHeader);

      expect(response.status).toBe(200);
      expect(response.body.Id).toBe(1);
      expect(response.body.Username).toBeDefined();
    });

    it('should return 404 Not Found if the user ID does not exist', async () => {
      const response = await request(app)
        .get('/users/99999')
        .set(apiKeyHeader);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('USER_NOT_FOUND');
    });
  });

  describe('GET /users/username/:username', () => {
    it('should return a single user if the username exists', async () => {
      const response = await request(app)
        .get('/users/username/dcortes')
        .set(apiKeyHeader);

      expect(response.status).toBe(200);
      expect(response.body.Username).toBe('dcortes');
      expect(response.body.Id).toBeDefined();
    });

    it('should return 404 Not Found if the username does not exist', async () => {
      const response = await request(app)
        .get('/users/username/nonexistentuser')
        .set(apiKeyHeader);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('USER_NOT_FOUND');
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update an existing user and return the updated data', async () => {
      const updates = {
        Username: 'updated-username',
      };

      const response = await request(app)
        .patch('/users/1')
        .set(apiKeyHeader)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.Username).toBe(updates.Username);
    });

    it('should return 404 Not Found if the user to update does not exist', async () => {
      const response = await request(app)
        .patch('/users/99999')
        .set(apiKeyHeader)
        .send({ Username: 'any' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('USER_NOT_FOUND');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should soft delete an existing user and return a success message', async () => {
      const deleteResponse = await request(app)
        .delete('/users/1')
        .set(apiKeyHeader);

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app)
        .get('/users/1')
        .set(apiKeyHeader);

      expect(getResponse.status).toBe(404);
      expect(getResponse.body.error).toBe('USER_NOT_FOUND');
    });

    it('should return 404 Not Found if the user to delete does not exist', async () => {
      const response = await request(app)
        .delete('/users/99999')
        .set(apiKeyHeader);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('USER_NOT_FOUND');
    });
  });
});
