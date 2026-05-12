import { Service } from '@resin/di';

import { TypedEmitter } from '@/typed-emitter';

import type { PubSubEventMap } from './pubsub.event-map';

@Service()
export class PubSubEventBus extends TypedEmitter<PubSubEventMap> {}
