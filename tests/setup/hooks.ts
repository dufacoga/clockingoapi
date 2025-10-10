import { beforeAll, afterAll, beforeEach } from 'vitest';
import { resetDatabase, closeDatabase } from './db';

beforeEach(async () => {
    await resetDatabase();
});

afterAll(async () => {
    await closeDatabase();
});