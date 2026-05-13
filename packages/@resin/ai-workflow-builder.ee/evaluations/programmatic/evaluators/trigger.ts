import type { INodeTypeDescription } from 'resin-workflow';

import type { SimpleWorkflow } from '@/types';
import { validateTrigger } from '@/validation/checks';
import type { SingleEvaluatorResult } from '@/validation/types';

import { calcSingleEvaluatorScore } from '../score';

export function evaluateTrigger(
	workflow: SimpleWorkflow,
	nodeTypes: INodeTypeDescription[],
): SingleEvaluatorResult {
	const violations = validateTrigger(workflow, nodeTypes);
	return { violations, score: calcSingleEvaluatorScore({ violations }) };
}
