import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from '@resin/typeorm';

import { InstalledPackages } from './installed-packages.entity';

@Entity()
export class InstalledNodes extends BaseEntity {
	@Column()
	name: string;

	@PrimaryColumn()
	type: string;

	@Column()
	latestVersion: number;

	@ManyToOne('InstalledPackages', 'installedNodes')
	@JoinColumn({ name: 'package', referencedColumnName: 'packageName' })
	package: InstalledPackages;
}
