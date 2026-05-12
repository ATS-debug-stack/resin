import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { AccessToken } from '../entities/oauth-access-token.entity';

@Service()
export class AccessTokenRepository extends Repository<AccessToken> {
	constructor(dataSource: DataSource) {
		super(AccessToken, dataSource.manager);
	}
}
