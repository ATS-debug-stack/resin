import type { PublicInstalledPackage } from 'resin-workflow';

export interface CommunityPackageMap {
	[name: string]: PublicInstalledPackage;
}
