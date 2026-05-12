import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AgentResourceEntity } from '../entities/agent-resource.entity';

@Service()
export class AgentResourceRepository extends Repository<AgentResourceEntity> {
	constructor(dataSource: DataSource) {
		super(AgentResourceEntity, dataSource.manager);
	}
}
