import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { ExecutionMetadata } from '../entities';

@Service()
export class ExecutionMetadataRepository extends Repository<ExecutionMetadata> {
	constructor(dataSource: DataSource) {
		super(ExecutionMetadata, dataSource.manager);
	}
}
