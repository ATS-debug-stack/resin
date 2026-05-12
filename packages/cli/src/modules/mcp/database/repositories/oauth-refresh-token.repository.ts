import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { RefreshToken } from '../entities/oauth-refresh-token.entity';

@Service()
export class RefreshTokenRepository extends Repository<RefreshToken> {
	constructor(dataSource: DataSource) {
		super(RefreshToken, dataSource.manager);
	}
}
