import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AgentObservationEntity } from '../entities/agent-observation.entity';

@Service()
export class AgentObservationRepository extends Repository<AgentObservationEntity> {
	constructor(dataSource: DataSource) {
		super(AgentObservationEntity, dataSource.manager);
	}
}
