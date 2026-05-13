import type { InstanceType } from '@resin/constants';
import { generateNanoId } from '@resin/utils';

export function generateHostInstanceId(instanceType: InstanceType) {
	return `${instanceType}-${generateNanoId()}`;
}
