import { ESLintUtils } from '@typescript-eslint/utils';

export const MisplacedN8nTypeormImportRule = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure `@resin/typeorm` is imported only from within the `@resin/db` package.',
		},
		messages: {
			moveImport: 'Please move this import to `@resin/db`.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			ImportDeclaration(node) {
				if (node.source.value === '@resin/typeorm' && !context.filename.includes('@resin/db')) {
					context.report({ node, messageId: 'moveImport' });
				}
			},
		};
	},
});
