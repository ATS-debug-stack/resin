jest.mock('@resin/instance-ai', () => ({
	createEvalAgent: jest.fn(),
	extractText: jest.fn(),
}));

jest.mock('../node-config', () => ({
	extractNodeConfig: jest.fn(),
}));

import { createEvalAgent, extractText } from '@resin/instance-ai';
import type { IConnections, INode, IWorkflowBase } from 'resin-workflow';

import {
	generateMockHints,
	identifyNodesForHints,
	identifyNodesForPinData,
} from '../workflow-analysis';

const mockedCreateEvalAgent = jest.mocked(createEvalAgent);
const mockedExtractText = jest.mocked(extractText);

function makeNode(overrides: Partial<INode> & { name: string; type: string }): INode {
	return {
		id: overrides.name,
		typeVersion: 1,
		position: [0, 0] as [number, number],
		parameters: {},
		...overrides,
	};
}

function makeWorkflow(nodes: INode[], connections: IConnections = {}): IWorkflowBase {
	return {
		id: 'test-workflow',
		name: 'Test',
		active: false,
		isArchived: false,
		activeVersionId: null,
		nodes,
		connections,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

describe('identifyNodesForPinData', () => {
	it('should identify AI root nodes as needing pin data', () => {
		const nodes = [
			makeNode({ name: 'ChatOpenAI', type: '@resin/nodes-langchain.lmChatOpenAi' }),
			makeNode({ name: 'Agent', type: '@resin/nodes-langchain.agent' }),
			makeNode({ name: 'Set', type: 'resin-nodes-base.set' }),
		];
		const connections: IConnections = {
			ChatOpenAI: { ai_languageModel: [[{ node: 'Agent', type: 'ai_languageModel', index: 0 }]] },
		};

		const result = identifyNodesForPinData(makeWorkflow(nodes, connections));
		const names = result.map((n) => n.name);

		expect(names).toContain('Agent');
		expect(names).not.toContain('ChatOpenAI');
		expect(names).not.toContain('Set');
	});

	it('should identify protocol/bypass nodes as needing pin data', () => {
		const nodes = [
			makeNode({ name: 'My Redis', type: 'resin-nodes-base.redis' }),
			makeNode({ name: 'My Postgres', type: 'resin-nodes-base.postgres' }),
			makeNode({ name: 'My Kafka', type: 'resin-nodes-base.kafka' }),
			makeNode({ name: 'HTTP Request', type: 'resin-nodes-base.httpRequest' }),
			makeNode({ name: 'Set', type: 'resin-nodes-base.set' }),
		];

		const result = identifyNodesForPinData(makeWorkflow(nodes));
		const names = result.map((n) => n.name);

		expect(names).toContain('My Redis');
		expect(names).toContain('My Postgres');
		expect(names).toContain('My Kafka');
		expect(names).not.toContain('HTTP Request');
		expect(names).not.toContain('Set');
	});

	it('should exclude disabled nodes', () => {
		const nodes = [
			makeNode({ name: 'My Redis', type: 'resin-nodes-base.redis', disabled: true }),
			makeNode({ name: 'Agent', type: '@resin/nodes-langchain.agent', disabled: true }),
		];
		const connections: IConnections = {
			ChatOpenAI: { ai_languageModel: [[{ node: 'Agent', type: 'ai_languageModel', index: 0 }]] },
		};

		const result = identifyNodesForPinData(makeWorkflow(nodes, connections));

		expect(result).toHaveLength(0);
	});

	it('should return empty for workflow with only logic nodes', () => {
		const nodes = [
			makeNode({ name: 'Set', type: 'resin-nodes-base.set' }),
			makeNode({ name: 'IF', type: 'resin-nodes-base.if' }),
			makeNode({ name: 'Merge', type: 'resin-nodes-base.merge' }),
		];

		const result = identifyNodesForPinData(makeWorkflow(nodes));

		expect(result).toHaveLength(0);
	});

	it('should handle Agent with multiple sub-nodes', () => {
		const nodes = [
			makeNode({ name: 'OpenAI', type: '@resin/nodes-langchain.lmChatOpenAi' }),
			makeNode({ name: 'Memory', type: '@resin/nodes-langchain.memoryBufferWindow' }),
			makeNode({ name: 'Calculator', type: '@resin/nodes-langchain.toolCalculator' }),
			makeNode({ name: 'Agent', type: '@resin/nodes-langchain.agent' }),
		];
		const connections: IConnections = {
			OpenAI: { ai_languageModel: [[{ node: 'Agent', type: 'ai_languageModel', index: 0 }]] },
			Memory: { ai_memory: [[{ node: 'Agent', type: 'ai_memory', index: 0 }]] },
			Calculator: { ai_tool: [[{ node: 'Agent', type: 'ai_tool', index: 0 }]] },
		};

		const result = identifyNodesForPinData(makeWorkflow(nodes, connections));
		const names = result.map((n) => n.name);

		expect(names).toEqual(['Agent']);
	});

	it('should identify all bypass node types', () => {
		const bypassTypes = [
			'resin-nodes-base.redis',
			'resin-nodes-base.mongoDb',
			'resin-nodes-base.mySql',
			'resin-nodes-base.postgres',
			'resin-nodes-base.microsoftSql',
			'resin-nodes-base.snowflake',
			'resin-nodes-base.kafka',
			'resin-nodes-base.rabbitmq',
			'resin-nodes-base.mqtt',
			'resin-nodes-base.amqp',
			'resin-nodes-base.ftp',
			'resin-nodes-base.ssh',
			'resin-nodes-base.ldap',
			'resin-nodes-base.emailSend',
			'resin-nodes-base.rssFeedRead',
			'resin-nodes-base.git',
		];

		const nodes = bypassTypes.map((type, i) => makeNode({ name: `Node${i}`, type }));
		const result = identifyNodesForPinData(makeWorkflow(nodes));

		expect(result).toHaveLength(bypassTypes.length);
	});
});

describe('identifyNodesForHints', () => {
	it('should exclude AI sub-nodes from hints', () => {
		const nodes = [
			makeNode({ name: 'OpenAI', type: '@resin/nodes-langchain.lmChatOpenAi' }),
			makeNode({ name: 'Agent', type: '@resin/nodes-langchain.agent' }),
			makeNode({ name: 'Slack', type: 'resin-nodes-base.slack' }),
		];
		const connections: IConnections = {
			OpenAI: { ai_languageModel: [[{ node: 'Agent', type: 'ai_languageModel', index: 0 }]] },
		};

		const result = identifyNodesForHints(makeWorkflow(nodes, connections));
		const names = result.map((n) => n.name);

		expect(names).not.toContain('OpenAI');
		expect(names).not.toContain('Agent');
		expect(names).toContain('Slack');
	});

	it('should exclude pinned bypass nodes from hints', () => {
		const nodes = [
			makeNode({ name: 'Webhook', type: 'resin-nodes-base.webhook' }),
			makeNode({ name: 'Redis', type: 'resin-nodes-base.redis' }),
			makeNode({ name: 'Slack', type: 'resin-nodes-base.slack' }),
			makeNode({ name: 'Set', type: 'resin-nodes-base.set' }),
		];

		const result = identifyNodesForHints(makeWorkflow(nodes));
		const names = result.map((n) => n.name);

		expect(names).not.toContain('Redis');
		expect(names).toContain('Webhook');
		expect(names).toContain('Slack');
		expect(names).toContain('Set');
	});

	it('should exclude disabled nodes', () => {
		const nodes = [
			makeNode({ name: 'Slack', type: 'resin-nodes-base.slack', disabled: true }),
			makeNode({ name: 'Gmail', type: 'resin-nodes-base.gmail' }),
		];

		const result = identifyNodesForHints(makeWorkflow(nodes));
		const names = result.map((n) => n.name);

		expect(names).not.toContain('Slack');
		expect(names).toContain('Gmail');
	});

	it('should return only HTTP-interceptible nodes for a mixed workflow', () => {
		const nodes = [
			makeNode({ name: 'Webhook', type: 'resin-nodes-base.webhook' }),
			makeNode({ name: 'OpenAI', type: '@resin/nodes-langchain.lmChatOpenAi' }),
			makeNode({ name: 'Agent', type: '@resin/nodes-langchain.agent' }),
			makeNode({ name: 'Postgres', type: 'resin-nodes-base.postgres' }),
			makeNode({ name: 'Slack', type: 'resin-nodes-base.slack' }),
			makeNode({ name: 'Set', type: 'resin-nodes-base.set' }),
		];
		const connections: IConnections = {
			OpenAI: { ai_languageModel: [[{ node: 'Agent', type: 'ai_languageModel', index: 0 }]] },
		};

		const result = identifyNodesForHints(makeWorkflow(nodes, connections));
		const names = result.map((n) => n.name);

		// Should include: Webhook (trigger, gets hints), Slack (HTTP service), Set (logic)
		expect(names).toContain('Webhook');
		expect(names).toContain('Slack');
		expect(names).toContain('Set');
		// Should exclude: OpenAI (AI sub-node), Agent (AI root, pinned), Postgres (bypass, pinned)
		expect(names).not.toContain('OpenAI');
		expect(names).not.toContain('Agent');
		expect(names).not.toContain('Postgres');
	});
});

describe('generateMockHints', () => {
	const workflow = makeWorkflow([
		makeNode({ name: 'Schedule', type: 'resin-nodes-base.scheduleTrigger' }),
		makeNode({ name: 'Slack', type: 'resin-nodes-base.slack' }),
	]);

	function mockAgentResponses(...responses: Array<string | Error>) {
		const generate = jest.fn();
		for (const r of responses) {
			if (r instanceof Error) generate.mockRejectedValueOnce(r);
			else generate.mockResolvedValueOnce({ __raw: r });
		}
		mockedCreateEvalAgent.mockReturnValue({ generate } as unknown as ReturnType<
			typeof createEvalAgent
		>);
		mockedExtractText.mockImplementation((result: unknown) => (result as { __raw: string }).__raw);
		return generate;
	}

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should succeed on the first attempt when the LLM returns a well-formed response', async () => {
		const generate = mockAgentResponses(
			JSON.stringify({
				globalContext: 'shared context',
				triggerContent: { timestamp: '2024-01-01T00:00:00Z' },
				nodeHints: { Slack: 'post a message' },
			}),
		);

		const result = await generateMockHints({ workflow, nodeNames: ['Schedule', 'Slack'] });

		expect(generate).toHaveBeenCalledTimes(1);
		expect(result.triggerContent).toEqual({ timestamp: '2024-01-01T00:00:00Z' });
		expect(result.warnings).toEqual([]);
	});

	it('should retry when the first attempt returns empty triggerContent, then succeed', async () => {
		const generate = mockAgentResponses(
			JSON.stringify({ globalContext: '', triggerContent: {}, nodeHints: { Slack: 'foo' } }),
			JSON.stringify({
				globalContext: '',
				triggerContent: { timestamp: '2024-01-01T00:00:00Z' },
				nodeHints: { Slack: 'foo' },
			}),
		);

		const result = await generateMockHints({ workflow, nodeNames: ['Schedule', 'Slack'] });

		expect(generate).toHaveBeenCalledTimes(2);
		expect(result.triggerContent).toEqual({ timestamp: '2024-01-01T00:00:00Z' });
		expect(result.warnings).toEqual([
			expect.stringContaining('Phase 1 attempt 1/2: empty triggerContent'),
		]);
	});

	it('should return emptyResult with both warnings when every attempt fails', async () => {
		const generate = mockAgentResponses(
			JSON.stringify({ globalContext: '', triggerContent: {}, nodeHints: { Slack: 'foo' } }),
			JSON.stringify({ globalContext: '', triggerContent: {}, nodeHints: { Slack: 'foo' } }),
		);

		const result = await generateMockHints({ workflow, nodeNames: ['Schedule', 'Slack'] });

		expect(generate).toHaveBeenCalledTimes(2);
		expect(result.triggerContent).toEqual({});
		expect(result.warnings).toEqual([
			expect.stringContaining('attempt 1/2'),
			expect.stringContaining('attempt 2/2'),
		]);
	});

	it('should retry when the first attempt throws, then succeed', async () => {
		const generate = mockAgentResponses(
			new Error('anthropic rate limit'),
			JSON.stringify({
				globalContext: '',
				triggerContent: { timestamp: '2024-01-01T00:00:00Z' },
				nodeHints: { Slack: 'foo' },
			}),
		);

		const result = await generateMockHints({ workflow, nodeNames: ['Schedule', 'Slack'] });

		expect(generate).toHaveBeenCalledTimes(2);
		expect(result.triggerContent).toEqual({ timestamp: '2024-01-01T00:00:00Z' });
		expect(result.warnings).toEqual([expect.stringContaining('anthropic rate limit')]);
	});

	it('should retry when the first attempt returns invalid nodeHints structure', async () => {
		const generate = mockAgentResponses(
			JSON.stringify({ globalContext: '', triggerContent: { a: 1 }, nodeHints: [] }),
			JSON.stringify({
				globalContext: '',
				triggerContent: { a: 1 },
				nodeHints: { Slack: 'foo' },
			}),
		);

		const result = await generateMockHints({ workflow, nodeNames: ['Schedule', 'Slack'] });

		expect(generate).toHaveBeenCalledTimes(2);
		expect(result.warnings).toEqual([expect.stringContaining('invalid nodeHints')]);
	});

	it('should not call the agent when there are no hint-eligible nodes', async () => {
		const generate = mockAgentResponses('should never be called');

		const result = await generateMockHints({ workflow, nodeNames: [] });

		expect(generate).not.toHaveBeenCalled();
		expect(result.triggerContent).toEqual({});
		expect(result.warnings).toEqual([]);
	});
});
