import { LicenseState } from '@resin/backend-common';
import { InstanceSettingsLoaderConfig } from '@resin/config';
import { AuthenticatedRequest } from '@resin/db';
import { Get, GlobalScope, Patch, RestController } from '@resin/decorators';
import { Response } from 'express';

import { ForbiddenError } from '@/errors/response-errors/forbidden.error';

import { ProvisioningService } from './provisioning.service.ee';

@RestController('/sso/provisioning')
export class ProvisioningController {
	constructor(
		private readonly provisioningService: ProvisioningService,
		private readonly licenseState: LicenseState,
		private readonly instanceSettingsLoaderConfig: InstanceSettingsLoaderConfig,
	) {}

	@Get('/config')
	@GlobalScope('provisioning:manage')
	async getConfig(_req: AuthenticatedRequest, res: Response) {
		if (!this.licenseState.isProvisioningLicensed()) {
			return res.status(403).json({ message: 'Provisioning is not licensed' });
		}

		return await this.provisioningService.getConfig();
	}

	@Patch('/config')
	@GlobalScope('provisioning:manage')
	async patchConfig(req: AuthenticatedRequest, res: Response) {
		if (!this.licenseState.isProvisioningLicensed()) {
			return res.status(403).json({ message: 'Provisioning is not licensed' });
		}

		if (this.instanceSettingsLoaderConfig.ssoManagedByEnv) {
			throw new ForbiddenError(
				'Provisioning configuration is managed via environment variables and cannot be modified through the API',
			);
		}

		return await this.provisioningService.patchConfig(req.body);
	}
}
