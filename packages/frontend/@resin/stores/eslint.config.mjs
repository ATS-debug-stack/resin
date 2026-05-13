import { defineConfig } from 'eslint/config';
import { frontendConfig } from '@resin/eslint-config/frontend';

export default defineConfig(frontendConfig, {
	rules: {
		//TODO: Remove these
		'@typescript-eslint/naming-convention': 'warn',
		'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
		'@typescript-eslint/no-unsafe-assignment': 'warn',
	},
});
