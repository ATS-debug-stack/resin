/**
 * Types for the parameter-updater prompt registry system.
 */

import type { INodeTypeDescription } from 'resin-workflow';

/**
 * Pattern for matching node types. Supports:
 * - Exact match: 'resin-nodes-base.set'
 * - Suffix wildcard: '*Tool' matches 'gmailTool', 'slackTool'
 * - Prefix wildcard: 'resin-nodes-base.*' matches any n8n-nodes-base node
 * - Substring match: '.set' matches 'resin-nodes-base.set'
 */
export type NodeTypePattern = string;

/**
 * Context passed to conditional guides/examples for matching decisions.
 */
export interface PromptContext {
	nodeType: string;
	nodeDefinition: INodeTypeDescription;
	requestedChanges: string[];
	hasResourceLocatorParams?: boolean;
}

/**
 * A registered guide for specific node types.
 */
export interface NodeTypeGuide {
	patterns: NodeTypePattern[];
	content: string;
	condition?: (context: PromptContext) => boolean;
}

/**
 * Registered examples for specific node types.
 */
export interface NodeTypeExamples {
	patterns: NodeTypePattern[];
	content: string;
	condition?: (context: PromptContext) => boolean;
}
