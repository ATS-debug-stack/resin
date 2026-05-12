import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { InstanceVersionHistory } from '../entities/instance-version-history.entity';

@Service()
export class InstanceVersionHistoryRepository extends Repository<InstanceVersionHistory> {
	constructor(dataSource: DataSource) {
		super(InstanceVersionHistory, dataSource.manager);
	}
}
