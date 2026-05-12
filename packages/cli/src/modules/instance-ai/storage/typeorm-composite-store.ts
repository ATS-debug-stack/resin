import { Service } from '@resin/di';
import { MastraCompositeStore } from '@mastra/core/storage';
import type { StorageDomains } from '@mastra/core/storage';

import { TypeORMMemoryStorage } from './typeorm-memory-storage';
import { TypeORMWorkflowsStorage } from './typeorm-workflows-storage';

@Service()
export class TypeORMCompositeStore extends MastraCompositeStore {
	override stores: StorageDomains;

	constructor(memoryStorage: TypeORMMemoryStorage, workflowsStorage: TypeORMWorkflowsStorage) {
		super({ id: 'resin-instance-ai-store', disableInit: true });
		// Only memory and workflows domains are needed by Instance-AI.
		// Other domains (scores, etc.) are never accessed.
		this.stores = {
			memory: memoryStorage,
			workflows: workflowsStorage,
		} as unknown as StorageDomains;
	}

	override async init(): Promise<void> {
		// No-op — TypeORM migrations handle table creation
	}
}
