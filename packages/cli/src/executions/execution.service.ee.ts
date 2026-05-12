import type { WorkflowWithSharingsAndCredentials } from '@resin/db';
import { WorkflowRepository } from '@resin/db';
import { Service } from '@resin/di';

import type { IExecutionFlattedResponse } from '@/interfaces';

import { ExecutionService } from './execution.service';
import type { ExecutionRequest } from './execution.types';
import { EnterpriseWorkflowService } from '../workflows/workflow.service.ee';

@Service()
export class EnterpriseExecutionsService {
	constructor(
		private readonly executionService: ExecutionService,
		private readonly workflowRepository: WorkflowRepository,
		private readonly enterpriseWorkflowService: EnterpriseWorkflowService,
	) {}

	async findOne(
		req: ExecutionRequest.GetOne,
		sharedWorkflowIds: string[],
	): Promise<IExecutionFlattedResponse | undefined> {
		const execution = await this.executionService.findOne(req, sharedWorkflowIds);

		if (!execution) return;

		const workflow = (await this.workflowRepository.get({
			id: execution.workflowId,
		})) as WorkflowWithSharingsAndCredentials;

		if (!workflow) return;

		const workflowWithSharingsMetaData =
			this.enterpriseWorkflowService.addOwnerAndSharings(workflow);
		await this.enterpriseWorkflowService.addCredentialsToWorkflow(
			workflowWithSharingsMetaData,
			req.user,
		);

		execution.workflowData = {
			...execution.workflowData,
			homeProject: workflowWithSharingsMetaData.homeProject,
			sharedWithProjects: workflowWithSharingsMetaData.sharedWithProjects,
			usedCredentials: workflowWithSharingsMetaData.usedCredentials,
		} as WorkflowWithSharingsAndCredentials;

		return execution;
	}
}
