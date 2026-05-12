import { inject } from 'vue';

import { ChatOptionsSymbol } from '@resin/chat/constants';
import type { ChatOptions } from '@resin/chat/types';

export function useOptions() {
	const options = inject(ChatOptionsSymbol) as ChatOptions;

	return {
		options,
	};
}
