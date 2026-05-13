/**
 * Re-export shared types from @resin/workflow-sdk.
 */
import type { WorkflowTechniqueType } from '@resin/workflow-sdk/prompts/best-practices';

export {
	WorkflowTechnique,
	TechniqueDescription,
	type WorkflowTechniqueType,
} from '@resin/workflow-sdk/prompts/best-practices';

/**
 * Result of prompt categorization (framework-specific, stays local).
 */
export interface PromptCategorization {
	techniques: WorkflowTechniqueType[];
	confidence?: number;
}
