import type { User } from '@resin/db';
import { Service } from '@resin/di';

import { FirecrawlQuickConnect } from '../quick-connect.config';
import { IQuickConnectHandler } from './handler.interface';
import axios from 'axios';

const FIRECRAWL_API_BASE_URL = 'https://api.firecrawl.dev';

interface FirecrawlCreateUserResponse {
	apiKey: string;
}

@Service()
export class FirecrawlHandler implements IQuickConnectHandler {
	private config: FirecrawlQuickConnect | undefined;

	setConfig(config: FirecrawlQuickConnect) {
		this.config = config;
	}

	async getCredentialData({ email }: User) {
		const secret = this.config!.backendFlowConfig.secret;
		const response = await axios.post<FirecrawlCreateUserResponse>(
			`${FIRECRAWL_API_BASE_URL}/admin/integration/create-user`,
			{ email },
			{
				headers: {
					Authorization: `Bearer ${secret}`,
					'Content-Type': 'application/json',
				},
			},
		);

		return {
			apiKey: response.data.apiKey,
		};
	}
}
