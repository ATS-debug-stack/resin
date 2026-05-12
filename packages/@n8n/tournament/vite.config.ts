import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@resin/vitest-config/node';
import path from 'node:path';

export default mergeConfig(
	defineConfig({
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	}),
	vitestConfig,
);
