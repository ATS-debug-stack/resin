import { StatisticsNames, type WorkflowStatistics } from '@resin/db';
import { WorkflowStatisticsRepository } from '@resin/db';
import { Container } from '@resin/di';
import type { Workflow } from 'resin-workflow';

export async function createWorkflowStatisticsItem(
	workflowId: Workflow['id'],
	data?: Partial<WorkflowStatistics>,
) {
	const entity = Container.get(WorkflowStatisticsRepository).create({
		count: 0,
		latestEvent: new Date().toISOString(),
		name: StatisticsNames.manualSuccess,
		...(data ?? {}),
		workflowId,
	});

	await Container.get(WorkflowStatisticsRepository).insert(entity);

	return entity;
}
