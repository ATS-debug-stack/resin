import { DateTimeColumn, WithTimestamps } from '@resin/db';
import { Column, Entity, PrimaryColumn } from '@resin/typeorm';

import type { ObservationScopeKind } from './agent-observation.entity';

@Entity({ name: 'agents_observation_cursors' })
export class AgentObservationCursorEntity extends WithTimestamps {
	@PrimaryColumn({ type: 'varchar', length: 20 })
	scopeKind: ObservationScopeKind;

	@PrimaryColumn({ type: 'varchar', length: 255 })
	scopeId: string;

	@Column({ type: 'varchar', length: 36 })
	lastObservedMessageId: string;

	@DateTimeColumn()
	lastObservedAt: Date;
}
