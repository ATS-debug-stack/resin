import type { IWorkflowBase, JsonValue } from 'resin-workflow';

export interface AbstractEventPayload {
	[key: string]: JsonValue | IWorkflowBase | undefined;
}
