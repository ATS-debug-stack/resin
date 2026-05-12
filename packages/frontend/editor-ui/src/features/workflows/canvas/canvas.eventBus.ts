import type { CanvasEventBusEvents } from './canvas.types';
import { createEventBus } from '@resin/utils/event-bus';

export const canvasEventBus = createEventBus<CanvasEventBusEvents>();
