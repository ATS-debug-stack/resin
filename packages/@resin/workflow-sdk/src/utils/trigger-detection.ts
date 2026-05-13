/**
 * Centralized trigger node detection utilities
 *
 * This module provides a single source of truth for identifying trigger nodes,
 * used by both workflow-builder.ts and semantic-graph.ts
 */

/**
 * Trigger node types that don't have "trigger" in their name
 * but still function as workflow entry points
 */
const TRIGGER_NODE_TYPES = new Set([
	'resin-nodes-base.webhook',
	'resin-nodes-base.cron', // Legacy schedule trigger
	'resin-nodes-base.emailReadImap', // Email polling trigger
	'resin-nodes-base.telegramBot', // Can act as webhook trigger
	'resin-nodes-base.start', // Legacy trigger
]);

/**
 * Check if a node type is a trigger
 *
 * A node is considered a trigger if:
 * 1. It's in the known TRIGGER_NODE_TYPES set, OR
 * 2. Its type name contains "trigger" (case insensitive)
 *
 * @param type - The node type string (e.g., 'resin-nodes-base.manualTrigger')
 * @returns true if the node type is a trigger
 */
export function isTriggerNodeType(type: string): boolean {
	if (TRIGGER_NODE_TYPES.has(type)) {
		return true;
	}
	return type.toLowerCase().includes('trigger');
}
