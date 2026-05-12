import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';

@BackendModule({
	name: 'provisioning',
	licenseFlag: ['feat:oidc', 'feat:saml', 'feat:ldap'],
	instanceTypes: ['main'],
})
export class ProvisioningModule implements ModuleInterface {
	async init() {
		await import('./provisioning.controller.ee');
		await import('./role-mapping-rule.controller.ee');
	}
}
