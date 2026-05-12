import type { PushMessage } from '@resin/api-types';

export type PushMessageQueueItem = {
	message: PushMessage;
	retriesLeft: number;
};
