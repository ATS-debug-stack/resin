import { baseConfig } from '@resin/stylelint-config/base';

export default {
	...baseConfig,
	rules: {
		...baseConfig.rules,
		'@resin/css-var-naming': [true, { severity: 'error' }],
	},
};
