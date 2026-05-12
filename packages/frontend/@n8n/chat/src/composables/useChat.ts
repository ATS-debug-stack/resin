import { inject } from 'vue';

import { ChatSymbol } from '@resin/chat/constants';
import type { Chat } from '@resin/chat/types';

export function useChat() {
	return inject(ChatSymbol) as Chat;
}
