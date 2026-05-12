import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { InstanceAiMessage } from '../entities/instance-ai-message.entity';

@Service()
export class InstanceAiMessageRepository extends Repository<InstanceAiMessage> {
	constructor(dataSource: DataSource) {
		super(InstanceAiMessage, dataSource.manager);
	}
}
