import { defineConfig } from 'eslint/config';
import { baseConfig } from '@resin/eslint-config/base';

export default defineConfig(
	baseConfig,
	{
		ignores: ['coverage/**', 'dist/**'],
	},
	{
		rules: {
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'objectLiteralProperty',
					format: null,
					filter: {
						regex: '^[a-z]+-[a-z-]+$',
						match: true,
					},
				},
			],
		},
	},
);
