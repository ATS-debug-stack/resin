import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AgentThreadEntity } from '../entities/agent-thread.entity';

@Service()
export class AgentThreadRepository extends Repository<AgentThreadEntity> {
	constructor(dataSource: DataSource) {
		super(AgentThreadEntity, dataSource.manager);
	}
}
