import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';

@BackendModule({ name: 'workflow-builder', instanceTypes: ['main'] })
export class WorkflowBuilderModule implements ModuleInterface {
	async entities() {
		const { WorkflowBuilderSession } = await import('./workflow-builder-session.entity');
		return [WorkflowBuilderSession];
	}
}
