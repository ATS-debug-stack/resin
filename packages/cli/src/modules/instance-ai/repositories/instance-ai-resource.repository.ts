import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { InstanceAiResource } from '../entities/instance-ai-resource.entity';

@Service()
export class InstanceAiResourceRepository extends Repository<InstanceAiResource> {
	constructor(dataSource: DataSource) {
		super(InstanceAiResource, dataSource.manager);
	}
}
