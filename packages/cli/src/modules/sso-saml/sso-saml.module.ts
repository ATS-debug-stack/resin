import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';

@BackendModule({ name: 'sso-saml', licenseFlag: 'feat:saml', instanceTypes: ['main'] })
export class SamlModule implements ModuleInterface {
	async init() {
		await import('./saml.controller.ee');

		const { SamlService } = await import('./saml.service.ee');
		await Container.get(SamlService).init();
	}
}
