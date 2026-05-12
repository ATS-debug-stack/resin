import { createEventBus } from '@resin/utils/event-bus';

export interface AgentsEventBusEvents {
	/** Fired when an agent's name or metadata is updated */
	agentUpdated: never;
}

export const agentsEventBus = createEventBus<AgentsEventBusEvents>();
