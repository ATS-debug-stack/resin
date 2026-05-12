import { createVitestConfig } from '@resin/vitest-config/node';

export default createVitestConfig({
	exclude: ['**/node_modules/**', '**/dist/**', '**/*.integration.test.ts'],
});
