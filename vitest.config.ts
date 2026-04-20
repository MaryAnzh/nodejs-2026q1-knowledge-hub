import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.unit.spec.ts', 'src/**/__tests__/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      lines: 90,
      branches: 85,
      functions: 90,
      statements: 90,
    },
  },
});