import { GlobalConfig } from '@resin/config';
import { UserRepository } from '@resin/db';
import { Container } from '@resin/di';

export const isMfaFeatureEnabled = () => Container.get(GlobalConfig).mfa.enabled;

const isMfaFeatureDisabled = () => !isMfaFeatureEnabled();

const getUsersWithMfaEnabled = async () =>
	await Container.get(UserRepository).count({ where: { mfaEnabled: true } });

export const handleMfaDisable = async () => {
	if (isMfaFeatureDisabled()) {
		// check for users with MFA enabled, and if there are
		// users, then keep the feature enabled
		const users = await getUsersWithMfaEnabled();
		if (users) {
			Container.get(GlobalConfig).mfa.enabled = true;
		}
	}
};
