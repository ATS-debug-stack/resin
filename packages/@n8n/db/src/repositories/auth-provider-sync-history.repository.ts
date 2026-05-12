import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AuthProviderSyncHistory } from '../entities';

@Service()
export class AuthProviderSyncHistoryRepository extends Repository<AuthProviderSyncHistory> {
	constructor(dataSource: DataSource) {
		super(AuthProviderSyncHistory, dataSource.manager);
	}
}
