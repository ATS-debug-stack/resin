import { Entity, PrimaryColumn } from '@resin/typeorm';

import { DateTimeColumn } from './abstract-entity';

@Entity()
export class InvalidAuthToken {
	@PrimaryColumn()
	token: string;

	@DateTimeColumn()
	expiresAt: Date;
}
