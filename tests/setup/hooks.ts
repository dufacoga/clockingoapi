import { beforeAll, afterAll, beforeEach } from 'vitest';
import { resetDatabase, closeDatabase } from './db';

beforeAll(async () => {
    await resetDatabase();
});

beforeEach(async () => {
    await resetDatabase();
});

afterAll(async () => {
    await closeDatabase();
});