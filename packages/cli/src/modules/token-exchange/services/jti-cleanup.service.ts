import { Logger } from '@resin/backend-common';
import { Time } from '@resin/constants';
import { OnLeaderStepdown, OnLeaderTakeover, OnShutdown } from '@resin/decorators';
import { Service } from '@resin/di';
import { InstanceSettings } from 'resin-core';

import { TokenExchangeJtiRepository } from '../database/repositories/token-exchange-jti.repository';
import { TokenExchangeConfig } from '../token-exchange.config';

@Service()
export class JtiCleanupService {
	private cleanupInterval: NodeJS.Timeout | undefined;

	private isShuttingDown = false;

	private readonly logger: Logger;

	constructor(
		logger: Logger,
		private readonly config: TokenExchangeConfig,
		private readonly jtiRepository: TokenExchangeJtiRepository,
		private readonly instanceSettings: InstanceSettings,
	) {
		this.logger = logger.scoped('token-exchange');
	}

	init() {
		if (this.instanceSettings.isLeader) this.startCleanup();
	}

	@OnLeaderTakeover()
	startCleanup() {
		if (this.isShuttingDown || this.cleanupInterval) return;

		const intervalMs = this.config.jtiCleanupIntervalSeconds * Time.seconds.toMilliseconds;
		this.cleanupInterval = setInterval(async () => await this.cleanup(), intervalMs);

		this.logger.debug(`JTI cleanup scheduled every ${this.config.jtiCleanupIntervalSeconds}s`);
	}

	@OnLeaderStepdown()
	stopCleanup() {
		clearInterval(this.cleanupInterval);
		this.cleanupInterval = undefined;
	}

	private async cleanup() {
		let totalDeleted = 0;
		try {
			let deleted: number;
			do {
				deleted = await this.jtiRepository.deleteExpiredBatch(this.config.jtiCleanupBatchSize);
				totalDeleted += deleted;
			} while (deleted >= this.config.jtiCleanupBatchSize);

			if (totalDeleted > 0) {
				this.logger.debug('Cleaned up expired JTIs', { count: totalDeleted });
			}
		} catch (error) {
			this.logger.error('Failed to clean up expired JTIs', { error });
		}
	}

	@OnShutdown()
	shutdown() {
		this.isShuttingDown = true;
		this.stopCleanup();
	}
}
