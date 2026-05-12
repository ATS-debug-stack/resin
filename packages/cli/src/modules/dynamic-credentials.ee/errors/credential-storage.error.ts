import { UserError } from 'resin-workflow';

export class CredentialStorageError extends UserError {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = 'CredentialStorageError';
	}
}
