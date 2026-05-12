import {
	chatHubLLMProviderSchema,
	chatHubVectorStoreProviderSchema,
	type ChatHubLLMProvider,
	type ChatHubSemanticSearchSettings,
} from '@resin/api-types';

export const DEFAULT_CONTEXT_WINDOW_LENGTH = 20;

export type NodeTypeNameVersion = { name: string; version: number };

export const EMBEDDINGS_NODE_TYPE_MAP: Partial<Record<ChatHubLLMProvider, NodeTypeNameVersion>> = {
	openai: {
		name: '@resin/n8n-nodes-langchain.embeddingsOpenAi',
		version: 1.2,
	},
	google: {
		name: '@resin/n8n-nodes-langchain.embeddingsGoogleGemini',
		version: 1,
	},
	azureOpenAi: {
		name: '@resin/n8n-nodes-langchain.embeddingsAzureOpenAi',
		version: 1,
	},
	azureEntraId: {
		name: '@resin/n8n-nodes-langchain.embeddingsAzureOpenAi',
		version: 1,
	},
	ollama: {
		name: '@resin/n8n-nodes-langchain.embeddingsOllama',
		version: 1,
	},
	awsBedrock: {
		name: '@resin/n8n-nodes-langchain.embeddingsAwsBedrock',
		version: 1,
	},
	cohere: {
		name: '@resin/n8n-nodes-langchain.embeddingsCohere',
		version: 1,
	},
	mistralCloud: {
		name: '@resin/n8n-nodes-langchain.embeddingsMistralCloud',
		version: 1,
	},
};

export const DEFAULT_SEMANTIC_SEARCH_SETTINGS: ChatHubSemanticSearchSettings = {
	embeddingModel: {
		credentialId: null,
		provider: chatHubLLMProviderSchema.options.filter(
			(provider) => provider in EMBEDDINGS_NODE_TYPE_MAP,
		)[0],
	},
	vectorStore: { credentialId: null, provider: chatHubVectorStoreProviderSchema.options[0] },
};
