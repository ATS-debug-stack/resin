import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';

import { ExecutionRedactionServiceProxy } from '@/executions/execution-redaction-proxy.service';

@BackendModule({ name: 'redaction', instanceTypes: ['main'] })
export class RedactionModule implements ModuleInterface {
	async init() {
		const { ExecutionRedactionService } = await import('./executions/execution-redaction.service');
		const executionRedactionService = Container.get(ExecutionRedactionService);
		await executionRedactionService.init();

		const executionRedactionServiceProxy = Container.get(ExecutionRedactionServiceProxy);
		executionRedactionServiceProxy.setExecutionRedaction(executionRedactionService);
	}
}
