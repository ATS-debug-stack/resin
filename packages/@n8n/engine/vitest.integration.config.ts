import { createVitestConfig } from '@resin/vitest-config/node';

export default createVitestConfig({
	include: ['**/*.integration.test.ts'],
});
