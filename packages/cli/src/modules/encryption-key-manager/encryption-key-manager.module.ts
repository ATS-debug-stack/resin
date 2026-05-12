import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';
import { InstanceSettings } from 'resin-core';

function isKeyRotationApiEnabled(): boolean {
	return process.env.N8N_ENV_FEAT_ENCRYPTION_KEY_ROTATION === 'true';
}

@BackendModule({ name: 'encryption-key-manager' })
export class EncryptionKeyManagerModule implements ModuleInterface {
	async init() {
		if (isKeyRotationApiEnabled()) {
			await import('./key-manager.service');
			if (Container.get(InstanceSettings).instanceType === 'main') {
				await import('./encryption-key.controller');
			}
			const { EncryptionBootstrapService } = await import('./encryption-bootstrap.service');
			await Container.get(EncryptionBootstrapService).run();
		}
	}
}
