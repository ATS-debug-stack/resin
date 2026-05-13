import { JsonColumn, WithTimestamps } from '@resin/db';
import { Entity, PrimaryColumn } from '@n8n/typeorm';
import { MessageEventBusDestinationOptions } from 'resin-workflow';

@Entity({ name: 'event_destinations' })
export class EventDestinations extends WithTimestamps {
	@PrimaryColumn('uuid')
	id: string;

	@JsonColumn()
	destination: MessageEventBusDestinationOptions;
}
