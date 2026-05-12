import { assignableProjectRoleSchema } from '@resin/permissions';

import { Z } from '../../zod-class';

export class ChangeUserRoleInProject extends Z.class({
	role: assignableProjectRoleSchema,
}) {}
