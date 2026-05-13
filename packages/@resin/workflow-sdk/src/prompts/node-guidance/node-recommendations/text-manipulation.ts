import { type NodeRecommendationDocument, RecommendationCategory } from './types';

export const textManipulationRecommendation: NodeRecommendationDocument = {
	category: RecommendationCategory.TEXT_MANIPULATION,
	version: '1.0.0',
	recommendation: {
		defaultNode: '@resin/nodes-langchain.agent',
		operations: [
			'Text summarization',
			'Content analysis and extraction',
			'Classification and categorization',
			'Chat and conversational AI',
			'Content generation and writing',
		],
		reasoning:
			'The AI Agent node is the default for text manipulation tasks. New users receive free OpenAI credits. Do NOT use provider-specific nodes directly.',
		connectedNodes: [
			{
				nodeType: '@resin/nodes-langchain.lmChatOpenAi',
				connectionType: 'ai_languageModel',
				description: 'Required chat model for the AI Agent',
			},
		],
	},
};
