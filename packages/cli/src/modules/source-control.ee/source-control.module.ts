import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';

@BackendModule({
	name: 'source-control',
	licenseFlag: 'feat:sourceControl',
	instanceTypes: ['main'],
})
export class SourceControlModule implements ModuleInterface {
	async init() {
		await import('./source-control.controller.ee');

		const { SourceControlService } = await import('./source-control.service.ee');
		await Container.get(SourceControlService).start();
	}
}
