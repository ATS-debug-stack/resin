import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AgentObservationLockEntity } from '../entities/agent-observation-lock.entity';

@Service()
export class AgentObservationLockRepository extends Repository<AgentObservationLockEntity> {
	constructor(dataSource: DataSource) {
		super(AgentObservationLockEntity, dataSource.manager);
	}
}
