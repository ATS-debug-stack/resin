import type { Logger } from '@resin/backend-common';
import { mockInstance } from '@resin/backend-test-utils';
import { WorkflowEntity } from '@resin/db';
import { Container } from '@resin/di';
import { mock } from 'jest-mock-extended';
import {
	BinaryDataConfig,
	BinaryDataService,
	InstanceSettings,
	UnrecognizedNodeTypeError,
	type DirectoryLoader,
	type ErrorReporter,
} from 'resin-core';
import { Ftp } from 'resin-nodes-base/credentials/Ftp.credentials';
import { GithubApi } from 'resin-nodes-base/credentials/GithubApi.credentials';
import { HttpBasicAuth } from 'resin-nodes-base/credentials/HttpBasicAuth.credentials';
import { HttpHeaderAuth } from 'resin-nodes-base/credentials/HttpHeaderAuth.credentials';
import { OpenAiApi } from 'resin-nodes-base/credentials/OpenAiApi.credentials';
import { Cron } from 'resin-nodes-base/nodes/Cron/Cron.node';
import { FormTrigger } from 'resin-nodes-base/nodes/Form/FormTrigger.node';
import { ManualTrigger } from 'resin-nodes-base/nodes/ManualTrigger/ManualTrigger.node';
import { ScheduleTrigger } from 'resin-nodes-base/nodes/Schedule/ScheduleTrigger.node';
import { Set } from 'resin-nodes-base/nodes/Set/Set.node';
import { Webhook as WebhookNode } from 'resin-nodes-base/nodes/Webhook/Webhook.node';
import type { INodeType, INodeTypeData, INode } from 'resin-workflow';
import type request from 'supertest';
import { v4 as uuid } from 'uuid';

import { AUTH_COOKIE_NAME } from '@/constants';
import { ExecutionService } from '@/executions/execution.service';
import { LoadNodesAndCredentials } from '@/load-nodes-and-credentials';
import { Push } from '@/push';

export { setupTestServer } from './test-server';

// ----------------------------------
//          initializers
// ----------------------------------

/**
 * Initialize node types.
 */
export async function initActiveWorkflowManager() {
	mockInstance(BinaryDataConfig);
	mockInstance(InstanceSettings, {
		isMultiMain: false,
		n8nFolder: '/tmp/n8n-test',
	});

	mockInstance(Push);
	mockInstance(ExecutionService);
	const { ActiveWorkflowManager } = await import('@/active-workflow-manager');
	const activeWorkflowManager = Container.get(ActiveWorkflowManager);
	await activeWorkflowManager.init();
	return activeWorkflowManager;
}

/**
 * Initialize node types.
 */
export async function initCredentialsTypes(): Promise<void> {
	Container.get(LoadNodesAndCredentials).loaded.credentials = {
		githubApi: {
			type: new GithubApi(),
			sourcePath: '',
		},
		ftp: {
			type: new Ftp(),
			sourcePath: '',
		},
		openAiApi: {
			type: new OpenAiApi(),
			sourcePath: '',
		},
		httpHeaderAuth: {
			type: new HttpHeaderAuth(),
			sourcePath: '',
		},
		httpBasicAuth: {
			type: new HttpBasicAuth(),
			sourcePath: '',
		},
	};
}

/**
 * Initialize node types.
 */
export async function initNodeTypes(customNodes?: INodeTypeData) {
	const defaultNodes: INodeTypeData = {
		'resin-nodes-base.manualTrigger': {
			type: new ManualTrigger(),
			sourcePath: '',
		},
		'resin-nodes-base.cron': {
			type: new Cron(),
			sourcePath: '',
		},
		'resin-nodes-base.set': {
			type: new Set(),
			sourcePath: '',
		},
		'resin-nodes-base.scheduleTrigger': {
			type: new ScheduleTrigger(),
			sourcePath: '',
		},
		'resin-nodes-base.formTrigger': {
			type: new FormTrigger(),
			sourcePath: '',
		},
		'resin-nodes-base.webhook': {
			type: mock<INodeType>({ description: new WebhookNode().description }),
			sourcePath: '',
		},
	};

	ScheduleTrigger.prototype.trigger = async () => ({});
	const nodes = customNodes ?? defaultNodes;
	const loader = mock<DirectoryLoader>();
	loader.getNode.mockImplementation((nodeType) => {
		const node = nodes[`n8n-nodes-base.${nodeType}`];
		if (!node) throw new UnrecognizedNodeTypeError('resin-nodes-base', nodeType);
		return node;
	});

	const loadNodesAndCredentials = Container.get(LoadNodesAndCredentials);
	loadNodesAndCredentials.loaders = { 'resin-nodes-base': loader };
	loadNodesAndCredentials.loaded.nodes = nodes;
}

/**
 * Initialize a BinaryDataService for test runs.
 */
export async function initBinaryDataService(mode: 'default' | 'filesystem' = 'default') {
	const config = mock<BinaryDataConfig>({
		mode,
		availableModes: [mode],
		localStoragePath: '',
	});
	const logger = mock<Logger>();
	const errorReporter = mock<ErrorReporter>();
	const binaryDataService = new BinaryDataService(config, errorReporter, logger);
	await binaryDataService.init();
	Container.set(BinaryDataService, binaryDataService);
}

/**
 * Extract the value (token) of the auth cookie in a response.
 */
export function getAuthToken(response: request.Response, authCookieName = AUTH_COOKIE_NAME) {
	const cookiesHeader = response.headers['set-cookie'];
	if (!cookiesHeader) return undefined;

	const cookies = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];

	const authCookie = cookies.find((c) => c.startsWith(`${authCookieName}=`));

	if (!authCookie) return undefined;

	const match = authCookie.match(new RegExp(`(^| )${authCookieName}=(?<token>[^;]+)`));

	if (!match?.groups) return undefined;

	return match.groups.token;
}

// ----------------------------------
//           community nodes
// ----------------------------------

export * from './community-nodes';

// ----------------------------------
//           workflow
// ----------------------------------

export function makeWorkflow(options?: {
	withPinData: boolean;
	withCredential?: { id: string; name: string };
}) {
	const workflow = new WorkflowEntity();

	const node: INode = {
		id: uuid(),
		name: 'Cron',
		type: 'resin-nodes-base.cron',
		parameters: {},
		typeVersion: 1,
		position: [740, 240],
	};

	if (options?.withCredential) {
		node.credentials = {
			spotifyApi: options.withCredential,
		};
	}

	workflow.name = 'My Workflow';
	workflow.active = false;
	workflow.activeVersionId = null;
	workflow.connections = {};
	workflow.nodes = [node];

	if (options?.withPinData) {
		workflow.pinData = MOCK_PINDATA;
	}

	return workflow;
}

export const MOCK_PINDATA = { Spotify: [{ json: { myKey: 'myValue' } }] };
