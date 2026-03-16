import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['**/node_modules/**', '**/e2e/**'],
		server: {
			deps: {
				external: ['playwright', 'playwright-core', 'chromium-bidi'],
			},
		},
	},
});
