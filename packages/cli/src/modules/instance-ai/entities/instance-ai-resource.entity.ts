import { WithTimestamps, JsonColumn } from '@resin/db';
import { Column, Entity, PrimaryColumn } from '@resin/typeorm';

@Entity({ name: 'instance_ai_resources' })
export class InstanceAiResource extends WithTimestamps {
	@PrimaryColumn({ type: 'varchar', length: 255 })
	id: string;

	@Column({ type: 'text', nullable: true })
	workingMemory: string | null;

	@JsonColumn({ nullable: true })
	metadata: Record<string, unknown> | null;
}
