import type { Component } from 'vue';
import type { BannerName } from '@resin/api-types';
import type { CalloutTheme } from '@resin/design-system';

export type N8nBanners = {
	[key in BannerName]: {
		priority: number;
		component: Component;
		content?: string;
		theme?: CalloutTheme;
		isDismissible?: boolean;
		dismissPermanently?: boolean;
	};
};
