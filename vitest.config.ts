import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
    environment: 'node',
    setupFiles: ['tests/setup/env.ts'],
    hookTimeout: 30_000,
    },
});