import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AgentMessageEntity } from '../entities/agent-message.entity';

@Service()
export class AgentMessageRepository extends Repository<AgentMessageEntity> {
	constructor(dataSource: DataSource) {
		super(AgentMessageEntity, dataSource.manager);
	}
}
