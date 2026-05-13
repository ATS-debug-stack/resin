/**
 * Data for get_suggested_nodes tool.
 * Contains curated node recommendations organized by workflow technique category.
 */

export interface CategorySuggestedNode {
	name: string;
	note?: string;
}

export interface CategoryData {
	description: string;
	patternHint: string;
	nodes: CategorySuggestedNode[];
}

export const suggestedNodesData: Record<string, CategoryData> = {
	chatbot: {
		description: 'Receiving chat messages and replying (built-in chat, Telegram, Slack, etc.)',
		patternHint: 'Chat Trigger → AI Agent → Memory → Response',
		nodes: [
			{
				name: '@resin/nodes-langchain.chatTrigger',
				note: 'When loadPreviousSession is set to memory, the downstream Agent must also have its own memory subnode to maintain conversation context during processing',
			},
			{
				name: '@resin/nodes-langchain.agent',
				note: 'Every agent in a conversational workflow MUST have a memory subnode connected. If multiple agents share the same conversation, they must use the same memory session key',
			},
			{ name: '@resin/nodes-langchain.lmChatOpenAi' },
			{ name: '@resin/nodes-langchain.lmChatGoogleGemini' },
			{
				name: '@resin/nodes-langchain.memoryBufferWindow',
				note: 'Maintains short-term conversation history. Must be connected as a subnode to every Agent that participates in a conversation. When multiple agents share a conversation, use the same session key across all of them',
			},
			{
				name: '@resin/nodes-langchain.retrieverVectorStore',
				note: 'Connects any Vector Store (Pinecone, Qdrant, Supabase, In-Memory, etc.) to an AI Agent for RAG. Use this as a subnode between the vector store and the agent to retrieve relevant documents when answering questions',
			},
			{ name: 'resin-nodes-base.slack' },
			{ name: 'resin-nodes-base.telegram' },
			{ name: 'resin-nodes-base.whatsApp' },
			{ name: 'resin-nodes-base.discord' },
		],
	},

	notification: {
		description: 'Sending alerts or updates via email, chat, SMS when events occur',
		patternHint: 'Trigger → Condition → Send (Email/Slack/SMS)',
		nodes: [
			{ name: 'resin-nodes-base.webhook', note: 'Event-based notifications from external systems' },
			{
				name: 'resin-nodes-base.scheduleTrigger',
				note: 'Periodic monitoring and batch notifications',
			},
			{
				name: 'resin-nodes-base.gmail',
				note: "Default to this because it's easy for users to setup",
			},
			{ name: 'resin-nodes-base.slack' },
			{ name: 'resin-nodes-base.telegram' },
			{ name: 'resin-nodes-base.twilio' },
			{
				name: 'resin-nodes-base.httpRequest',
				note: 'For services without dedicated nodes (Teams, Discord)',
			},
			{ name: 'resin-nodes-base.if', note: 'Check alert conditions before sending' },
			{
				name: 'resin-nodes-base.switch',
				note: 'If routing by severity/type is needed, use Switch to direct to different channels',
			},
		],
	},

	scheduling: {
		description: 'Running actions at specific times or intervals',
		patternHint: 'Schedule Trigger → Fetch → Process → Act',
		nodes: [
			{ name: 'resin-nodes-base.scheduleTrigger' },
			{ name: 'resin-nodes-base.httpRequest' },
			{ name: 'resin-nodes-base.set' },
			{ name: 'resin-nodes-base.wait', note: 'Respect rate limits between API calls' },
		],
	},

	data_transformation: {
		description: 'Cleaning, formatting, or restructuring data',
		patternHint: 'Input → Filter/Map → Transform → Output',
		nodes: [
			{ name: 'resin-nodes-base.set' },
			{ name: 'resin-nodes-base.if', note: 'Use early to validate inputs' },
			{ name: 'resin-nodes-base.filter', note: 'Use early to reduce data volume' },
			{ name: 'resin-nodes-base.summarize', note: 'Pivot table-style aggregations' },
			{ name: 'resin-nodes-base.aggregate', note: 'Combine multiple items into one' },
			{
				name: 'resin-nodes-base.splitOut',
				note: 'Convert single item with array into multiple items',
			},
			{ name: 'resin-nodes-base.sort' },
			{ name: 'resin-nodes-base.limit' },
			{ name: 'resin-nodes-base.removeDuplicates' },
			{
				name: 'resin-nodes-base.splitInBatches',
				note: 'For large datasets (100+ items), batch processing prevents timeouts',
			},
		],
	},

	data_persistence: {
		description: 'Storing, updating, or retrieving records from persistent storage',
		patternHint: 'Trigger → Process → Store (DataTable/Sheets)',
		nodes: [
			{ name: 'resin-nodes-base.dataTable', note: 'PREFERRED - no external config needed' },
			{
				name: 'resin-nodes-base.googleSheets',
				note: 'For collaboration needs; if >10k rows expected, consider DataTable instead',
			},
			{
				name: 'resin-nodes-base.airtable',
				note: 'If relationships between tables are needed',
			},
			{ name: 'resin-nodes-base.postgres' },
			{ name: 'resin-nodes-base.mySql' },
			{ name: 'resin-nodes-base.mongoDb' },
		],
	},

	data_extraction: {
		description: 'Pulling specific information from structured or unstructured inputs',
		patternHint: 'Source → Extract → Parse → Structure',
		nodes: [
			{
				name: 'resin-nodes-base.extractFromFile',
				note: 'For multiple file types, route by file type first with IF/Switch',
			},
			{ name: 'resin-nodes-base.htmlExtract', note: 'JS-rendered content may be empty' },
			{ name: 'resin-nodes-base.splitOut', note: 'Use before Loop Over Items for arrays' },
			{
				name: 'resin-nodes-base.splitInBatches',
				note: 'Process 200 rows at a time for memory',
			},
			{ name: 'resin-nodes-base.code' },
			{ name: '@resin/nodes-langchain.informationExtractor', note: 'For unstructured text' },
			{
				name: '@resin/nodes-langchain.chainSummarization',
				note: 'Context window limits may truncate',
			},
		],
	},

	document_processing: {
		description: 'Taking action on content within files (PDFs, Word docs, images)',
		patternHint: 'Trigger → Extract Text → AI Parse → Store',
		nodes: [
			{
				name: 'resin-nodes-base.gmailTrigger',
			},
			{ name: 'resin-nodes-base.googleDriveTrigger' },
			{
				name: 'resin-nodes-base.extractFromFile',
				note: 'Different file types require different operations - route accordingly',
			},
			{ name: 'resin-nodes-base.awsTextract', note: 'For tables and forms in scanned docs' },
			{ name: 'resin-nodes-base.mindee', note: 'Specialized invoice/receipt parsing' },
			{ name: '@resin/nodes-langchain.agent' },
			{
				name: '@resin/nodes-langchain.documentDefaultDataLoader',
				note: 'Loads binary files (PDF, CSV, JSON, DOCX, EPUB, text) into LangChain Documents. Auto-detects format from MIME type. Requires a preceding node that outputs binary data',
			},
			{
				name: '@resin/nodes-langchain.vectorStoreInMemory',
				note: 'No external dependencies needed',
			},
			{ name: 'resin-nodes-base.splitInBatches', note: 'Process 5-10 files at a time' },
		],
	},

	form_input: {
		description: 'Gathering data from users via forms',
		patternHint: 'Form Trigger → Validate → Store → Respond',
		nodes: [
			{ name: 'resin-nodes-base.formTrigger', note: 'ALWAYS store raw data to persistent storage' },
			{ name: 'resin-nodes-base.form', note: 'Each node is one page/step' },
			{ name: 'resin-nodes-base.dataTable', note: 'PREFERRED for form data storage' },
			{ name: 'resin-nodes-base.googleSheets' },
			{ name: 'resin-nodes-base.airtable' },
		],
	},

	content_generation: {
		description: 'Creating text, images, audio, or video',
		patternHint: 'Trigger → Generate (Text/Image/Video) → Deliver',
		nodes: [
			{ name: '@resin/nodes-langchain.agent', note: 'For text generation' },
			{
				name: '@resin/nodes-langchain.openAi',
				note: 'Use for image/video generation. DALL-E, TTS, Sora video generation',
			},
			{ name: '@resin/nodes-langchain.lmChatGoogleGemini', note: 'Imagen, video generation' },
			{ name: 'resin-nodes-base.httpRequest', note: 'For APIs without dedicated nodes' },
			{ name: 'resin-nodes-base.editImage', note: 'Resize, crop, format conversion' },
			{ name: 'resin-nodes-base.markdown', note: 'Convert to HTML' },
			{ name: 'resin-nodes-base.facebookGraphApi' },
			{
				name: 'resin-nodes-base.wait',
				note: 'Video generation is async, use wait while polling for updated',
			},
		],
	},

	triage: {
		description: 'Classifying data for routing or prioritization',
		patternHint: 'Trigger → Classify → Route → Act',
		nodes: [
			{
				name: '@resin/nodes-langchain.agent',
				note: 'For consistent/deterministic classification, always use structured output parser and set temperature 0-0.2',
			},
			{
				name: '@resin/nodes-langchain.outputParserStructured',
				note: 'Critical to ensure agent output is consistent and matching general schema',
			},
		],
	},

	scraping_and_research: {
		description: 'Collecting information from websites or APIs',
		patternHint: 'Trigger → Fetch → Extract → Store',
		nodes: [
			{
				name: 'resin-nodes-base.dataTable',
				note: 'Default storage for scraped data when the user does not specify a destination. No external config needed. Always include a storage step in scraping workflows',
			},
			{
				name: 'resin-nodes-base.phantombuster',
				note: 'Use this for social media requests: LinkedIn, Facebook, Instagram, Twitter, etc.',
			},
			{
				name: '@resin/nodes-langchain.toolSerpApi',
				note: 'Give agent web search capability, get up-to-date information from websites.',
			},
			{ name: 'resin-nodes-base.perplexity', note: 'Recommended for fetching up-to-date news' },
			{ name: 'resin-nodes-base.perplexityTool', note: 'Recommended for fetching up-to-date news' },
			{
				name: 'resin-nodes-base.htmlExtract',
				note: 'Use to extract HTML content from http requests. Though, JS-rendered sites may return empty',
			},
			{
				name: 'resin-nodes-base.splitInBatches',
				note: 'Use to batch the processing of items. General recommendation: 200 rows at a time if processing is fast',
			},
			{ name: 'resin-nodes-base.wait', note: 'Use this to avoid rate limits (429 errors)' },
			{ name: 'resin-nodes-base.httpRequest' },
			{ name: 'resin-nodes-base.httpRequestTool' },
		],
	},
};

export const categoryList = Object.keys(suggestedNodesData);
