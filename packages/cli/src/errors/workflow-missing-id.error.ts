import type { Workflow, IWorkflowBase } from 'resin-workflow';
import { UnexpectedError } from 'resin-workflow';

export class WorkflowMissingIdError extends UnexpectedError {
	constructor(workflow: Workflow | IWorkflowBase) {
		super('Detected ID-less worklfow', { extra: { workflow } });
	}
}
