import { createVitestConfig } from '@resin/vitest-config/node';

export default createVitestConfig({
	coverage: {
		exclude: ['dist/**', 'bundle/**', '**/*.test.ts', '**/*.config.ts'],
	},
});
