import { LlmJudgeProviderRegistry } from '../llm-judge-provider-registry';

describe('LlmJudgeProviderRegistry (fixed-list)', () => {
	const registry = new LlmJudgeProviderRegistry();

	it('exposes the canonical chat-model providers shipped by @resin/nodes-langchain', () => {
		const expectedNodeTypes = [
			'@resin/nodes-langchain.lmChatOpenAi',
			'@resin/nodes-langchain.lmChatAnthropic',
			'@resin/nodes-langchain.lmChatGoogleGemini',
			'@resin/nodes-langchain.lmChatGoogleVertex',
			'@resin/nodes-langchain.lmChatAzureOpenAi',
			'@resin/nodes-langchain.lmChatAwsBedrock',
			'@resin/nodes-langchain.lmChatOllama',
			'@resin/nodes-langchain.lmChatVercelAiGateway',
			'@resin/nodes-langchain.lmChatXAiGrok',
			'@resin/nodes-langchain.lmChatGroq',
			'@resin/nodes-langchain.lmChatOpenRouter',
			'@resin/nodes-langchain.lmChatDeepSeek',
			'@resin/nodes-langchain.lmChatCohere',
			'@resin/nodes-langchain.lmChatMistralCloud',
			'@resin/nodes-langchain.lmChatAlibabaCloud',
			'@resin/nodes-langchain.lmChatMinimax',
			'@resin/nodes-langchain.lmChatMoonshot',
			'@resin/nodes-langchain.lmChatLemonade',
		];
		const actual = registry.listProviders().map((p) => p.nodeType);
		expect(actual.sort()).toEqual([...expectedNodeTypes].sort());
	});

	describe('shape', () => {
		it('every entry has nodeType, displayName, and a non-empty credentialTypes array', () => {
			for (const entry of registry.listProviders()) {
				expect(entry.nodeType).toMatch(/^@n8n\/n8n-nodes-langchain\./);
				expect(typeof entry.displayName).toBe('string');
				expect(entry.displayName.length).toBeGreaterThan(0);
				expect(Array.isArray(entry.credentialTypes)).toBe(true);
				expect(entry.credentialTypes.length).toBeGreaterThan(0);
				for (const cred of entry.credentialTypes) {
					expect(typeof cred.name).toBe('string');
					expect(cred.name.length).toBeGreaterThan(0);
					expect(typeof cred.displayName).toBe('string');
					expect(cred.displayName.length).toBeGreaterThan(0);
				}
			}
		});
	});

	describe('get(nodeType)', () => {
		it('returns the matching entry for a known provider', () => {
			const entry = registry.get('@resin/nodes-langchain.lmChatOpenAi');
			expect(entry).toBeDefined();
			expect(entry?.displayName).toBe('OpenAI Chat Model');
			expect(entry?.credentialTypes.map((c) => c.name)).toContain('openAiApi');
		});

		it('returns undefined for unknown providers', () => {
			expect(registry.get('@resin/nodes-langchain.lmChatNotARealNode')).toBeUndefined();
		});

		it('exposes Azure OpenAI with both api-key and Entra credential variants', () => {
			const entry = registry.get('@resin/nodes-langchain.lmChatAzureOpenAi');
			const credNames = entry?.credentialTypes.map((c) => c.name) ?? [];
			expect(credNames).toEqual(
				expect.arrayContaining(['azureOpenAiApi', 'azureEntraCognitiveServicesOAuth2Api']),
			);
		});
	});

	describe('listProviders() referential stability', () => {
		it('returns the same array reference across calls (cheap snapshot)', () => {
			expect(registry.listProviders()).toBe(registry.listProviders());
		});
	});
});
