import { defineConfig, mergeConfig } from 'vitest/config';
import { vitestConfig } from '@resin/vitest-config/node';
import path from 'node:path';

export default mergeConfig(
	vitestConfig,
	defineConfig({
		test: {
			setupFiles: ['./test/setup.ts'],
		},
		resolve: {
			alias: {
				'@utils': path.resolve(__dirname, './utils'),
				'@nodes-testing': path.resolve(__dirname, '../../core/nodes-testing'),
				'resin-workflow': path.resolve(__dirname, '../../workflow/dist/cjs/index.js'),
			},
		},
	}),
);
