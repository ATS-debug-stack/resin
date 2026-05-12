import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { DynamicCredentialUserEntry } from '../entities/dynamic-credential-user-entry';

@Service()
export class DynamicCredentialUserEntryRepository extends Repository<DynamicCredentialUserEntry> {
	constructor(dataSource: DataSource) {
		super(DynamicCredentialUserEntry, dataSource.manager);
	}
}
