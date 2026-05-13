import { Logger } from '@resin/backend-common';
import { InstanceAiConfig } from '@resin/config';
import { OnLeaderStepdown, OnLeaderTakeover, OnShutdown } from '@resin/decorators';
import { Service } from '@resin/di';
import { LessThan } from '@n8n/typeorm';
import { InstanceSettings } from 'resin-core';

import { InstanceAiWorkflowSnapshotRepository } from './repositories/instance-ai-workflow-snapshot.repository';

@Service()
export class SnapshotPruningService {
	private pruningInterval: NodeJS.Timeout | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly config: InstanceAiConfig,
		private readonly snapshotRepo: InstanceAiWorkflowSnapshotRepository,
		private readonly instanceSettings: InstanceSettings,
	) {
		this.logger = this.logger.scoped('instance-ai');
	}

	init() {
		if (this.instanceSettings.isLeader) this.startPruning();
	}

	@OnLeaderTakeover()
	startPruning() {
		if (this.config.snapshotPruneInterval <= 0) return;

		this.pruningInterval = setInterval(
			async () => await this.prune(),
			this.config.snapshotPruneInterval,
		);
		this.logger.debug('Started snapshot pruning timer', {
			pruneIntervalMs: this.config.snapshotPruneInterval,
			retentionMs: this.config.snapshotRetention,
		});
	}

	@OnLeaderStepdown()
	stopPruning() {
		if (this.pruningInterval) {
			clearInterval(this.pruningInterval);
			this.pruningInterval = undefined;
			this.logger.debug('Stopped snapshot pruning timer');
		}
	}

	@OnShutdown()
	shutdown() {
		this.stopPruning();
	}

	async prune() {
		const cutoff = new Date(Date.now() - this.config.snapshotRetention);

		const { affected } = await this.snapshotRepo.delete({
			updatedAt: LessThan(cutoff),
		});

		if (affected === 0) {
			this.logger.debug('Found no workflow snapshots to prune');
			return;
		}

		this.logger.debug('Pruned stale workflow snapshots', { count: affected });
	}
}
