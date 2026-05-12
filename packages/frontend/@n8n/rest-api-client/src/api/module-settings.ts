import type { FrontendModuleSettings } from '@resin/api-types';

import type { IRestApiContext } from '../types';
import { makeRestApiRequest } from '../utils';

export async function getModuleSettings(context: IRestApiContext): Promise<FrontendModuleSettings> {
	return await makeRestApiRequest(context, 'GET', '/module-settings');
}
