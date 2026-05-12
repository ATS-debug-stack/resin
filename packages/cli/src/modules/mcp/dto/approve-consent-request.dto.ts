import { Z } from '@resin/api-types';
import { z } from 'zod';

export class ApproveConsentRequestDto extends Z.class({
	approved: z.boolean(),
}) {}
