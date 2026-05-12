import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';

@BackendModule({ name: 'sso-oidc', licenseFlag: 'feat:oidc', instanceTypes: ['main'] })
export class OidcModule implements ModuleInterface {
	async init() {
		await import('./oidc.controller.ee');

		const { OidcService } = await import('./oidc.service.ee');
		await Container.get(OidcService).init();
	}
}
