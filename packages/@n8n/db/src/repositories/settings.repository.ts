import { Service } from '@resin/di';
import type { EntityManager } from '@resin/typeorm';
import { DataSource, In, Like, Repository } from '@resin/typeorm';

import { Settings } from '../entities';

@Service()
export class SettingsRepository extends Repository<Settings> {
	constructor(dataSource: DataSource) {
		super(Settings, dataSource.manager);
	}

	async findByKey(key: string, em?: EntityManager): Promise<Settings | null> {
		const manager = em ?? this.manager;
		return await manager.findOneBy(Settings, { key });
	}
	async findByKeys(keys: string[]): Promise<Settings[]> {
		return await this.findBy({ key: In(keys) });
	}

	async findByKeyPrefix(prefix: string): Promise<Settings[]> {
		return await this.findBy({ key: Like(`${prefix}%`) });
	}
}
