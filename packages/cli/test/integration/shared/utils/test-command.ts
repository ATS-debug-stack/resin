import { testDb, mockInstance } from '@resin/backend-test-utils';
import { CommandMetadata, type CommandClass } from '@resin/decorators';
import { Container } from '@resin/di';
import argvParser from 'yargs-parser';

import { MessageEventBus } from '@/eventbus/message-event-bus/message-event-bus';
import { TelemetryEventRelay } from '@/events/relays/telemetry.event-relay';

mockInstance(MessageEventBus);

export const setupTestCommand = <T extends CommandClass>(Command: T) => {
	// mock SIGINT/SIGTERM registration
	process.once = jest.fn();
	process.exit = jest.fn() as never;

	beforeAll(async () => {
		await testDb.init();
	});

	beforeEach(() => {
		jest.clearAllMocks();
		mockInstance(TelemetryEventRelay);
	});

	afterAll(async () => {
		await testDb.terminate();

		jest.restoreAllMocks();
	});

	const run = async (argv: string[] = []) => {
		const command = new Command();
		const rawFlags = argvParser(argv, { string: ['id'] });
		const entry = Container.get(CommandMetadata)
			.getEntries()
			.find(([, e]) => e.class === Command)?.[1];
		command.flags = entry?.flagsSchema ? entry.flagsSchema.parse(rawFlags) : rawFlags;
		await command.init?.();
		await command.run();
		return command;
	};

	return { run };
};
