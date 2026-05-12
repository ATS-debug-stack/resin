/**
 * Registry mapping workflow techniques to their documentation getter functions.
 *
 * Sources best-practice content from the shared @resin/workflow-sdk/prompts package.
 */
import { bestPracticesRegistry } from '@resin/workflow-sdk/prompts/best-practices';

import { WorkflowTechnique, type WorkflowTechniqueType } from './techniques';

export const documentation: Record<WorkflowTechniqueType, (() => string) | undefined> =
	Object.fromEntries(
		Object.values(WorkflowTechnique).map((technique) => {
			const doc = bestPracticesRegistry[technique];
			return [technique, doc ? () => doc.getDocumentation() : undefined];
		}),
	) as Record<WorkflowTechniqueType, (() => string) | undefined>;
