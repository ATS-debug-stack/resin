import { MIGRATION_REPORT_TARGET_VERSION } from '@resin/api-types';
import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';

@BackendModule({ name: 'breaking-changes', instanceTypes: ['main'] })
export class BreakingChangesModule implements ModuleInterface {
	async init() {
		if (!MIGRATION_REPORT_TARGET_VERSION) return;

		// Import rules so that they are added to the BreakingChangeRuleMetadata registry
		await import('./rules');

		// Register rules in the service
		const { BreakingChangeService } = await import('./breaking-changes.service');
		Container.get(BreakingChangeService).registerRules();

		await import('./breaking-changes.controller');
	}
}
