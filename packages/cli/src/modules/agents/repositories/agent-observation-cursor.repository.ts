import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AgentObservationCursorEntity } from '../entities/agent-observation-cursor.entity';

@Service()
export class AgentObservationCursorRepository extends Repository<AgentObservationCursorEntity> {
	constructor(dataSource: DataSource) {
		super(AgentObservationCursorEntity, dataSource.manager);
	}
}
