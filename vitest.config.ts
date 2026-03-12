import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['**/node_modules/**', '**/e2e/**'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			exclude: [
				'node_modules/**',
				'src/**/*.d.ts',
				'**/*.config.*',
				'**/types.ts',
			],
		},
		server: {
			deps: {
				external: ['playwright', 'playwright-core', 'chromium-bidi'],
			},
		},
	},
});
