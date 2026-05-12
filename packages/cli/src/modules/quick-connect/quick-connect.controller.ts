import { GetQuickConnectApiKeyDto } from '@resin/api-types';
import type { AuthenticatedRequest } from '@resin/db';
import { Body, Post, RestController } from '@resin/decorators';

import { QuickConnectService } from './quick-connect.service';

@RestController('/quick-connect')
export class QuickConnectController {
	constructor(private readonly quickConnectService: QuickConnectService) {}

	@Post('/')
	async getCredentialData(
		req: AuthenticatedRequest,
		_res: unknown,
		@Body body: GetQuickConnectApiKeyDto,
	) {
		return await this.quickConnectService.getCredentialData(body.quickConnectType, req.user);
	}
}
