import { chatModelsRequestSchema, Z } from '@resin/api-types';

export class ChatModelsRequestDto extends Z.class(chatModelsRequestSchema.shape) {}
