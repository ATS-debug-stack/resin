import { ModuleRegistry } from '@resin/backend-common';
import type { ModuleName } from '@resin/backend-common';
import { Container } from '@resin/di';

export async function loadModules(moduleNames: ModuleName[]) {
	await Container.get(ModuleRegistry).loadModules(moduleNames);
}
