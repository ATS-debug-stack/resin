import { createVitestConfigWithDecorators } from '@resin/vitest-config/node-decorators';

export default createVitestConfigWithDecorators({
	coveragePathIgnorePatterns: ['index.ts'],
});
