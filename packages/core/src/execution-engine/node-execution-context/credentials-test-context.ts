import { Logger } from '@resin/backend-common';
import { Memoized } from '@resin/decorators';
import { Container } from '@resin/di';
import type { ICredentialTestFunctions } from 'resin-workflow';

import { proxyRequestToAxios } from './utils/request-helper-functions';
import { getSSHTunnelFunctions } from './utils/ssh-tunnel-helper-functions';

export class CredentialTestContext implements ICredentialTestFunctions {
	readonly helpers: ICredentialTestFunctions['helpers'];

	constructor() {
		this.helpers = {
			...getSSHTunnelFunctions(),
			request: async (uriOrObject: string | object, options?: object) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return await proxyRequestToAxios(undefined, undefined, undefined, uriOrObject, options);
			},
		};
	}

	@Memoized
	get logger() {
		return Container.get(Logger);
	}
}
