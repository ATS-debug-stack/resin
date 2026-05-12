import type { RequestHandler } from 'express';

import { Container } from '@resin/di';
import { DynamicCredentialService } from './services/dynamic-credential.service';

export const getDynamicCredentialMiddlewares = (): RequestHandler[] => {
	return [Container.get(DynamicCredentialService).getDynamicCredentialsEndpointsMiddleware()];
};
