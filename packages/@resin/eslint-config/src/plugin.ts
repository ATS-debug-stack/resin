import type { ESLint } from 'eslint';
import { rules } from './rules/index.js';

const plugin = {
	meta: {
		name: 'resin-local-rules',
	},
	configs: {},
	// @ts-expect-error Rules type does not match for typescript-eslint and eslint
	rules: rules as ESLint.Plugin['rules'],
} satisfies ESLint.Plugin;

export const localRulesPlugin = {
	...plugin,
	configs: {
		recommended: {
			plugins: {
				'resin-local-rules': plugin,
			},
			rules: {
				'resin-local-rules/no-uncaught-json-parse': 'error',
				'resin-local-rules/no-json-parse-json-stringify': 'error',
				'resin-local-rules/no-unneeded-backticks': 'error',
				'resin-local-rules/no-interpolation-in-regular-string': 'error',
				'resin-local-rules/no-unused-param-in-catch-clause': 'error',
				'resin-local-rules/no-useless-catch-throw': 'error',
				'resin-local-rules/no-internal-package-import': 'error',
				'resin-local-rules/no-type-only-import-in-di': 'error',
			},
		},
	},
} satisfies ESLint.Plugin;
