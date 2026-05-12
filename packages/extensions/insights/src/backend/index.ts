import { defineBackendExtension } from '@resin/extension-sdk/backend';

export default defineBackendExtension({
	setup(n8n) {
		console.log(n8n);
	},
});
