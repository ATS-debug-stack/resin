import { WithTimestamps } from '@resin/db';
import { Column, Entity, Index, PrimaryColumn } from '@resin/typeorm';

@Entity({ name: 'instance_ai_iteration_logs' })
@Index(['threadId', 'taskKey', 'createdAt'])
export class InstanceAiIterationLog extends WithTimestamps {
	@PrimaryColumn({ type: 'varchar', length: 36 })
	id: string;

	@Column({ type: 'uuid' })
	threadId: string;

	@Column({ type: 'varchar' })
	taskKey: string;

	@Column({ type: 'text' })
	entry: string;
}
