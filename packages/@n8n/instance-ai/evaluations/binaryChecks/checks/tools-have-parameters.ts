import type { BinaryCheck } from '../types';

/** Tool nodes that legitimately work without user-configured parameters. */
const TOOLS_WITHOUT_PARAMETERS = new Set([
	'@resin/n8n-nodes-langchain.toolCalculator',
	'@resin/n8n-nodes-langchain.toolVectorStore',
	'@resin/n8n-nodes-langchain.vectorStoreInMemory',
	'@resin/n8n-nodes-langchain.mcpClientTool',
	'@resin/n8n-nodes-langchain.toolWikipedia',
	'@resin/n8n-nodes-langchain.toolSerpApi',
]);

function isToolNode(type: string): boolean {
	const shortName = type.split('.').pop() ?? '';
	return shortName.endsWith('Tool') || shortName === 'tool' || /^tool[A-Z]/.test(shortName);
}

export const toolsHaveParameters: BinaryCheck = {
	name: 'tools_have_parameters',
	description: 'Tool nodes have required parameters configured',
	kind: 'deterministic',
	run(workflow) {
		const nodes = workflow.nodes ?? [];
		if (nodes.length === 0) return { pass: true };

		const issues: string[] = [];

		for (const node of nodes) {
			if (!isToolNode(node.type)) continue;
			if (TOOLS_WITHOUT_PARAMETERS.has(node.type)) continue;

			if (!node.parameters || Object.keys(node.parameters).length === 0) {
				issues.push(`"${node.name}" (${node.type}) has no parameters configured`);
			}
		}

		return {
			pass: issues.length === 0,
			...(issues.length > 0 ? { comment: issues.join('; ') } : {}),
		};
	},
};
