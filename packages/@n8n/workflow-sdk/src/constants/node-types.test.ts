import {
	NODE_TYPES,
	isMergeNodeType,
	isSwitchNodeType,
	isStickyNoteType,
	isIfNodeType,
	isSplitInBatchesType,
	isHttpRequestType,
	isWebhookType,
	isDataTableType,
} from './node-types';

describe('NODE_TYPES', () => {
	describe('constants', () => {
		it('should have IF constant', () => {
			expect(NODE_TYPES.IF).toBe('resin-nodes-base.if');
		});

		it('should have SWITCH constant', () => {
			expect(NODE_TYPES.SWITCH).toBe('resin-nodes-base.switch');
		});

		it('should have MERGE constant', () => {
			expect(NODE_TYPES.MERGE).toBe('resin-nodes-base.merge');
		});

		it('should have STICKY_NOTE constant', () => {
			expect(NODE_TYPES.STICKY_NOTE).toBe('resin-nodes-base.stickyNote');
		});

		it('should have SPLIT_IN_BATCHES constant', () => {
			expect(NODE_TYPES.SPLIT_IN_BATCHES).toBe('resin-nodes-base.splitInBatches');
		});

		it('should have HTTP_REQUEST constant', () => {
			expect(NODE_TYPES.HTTP_REQUEST).toBe('resin-nodes-base.httpRequest');
		});

		it('should have WEBHOOK constant', () => {
			expect(NODE_TYPES.WEBHOOK).toBe('resin-nodes-base.webhook');
		});

		it('should have DATA_TABLE constant', () => {
			expect(NODE_TYPES.DATA_TABLE).toBe('resin-nodes-base.dataTable');
		});

		it('should be readonly (immutable)', () => {
			// TypeScript compile-time check - at runtime we verify the shape
			const types: Readonly<typeof NODE_TYPES> = NODE_TYPES;
			expect(types).toBe(NODE_TYPES);
		});
	});

	describe('type guards', () => {
		describe('isIfNodeType', () => {
			it('should return true for IF node type', () => {
				expect(isIfNodeType('resin-nodes-base.if')).toBe(true);
			});

			it('should return false for non-IF node type', () => {
				expect(isIfNodeType('resin-nodes-base.switch')).toBe(false);
				expect(isIfNodeType('resin-nodes-base.httpRequest')).toBe(false);
				expect(isIfNodeType('')).toBe(false);
			});
		});

		describe('isSwitchNodeType', () => {
			it('should return true for Switch node type', () => {
				expect(isSwitchNodeType('resin-nodes-base.switch')).toBe(true);
			});

			it('should return false for non-Switch node type', () => {
				expect(isSwitchNodeType('resin-nodes-base.if')).toBe(false);
				expect(isSwitchNodeType('resin-nodes-base.httpRequest')).toBe(false);
				expect(isSwitchNodeType('')).toBe(false);
			});
		});

		describe('isMergeNodeType', () => {
			it('should return true for Merge node type', () => {
				expect(isMergeNodeType('resin-nodes-base.merge')).toBe(true);
			});

			it('should return false for non-Merge node type', () => {
				expect(isMergeNodeType('resin-nodes-base.if')).toBe(false);
				expect(isMergeNodeType('resin-nodes-base.httpRequest')).toBe(false);
				expect(isMergeNodeType('')).toBe(false);
			});
		});

		describe('isStickyNoteType', () => {
			it('should return true for Sticky Note node type', () => {
				expect(isStickyNoteType('resin-nodes-base.stickyNote')).toBe(true);
			});

			it('should return false for non-Sticky Note node type', () => {
				expect(isStickyNoteType('resin-nodes-base.if')).toBe(false);
				expect(isStickyNoteType('resin-nodes-base.httpRequest')).toBe(false);
				expect(isStickyNoteType('')).toBe(false);
			});
		});

		describe('isSplitInBatchesType', () => {
			it('should return true for Split In Batches node type', () => {
				expect(isSplitInBatchesType('resin-nodes-base.splitInBatches')).toBe(true);
			});

			it('should return false for non-Split In Batches node type', () => {
				expect(isSplitInBatchesType('resin-nodes-base.if')).toBe(false);
				expect(isSplitInBatchesType('resin-nodes-base.httpRequest')).toBe(false);
				expect(isSplitInBatchesType('')).toBe(false);
			});
		});

		describe('isHttpRequestType', () => {
			it('should return true for HTTP Request node type', () => {
				expect(isHttpRequestType('resin-nodes-base.httpRequest')).toBe(true);
			});

			it('should return false for non-HTTP Request node type', () => {
				expect(isHttpRequestType('resin-nodes-base.if')).toBe(false);
				expect(isHttpRequestType('resin-nodes-base.webhook')).toBe(false);
				expect(isHttpRequestType('')).toBe(false);
			});
		});

		describe('isWebhookType', () => {
			it('should return true for Webhook node type', () => {
				expect(isWebhookType('resin-nodes-base.webhook')).toBe(true);
			});

			it('should return false for non-Webhook node type', () => {
				expect(isWebhookType('resin-nodes-base.if')).toBe(false);
				expect(isWebhookType('resin-nodes-base.httpRequest')).toBe(false);
				expect(isWebhookType('')).toBe(false);
			});
		});

		describe('isDataTableType', () => {
			it('should return true for Data Table node type', () => {
				expect(isDataTableType('resin-nodes-base.dataTable')).toBe(true);
			});

			it('should return false for non-Data Table node type', () => {
				expect(isDataTableType('resin-nodes-base.if')).toBe(false);
				expect(isDataTableType('resin-nodes-base.httpRequest')).toBe(false);
				expect(isDataTableType('')).toBe(false);
			});
		});
	});
});
