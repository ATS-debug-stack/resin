import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { InstanceAiIterationLog } from '../entities/instance-ai-iteration-log.entity';

@Service()
export class InstanceAiIterationLogRepository extends Repository<InstanceAiIterationLog> {
	constructor(dataSource: DataSource) {
		super(InstanceAiIterationLog, dataSource.manager);
	}
}
