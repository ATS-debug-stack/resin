import type { IInviteResponse, InvitableRoleName } from './users.types';
import type { CurrentUserResponse } from '@resin/rest-api-client/api/users';
import type { IRestApiContext } from '@resin/rest-api-client';
import type { IDataObject } from 'resin-workflow';
import { makeRestApiRequest } from '@resin/rest-api-client';

type AcceptInvitationParams = {
	token: string;
	firstName: string;
	lastName: string;
	password: string;
};

export async function inviteUsers(
	context: IRestApiContext,
	params: Array<{ email: string; role: InvitableRoleName }>,
) {
	return await makeRestApiRequest<IInviteResponse[]>(context, 'POST', '/invitations', params);
}

export async function acceptInvitation(context: IRestApiContext, params: AcceptInvitationParams) {
	if (!params.token) {
		throw new Error('Token is required');
	}

	return await makeRestApiRequest<CurrentUserResponse>(
		context,
		'POST',
		'/invitations/accept',
		params as unknown as IDataObject,
	);
}
