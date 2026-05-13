import type { INodeTypeDescription } from 'resin-workflow';

import type { SimpleWorkflow } from '@/types';
import { validateFromAi } from '@/validation/checks';
import type { SingleEvaluatorResult } from '@/validation/types';

import { calcSingleEvaluatorScore } from '../score';

export function evaluateFromAi(
	workflow: SimpleWorkflow,
	nodeTypes: INodeTypeDescription[],
): SingleEvaluatorResult {
	const violations = validateFromAi(workflow, nodeTypes);
	return { violations, score: calcSingleEvaluatorScore({ violations }) };
}
