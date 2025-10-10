import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/env.ts', './tests/setup/hooks.ts'],
    pool: 'forks',
    maxWorkers: 1,
  },
  plugins: [tsconfigPaths()],
});