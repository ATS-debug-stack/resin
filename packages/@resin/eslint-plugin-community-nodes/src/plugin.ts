import type { ESLint, Linter } from 'eslint';

import pkg from '../package.json' with { type: 'json' };
import { rules } from './rules/index.js';

const plugin = {
	meta: {
		name: pkg.name,
		version: pkg.version,
		namespace: '@resin/community-nodes',
	},
	// @ts-expect-error Rules type does not match for typescript-eslint and eslint
	rules: rules as ESLint.Plugin['rules'],
} satisfies ESLint.Plugin;

const configs = {
	recommended: {
		ignores: ['eslint.config.{js,mjs,ts,mts}'],
		plugins: {
			'@resin/community-nodes': plugin,
		},
		rules: {
			'@resin/community-nodes/ai-node-package-json': 'error',
			'@resin/community-nodes/no-restricted-globals': 'error',
			'@resin/community-nodes/no-restricted-imports': 'error',
			'@resin/community-nodes/credential-password-field': 'error',
			'@resin/community-nodes/n8n-object-validation': 'error',
			'@resin/community-nodes/no-deprecated-workflow-functions': 'error',
			'@resin/community-nodes/node-usable-as-tool': 'error',
			'@resin/community-nodes/package-name-convention': 'error',
			'@resin/community-nodes/credential-test-required': 'error',
			'@resin/community-nodes/no-credential-reuse': 'error',
			'@resin/community-nodes/no-forbidden-lifecycle-scripts': 'error',
			'@resin/community-nodes/no-http-request-with-manual-auth': 'error',
			'@resin/community-nodes/no-overrides-field': 'error',
			'@resin/community-nodes/no-runtime-dependencies': 'error',
			'@resin/community-nodes/no-template-placeholders': 'error',
			'@resin/community-nodes/icon-validation': 'error',
			'@resin/community-nodes/options-sorted-alphabetically': 'warn',
			'@resin/community-nodes/resource-operation-pattern': 'warn',
			'@resin/community-nodes/credential-documentation-url': 'error',
			'@resin/community-nodes/cred-class-field-icon-missing': 'error',
			'@resin/community-nodes/cred-class-name-suffix': 'error',
			'@resin/community-nodes/cred-class-oauth2-naming': 'error',
			'@resin/community-nodes/node-connection-type-literal': 'error',
			'@resin/community-nodes/missing-paired-item': 'error',
			'@resin/community-nodes/no-builder-hint-leakage': 'error',
			'@resin/community-nodes/node-operation-error-itemindex': 'error',
			'@resin/community-nodes/require-community-node-keyword': 'warn',
			'@resin/community-nodes/require-continue-on-fail': 'error',
			'@resin/community-nodes/require-node-api-error': 'error',
			'@resin/community-nodes/require-node-description-fields': 'error',
			'@resin/community-nodes/valid-credential-references': 'error',
			'@resin/community-nodes/valid-peer-dependencies': 'error',
			'@resin/community-nodes/webhook-lifecycle-complete': 'error',
		},
	},
	recommendedWithoutN8nCloudSupport: {
		ignores: ['eslint.config.{js,mjs,ts,mts}'],
		plugins: {
			'@resin/community-nodes': plugin,
		},
		rules: {
			'@resin/community-nodes/ai-node-package-json': 'error',
			'@resin/community-nodes/credential-password-field': 'error',
			'@resin/community-nodes/n8n-object-validation': 'error',
			'@resin/community-nodes/no-deprecated-workflow-functions': 'error',
			'@resin/community-nodes/node-usable-as-tool': 'error',
			'@resin/community-nodes/package-name-convention': 'error',
			'@resin/community-nodes/credential-test-required': 'error',
			'@resin/community-nodes/no-credential-reuse': 'error',
			'@resin/community-nodes/no-forbidden-lifecycle-scripts': 'error',
			'@resin/community-nodes/no-http-request-with-manual-auth': 'error',
			'@resin/community-nodes/no-overrides-field': 'error',
			'@resin/community-nodes/no-runtime-dependencies': 'error',
			'@resin/community-nodes/no-template-placeholders': 'error',
			'@resin/community-nodes/icon-validation': 'error',
			'@resin/community-nodes/options-sorted-alphabetically': 'warn',
			'@resin/community-nodes/credential-documentation-url': 'error',
			'@resin/community-nodes/resource-operation-pattern': 'warn',
			'@resin/community-nodes/cred-class-field-icon-missing': 'error',
			'@resin/community-nodes/cred-class-name-suffix': 'error',
			'@resin/community-nodes/cred-class-oauth2-naming': 'error',
			'@resin/community-nodes/node-connection-type-literal': 'error',
			'@resin/community-nodes/missing-paired-item': 'error',
			'@resin/community-nodes/no-builder-hint-leakage': 'error',
			'@resin/community-nodes/node-operation-error-itemindex': 'error',
			'@resin/community-nodes/require-community-node-keyword': 'warn',
			'@resin/community-nodes/require-continue-on-fail': 'error',
			'@resin/community-nodes/require-node-api-error': 'error',
			'@resin/community-nodes/require-node-description-fields': 'error',
			'@resin/community-nodes/valid-credential-references': 'error',
			'@resin/community-nodes/valid-peer-dependencies': 'error',
			'@resin/community-nodes/webhook-lifecycle-complete': 'error',
		},
	},
} satisfies Record<string, Linter.Config>;

const pluginWithConfigs = { ...plugin, configs } satisfies ESLint.Plugin;

const n8nCommunityNodesPlugin = pluginWithConfigs;
export default pluginWithConfigs;
export { rules, configs, n8nCommunityNodesPlugin };
