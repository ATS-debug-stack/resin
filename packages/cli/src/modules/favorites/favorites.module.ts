import type { ModuleInterface } from '@resin/decorators';
import { BackendModule } from '@resin/decorators';
import { Container } from '@resin/di';

@BackendModule({ name: 'favorites', instanceTypes: ['main'] })
export class FavoritesModule implements ModuleInterface {
	async init() {
		await import('./favorites.controller');

		const { FavoritesEventRelay } = await import('./favorites.event-relay');
		Container.get(FavoritesEventRelay).init();
	}

	async entities() {
		const { UserFavorite } = await import('./database/entities/user-favorite.entity');
		return [UserFavorite] as never;
	}
}
