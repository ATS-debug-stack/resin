import { Logger } from '@resin/backend-common';
import { Service } from '@resin/di';
import { EncryptionKeyProxy, InstanceSettings } from 'resin-core';

import { KeyManagerService } from './key-manager.service';

@Service()
export class EncryptionBootstrapService {
	constructor(
		private readonly keyManager: KeyManagerService,
		private readonly instanceSettings: InstanceSettings,
		private readonly encryptionKeyProxy: EncryptionKeyProxy,
		private readonly logger: Logger,
	) {
		this.logger = this.logger.scoped('encryption-key-manager');
	}

	async run(): Promise<void> {
		if (this.instanceSettings.instanceType === 'main') {
			await this.keyManager.bootstrapLegacyCbcKey(this.instanceSettings.encryptionKey);
			await this.keyManager.bootstrapGcmKey();
		}
		this.encryptionKeyProxy.setProvider(this.keyManager);
		this.logger.debug('Encryption key bootstrap complete');
	}
}
