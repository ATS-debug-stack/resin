import type { INodeTypeDescription } from 'resin-workflow';

export function isTool(nodeType: INodeTypeDescription): boolean {
	return nodeType.codex?.subcategories?.AI?.includes('Tools') ?? false;
}
