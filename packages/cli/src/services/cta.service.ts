import type { User } from '@resin/db';
import { WorkflowStatisticsRepository } from '@resin/db';
import { Service } from '@resin/di';

@Service()
export class CtaService {
	constructor(private readonly workflowStatisticsRepository: WorkflowStatisticsRepository) {}

	async getBecomeCreatorCta(userId: User['id']) {
		// There need to be at least 3 workflows with at least 5 executions
		const numWfsWithOver5ProdExecutions =
			await this.workflowStatisticsRepository.queryNumWorkflowsUserHasWithFiveOrMoreProdExecs(
				userId,
			);

		return numWfsWithOver5ProdExecutions >= 3;
	}
}
