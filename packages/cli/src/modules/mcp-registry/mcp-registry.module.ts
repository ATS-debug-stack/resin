import { Logger } from '@resin/backend-common';
import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';

import { LoadNodesAndCredentials } from '@/load-nodes-and-credentials';

@BackendModule({ name: 'mcp-registry' })
export class McpRegistryModule implements ModuleInterface {
	async nodeLoaders() {
		const { McpRegistryService } = await import('./registry/mcp-registry.service');
		const { McpRegistryNodeLoader } = await import('./mcp-registry-node-loader');

		return [
			new McpRegistryNodeLoader(
				Container.get(McpRegistryService),
				Container.get(LoadNodesAndCredentials),
				Container.get(Logger),
			),
		];
	}
}
