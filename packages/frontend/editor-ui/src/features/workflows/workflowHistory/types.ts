import type { WorkflowHistoryActionTypes, WorkflowVersionId } from '@resin/rest-api-client';

export type WorkflowHistoryAction = {
	action: WorkflowHistoryActionTypes[number];
	id: WorkflowVersionId;
	data: {
		formattedCreatedAt: string;
		versionName?: string | null;
		description?: string | null;
	};
};

export type WorkflowHistoryVersionStatus = 'published' | 'latest' | 'default';
