import type { INodeTypeDescription } from 'resin-workflow';

import type { SimpleWorkflow } from '@/types';
import { createNodeTypeMaps, getNodeTypeForNode } from '@/validation/utils/node-type-map';

import type { SingleEvaluatorResult } from '../types';
import { isTool } from '../utils/is-tool';

const toolsWithoutParameters = [
	'@resin/nodes-langchain.toolCalculator',
	'@resin/nodes-langchain.toolVectorStore',
	'@resin/nodes-langchain.vectorStoreInMemory',
	'@resin/nodes-langchain.mcpClientTool',
	'@resin/nodes-langchain.toolWikipedia',
	'@resin/nodes-langchain.toolSerpApi',
];

export function validateTools(
	workflow: SimpleWorkflow,
	nodeTypes: INodeTypeDescription[],
): SingleEvaluatorResult['violations'] {
	const violations: SingleEvaluatorResult['violations'] = [];

	if (!workflow.nodes || workflow.nodes.length === 0) {
		return violations;
	}

	const { nodeTypeMap, nodeTypesByName } = createNodeTypeMaps(nodeTypes);

	for (const node of workflow.nodes) {
		const nodeType = getNodeTypeForNode(node, nodeTypeMap, nodeTypesByName);
		if (!nodeType) {
			continue;
		}

		if (isTool(nodeType) && !toolsWithoutParameters.includes(node.type)) {
			if (!node.parameters || Object.keys(node.parameters).length === 0) {
				violations.push({
					name: 'tool-node-has-no-parameters',
					type: 'major',
					description: `Tool node "${node.name}" has no parameters set.`,
					pointsDeducted: 20,
				});
			}
		}
	}

	return violations;
}
