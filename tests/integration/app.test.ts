import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import '../setup/hooks';

const apiKeyHeader = { 'X-API-Key': process.env.API_KEY };

describe('App smoke tests', () => {
  it('healthz is up', async () => {
    const res = await request(app).get('/health').set(apiKeyHeader);
    expect([200, 204]).toContain(res.status);
  });
});