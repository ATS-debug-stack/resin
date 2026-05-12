import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { TrustedKeySourceEntity } from '../entities/trusted-key-source.entity';

@Service()
export class TrustedKeySourceRepository extends Repository<TrustedKeySourceEntity> {
	constructor(dataSource: DataSource) {
		super(TrustedKeySourceEntity, dataSource.manager);
	}
}
