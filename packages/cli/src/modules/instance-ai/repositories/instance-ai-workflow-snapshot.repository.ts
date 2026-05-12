import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { InstanceAiWorkflowSnapshot } from '../entities/instance-ai-workflow-snapshot.entity';

@Service()
export class InstanceAiWorkflowSnapshotRepository extends Repository<InstanceAiWorkflowSnapshot> {
	constructor(dataSource: DataSource) {
		super(InstanceAiWorkflowSnapshot, dataSource.manager);
	}
}
