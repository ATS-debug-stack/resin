import type { IRestApiContext } from '@resin/rest-api-client';
import type {
	DependenciesBatchResponse,
	DependencyCountsBatchResponse,
	DependencyResourceType,
} from '@resin/api-types';
import { makeRestApiRequest } from '@resin/rest-api-client';

export async function getResourceDependencyCounts(
	context: IRestApiContext,
	resourceIds: string[],
	resourceType: DependencyResourceType,
) {
	return await makeRestApiRequest<DependencyCountsBatchResponse>(
		context,
		'POST',
		'/workflow-dependencies/counts',
		{ resourceIds, resourceType },
	);
}

export async function getResourceDependencies(
	context: IRestApiContext,
	resourceIds: string[],
	resourceType: DependencyResourceType,
) {
	return await makeRestApiRequest<DependenciesBatchResponse>(
		context,
		'POST',
		'/workflow-dependencies/details',
		{ resourceIds, resourceType },
	);
}
