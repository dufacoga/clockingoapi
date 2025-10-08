import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app'; 
import { apiKeyHeader } from './test-setup'; 

describe('API - /users', () => {
    
  describe('POST /users', () => {
    it('should create a new user with valid data and return it', async () => {
      const newUser = {
        Username: 'newuser-test',
        RoleId: 1,
        Password: 'a-very-secure-password123'
      };

      const response = await request(app)
        .post('/users')
        .set(apiKeyHeader)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.Username).toBe(newUser.Username);
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      const incompleteUser = {
        RoleId: 1
      };

      const response = await request(app)
        .post('/users')
        .set(apiKeyHeader)
        .send(incompleteUser);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const response = await request(app)
        .get('/users')
        .set(apiKeyHeader);
        
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user if the ID exists', async () => {
      const response = await request(app)
        .get('/users/1')
        .set(apiKeyHeader);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.Id).toBe(1);
    });

    it('should return 404 Not Found if the user ID does not exist', async () => {
      const response = await request(app)
        .get('/users/99999')
        .set(apiKeyHeader);

      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /users/username/:username', () => {
    it('should return a single user if the username exists', async () => {
      const response = await request(app)
        .get('/users/username/dcortes')
        .set(apiKeyHeader);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.Username).toBe('dcortes');
    });

    it('should return 404 Not Found if the username does not exist', async () => {
      const response = await request(app)
        .get('/users/username/nonexistentuser')
        .set(apiKeyHeader);

      expect(response.status).toBe(404);
    });
  });
  
  describe('PATCH /users/:id', () => {
    it('should update an existing user and return the updated data', async () => {
      const updates = {
        Username: 'updated-username'
      };

      const response = await request(app)
        .patch('/users/1')
        .set(apiKeyHeader)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.data.Username).toBe(updates.Username);
    });

    it('should return 404 Not Found if the user to update does not exist', async () => {
      const response = await request(app)
        .patch('/users/99999')
        .set(apiKeyHeader)
        .send({ Username: 'any' });

      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /users/:id', () => {
    it('should soft delete an existing user and return a success message', async () => {
      const deleteResponse = await request(app)
        .delete('/users/1')
        .set(apiKeyHeader);

      expect(deleteResponse.status).toBe(200);
      
      const getResponse = await request(app)
        .get('/users/1')
        .set(apiKeyHeader);
        
      expect(getResponse.status).toBe(404);
    });
    
    it('should return 404 Not Found if the user to delete does not exist', async () => {
      const response = await request(app)
        .delete('/users/99999')
        .set(apiKeyHeader);

      expect(response.status).toBe(404);
    });
  });
});