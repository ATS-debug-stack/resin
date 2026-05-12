import { describe, it, expect } from '@jest/globals';

import {
	isTriggerType,
	isStickyNote,
	isMergeType,
	generateDefaultNodeName,
} from './node-type-utils';

describe('node-type-utils', () => {
	describe('isTriggerType', () => {
		it('returns true for types containing "trigger"', () => {
			expect(isTriggerType('resin-nodes-base.manualTrigger')).toBe(true);
			expect(isTriggerType('resin-nodes-base.cronTrigger')).toBe(true);
		});

		it('returns true for webhook', () => {
			expect(isTriggerType('resin-nodes-base.webhook')).toBe(true);
		});

		it('returns false for non-trigger types', () => {
			expect(isTriggerType('resin-nodes-base.httpRequest')).toBe(false);
			expect(isTriggerType('resin-nodes-base.set')).toBe(false);
		});

		it('is case insensitive for trigger keyword', () => {
			expect(isTriggerType('resin-nodes-base.ManualTrigger')).toBe(true);
			expect(isTriggerType('resin-nodes-base.TRIGGER')).toBe(true);
		});
	});

	describe('isStickyNote', () => {
		it('returns true for sticky note type', () => {
			expect(isStickyNote('resin-nodes-base.stickyNote')).toBe(true);
		});

		it('returns false for other types', () => {
			expect(isStickyNote('resin-nodes-base.set')).toBe(false);
			expect(isStickyNote('resin-nodes-base.stickyNotes')).toBe(false);
		});
	});

	describe('isMergeType', () => {
		it('returns true for merge type', () => {
			expect(isMergeType('resin-nodes-base.merge')).toBe(true);
		});

		it('returns false for other types', () => {
			expect(isMergeType('resin-nodes-base.set')).toBe(false);
			expect(isMergeType('resin-nodes-base.mergeNode')).toBe(false);
		});
	});

	describe('generateDefaultNodeName', () => {
		it('converts camelCase to title case with spaces', () => {
			expect(generateDefaultNodeName('resin-nodes-base.httpRequest')).toBe('HTTP Request');
		});

		it('handles uppercase acronyms', () => {
			expect(generateDefaultNodeName('resin-nodes-base.apiNode')).toBe('API Node');
		});

		it('converts common acronyms to uppercase', () => {
			expect(generateDefaultNodeName('resin-nodes-base.urlShortener')).toBe('URL Shortener');
			expect(generateDefaultNodeName('resin-nodes-base.jsonParser')).toBe('JSON Parser');
			expect(generateDefaultNodeName('resin-nodes-base.sqlQuery')).toBe('SQL Query');
		});

		it('handles AI acronym', () => {
			expect(generateDefaultNodeName('@resin/n8n-nodes-langchain.aiAgent')).toBe('AI Agent');
		});

		it('handles AWS and GCP', () => {
			expect(generateDefaultNodeName('resin-nodes-base.awsLambda')).toBe('AWS Lambda');
			expect(generateDefaultNodeName('resin-nodes-base.gcpFunction')).toBe('GCP Function');
		});

		it('handles FTP and SSH', () => {
			expect(generateDefaultNodeName('resin-nodes-base.ftpUpload')).toBe('FTP Upload');
			expect(generateDefaultNodeName('resin-nodes-base.sshCommand')).toBe('SSH Command');
		});

		it('handles CSV and XML', () => {
			expect(generateDefaultNodeName('resin-nodes-base.csvParser')).toBe('CSV Parser');
			expect(generateDefaultNodeName('resin-nodes-base.xmlBuilder')).toBe('XML Builder');
		});

		it('handles simple names', () => {
			expect(generateDefaultNodeName('resin-nodes-base.set')).toBe('Set');
			expect(generateDefaultNodeName('resin-nodes-base.if')).toBe('If');
		});

		it('takes last part after dot', () => {
			expect(generateDefaultNodeName('@resin/n8n-nodes-langchain.tool')).toBe('Tool');
		});
	});
});
