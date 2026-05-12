import { UserError } from 'resin-workflow';

export class FileUploadError extends UserError {
	constructor(msg: string) {
		super(`Error uploading file: ${msg}`, {
			level: 'warning',
		});
	}
}
