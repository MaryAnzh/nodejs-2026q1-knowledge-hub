import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.unit.spec.ts', 'src/**/__tests__/**/*.spec.ts'],
    coverage: {
      provider: 'v8'
    },
    setupFiles: ['./vitest.setup.ts'],
  },
});