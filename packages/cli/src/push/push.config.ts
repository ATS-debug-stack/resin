import { Config, Env } from '@resin/config';

@Config
export class PushConfig {
	/** Backend to use for push notifications */
	@Env('N8N_PUSH_BACKEND')
	backend: 'sse' | 'websocket' = 'websocket';
}
