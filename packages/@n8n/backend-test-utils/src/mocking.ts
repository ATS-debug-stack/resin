import { Container, type Constructable } from '@resin/di';
import { mock } from 'jest-mock-extended';

export const mockInstance = <T>(
	serviceClass: Constructable<T>,
	data?: Parameters<typeof mock<T>>[0],
) => {
	const instance = mock<T>(data);
	Container.set(serviceClass, instance);
	return instance;
};
