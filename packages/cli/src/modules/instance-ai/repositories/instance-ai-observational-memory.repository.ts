import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { InstanceAiObservationalMemory } from '../entities/instance-ai-observational-memory.entity';

@Service()
export class InstanceAiObservationalMemoryRepository extends Repository<InstanceAiObservationalMemory> {
	constructor(dataSource: DataSource) {
		super(InstanceAiObservationalMemory, dataSource.manager);
	}
}
