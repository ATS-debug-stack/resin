import { defineConfig, globalIgnores } from 'eslint/config';
import { nodeConfig } from '@resin/eslint-config/node';

export default defineConfig(
	globalIgnores(['electron-builder.config.js','scripts/**']),
	nodeConfig,
	{
		rules: {
			'unicorn/filename-case': ['error', { case: 'kebabCase' }],
		},
	},
);
