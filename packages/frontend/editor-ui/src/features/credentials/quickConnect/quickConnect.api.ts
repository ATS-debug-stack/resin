import type { IRestApiContext } from '@resin/rest-api-client';
import { makeRestApiRequest } from '@resin/rest-api-client';
import type { QuickConnectOption } from '@resin/api-types';

type GetQuickConnectApiKeyResponse = {
	apiKey: string;
};

export async function getQuickConnectApiKey(
	context: IRestApiContext,
	{ quickConnectType }: { quickConnectType: QuickConnectOption['quickConnectType'] },
): Promise<GetQuickConnectApiKeyResponse> {
	return await makeRestApiRequest(context, 'POST', '/quick-connect', { quickConnectType });
}
