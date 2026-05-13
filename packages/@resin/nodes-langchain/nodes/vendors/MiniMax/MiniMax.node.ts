import type { IExecuteFunctions, INodeType } from 'resin-workflow';

import { router } from './actions/router';
import { versionDescription } from './actions/versionDescription';

export class MiniMax implements INodeType {
	description = versionDescription;

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
